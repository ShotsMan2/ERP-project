# Product Requirement Document & Technical Specification
**Module:** Core Authentication & Role-Based Access Control (RBAC)
**Author (Agent):** Pi (Product Owner & Business Analyst)
**Status:** Approved for Implementation

---

## 1. Business Logic & Product Requirements (PRD)

### 1.1 Overview
Kurumsal ERP platformunun merkezinde yer alacak olan "Core Auth & RBAC" modülü, "Sıfır Güven" (Zero-Trust) mimarisi prensiplerine göre tasarlanmıştır. Kullanıcıların kimlik doğrulaması, JWT tabanlı oturum yönetimi ve en alt veri satırına kadar inen (Row-Level Security) yetkilendirme mekanizmasını kapsar.

### 1.2 User Stories
- **US-001:** Bir sistem yöneticisi olarak, farklı şirketler (Tenants) ve bu şirketlere bağlı şubeler (Branches) tanımlayabilmeliyim.
- **US-002:** Bir sistem yöneticisi olarak, kullanıcıları belirli şubelere ve departmanlara atayabilmeliyim.
- **US-003:** Bir kullanıcı olarak, e-posta ve güçlü parolam ile giriş yapıp kısa ömürlü (15 dk) Access Token ve uzun ömürlü (7 gün) Refresh Token alabilmeliyim.
- **US-004:** Sisteme entegre edilecek güvenlik denetimi modülü (Audit), kullanıcıların yaptığı her POST, PUT ve DELETE işlemini `trace_id` ve `user_id` ile veritabanına ve Elasticsearch'e asenkron (RabbitMQ/Celery) olarak kaydetmelidir.
- **US-005:** Bir sistem yöneticisi olarak, çok ince taneli (granular) roller oluşturabilmeli ve bu rolleri kullanıcılara atayabilmeliyim (örn: `inventory:write`, `finance:read_only`).

---

## 2. Technical Specification (SPEC)

### 2.1 Database Schema (PostgreSQL 16)
`SQLAlchemy 2.0 (Async)` kullanılarak tasarlanacak veri modelleri:

- **Company (Tenant):** `id`, `name`, `tax_id`, `created_at`, `updated_at`, `is_active`
- **Branch:** `id`, `company_id`, `name`, `address`, `created_at`
- **User:** `id`, `email`, `hashed_password`, `first_name`, `last_name`, `is_active`, `is_superuser`, `default_branch_id`
- **Role:** `id`, `name`, `description`
- **Permission:** `id`, `resource` (örn: `invoice`), `action` (örn: `create`)
- **UserRoleLink:** `user_id`, `role_id`
- **RolePermissionLink:** `role_id`, `permission_id`

### 2.2 API Endpoints (FastAPI)
Bütün uç noktalar `<FastAPI>/api/v1/auth/` altında olacaktır.

| Endpoint | Method | Description | Security |
|----------|--------|-------------|----------|
| `/login` | `POST` | E-posta ve parola ile Access ve Refresh Token döner. | Public |
| `/refresh` | `POST` | Geçerli bir Refresh Token ile yeni bir Access Token döner. | Refresh Token |
| `/me` | `GET` | Oturum açmış kullanıcının bilgilerini ve yetkilerini döner. | JWT Bearer |
| `/logout` | `POST` | Refresh Token'ı kara listeye (Redis) alır. | JWT Bearer |
| `/users` | `POST` | Yeni bir kullanıcı oluşturur (Sadece Superuser). | JWT + `user:create` |

### 2.3 Edge Cases & Constraints
1. **Şifreleme:** Parolalar `bcrypt` veya `argon2` ile hashlenecektir.
2. **Performans:** Token doğrulama işlemi sırasında kullanıcı her seferinde PostgreSQL'e gitmemelidir; yetki kontrolleri JWT Payload'u içindeki (veya Redis üzerindeki) önbelleklenmiş izinler ile p95 < 200ms sürede çözülmelidir.
3. **Audit Trail:** Tüm yetki değişiklikleri ve giriş başarısızlıkları (Brute Force koruması için) Redis Rate Limiter'a ve Audit loglarına düşmelidir.

### 2.4 Handoff to Next Agent (Devin AI)
Devin AI'ın görevi: Yukarıdaki spesifikasyonlara göre FastAPI projelerini yapılandırmak, SQLAlchemy 2.0 modellerini oluşturmak, Alembic migrationlarını çalıştırmak ve otonom test kapsamını sağlamaktır.
