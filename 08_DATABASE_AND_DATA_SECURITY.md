# İşAkış — 08: Veritabanı ve Veri Güvenliği

> Proje: İşAkış
> Doküman: Veritabanı ve Veri Güvenliği
> Durum: Draft
> Üretim tarihi: 2026-07-21
> Kaynak girdi: templates/01_PROJE_GIRDI_FORMU.yaml

---

## İçindekiler

1. [Veri Sınıflandırması](#1-veri-sınıflandırması)
2. [Tenant Stratejisi](#2-tenant-stratejisi)
3. [Kavramsal Veri Modeli](#3-kavramsal-veri-modeli)
4. [Mantıksal Veri Modeli — Mermaid ER Diyagramı](#4-mantıksal-veri-modeli--mermaid-er-diyagramı)
5. [Tablo Listesi](#5-tablo-listesi)
6. [İndeksleme Yaklaşımı](#6-i̇ndeksleme-yaklaşımı)
7. [Migration (Flyway)](#7-migration-flyway)
8. [Database Rolleri ve Erişim Kontrolü](#8-database-rolleri-ve-erişim-kontrolü)
9. [Row-Level Security (RLS) Değerlendirmesi](#9-row-level-security-rls-değerlendirmesi)
10. [Şifreleme ve Hashing](#10-şifreleme-ve-hashing)
11. [Backup, PITR ve Restore](#11-backup-pitr-ve-restore)
12. [Retention ve Silme Politikası](#12-retention-ve-silme-politikası)
13. [Test Verisi Politikası](#13-test-verisi-politikası)

---

## 1. Veri Sınıflandırması

KVKK kapsamında İşAkış'ta işlenen tüm veriler aşağıdaki gibi sınıflandırılır:

| Sınıf | Etiket | Örnek Veriler | Saklama | Şifreleme | Erişim |
|-------|--------|---------------|---------|-----------|--------|
| **Kritik** | `PII-SENSITIVE` | Şifre hash'i, refresh token, JWT signing key | Oturum süresi / manuel rotasyon | bcrypt (şifre), AES-256 (token) | Sadece Identity Service |
| **Kişisel Veri** | `PII-GENERAL` | Ad, soyad, e-posta, telefon, adres, imza, profil fotoğrafı | Hesap silinene kadar (en fazla 10 yıl), talep halinde 30 gün içinde silme | AES-256 (DB seviyesinde opsiyonel), TLS (aktarımda) | Tenant scope + yetkilendirme |
| **Hassas İş Verisi** | `BUSINESS-SENSITIVE` | İş emri detayları, müşteri özel notları, fiyat bilgisi, kontrol listesi sonuçları | Sözleşme süresi + 5 yıl, talep halinde silme | AES-256 (opsiyonel), TLS (aktarımda) | Tenant scope + RBAC |
| **İş Verisi** | `BUSINESS-GENERAL` | İş emri durumu, malzeme listesi, varlık bilgileri, rapor özetleri | Sözleşme süresi + 3 yıl | TLS (aktarımda) | Tenant scope + RBAC |
| **Lokasyon Verisi** | `LOCATION` | GPS koordinatları, teknisyen konum geçmişi, check-in/out lokasyonları | 90 gün (canlı), 1 yıl (anonimleştirilmiş rapor) | AES-256 (DB seviyesinde), TLS (aktarımda) | Tenant scope + Admin |
| **Sistem Verisi** | `SYSTEM` | Audit log, metrikler, hata log'ları, performans verileri | 90 gün (log), 1 yıl (audit) | TLS (aktarımda) | Admin |
| **Geçici Veri** | `TRANSIENT` | Cache verisi, oturum verisi, rate limit sayaçları | TTL sonunda otomatik silme | Yok (bellekte) | Uygulama içi |

### KVKK Uyum Matrisi

| KVKK Yükümlülüğü | İşAkış Karşılığı |
|-------------------|---------------------|
| **Aydınlatma yükümlülüğü** | Kayıt sayfasında ve uygulama içinde KVKK Aydınlatma Metni |
| **Açık rıza** | Hesap oluşturma sırasında checkbox (opt-in, önceden işaretli DEĞİL) |
| **Veri minimizasyonu** | Sadece gerekli alanlar toplanır. İş emri için TCKN veya doğum tarihi istenmez |
| **VERBIS kaydı** | İşAkış (operatör sıfatıyla) VERBIS'e kayıtlı olmalı |
| **Erişim hakkı** | Kullanıcı, profil sayfasından tüm kişisel verilerini görüntüleyebilir ve JSON/CSV olarak dışa aktarabilir |
| **Düzeltme hakkı** | Kullanıcı profil bilgilerini düzenleyebilir |
| **Silme hakkı** | Hesap silme → 30 gün soft-delete → 90 gün sonra kalıcı silme (backup'lardan da temizleme) |
| **Veri taşınabilirliği** | JSON formatında veri dışa aktarımı |
| **Veri güvenliği** | Bu dokümanda tanımlanan tüm teknik ve idari tedbirler |

---

## 2. Tenant Stratejisi

### Shared Database / Shared Schema

İşAkış, **shared database + shared schema** tenant modelini kullanır.

```
┌─────────────────────────────────────────────┐
│            PostgreSQL 16 - sahaflow          │
│                                               │
│  ┌─────────────────────────────────────────┐ │
│  │            public schema                 │ │
│  │                                          │ │
│  │  tenant_id = 'aaa' → Tenant-A verileri  │ │
│  │  tenant_id = 'bbb' → Tenant-B verileri  │ │
│  │  tenant_id = 'ccc' → Tenant-C verileri  │ │
│  │  ...                                     │ │
│  │                                          │ │
│  │  Her tabloda tenant_id (UUID) kolonu    │ │
│  │  Her sorguda WHERE tenant_id = ?       │ │
│  └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

### Neden Bu Model?

| Kriter | Değerlendirme |
|--------|---------------|
| **Maliyet** | Tek veritabanı, tek connection pool. 2 kişilik ekip için ideal. |
| **Operasyon** | Tek yedek, tek migration, tek monitoring. |
| **Ölçek** | 100 tenant (year-1), her biri ~10GB → 1TB veri. Tek PostgreSQL instance yeterli. |
| **Dezavantaj** | Tenant'lar arası sızıntı riski (application seviyesinde önleniyor). "Noisy neighbor" problemi — bir tenant'ın ağır sorguları diğerlerini etkileyebilir. |

### Tenant İzolasyon Stratejisi

```
[A] Uygulama seviyesi (PRİMER):
    - TenantContext ThreadLocal filter
    - Her repository sorgusunda tenant_id = ?
    - Hibernate interceptor ile otomatik tenant_id ekleme

[B] Veritabanı seviyesi (DESTEK):
    - Her tabloda tenant_id NOT NULL kısıtı
    - CHECK constraint veya trigger ile tenant_id boş geçilemez
    - (Opsiyonel) RLS policy ile ek güvenlik katmanı
```

### Gelecek için Database-per-Tenant Geçiş Yolu

Eğer 500+ tenant'a ulaşılırsa:
- Yeni tenant'lar ayrı veritabanında oluşturulabilir
- `tenant` tablosuna `database_name` veya `connection_string` alanı eklenir
- RoutingDataSource ile doğru veritabanına yönlendirme yapılır
- Eski tenant'lar kademeli olarak taşınır

---

## 3. Kavramsal Veri Modeli

### Ana Varlıklar ve İlişkiler

```
TENANT ──owns──> USER_ACCOUNT ──has──> MEMBERSHIP ──has──> ROLE ──has──> PERMISSION
  │                   │
  │                   │ (assigns)
  │                   ▼
  │              WORK_ORDER_ASSIGNMENT
  │                   │
  │ owns              │ belongs to
  │                   ▼
  ├──owns──> CUSTOMER ──owns──> ASSET
  │              │                │
  │              │                │ (belongs to)
  │              │                ▼
  │              └─────> WORK_ORDER ──uses──> MATERIAL (via WORK_ORDER_MATERIAL)
  │                          │
  │                          │ (has)
  │                          ▼
  │                   WORK_ORDER_STATUS_HISTORY
  │                   LOCATION_EVENT
  │                   CHECKLIST_RESULT ──based on──> CHECKLIST_TEMPLATE
  │                   MEDIA_OBJECT
  │                   SERVICE_REPORT
  │                   CUSTOMER_APPROVAL
  │
  ├──owns──> OUTBOX_EVENT
  └──owns──> AUDIT_EVENT
```

---

## 4. Mantıksal Veri Modeli — Mermaid ER Diyagramı

```mermaid
erDiagram
    TENANT ||--o{ USER_ACCOUNT : "kullanıcılarını barındırır"
    TENANT ||--o{ CUSTOMER : "müşterilerini barındırır"
    TENANT ||--o{ WORK_ORDER : "iş emirlerini barındırır"
    TENANT ||--o{ CHECKLIST_TEMPLATE : "kontrol listesi şablonları"
    TENANT ||--o{ MATERIAL : "malzeme kataloğu"
    TENANT ||--o{ ROLE : "rollerini tanımlar"
    TENANT ||--o{ AUDIT_EVENT : "audit kayıtları"
    TENANT ||--o{ OUTBOX_EVENT : "outbox event'leri"

    USER_ACCOUNT ||--o{ MEMBERSHIP : "üyelik"
    ROLE ||--o{ PERMISSION : "izinleri"
    ROLE ||--o{ MEMBERSHIP : "role atanır"

    CUSTOMER ||--o{ CUSTOMER_ADDRESS : "adresleri"
    CUSTOMER ||--o{ ASSET : "varlıkları"
    CUSTOMER ||--o{ WORK_ORDER : "iş emirleri"

    ASSET ||--o{ WORK_ORDER : "iş emirleri"

    WORK_ORDER ||--o{ WORK_ORDER_ASSIGNMENT : "atamaları"
    WORK_ORDER ||--o{ WORK_ORDER_STATUS_HISTORY : "durum geçmişi"
    WORK_ORDER ||--o{ LOCATION_EVENT : "lokasyon olayları"
    WORK_ORDER ||--o{ MEDIA_OBJECT : "medya dosyaları"
    WORK_ORDER ||--o{ CHECKLIST_RESULT : "kontrol listesi sonuçları"
    WORK_ORDER ||--o{ WORK_ORDER_MATERIAL : "kullanılan malzemeler"
    WORK_ORDER ||--o{ SERVICE_REPORT : "servis raporları"
    WORK_ORDER ||--|{ CUSTOMER_APPROVAL : "müşteri onayları"

    CHECKLIST_TEMPLATE ||--o{ CHECKLIST_RESULT : "sonuçlar"
    MATERIAL ||--o{ WORK_ORDER_MATERIAL : "kullanım"
    USER_ACCOUNT ||--o{ WORK_ORDER_ASSIGNMENT : "atamaları"
    CUSTOMER_ADDRESS ||--o|{ POSTGIS_GEOMETRY : "coğrafi konum"

    TENANT {
        uuid id PK
        varchar name
        varchar subdomain UK
        varchar contact_email
        varchar contact_phone
        varchar address
        boolean is_active
        varchar subscription_tier
        timestamp created_at
        timestamp updated_at
    }

    USER_ACCOUNT {
        uuid id PK
        uuid tenant_id FK
        varchar email UK
        varchar password_hash
        varchar first_name
        varchar last_name
        varchar phone
        varchar avatar_url
        boolean is_active
        boolean is_locked
        int failed_login_attempts
        timestamp locked_until
        timestamp last_login_at
        timestamp password_changed_at
        boolean mfa_enabled
        varchar mfa_secret
        timestamp created_at
        timestamp updated_at
    }

    MEMBERSHIP {
        uuid id PK
        uuid user_id FK
        uuid role_id FK
        uuid tenant_id FK
        timestamp created_at
    }

    ROLE {
        uuid id PK
        uuid tenant_id FK
        varchar name
        varchar description
        boolean is_system_role
        timestamp created_at
    }

    PERMISSION {
        uuid id PK
        uuid role_id FK
        varchar permission_key
        timestamp created_at
    }

    CUSTOMER {
        uuid id PK
        uuid tenant_id FK
        varchar name
        varchar company_name
        varchar tax_number
        varchar tax_office
        varchar email
        varchar phone
        varchar notes
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    CUSTOMER_ADDRESS {
        uuid id PK
        uuid customer_id FK
        varchar label
        varchar address_line1
        varchar address_line2
        varchar city
        varchar district
        varchar postal_code
        geometry location "POINT, PostGIS"
        boolean is_default
        timestamp created_at
    }

    ASSET {
        uuid id PK
        uuid tenant_id FK
        uuid customer_id FK
        varchar name
        varchar serial_number
        varchar model
        varchar brand
        varchar asset_type
        varchar location_description
        text notes
        jsonb metadata
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    WORK_ORDER {
        uuid id PK
        uuid tenant_id FK
        uuid customer_id FK
        uuid asset_id FK "nullable"
        varchar title
        text description
        varchar status
        varchar priority
        timestamp scheduled_start_at
        timestamp scheduled_end_at
        timestamp actual_start_at
        timestamp actual_end_at
        uuid assigned_to_user_id "nullable"
        text notes
        jsonb custom_fields
        bigint version "optimistic lock"
        timestamp created_at
        timestamp updated_at
        uuid created_by
    }

    WORK_ORDER_ASSIGNMENT {
        uuid id PK
        uuid work_order_id FK
        uuid user_id FK
        timestamp assigned_at
        uuid assigned_by
        timestamp unassigned_at
    }

    WORK_ORDER_STATUS_HISTORY {
        uuid id PK
        uuid work_order_id FK
        varchar from_status
        varchar to_status
        text note
        uuid changed_by
        timestamp changed_at
    }

    LOCATION_EVENT {
        uuid id PK
        uuid work_order_id FK
        uuid user_id
        varchar event_type
        geometry location "POINT, PostGIS"
        double precision accuracy
        timestamp recorded_at
    }

    CHECKLIST_TEMPLATE {
        uuid id PK
        uuid tenant_id FK
        varchar name
        varchar description
        jsonb items "soru/öğe listesi"
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    CHECKLIST_RESULT {
        uuid id PK
        uuid work_order_id FK
        uuid checklist_template_id FK
        uuid completed_by
        jsonb answers "cevaplar"
        varchar status
        text general_notes
        timestamp completed_at
        timestamp created_at
    }

    MATERIAL {
        uuid id PK
        uuid tenant_id FK
        varchar name
        varchar sku
        varchar unit
        decimal unit_price
        boolean is_active
        timestamp created_at
    }

    WORK_ORDER_MATERIAL {
        uuid id PK
        uuid work_order_id FK
        uuid material_id FK
        decimal quantity
        decimal unit_price "işlem anındaki fiyat"
        text note
        timestamp created_at
    }

    MEDIA_OBJECT {
        uuid id PK
        uuid tenant_id FK
        uuid work_order_id FK "nullable"
        uuid checklist_result_id FK "nullable"
        varchar object_key "S3 key"
        varchar original_filename
        varchar content_type
        bigint file_size
        varchar status "PENDING, READY, FAILED"
        timestamp created_at
        uuid created_by
    }

    CUSTOMER_APPROVAL {
        uuid id PK
        uuid work_order_id FK
        uuid customer_id FK
        varchar approval_type "SIGNATURE, CODE, CONFIRMATION"
        text signature_data "base64 imza görseli"
        varchar confirmation_code
        geometry signed_location "POINT"
        timestamp signed_at
    }

    SERVICE_REPORT {
        uuid id PK
        uuid work_order_id FK
        uuid created_by
        text summary
        text work_performed
        text recommendations
        jsonb parts_used
        varchar report_status "DRAFT, FINAL"
        timestamp created_at
        timestamp finalized_at
    }

    PAYMENT_STATUS {
        uuid id PK
        uuid work_order_id FK
        varchar payment_method
        decimal amount
        varchar currency "TRY"
        varchar status "PENDING, PAID, REFUNDED, CANCELLED"
        varchar transaction_id
        timestamp paid_at
        timestamp created_at
    }

    OUTBOX_EVENT {
        uuid id PK
        uuid tenant_id FK
        varchar aggregate_type
        uuid aggregate_id
        varchar event_type
        jsonb payload
        varchar status "PENDING, PROCESSED, FAILED"
        int retry_count
        timestamp created_at
        timestamp processed_at
    }

    AUDIT_EVENT {
        uuid id PK
        uuid tenant_id FK
        uuid actor_id
        varchar actor_role
        varchar event_type
        varchar target_type
        uuid target_id
        varchar action
        jsonb changes
        varchar ip_address
        varchar user_agent
        varchar request_id
        timestamp created_at
    }
```

---

## 5. Tablo Listesi

| # | Tablo Adı | Açıklama | Tahmini Yıllık Boyut (100 tenant) | Partition Key | Kritiklik |
|---|-----------|----------|-----------------------------------|---------------|-----------|
| 1 | `tenant` | Tenant tanımı ve konfigürasyonu | < 1 MB | — | Kritik |
| 2 | `user_account` | Kullanıcı hesabı ve kimlik bilgileri | ~50 MB | tenant_id (isteğe bağlı) | Kritik |
| 3 | `membership` | Kullanıcı-rol ilişkisi | ~10 MB | tenant_id | Kritik |
| 4 | `role` | Rol tanımları | < 1 MB | tenant_id | Kritik |
| 5 | `permission` | Rol-izin ilişkisi | < 5 MB | — | Kritik |
| 6 | `customer` | Müşteri bilgileri | ~100 MB | tenant_id | Hassas |
| 7 | `customer_address` | Müşteri adresleri + PostGIS konum | ~200 MB | customer_id | Hassas |
| 8 | `asset` | Müşteriye ait varlıklar | ~200 MB | tenant_id | İş |
| 9 | `work_order` | İş emirleri (ana tablo) | ~5 GB | tenant_id + created_at | İş |
| 10 | `work_order_assignment` | İş emri-teknisyen atamaları | ~100 MB | work_order_id | İş |
| 11 | `work_order_status_history` | İş emri durum geçmişi | ~500 MB | work_order_id | İş |
| 12 | `location_event` | GPS konum olayları | ~100 GB (en büyük tablo) | work_order_id + recorded_at | Lokasyon |
| 13 | `checklist_template` | Kontrol listesi şablonları | ~10 MB | tenant_id | İş |
| 14 | `checklist_result` | Saha kontrol listesi sonuçları | ~500 MB | work_order_id | Hassas |
| 15 | `material` | Malzeme kataloğu | ~10 MB | tenant_id | İş |
| 16 | `work_order_material` | İş emrinde kullanılan malzemeler | ~100 MB | work_order_id | İş |
| 17 | `media_object` | Dosya metadata kayıtları | ~100 MB | tenant_id | Hassas |
| 18 | `customer_approval` | Müşteri onay/imza kayıtları | ~200 MB | work_order_id | Hassas |
| 19 | `service_report` | Servis raporları | ~200 MB | work_order_id | Hassas |
| 20 | `payment_status` | Ödeme durumu | ~10 MB | work_order_id | Hassas |
| 21 | `outbox_event` | Outbox pattern event'leri | ~500 MB | — (polling ile temizlenir) | Sistem |
| 22 | `audit_event` | Denetim kayıtları | ~10 GB | created_at (time-based partition) | Sistem |
| 23 | `flyway_schema_history` | Flyway migration geçmişi | < 1 MB | — | Sistem |

### Tablo Büyüklük Hiyerarşisi

```
location_event        ████████████████████████████████  ~100 GB
audit_event           ████                            ~10 GB
work_order            ██                              ~5 GB
checklist_result      █                               ~500 MB
outbox_event          █                               ~500 MB
work_order_status_..  █                               ~500 MB
diğer tüm tablolar    █                               ~2 GB
                         ────────────────────────────────
                         TOPLAM                        ~118 GB
```

---

## 6. İndeksleme Yaklaşımı

### Zorunlu İndeksler (Her Tabloda)

| İndeks | Amaç |
|--------|------|
| `PRIMARY KEY (id)` | Tüm tablolarda UUID PK |
| `INDEX (tenant_id)` | Tüm tenant-aware tablolarda |
| `INDEX (tenant_id, id)` | Composite: tenant + PK aramaları için (IDOR önleme) |

### İş Emri Performans İndeksleri

```sql
-- İş emri listeleme (dashboard)
CREATE INDEX idx_wo_tenant_status ON work_order(tenant_id, status);
CREATE INDEX idx_wo_tenant_priority ON work_order(tenant_id, priority);
CREATE INDEX idx_wo_tenant_scheduled ON work_order(tenant_id, scheduled_start_at);
CREATE INDEX idx_wo_tenant_customer ON work_order(tenant_id, customer_id);
CREATE INDEX idx_wo_tenant_assignee ON work_order(tenant_id, assigned_to_user_id);
CREATE INDEX idx_wo_tenant_created ON work_order(tenant_id, created_at DESC);

-- PostGIS coğrafi indeksler
CREATE INDEX idx_customer_address_location ON customer_address USING GIST(location);
CREATE INDEX idx_location_event_location ON location_event USING GIST(location);
CREATE INDEX idx_location_event_wo_recorded ON location_event(work_order_id, recorded_at DESC);

-- Audit log tarih sorguları
CREATE INDEX idx_audit_event_created ON audit_event(created_at DESC);
CREATE INDEX idx_audit_event_tenant_created ON audit_event(tenant_id, created_at DESC);
CREATE INDEX idx_audit_event_type ON audit_event(event_type, created_at DESC);
```

### Partitioning Stratejisi

```sql
-- location_event: Aylık range partition (en büyük tablo)
CREATE TABLE location_event (
    id UUID NOT NULL,
    work_order_id UUID NOT NULL,
    user_id UUID,
    event_type VARCHAR(50),
    location GEOGRAPHY(POINT),
    accuracy DOUBLE PRECISION,
    recorded_at TIMESTAMP NOT NULL
) PARTITION BY RANGE (recorded_at);

CREATE TABLE location_event_2026_07 PARTITION OF location_event
    FOR VALUES FROM ('2026-07-01') TO ('2026-08-01');
-- Otomatik oluşturma için pg_partman extension değerlendirilebilir (MVP sonrası)

-- audit_event: Aylık range partition
CREATE TABLE audit_event (
    id UUID NOT NULL,
    tenant_id UUID NOT NULL,
    ...
    created_at TIMESTAMP NOT NULL
) PARTITION BY RANGE (created_at);
```

### İndeks Bakımı

- `REINDEX` işlemi: Aylık bakım penceresinde
- `ANALYZE`: Autovacuum varsayılan yapılandırması yeterli
- `pg_stat_user_indexes` ile kullanılmayan indekslerin tespiti (aylık)

---

## 7. Migration (Flyway)

### Migration Dosya Adlandırması

```
src/main/resources/db/migration/
├── V001__initial_schema.sql            # Tenant, user_account, role, permission
├── V002__customer_and_address.sql      # Customer, customer_address + PostGIS
├── V003__asset.sql                     # Asset
├── V004__work_order.sql                # Work order + assignment + status history
├── V005__checklist.sql                 # Checklist template + result
├── V006__material_and_inventory.sql    # Material + work_order_material
├── V007__media_object.sql              # Media object
├── V008__location_event.sql            # Location event (PostGIS) + partitioning
├── V009__approval_and_report.sql       # Customer approval + service report
├── V010__payment_and_outbox.sql        # Payment status + outbox event
├── V011__audit_event.sql               # Audit event + partitioning
├── V012__seed_data.sql                 # Sistem rolleri ve izinleri (seed)
└── R__repeatable_functions.sql         # Repeatable: trigger fonksiyonları, yardımcı fonksiyonlar
```

### Migration Kuralları

| Kural | Açıklama |
|-------|----------|
| **Versiyon sırası** | `V001`, `V002`, ... — bir kez çalıştırılır, değiştirilemez. CheckSum ile korunur. |
| **Repeatable** | `R__` prefix — her değişiklikte tekrar çalıştırılır. View'lar, fonksiyonlar burada. |
| **Geri alma (undo)** | MVP aşamasında geri alma stratejisi: manuel rollback script. Flyway Teams alınırsa otomatik. |
| **Sıfır kesinti (zero-downtime)** | Yeni kolon: nullable veya DEFAULT ile eklenir. Kolon silme: önce kullanımı kaldır, sonra sil. |
| **Test ortamında sıfırlama** | `flyway.clean()` sadece test ortamında çalışır. Production'da clean devre dışı. |

### Flyway Migration Örneği

```sql
-- V004__work_order.sql
CREATE TABLE work_order (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    customer_id UUID NOT NULL REFERENCES customer(id),
    asset_id UUID REFERENCES asset(id),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'OPEN',
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    scheduled_start_at TIMESTAMP WITH TIME ZONE,
    scheduled_end_at TIMESTAMP WITH TIME ZONE,
    actual_start_at TIMESTAMP WITH TIME ZONE,
    actual_end_at TIMESTAMP WITH TIME ZONE,
    assigned_to_user_id UUID,
    notes TEXT,
    custom_fields JSONB,
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,

    CONSTRAINT fk_wo_tenant FOREIGN KEY (tenant_id) REFERENCES tenant(id),
    CONSTRAINT fk_wo_customer FOREIGN KEY (customer_id) REFERENCES customer(id),
    CONSTRAINT fk_wo_asset FOREIGN KEY (asset_id) REFERENCES asset(id),
    CONSTRAINT chk_wo_status CHECK (status IN ('OPEN', 'ASSIGNED', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED')),
    CONSTRAINT chk_wo_priority CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'))
);

CREATE INDEX idx_wo_tenant_status ON work_order(tenant_id, status);
CREATE INDEX idx_wo_tenant_customer ON work_order(tenant_id, customer_id);
CREATE INDEX idx_wo_tenant_created ON work_order(tenant_id, created_at DESC);
```

### Spring Boot Flyway Konfigürasyonu

```yaml
# application.yml
spring:
  flyway:
    enabled: true
    locations: classpath:db/migration
    baseline-on-migrate: false
    validate-on-migrate: true
    clean-disabled: true  # Production'da clean yapılamaz
    out-of-order: false
    schemas: public
```

---

## 8. Database Rolleri ve Erişim Kontrolü

### Veritabanı Kullanıcı Rolleri

| Rol | Kullanıcı Adı | Yetkiler | Kullanım Yeri |
|-----|---------------|----------|---------------|
| **Migration** | `app_migration` | DDL (CREATE, ALTER, DROP), SELECT, INSERT, UPDATE, DELETE (seed data) | Flyway migration, CI/CD pipeline |
| **Runtime (Uygulama)** | `app_runtime` | SELECT, INSERT, UPDATE, DELETE. DDL YASAK. | Spring Boot uygulaması |
| **Read-Only (Rapor)** | `app_readonly` | Sadece SELECT. DML ve DDL YASAK. | Raporlama, analitik sorgular, Metabase |
| **Backup Operator** | `backup_operator` | SELECT (tüm tablolar), pg_dump. DML ve DDL YASAK. | Otomatik yedekleme işlemleri |

### Rol Oluşturma SQL'i

```sql
-- Migration kullanıcısı
CREATE ROLE app_migration WITH LOGIN PASSWORD 'STRONG_PASSWORD_32_CHAR_MIN' VALID UNTIL 'infinity';
GRANT ALL PRIVILEGES ON DATABASE sahaflow TO app_migration;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO app_migration;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO app_migration;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO app_migration;

-- Runtime kullanıcısı
CREATE ROLE app_runtime WITH LOGIN PASSWORD 'STRONG_PASSWORD_32_CHAR_MIN' VALID UNTIL 'infinity';
GRANT CONNECT ON DATABASE sahaflow TO app_runtime;
GRANT USAGE ON SCHEMA public TO app_runtime;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_runtime;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO app_runtime;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_runtime;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE ON SEQUENCES TO app_runtime;
-- DDL yetkisi VERİLMEZ

-- Read-Only kullanıcısı
CREATE ROLE app_readonly WITH LOGIN PASSWORD 'STRONG_PASSWORD_32_CHAR_MIN';
GRANT CONNECT ON DATABASE sahaflow TO app_readonly;
GRANT USAGE ON SCHEMA public TO app_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO app_readonly;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO app_readonly;

-- Backup kullanıcısı
CREATE ROLE backup_operator WITH LOGIN PASSWORD 'STRONG_PASSWORD_32_CHAR_MIN';
GRANT CONNECT ON DATABASE sahaflow TO backup_operator;
GRANT USAGE ON SCHEMA public TO backup_operator;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO backup_operator;
```

### Connection Pool Konfigürasyonu (HikariCP)

```yaml
spring:
  datasource:
    hikari:
      username: ${DB_USERNAME:app_runtime}
      password: ${DB_PASSWORD}
      maximum-pool-size: 10  # 2 vCPU için optimize
      minimum-idle: 2
      connection-timeout: 5000  # 5 saniye
      idle-timeout: 300000     # 5 dakika
      max-lifetime: 1800000    # 30 dakika
      leak-detection-threshold: 10000  # 10 saniye
```

---

## 9. Row-Level Security (RLS) Değerlendirmesi

### Karar: Şimdilik Uygulanmıyor (Applicaton-Level Tenant Filtering)

| Faktör | Değerlendirme |
|--------|---------------|
| **Avantajları** | Veritabanı seviyesinde zorunlu tenant izolasyonu. `app_runtime` kullanıcısı yanlışlıkla veya SQL injection ile başka tenant'ın verisini okuyamaz. |
| **Dezavantajları** | Her connection'da `SET tenant.id = '...'` çalıştırmak gerekir. Connection pool'da tenant state yönetimi karmaşıklaşır. `pgBouncer` transaction pooling ile uyumsuz. Hibernate lazy loading ve batch işlemlerde beklenmeyen davranışlar. |
| **Mevcut durum** | Application seviyesinde TenantContext + Hibernate interceptor + Repository sorgularında tenant_id kontrolü yeterli. |
| **Geçiş tetikleyicisi** | Pentest raporu RLS önerirse; compliance denetimi (SOC2, ISO27001) talep ederse; 1000+ tenant ile cross-tenant sızıntı riski artarsa. |

### RLS Uygulama Örneği (Referans)

```sql
-- Gelecekte uygulanacaksa:
ALTER TABLE work_order ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON work_order
    FOR ALL
    TO app_runtime
    USING (tenant_id = current_setting('tenant.id')::UUID);

-- Uygulama tarafında:
-- Her connection başında: SET tenant.id = '...';
-- HikariCP connection init SQL: SET tenant.id = '';
```

---

## 10. Şifreleme ve Hashing

### Şifre Hashing: bcrypt

```java
// PasswordEncoder bean
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder(12);  // Cost factor 12 (yaklaşık 250ms)
}

// Kullanıcı şifresi hash'leme
String hashedPassword = passwordEncoder.encode(rawPassword);
// → $2a$12$... (60 karakterlik hash)

// Hash karşılaştırma
boolean matches = passwordEncoder.matches(rawPassword, hashedPassword);
```

### Uygulama Seviyesinde Veri Şifreleme (AES-256-GCM)

Hassas veriler (vergi numarası, TCKN varsa, imza verisi) uygulama seviyesinde AES-256-GCM ile şifrelenir:

```java
@Component
public class DataEncryptionService {

    private final SecretKey secretKey;

    public DataEncryptionService(@Value("${app.encryption.key}") String base64Key) {
        byte[] decodedKey = Base64.getDecoder().decode(base64Key);
        this.secretKey = new SecretKeySpec(decodedKey, "AES");
    }

    public String encrypt(String plainText) {
        try {
            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            byte[] iv = new byte[12]; // GCM recommended IV length
            SecureRandom.getInstanceStrong().nextBytes(iv);
            GCMParameterSpec spec = new GCMParameterSpec(128, iv);
            cipher.init(Cipher.ENCRYPT_MODE, secretKey, spec);
            byte[] cipherText = cipher.doFinal(plainText.getBytes(StandardCharsets.UTF_8));

            // IV + CipherText birleştir ve base64 encode et
            byte[] combined = ByteBuffer.allocate(iv.length + cipherText.length)
                .put(iv)
                .put(cipherText)
                .array();
            return Base64.getEncoder().encodeToString(combined);

        } catch (GeneralSecurityException e) {
            throw new EncryptionException("Encryption failed", e);
        }
    }

    public String decrypt(String encryptedText) {
        try {
            byte[] combined = Base64.getDecoder().decode(encryptedText);
            ByteBuffer buffer = ByteBuffer.wrap(combined);
            byte[] iv = new byte[12];
            buffer.get(iv);
            byte[] cipherText = new byte[buffer.remaining()];
            buffer.get(cipherText);

            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
            GCMParameterSpec spec = new GCMParameterSpec(128, iv);
            cipher.init(Cipher.DECRYPT_MODE, secretKey, spec);
            byte[] plainText = cipher.doFinal(cipherText);
            return new String(plainText, StandardCharsets.UTF_8);

        } catch (GeneralSecurityException e) {
            throw new EncryptionException("Decryption failed", e);
        }
    }
}
```

### JPA Attribute Converter ile Şeffaf Şifreleme

```java
@Converter
public class EncryptedStringConverter implements AttributeConverter<String, String> {

    private static DataEncryptionService encryptionService;

    @Autowired
    public void setEncryptionService(DataEncryptionService service) {
        EncryptedStringConverter.encryptionService = service;
    }

    @Override
    public String convertToDatabaseColumn(String attribute) {
        if (attribute == null) return null;
        return encryptionService.encrypt(attribute);
    }

    @Override
    public String convertToEntityAttribute(String dbData) {
        if (dbData == null) return null;
        return encryptionService.decrypt(dbData);
    }
}

// Kullanımı
@Entity
public class Customer {
    @Column(name = "tax_number")
    @Convert(converter = EncryptedStringConverter.class)
    private String taxNumber;  // Veritabanında şifreli saklanır
}
```

### Şifreleme Anahtarı Yönetimi

| Kural | Uygulama |
|-------|----------|
| **Anahtar üretimi** | `openssl rand -base64 32` ile 256-bit anahtar |
| **Saklama** | Environment variable (`APP_ENCRYPTION_KEY`). Asla Git'te, kodda veya imajda saklanmaz. |
| **Rotasyon** | Manuel rotasyon (MVP aşaması). Rotasyon sırasında eski anahtar ile decrypt, yeni anahtar ile encrypt. |
| **Yedek** | Anahtar, güvenli bir yerde (şifre yöneticisi, HSM veya offline yedek) saklanır. |

### Veritabanı Seviyesinde Şifreleme (pgcrypto)

```sql
-- pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Kolon seviyesinde şifreleme (opsiyonel, ek güvenlik katmanı)
-- Hassas veri barındıran kolonlar için:
UPDATE customer SET tax_number = pgp_sym_encrypt(tax_number, 'ENCRYPTION_KEY')
WHERE tenant_id = '...';
```

**Not**: pgcrypto, uygulama seviyesindeki şifrelemeye göre daha az esneklik sunar (indeksleme, arama zor). İşAkış'ta uygulama seviyesinde şifreleme (JPA Attribute Converter) birincil yöntemdir.

### Bağlantı Şifreleme (TLS)

```yaml
# application.yml
spring:
  datasource:
    url: jdbc:postgresql://host:5432/sahaflow?sslmode=require
    hikari:
      ssl-mode: REQUIRE
```

---

## 11. Backup, PITR ve Restore

### Yedekleme Stratejisi

```
TAM YEDEK (Haftalık):
  pg_dump -Fc sahaflow > /backups/weekly/sahaflow_$(date +%Y%m%d).dump

WAL ARŞİVLEME (Sürekli):
  archive_mode = on
  archive_command = 'cp %p /backups/wal/%f'
  → Point-in-Time Recovery (PITR) için

ARTIMLI YEDEK (Günlük):
  pg_dump -Fc --schema=public sahaflow > /backups/daily/sahaflow_$(date +%Y%m%d).dump

R2'ye YEDEKLEME (Günlük):
  rclone sync /backups/ r2:sahaflow-backups/
  → Immutable (Object Lock) — fidye yazılımına karşı koruma
```

### Yedekleme Politikası

| Parametre | Değer |
|-----------|-------|
| **RPO (Recovery Point Objective)** | 1 saat (WAL arşivleme ile) |
| **RTO (Recovery Time Objective)** | 4 saat |
| **Tam yedek saklama** | 4 hafta |
| **WAL saklama** | 7 gün |
| **Yıllık yedek** | 1 adet, 7 yıl saklama (yasal gereklilik) |
| **Yedek şifreleme** | AES-256 (rclone crypt veya pg_dump ile) |
| **Yedek doğrulama** | Aylık: yedekten geri dönme testi (staging ortamında) |

### PostgreSQL Konfigürasyonu (postgresql.conf)

```ini
# WAL Arşivleme (PITR için)
wal_level = replica
archive_mode = on
archive_command = 'test ! -f /backups/wal/%f && cp %p /backups/wal/%f'
archive_timeout = 300  # 5 dakikada bir WAL segment'ini arşivle

# Backup süresi
max_wal_size = 4GB
min_wal_size = 1GB

# Checkpoint
checkpoint_timeout = 15min
checkpoint_completion_target = 0.9
```

### Restore Prosedürü

```bash
# 1. En son tam yedeği geri yükle
pg_restore -d sahaflow /backups/weekly/sahaflow_20260719.dump

# 2. WAL dosyalarını uygula (PITR)
# recovery.conf veya PostgreSQL 12+ signal file ile:
touch /var/lib/postgresql/data/recovery.signal

# postgresql.conf'a ekle:
restore_command = 'cp /backups/wal/%f %p'
recovery_target_time = '2026-07-21 14:30:00+03'
```

### Restore Testi (Aylık)

```bash
# Staging ortamında:
# 1. Production yedeğini staging'e geri yükle
# 2. Flyway migration çalıştır (güncel şema için)
# 3. Health check endpoint'lerini kontrol et
# 4. Örnek sorgularla veri bütünlüğünü doğrula
# 5. Tenant izolasyonunu doğrula
```

---

## 12. Retention ve Silme Politikası

### Veri Sınıfına Göre Saklama Süreleri

| Veri Sınıfı | Saklama Süresi | Silme Yöntemi | Gerekçe |
|-------------|----------------|---------------|---------|
| **Audit log** | 3 yıl | Aylık partition DROP | Yasal ve uyumluluk gereksinimi |
| **Lokasyon verisi (ham)** | 90 gün | Aylık partition DROP | KVKK veri minimizasyonu |
| **Lokasyon verisi (anonim)** | 1 yıl | Aylık toplu silme | İş zekası, raporlama |
| **Outbox event** | 7 gün (işlendikten sonra) | Günlük temizleme job'ı | Depolama optimizasyonu |
| **Oturum / refresh token** | 7 gün | Günlük temizleme job'ı | Güvenlik |
| **Rate limit sayaçları** | 1 saat (TTL) | Caffeine otomatik eviction | Bellek yönetimi |
| **Kullanıcı hesabı (silinmiş)** | 30 gün soft-delete → 90 gün hard-delete | Zamanlanmış job | KVKK silme hakkı |
| **İş emri verisi** | Sözleşme süresi + 5 yıl | Manuel / otomatik silme | Ticari ve yasal |
| **Dosyalar (S3)** | İş emri silinene kadar + 30 gün | S3 lifecycle policy | KVKK + depolama maliyeti |

### KVKK Silme Prosedürü

```
Kullanıcı hesap silme talebi:
  1. user_account.is_active = false, deleted_at = NOW() (SOFT DELETE)
  2. refresh_token'ları invalidate et
  3. 30 gün bekle (kullanıcı vazgeçebilir)
  4. user_account'u HARD DELETE
  5. Aynı kullanıcının oluşturduğu iş emirleri:
     - created_by = NULL (anonimleştir)
     - Müşteri verisi → müşteri silme akışına bağlı
  6. Backup'lardan da temizleme:
     - En son tam yedekten sonraki yedekleri bekle
     - 90 gün içinde tüm yedeklerden temizlenmiş olur

Müşteri verisi silme talebi:
  1. customer.is_active = false
  2. İlgili work_order'lar: CASCADE değil, manuel review
  3. İlgili asset'ler: soft delete
  4. 90 gün sonra hard delete
```

### Otomatik Temizleme Job'ları

```java
@Component
public class DataRetentionJobs {

    // Her gün 03:00'te çalışır
    @Scheduled(cron = "0 0 3 * * ?")
    public void cleanupExpiredRefreshTokens() {
        refreshTokenRepository.deleteExpired(Instant.now().minus(7, ChronoUnit.DAYS));
    }

    @Scheduled(cron = "0 0 3 * * ?")
    public void cleanupProcessedOutboxEvents() {
        outboxEventRepository.deleteProcessedOlderThan(Instant.now().minus(7, ChronoUnit.DAYS));
    }

    // Her ayın 1'inde çalışır
    @Scheduled(cron = "0 0 2 1 * ?")
    public void dropOldLocationPartitions() {
        // 90 günden eski location_event partition'larını sil
        jdbcTemplate.execute("DROP TABLE IF EXISTS location_event_" +
            LocalDate.now().minusMonths(3).format(DateTimeFormatter.ofPattern("yyyy_MM")));
    }

    @Scheduled(cron = "0 0 4 1 * ?")
    public void hardDeleteExpiredAccounts() {
        userAccountRepository.hardDeleteOlderThan(Instant.now().minus(90, ChronoUnit.DAYS));
    }
}
```

---

## 13. Test Verisi Politikası

### Kesinlikle Yasak

- Production verisinin test ortamına kopyalanması
- Gerçek kişisel verilerin (ad, e-posta, telefon) test verisi olarak kullanılması
- Production şifre hash'lerinin test ortamına taşınması

### Test Verisi Üretimi

```java
// JavaFaker (veya Instancio) ile gerçekçi ama sahte veri
@Test
void seedTestData() {
    Faker faker = new Faker(Locale.of("tr"));

    // Tenant oluştur
    Tenant tenant = Tenant.builder()
        .name("Test Şirketi " + faker.company().name())
        .subdomain("test-" + UUID.randomUUID().toString().substring(0, 8))
        .isActive(true)
        .build();
    tenantRepository.save(tenant);

    // Kullanıcı oluştur (sahte e-posta)
    for (int i = 0; i < 10; i++) {
        UserAccount user = UserAccount.builder()
            .tenantId(tenant.getId())
            .email("test-user-" + i + "@sahaflow-test.local")  // Gerçek domain DEĞİL
            .passwordHash("$2a$12$dummy-hash-for-test-only")
            .firstName(faker.name().firstName())
            .lastName(faker.name().lastName())
            .isActive(true)
            .build();
        userAccountRepository.save(user);
    }

    // İş emri oluştur (gerçekçi ama sahte)
    for (int i = 0; i < 100; i++) {
        WorkOrder wo = WorkOrder.builder()
            .tenantId(tenant.getId())
            .customerId(customer.getId())
            .title("Test İş Emri #" + i)
            .description("Bu otomatik oluşturulmuş test verisidir")
            .status(WorkOrderStatus.values()[i % WorkOrderStatus.values().length])
            .priority(WorkOrderPriority.values()[i % WorkOrderPriority.values().length])
            .build();
        workOrderRepository.save(wo);
    }
}
```

### Test Veri Kümesi (Seed)

```sql
-- V012__seed_data.sql
-- Sadece sistem rolleri ve temel veriler. Gerçek kişisel veri İÇERMEZ.

-- Sistem rolleri
INSERT INTO role (id, tenant_id, name, description, is_system_role) VALUES
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'ADMIN', 'Sistem yöneticisi', true),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'MANAGER', 'Servis yöneticisi', true),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'DISPATCHER', 'İş dağıtıcı', true),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'TECHNICIAN', 'Saha teknisyeni', true);

-- İzinler (her rol için) — detaylar için 07_BACKEND_ARCHITECTURE_SECURITY.md
```

---

## Karar Bekleyen Konular

1. **Partitioning otomasyonu**: `pg_partman` extension kullanılıp kullanılmayacağı. Manuel partition yönetimi başlangıçta yeterli, aylık bakım script'i ile idare edilebilir.
2. **Connection pooler (pgBouncer)**: 500+ bağlantıya ulaşıldığında pgBouncer transaction pooling. MVP aşamasında HikariCP yeterli.
3. **Read replica**: Raporlama ve analitik sorgular için read replica. 100+ tenant ve ağır raporlama yükü oluştuğunda değerlendirilecek.
4. **PostGIS versiyonu**: PostGIS 3.4 mü 3.5 mi? PostgreSQL 16 ile uyumlu en son kararlı sürüm.
5. **Veritabanı yedekleme aracı**: pg_dump vs pgBackRest vs WAL-G. pgBackRest, PITR ve incremental backup için daha iyi, ancak ek konfigürasyon yükü var. MVP'de pg_dump + WAL arşivleme.
6. **KVKK VERBIS kaydı**: Operatör sıfatıyla VERBIS kaydı için gerekli veri envanterinin çıkarılması ve Sicil'e kayıt. Production öncesinde tamamlanmalı.
7. **Veri işleme sözleşmesi (DPA)**: Müşterilerle (tenant'larla) imzalanacak veri işleme sözleşmesi taslağı. Hukuki danışmanlık gerektirir.

---

## İlgili Dokümanlar

- [05: Teknoloji Yığını Kararları](05_TECH_STACK_DECISIONS.md)
- [06: Frontend Mimari ve Güvenlik](06_FRONTEND_ARCHITECTURE_SECURITY.md)
- [07: Backend Mimari ve Güvenlik](07_BACKEND_ARCHITECTURE_SECURITY.md)
- [09: API ve Entegrasyonlar](09_API_AND_INTEGRATIONS.md)
