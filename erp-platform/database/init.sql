-- =============================================================================
-- ERP Platform - Database Initialization Script
-- =============================================================================
-- This script runs automatically when the PostgreSQL container starts
-- for the first time. It creates the database, extensions, and schemas.
-- =============================================================================

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";
CREATE EXTENSION IF NOT EXISTS "tablefunc";

-- Create schemas for modular organization
CREATE SCHEMA IF NOT EXISTS core;
CREATE SCHEMA IF NOT EXISTS hr;
CREATE SCHEMA IF NOT EXISTS inventory;
CREATE SCHEMA IF NOT EXISTS procurement;
CREATE SCHEMA IF NOT EXISTS sales;
CREATE SCHEMA IF NOT EXISTS accounting;
CREATE SCHEMA IF NOT EXISTS projects;
CREATE SCHEMA IF NOT EXISTS system;
CREATE SCHEMA IF NOT EXISTS audit;

-- Set search path
ALTER DATABASE erp_db SET search_path TO core, hr, inventory, procurement, sales, accounting, projects, system, audit, public;

-- Create roles if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'erp_app') THEN
        CREATE ROLE erp_app WITH LOGIN PASSWORD 'erp_app_secret' INHERIT;
    END IF;
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'erp_readonly') THEN
        CREATE ROLE erp_readonly WITH LOGIN PASSWORD 'erp_readonly_secret' INHERIT;
    END IF;
END
$$;

-- Grant schema permissions
GRANT USAGE ON SCHEMA core, hr, inventory, procurement, sales, accounting, projects, system, audit, public TO erp_app;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA core, hr, inventory, procurement, sales, accounting, projects, system, audit, public TO erp_app;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA core, hr, inventory, procurement, sales, accounting, projects, system, audit, public TO erp_app;

GRANT USAGE ON SCHEMA core, hr, inventory, procurement, sales, accounting, projects, system, audit, public TO erp_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA core, hr, inventory, procurement, sales, accounting, projects, system, audit, public TO erp_readonly;

-- Create default partitions for audit_logs (monthly partitioning example)
CREATE TABLE IF NOT EXISTS audit.audit_logs_partitions (
    LIKE audit.audit_logs INCLUDING ALL
) PARTITION BY RANGE (created_at);

-- Create initial partition for current month
DO $$
DECLARE
    partition_name TEXT;
    start_date TEXT;
    end_date TEXT;
BEGIN
    partition_name := 'audit_logs_' || to_char(CURRENT_DATE, 'YYYY_MM');
    start_date := date_trunc('month', CURRENT_DATE)::TEXT;
    end_date := (date_trunc('month', CURRENT_DATE) + INTERVAL '1 month')::TEXT;

    IF NOT EXISTS (
        SELECT FROM pg_catalog.pg_class WHERE relname = partition_name
    ) THEN
        EXECUTE format(
            'CREATE TABLE audit.%I PARTITION OF audit.audit_logs_partitions
             FOR VALUES FROM (%L) TO (%L)',
            partition_name, start_date, end_date
        );
    END IF;
END
$$;

-- Enable row-level security for multi-tenancy
ALTER TABLE core.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory.stock_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE procurement.purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales.sales_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounting.journals ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounting.invoices ENABLE ROW LEVEL SECURITY;

-- Create default RLS policies
CREATE POLICY company_isolation ON core.companies
    USING (id = current_setting('app.current_company_id')::UUID);

CREATE POLICY branch_isolation ON core.branches
    USING (company_id = current_setting('app.current_company_id')::UUID);

CREATE POLICY department_isolation ON core.departments
    USING (company_id = current_setting('app.current_company_id')::UUID);

CREATE POLICY employee_isolation ON hr.employees
    USING (company_id = current_setting('app.current_company_id')::UUID);

CREATE POLICY product_isolation ON inventory.products
    USING (company_id = current_setting('app.current_company_id')::UUID);

-- Create audit trigger function
CREATE OR REPLACE FUNCTION audit.set_audit_columns()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    NEW.updated_by = current_setting('app.current_user_id', true)::UUID;
    IF TG_OP = 'INSERT' THEN
        NEW.created_at = NOW();
        NEW.created_by = current_setting('app.current_user_id', true)::UUID;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create soft-delete function
CREATE OR REPLACE FUNCTION core.soft_delete()
RETURNS TRIGGER AS $$
BEGIN
    NEW.deleted_at = NOW();
    NEW.is_active = FALSE;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create UUID v7 generation function (time-sortable)
CREATE OR REPLACE FUNCTION core.uuid_v7()
RETURNS UUID AS $$
DECLARE
    timestamp_ms BIGINT;
    uuid_bytes BYTEA;
BEGIN
    timestamp_ms := (EXTRACT(EPOCH FROM clock_timestamp()) * 1000)::BIGINT;
    uuid_bytes := decode(lpad(to_hex(timestamp_ms), 16, '0'), 'hex');
    uuid_bytes := uuid_bytes || decode(lpad(to_hex((random() * (2^80 - 1))::BIGINT), 16, '0'), 'hex');
    RETURN encode(uuid_bytes, 'hex')::UUID;
END;
$$ LANGUAGE plpgsql VOLATILE;

-- Notify on INSERT/UPDATE/DELETE for cache invalidation
CREATE OR REPLACE FUNCTION system.notify_change()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM pg_notify(
        'table_changes',
        json_build_object(
            'table', TG_TABLE_NAME,
            'schema', TG_TABLE_SCHEMA,
            'action', TG_OP,
            'timestamp', NOW()
        )::TEXT
    );
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

COMMENT ON DATABASE erp_db IS 'ERP Platform - Enterprise Resource Planning Database';
COMMENT ON SCHEMA core IS 'Core tenancy and company management';
COMMENT ON SCHEMA hr IS 'Human Resources module';
COMMENT ON SCHEMA inventory IS 'Product and Inventory management';
COMMENT ON SCHEMA procurement IS 'Purchasing and Supplier management';
COMMENT ON SCHEMA sales IS 'Sales and Customer management';
COMMENT ON SCHEMA accounting IS 'Accounting and Finance';
COMMENT ON SCHEMA projects IS 'Project and Task management';
COMMENT ON SCHEMA system IS 'System configuration and logging';
COMMENT ON SCHEMA audit IS 'Audit trail and compliance';
