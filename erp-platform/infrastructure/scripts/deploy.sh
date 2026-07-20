#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# ERP Platform - Deployment Script
# =============================================================================
# Usage: ./infrastructure/scripts/deploy.sh [environment] [tag]
# Examples:
#   ./infrastructure/scripts/deploy.sh staging latest
#   ./infrastructure/scripts/deploy.sh production v1.2.3

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

ENVIRONMENT="${1:-staging}"
IMAGE_TAG="${2:-latest}"
REGISTRY="${REGISTRY:-ghcr.io}"
IMAGE_NAMESPACE="${IMAGE_NAMESPACE:-erp-platform}"
NAMESPACE="erp-system"

echo "=============================================="
echo "  ERP Platform Deployment"
echo "  Environment: $ENVIRONMENT"
echo "  Image Tag:   $IMAGE_TAG"
echo "=============================================="

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(staging|production)$ ]]; then
    echo "Error: Environment must be 'staging' or 'production'"
    exit 1
fi

# Check prerequisites
command -v kubectl >/dev/null 2>&1 || { echo "Error: kubectl is required but not installed."; exit 1; }
command -v aws >/dev/null 2>&1 || { echo "Error: aws CLI is required but not installed."; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "Error: docker is required but not installed."; exit 1; }

# Load environment specific configuration
case "$ENVIRONMENT" in
    staging)
        CLUSTER_NAME="erp-platform-staging"
        K8S_ENV="staging"
        ;;
    production)
        CLUSTER_NAME="erp-platform-production"
        K8S_ENV="prod"
        ;;
esac

echo ""
echo "Step 1: Building Docker images..."
echo "----------------------------------------"
docker build -t "$REGISTRY/$IMAGE_NAMESPACE/backend:$IMAGE_TAG" -f "$PROJECT_ROOT/infrastructure/docker/backend.Dockerfile" "$PROJECT_ROOT"
docker build -t "$REGISTRY/$IMAGE_NAMESPACE/worker:$IMAGE_TAG" -f "$PROJECT_ROOT/infrastructure/docker/worker.Dockerfile" "$PROJECT_ROOT"

echo ""
echo "Step 2: Pushing Docker images..."
echo "----------------------------------------"
docker push "$REGISTRY/$IMAGE_NAMESPACE/backend:$IMAGE_TAG"
docker push "$REGISTRY/$IMAGE_NAMESPACE/worker:$IMAGE_TAG"

echo ""
echo "Step 3: Updating kubeconfig..."
echo "----------------------------------------"
aws eks update-kubeconfig --name "$CLUSTER_NAME" --region "${AWS_REGION:-us-east-1}"

echo ""
echo "Step 4: Applying Kubernetes manifests..."
echo "----------------------------------------"

# Update image tags in deployment files
sed -i "s|image:.*backend:.*|image: $REGISTRY/$IMAGE_NAMESPACE/backend:$IMAGE_TAG|g" "$PROJECT_ROOT/infrastructure/kubernetes/deployments/api.yaml"
sed -i "s|image:.*worker:.*|image: $REGISTRY/$IMAGE_NAMESPACE/worker:$IMAGE_TAG|g" "$PROJECT_ROOT/infrastructure/kubernetes/deployments/worker.yaml"

# Apply manifests
kubectl apply -f "$PROJECT_ROOT/infrastructure/kubernetes/namespaces/"
kubectl apply -f "$PROJECT_ROOT/infrastructure/kubernetes/configmaps/"
kubectl apply -f "$PROJECT_ROOT/infrastructure/kubernetes/services/"
kubectl apply -f "$PROJECT_ROOT/infrastructure/kubernetes/deployments/"
kubectl apply -f "$PROJECT_ROOT/infrastructure/kubernetes/hpa/"
kubectl apply -f "$PROJECT_ROOT/infrastructure/kubernetes/ingress/"

echo ""
echo "Step 5: Waiting for rollout..."
echo "----------------------------------------"
kubectl rollout status deployment/api -n "$NAMESPACE" --timeout=5m
kubectl rollout status deployment/worker -n "$NAMESPACE" --timeout=5m
kubectl rollout status deployment/frontend -n "$NAMESPACE" --timeout=5m

echo ""
echo "Step 6: Running smoke tests..."
echo "----------------------------------------"
API_ENDPOINT="https://api.${ENVIRONMENT}.erp-platform.com"
if [ "$ENVIRONMENT" = "staging" ]; then
    API_ENDPOINT="https://api.staging.erp-platform.com"
fi

if curl -sf --retry 5 --retry-delay 10 "$API_ENDPOINT/api/v1/monitoring/health" > /dev/null 2>&1; then
    echo "Smoke test PASSED: API is healthy"
else
    echo "Smoke test FAILED: API health check failed"
    exit 1
fi

echo ""
echo "=============================================="
echo "  Deployment to $ENVIRONMENT completed successfully!"
echo "=============================================="
