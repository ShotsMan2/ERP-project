.PHONY: help install dev build test lint migrate seed docker-up docker-down deploy backup restore

SHELL := /bin/bash
PYTHON := python3.12
PIP := pip
NPM := npm
DOCKER := docker
DOCKER_COMPOSE := docker compose
REGISTRY ?= ghcr.io
IMAGE_NAMESPACE ?= erp-platform
IMAGE_TAG ?= latest

help: ## Show available commands
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Install all dependencies
	$(PIP) install -r backend/requirements/base.txt -r backend/requirements/dev.txt
	$(PIP) install -r backend/requirements/prod.txt
	cd frontend && $(NPM) install

dev: ## Start local development environment
	$(DOCKER_COMPOSE) up --build -d postgres redis rabbitmq elasticsearch minio
	@echo "Waiting for services to be healthy..."
	@sleep 10
	cd backend && $(PYTHON) -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
	cd frontend && $(NPM) run dev &

build: ## Build Docker images
	$(DOCKER_COMPOSE) build
	$(DOCKER) build -t $(REGISTRY)/$(IMAGE_NAMESPACE)/backend:$(IMAGE_TAG) -f infrastructure/docker/backend.Dockerfile .
	$(DOCKER) build -t $(REGISTRY)/$(IMAGE_NAMESPACE)/worker:$(IMAGE_TAG) -f infrastructure/docker/worker.Dockerfile .
	$(DOCKER) build -t $(REGISTRY)/$(IMAGE_NAMESPACE)/frontend:$(IMAGE_TAG) -f frontend/Dockerfile ./frontend

test: ## Run all tests
	cd backend && $(PYTHON) -m pytest tests/ -v --cov=app --cov-report=term --cov-report=html
	cd frontend && $(NPM) run test -- --coverage

lint: ## Run linters
	cd backend && ruff check app/ tests/
	cd backend && mypy app/
	cd frontend && $(NPM) run lint

migrate: ## Run database migrations
	cd backend && alembic upgrade head

seed: ## Seed the database with initial data
	cd backend && $(PYTHON) -m app.seed

docker-up: ## Start all Docker services
	$(DOCKER_COMPOSE) up --build -d

docker-down: ## Stop all Docker services
	$(DOCKER_COMPOSE) down -v

docker-up-prod: ## Start production simulation
	$(DOCKER_COMPOSE) -f docker-compose.prod.yml up --build -d

docker-down-prod: ## Stop production simulation
	$(DOCKER_COMPOSE) -f docker-compose.prod.yml down -v

deploy: ## Deploy to Kubernetes
	@echo "Deploying to Kubernetes..."
	kubectl apply -f infrastructure/kubernetes/namespaces/
	kubectl apply -f infrastructure/kubernetes/configmaps/
	kubectl apply -f infrastructure/kubernetes/services/
	kubectl apply -f infrastructure/kubernetes/deployments/
	kubectl apply -f infrastructure/kubernetes/hpa/
	kubectl apply -f infrastructure/kubernetes/ingress/
	@echo "Deployment complete."

deploy-rollback: ## Rollback to previous Kubernetes deployment
	kubectl rollout undo deployment/api -n erp-system
	kubectl rollout undo deployment/worker -n erp-system
	kubectl rollout undo deployment/frontend -n erp-system

backup: ## Backup database to S3
	@echo "Starting database backup..."
	./infrastructure/scripts/backup.sh

restore: ## Restore database from latest backup
	@echo "Starting database restore..."
	./infrastructure/scripts/restore.sh

logs: ## Tail logs from Docker services
	$(DOCKER_COMPOSE) logs -f

ps: ## Show running services
	$(DOCKER_COMPOSE) ps

clean: ## Clean up temporary files
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete
	find . -type f -name "*.pyo" -delete
	find . -type f -name ".coverage" -delete
	find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name "node_modules" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name "dist" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".mypy_cache" -exec rm -rf {} + 2>/dev/null || true
	rm -rf frontend/dist
	rm -rf backend/htmlcov
