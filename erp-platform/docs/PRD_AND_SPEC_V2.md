# Enterprise ERP Platform: V2 Architecture & PRD
**Module:** Enterprise Core, Event-Driven Architecture, CQRS & Advanced Analytics
**Author (Agent):** Pi (Product Owner & Business Analyst)
**Status:** Approved for Implementation

---

## 1. Business Logic & Product Requirements (PRD)

### 1.1 Overview
Kurumsal ERP platformunu "Monolitik" yapıdan "Modüler Monolit ve Mikroservislere Ayrılabilir" (Modular Monolith with Microservice Extraction Points) bir yapıya taşıyoruz. Bu dönüşüm; saniyede binlerce isteği karşılayabilen, verinin Event-Driven (olay güdümlü) olarak RabbitMQ üzerinden aktığı, ve arama/raporlama işlemlerinin Elasticsearch (CQRS read model) üzerinden yapıldığı devasa bir sistemi kapsar.

### 1.2 User Stories & Core Features
- **US-010 (Event-Driven):** Bir işlem (örneğin: `InvoiceCreated`) yapıldığında, sistem senkron olarak beklemeden RabbitMQ'ya bir event fırlatmalı. Envanter ve Finans modülleri bu event'i dinleyerek asenkron (Celery) olarak kendi veritabanlarını güncellemelidir.
- **US-011 (CQRS - Arama ve Raporlama):** Kullanıcı, Dashboard üzerinde 10 yıllık veriyi süzdüğünde (Full-text search veya agregation), istek doğrudan PostgreSQL yerine Elasticsearch 8'e gitmeli ve p95 < 300ms içinde sonuç dönmelidir.
- **US-012 (Predictive AI):** Sistem arka planda çalışan bir AI modülüne sahip olmalı. Stokların bitme hızını (burn rate) analiz edip, satın alma departmanına otomatik "Tedarik Önerisi" oluşturmalıdır.
- **US-013 (Zero-Trust API):** Tüm API katmanları (FastAPI) sadece JWT yetkilendirmesi değil, aynı zamanda Role-Based Access Control (RBAC) ile `trace-id` (OpenTelemetry) takibi sağlamalı. Audit loglar eksiksiz olmalı.
- **US-014 (Micro-Frontend Readiness):** Frontend (React 18), farklı domainlerden gelen modülleri (Finans, İK) dinamik olarak yükleyebilecek şekilde yapılandırılmış ve "Premium" (Tailwind CSS, Ant Design 5, Glassmorphism) bir UI'a sahip olmalıdır.

---

## 2. Technical Specification (SPEC)

### 2.1 CQRS & Event-Driven Database Schema
Yazma işlemleri (Write) PostgreSQL 16'ya, Okuma işlemleri (Read) Elasticsearch'e ayrılacaktır.
- **Write Database (PostgreSQL 16 - Async SQLAlchemy):**
  - Schema: `core`, `inventory`, `finance`, `hr`
  - Transactional bütünlük zorunludur. `UUID` primary key'ler kullanılacaktır.
- **Read Model (Elasticsearch 8):**
  - İndeksler: `erp_invoices`, `erp_inventory_logs`, `erp_audit_logs`
  - Veri senkronizasyonu `SQLAlchemy Events` veya `Debezium (CDC)` yerine ilk aşamada **Celery + RabbitMQ** üzerinden yapılacaktır.

### 2.2 Event Bus (RabbitMQ 4)
Microservice haberleşmesi için Topic Exchange kullanılacaktır.
- **Exchange:** `erp.topic.exchange`
- **Routing Keys:** 
  - `finance.invoice.created`
  - `inventory.stock.adjusted`
  - `hr.employee.onboarded`

### 2.3 API Endpoints (FastAPI)
- **`/api/v2/events/`** - Webhook'lar ve dış sistemlerden gelen event'leri karşılamak için.
- **`/api/v2/search/`** - Elasticsearch'e proxy görevi gören, yetkilendirilmiş CQRS read endpointleri.
- **`/api/v2/analytics/predict`** - AI asistanın (Predictive) stok ve finans öngörülerini döneceği endpoint.

### 2.4 Infrastructure (Kubernetes & Docker)
Sistem Docker-Compose ile ayağa kalkacak ancak Kubernetes (K8s) için Helm chart'ları hazırlanacaktır.
- **Redis 7:** Caching (Tier 1) ve Rate Limiting.
- **RabbitMQ:** Event Broker.
- **Elasticsearch + Kibana:** Arama motoru ve log analizi.
- **PostgreSQL 16:** Ana veri kaynağı.

### 2.5 Handoff to Next Agents
- **Cursor:** Bu belgeyi temel alarak Frontend'in premium UI bileşenlerini ve TypeScript tiplerini hazırlayacak.
- **Devin AI:** FastAPI altyapısını, Async SQLAlchemy modellerini, RabbitMQ yayıncı/dinleyici (publisher/consumer) sınıflarını ve Celery görevlerini otonom olarak kodlayacak. Test Coverage %90'ı geçecek.
- **GitHub Copilot:** Tüm fonksiyonların dokümantasyonunu ve mikro seviyedeki refaktör işlemlerini anlık olarak yönetecek.
