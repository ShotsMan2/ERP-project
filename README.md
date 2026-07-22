# Enterprise ERP System

Welcome to the Enterprise Resource Planning (ERP) System repository. This project aims to provide a unified, enterprise-grade platform for mid-to-large businesses, replacing fragmented software with a single, cohesive system covering Finance, HR, Inventory, Sales, Procurement, Project Management, and Analytics.

## 📂 Repository Structure

- **[`erp-platform/`](./erp-platform/)**: Contains the complete source code for the ERP application, including frontend, backend, infrastructure, and detailed technical documentation. 
  - 📖 *Please see the [Technical README](./erp-platform/README.md) inside this directory for detailed setup instructions, architecture diagrams, and module lists.*
- **[`ERP-SYSTEM-PLANNING.md`](./ERP-SYSTEM-PLANNING.md)**: The comprehensive architecture and planning document detailing the functional/non-functional requirements, business value, and system design.
- **`.agents/`**: Contains AI agent configuration, context, and rules for automated assistance on this codebase.

## 🛠️ High-Level Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Ant Design 5, Tailwind CSS
- **Backend**: Python 3.12, FastAPI, SQLAlchemy 2.0, Celery
- **Database**: PostgreSQL 16
- **Cache & Message Broker**: Redis 7, RabbitMQ 4
- **Search**: Elasticsearch 8
- **Infrastructure**: Docker Compose, Kubernetes, Terraform

## 🚀 Getting Started

To get started with development, please navigate to the `erp-platform` directory and refer to its specific documentation:

```bash
cd erp-platform
# Follow the instructions in erp-platform/README.md
```
