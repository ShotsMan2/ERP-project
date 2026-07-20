#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# ERP Platform - Database Backup Script
# =============================================================================
# Backs up PostgreSQL database to S3-compatible storage with retention policy.
# Usage: ./infrastructure/scripts/backup.sh [database_name]
# Default database: erp_db

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Load environment variables
if [ -f "$PROJECT_ROOT/.env" ]; then
    set -a
    source "$PROJECT_ROOT/.env"
    set +a
fi

# Configuration
DB_NAME="${1:-${POSTGRES_DB:-erp_db}}"
DB_USER="${POSTGRES_USER:-erp_user}"
DB_HOST="${POSTGRES_SERVER:-localhost}"
DB_PORT="${POSTGRES_PORT:-5432}"
DB_PASSWORD="${POSTGRES_PASSWORD:-}"

S3_BUCKET="${BACKUP_S3_BUCKET:-erp-backups}"
S3_PREFIX="${BACKUP_S3_PREFIX:-postgres}"
S3_ENDPOINT="${S3_ENDPOINT_URL:-}"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-30}"

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILENAME="${DB_NAME}_${TIMESTAMP}.sql.gz"
BACKUP_PATH="/tmp/${BACKUP_FILENAME}"

echo "=============================================="
echo "  ERP Database Backup"
echo "  Database: $DB_NAME"
echo "  Timestamp: $TIMESTAMP"
echo "=============================================="

# Check prerequisites
command -v pg_dump >/dev/null 2>&1 || { echo "Error: pg_dump is required but not installed."; exit 1; }
command -v aws >/dev/null 2>&1 || { echo "Error: aws CLI is required but not installed."; exit 1; }
command -v gzip >/dev/null 2>&1 || { echo "Error: gzip is required but not installed."; exit 1; }

# Export password for pg_dump
export PGPASSWORD="$DB_PASSWORD"

echo ""
echo "Step 1: Dumping database..."
echo "----------------------------------------"
pg_dump \
    --host="$DB_HOST" \
    --port="$DB_PORT" \
    --username="$DB_USER" \
    --dbname="$DB_NAME" \
    --format=custom \
    --verbose \
    --no-owner \
    --no-acl \
    --blobs \
    --compress=9 \
    --file="$BACKUP_PATH"

# Check backup size
BACKUP_SIZE=$(du -h "$BACKUP_PATH" | cut -f1)
echo "Backup size: $BACKUP_SIZE"

echo ""
echo "Step 2: Uploading to S3..."
echo "----------------------------------------"
S3_TARGET="s3://${S3_BUCKET}/${S3_PREFIX}/${BACKUP_FILENAME}"

if [ -n "$S3_ENDPOINT" ]; then
    aws s3 cp "$BACKUP_PATH" "$S3_TARGET" --endpoint-url="$S3_ENDPOINT"
else
    aws s3 cp "$BACKUP_PATH" "$S3_TARGET"
fi

echo ""
echo "Step 3: Uploading backup info file..."
echo "----------------------------------------"
INFO_FILE="/tmp/backup_info_${TIMESTAMP}.json"
cat > "$INFO_FILE" << EOF
{
    "database": "$DB_NAME",
    "timestamp": "$TIMESTAMP",
    "size_bytes": $(stat -f%z "$BACKUP_PATH" 2>/dev/null || stat -c%s "$BACKUP_PATH" 2>/dev/null || echo 0),
    "size_human": "$BACKUP_SIZE",
    "filename": "$BACKUP_FILENAME",
    "host": "$DB_HOST",
    "port": $DB_PORT,
    "user": "$DB_USER",
    "format": "custom",
    "compression": "gzip"
}
EOF

if [ -n "$S3_ENDPOINT" ]; then
    aws s3 cp "$INFO_FILE" "s3://${S3_BUCKET}/${S3_PREFIX}/latest_backup_info.json" --endpoint-url="$S3_ENDPOINT"
else
    aws s3 cp "$INFO_FILE" "s3://${S3_BUCKET}/${S3_PREFIX}/latest_backup_info.json"
fi

echo ""
echo "Step 4: Cleaning up local backup..."
echo "----------------------------------------"
rm -f "$BACKUP_PATH" "$INFO_FILE"

echo ""
echo "Step 5: Cleaning up old backups (retention: $RETENTION_DAYS days)..."
echo "----------------------------------------"
CUTOFF_DATE=$(date -d "-${RETENTION_DAYS} days" +%Y-%m-%d)

if [ -n "$S3_ENDPOINT" ]; then
    aws s3 ls "s3://${S3_BUCKET}/${S3_PREFIX}/" --endpoint-url="$S3_ENDPOINT" | while read -r line; do
        FILE_DATE=$(echo "$line" | awk '{print $1}')
        FILE_NAME=$(echo "$line" | awk '{print $4}')
        if [[ "$FILE_DATE" < "$CUTOFF_DATE" ]] && [[ "$FILE_NAME" =~ \.sql\.gz$ ]]; then
            echo "Removing expired backup: $FILE_NAME"
            aws s3 rm "s3://${S3_BUCKET}/${S3_PREFIX}/${FILE_NAME}" --endpoint-url="$S3_ENDPOINT"
        fi
    done
else
    aws s3 ls "s3://${S3_BUCKET}/${S3_PREFIX}/" | while read -r line; do
        FILE_DATE=$(echo "$line" | awk '{print $1}')
        FILE_NAME=$(echo "$line" | awk '{print $4}')
        if [[ "$FILE_DATE" < "$CUTOFF_DATE" ]] && [[ "$FILE_NAME" =~ \.sql\.gz$ ]]; then
            echo "Removing expired backup: $FILE_NAME"
            aws s3 rm "s3://${S3_BUCKET}/${S3_PREFIX}/${FILE_NAME}"
        fi
    done
fi

echo ""
echo "=============================================="
echo "  Backup completed successfully!"
echo "  File: s3://${S3_BUCKET}/${S3_PREFIX}/${BACKUP_FILENAME}"
echo "=============================================="

# Cleanup environment variable
unset PGPASSWORD
