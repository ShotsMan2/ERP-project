# Project Overview: Corporate ERP System

This project is an Enterprise Resource Planning (ERP) system designed to serve as a unified platform for mid-to-large enterprises. It covers comprehensive modules including Finance, HR, Inventory, Sales, Procurement, Project Management, and Analytics.

## Tech Stack & Architecture
- **Architecture:** Modular monolith designed with microservice extraction points.
- **Frontend:** React 18+ with TypeScript, Micro-frontend ready.
- **API:** REST + GraphQL hybrid, OpenAPI 3.1 specifications.
- **Database:** PostgreSQL 16 (with partitioning and read replicas).
- **Caching & Queues:** Redis 7 (multi-tier), RabbitMQ / Redis Streams.
- **Search:** Elasticsearch / Meilisearch.
- **Deployment & Infra:** Docker, Kubernetes (EKS/AKS/GKE), S3-compatible object storage.
- **Auth & Security:** OAuth 2.0 + JWT + Refresh Tokens, strict RBAC, OWASP Top 10 compliance.

## Agent Instructions & Rules
1. **Context Awareness:** Always keep this project summary and architectural constraints in mind for every prompt and task. You must operate within the context of an enterprise-grade ERP.
2. **Modularity:** Respect the modular boundaries of the application (Core, HR, Finance, Inventory, etc.) and do not tightly couple independent modules.
3. **Performance & Scalability:** Write code that supports horizontal scaling, fast API response times (<200ms p95), and handles high concurrency (5,000+ users).
4. **Best Practices:** Follow strict TypeScript typing, comprehensive error handling, and ensure all data mutations leave a full audit trail.
