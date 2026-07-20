resource "aws_db_subnet_group" "postgres" {
  name       = "erp-postgres-${var.environment}"
  subnet_ids = var.subnet_ids

  tags = {
    Name = "erp-postgres-subnet-group-${var.environment}"
  }
}

resource "aws_security_group" "postgres" {
  name        = "erp-postgres-sg-${var.environment}"
  description = "PostgreSQL security group"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = var.allowed_security_group_ids
    description     = "Allow PostgreSQL access from EKS cluster"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all outbound traffic"
  }

  tags = {
    Name = "erp-postgres-sg-${var.environment}"
  }
}

resource "aws_db_parameter_group" "postgres" {
  name   = "erp-postgres-pg-${var.environment}"
  family = "postgres16"

  parameter {
    name  = "shared_buffers"
    value = "512MB"
  }

  parameter {
    name  = "effective_cache_size"
    value = "1536MB"
  }

  parameter {
    name  = "maintenance_work_mem"
    value = "128MB"
  }

  parameter {
    name  = "checkpoint_completion_target"
    value = "0.9"
  }

  parameter {
    name  = "wal_buffers"
    value = "16MB"
  }

  parameter {
    name  = "default_statistics_target"
    value = "100"
  }

  parameter {
    name  = "random_page_cost"
    value = "1.1"
  }

  parameter {
    name  = "effective_io_concurrency"
    value = "200"
  }

  parameter {
    name  = "work_mem"
    value = "6553kB"
  }

  parameter {
    name  = "max_connections"
    value = "200"
  }

  parameter {
    name         = "rds.force_ssl"
    value        = var.environment == "prod" ? "1" : "0"
    apply_method = "pending-reboot"
  }

  tags = {
    Name = "erp-postgres-pg-${var.environment}"
  }
}

resource "aws_db_instance" "postgres" {
  identifier = "erp-postgres-${var.environment}"

  engine                      = "postgres"
  engine_version              = "16.3"
  instance_class              = var.db_instance_class
  allocated_storage           = var.db_allocated_storage
  storage_type                = "gp3"
  storage_encrypted           = true
  db_name                     = var.db_name
  username                    = var.db_username
  password                    = var.db_password
  port                        = 5432

  db_subnet_group_name        = aws_db_subnet_group.postgres.name
  vpc_security_group_ids      = [aws_security_group.postgres.id]
  parameter_group_name        = aws_db_parameter_group.postgres.name

  backup_retention_period     = var.environment == "prod" ? 30 : 7
  backup_window               = "02:00-03:00"
  maintenance_window          = "sun:04:00-sun:05:00"
  copy_tags_to_snapshot       = true
  delete_automated_backups    = var.environment != "prod"
  skip_final_snapshot         = var.environment != "prod"
  final_snapshot_identifier   = var.environment == "prod" ? "erp-postgres-${var.environment}-final-${formatdate("YYYY-MM-DD-hhmm", timestamp())}" : null

  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]

  performance_insights_enabled          = true
  performance_insights_retention_period = 7

  auto_minor_version_upgrade = true
  deletion_protection        = var.environment == "prod"

  tags = {
    Name = "erp-postgres-${var.environment}"
  }
}
