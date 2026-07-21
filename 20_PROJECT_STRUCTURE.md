> Proje: İşAkış / > Doküman: Proje Yapısı / > Durum: Draft / > Üretim tarihi: 2026-07-21 / > Kaynak girdi: templates/01_PROJE_GIRDI_FORMU.yaml

# İşAkış — Proje Yapısı

## 1. Monorepo Kararı ve Gerekçesi

**Karar:** Tüm uygulama kodları (backend, web frontend, mobil, altyapı, dokümantasyon) tek bir Git monorepo'sunda tutulacaktır.

**Durum:** Accepted

**Gerekçe:**
- **Ekip büyüklüğü 2 kişi:** Polyrepo yönetimi (çoklu repo, versiyon uyumu, cross-repo PR) 2 kişilik ekip için aşırı operasyonel yüktür.
- **Paylaşılan kod:** API tipleri (OpenAPI spec), validasyon kuralları, sabitler gibi paylaşımlı artefakt'lar tek repoda kolay paylaşılır.
- **Atomik değişiklik:** Bir özellik backend + frontend + mobil değişikliği gerektirdiğinde tek PR'da teslim edilebilir.
- **CI/CD basitliği:** Tek CI yapılandırması, değişiklik algılama (path-based triggers) ile sadece etkilenen projeler build edilir.
- **Tutarlı araç zinciri:** Lint, format, test, build araçları tüm projelerde tutarlıdır.

**Olumsuz Yanlar ve Azaltma:**
- Repo boyutu büyüdükçe clone süresi uzar → shallow clone (`--depth 1`) CI'da kullanılır.
- Bağımsız sürümleme zorlaşır → her uygulamanın kendi `package.json`/`build.gradle`/`pubspec.yaml` versiyonu vardır; release tag'leri `api/v1.0.0`, `web/v1.0.0`, `mobile/v1.0.0` formatında atılır.

**Yeniden Değerlendirme Tetikleyicisi:**
- Ekip 5+ kişiye büyürse ve farklı ekipler farklı uygulamaları sahiplenirse polyrepo'ya geçiş değerlendirilir.
- Mobil uygulama build süresi 15 dakikayı aşarsa ayrı repo düşünülebilir.

---

## 2. Tam Klasör Ağacı

```
saha-flow/
│
├── apps/
│   ├── web/                          # Next.js web uygulaması (admin paneli)
│   │   ├── src/
│   │   │   ├── app/                  # App Router (Next.js 14+)
│   │   │   │   ├── (auth)/           # Auth route group (login, forgot-password)
│   │   │   │   ├── (dashboard)/      # Dashboard route group (authenticated)
│   │   │   │   │   ├── dashboard/
│   │   │   │   │   ├── customers/
│   │   │   │   │   ├── devices/
│   │   │   │   │   ├── work-orders/
│   │   │   │   │   ├── technicians/
│   │   │   │   │   ├── checklists/
│   │   │   │   │   ├── reports/
│   │   │   │   │   ├── audit-log/
│   │   │   │   │   ├── users/
│   │   │   │   │   └── settings/
│   │   │   │   └── layout.tsx
│   │   │   ├── components/           # Paylaşılan UI bileşenleri
│   │   │   │   ├── ui/               # Atom bileşenler (Button, Input, Card)
│   │   │   │   ├── forms/            # Form bileşenleri
│   │   │   │   ├── layout/           # Layout bileşenleri (Sidebar, Header)
│   │   │   │   └── shared/           # İş mantığı içeren karma bileşenler
│   │   │   ├── features/             # Feature bazlı modüller
│   │   │   │   ├── auth/             # Login, register, password reset
│   │   │   │   ├── customers/        # Müşteri listesi, detay, form
│   │   │   │   ├── devices/          # Cihaz listesi, detay, form
│   │   │   │   ├── work-orders/      # İş emri listesi, detay, durum güncelleme
│   │   │   │   ├── assignments/      # Atama ve takvim
│   │   │   │   ├── checklists/       # Kontrol listesi şablonları
│   │   │   │   ├── reports/          # Servis raporu görüntüleme
│   │   │   │   ├── dashboard/        # Dashboard widget'ları
│   │   │   │   └── audit-log/        # Audit log görüntüleme
│   │   │   ├── hooks/                # Shared React hooks
│   │   │   ├── lib/                  # API client, utilities
│   │   │   │   ├── api/              # API client fonksiyonları (fetch wrapper)
│   │   │   │   ├── auth/             # Auth helpers (token yönetimi)
│   │   │   │   └── utils/            # Genel araçlar (format, validasyon)
│   │   │   ├── styles/               # Global stiller, Tailwind konfigürasyonu
│   │   │   └── types/                # TypeScript tip tanımları
│   │   ├── public/                   # Statik dosyalar
│   │   ├── tests/                    # Test dosyaları
│   │   │   ├── unit/
│   │   │   ├── integration/
│   │   │   └── e2e/                  # Playwright / Cypress
│   │   ├── .env.example
│   │   ├── next.config.js
│   │   ├── tailwind.config.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── mobile/                       # Flutter mobil uygulaması
│       ├── lib/
│       │   ├── app.dart              # Uygulama root widget'ı
│       │   ├── main.dart             # Entry point
│       │   ├── bootstrap.dart        # DI kurulumu, initialize
│       │   ├── core/                 # Çekirdek altyapı
│       │   │   ├── constants/        # Sabitler, enum'lar
│       │   │   ├── errors/           # Exception sınıfları
│       │   │   ├── network/          # HTTP client, interceptor, token refresh
│       │   │   ├── storage/          # Yerel DB (Drift/Floor), secure storage
│       │   │   ├── sync/             # Senkronizasyon motoru
│       │   │   ├── theme/            # Tema, renkler, tipografi
│       │   │   └── utils/            # Genel araçlar
│       │   ├── features/             # Feature-first yapı (aşağıda detaylı)
│       │   │   ├── auth/             # Giriş, şifre sıfırlama
│       │   │   ├── work_orders/      # İş emri listesi, detay, durum güncelleme
│       │   │   ├── customers/        # Müşteri bilgisi ve adres
│       │   │   ├── checklist/        # Kontrol listesi doldurma
│       │   │   ├── signature/        # İmza alma
│       │   │   ├── camera/           # Fotoğraf çekme ve yükleme
│       │   │   ├── materials/        # Malzeme kaydı
│       │   │   ├── map/              # Harita ve konum
│       │   │   └── settings/         # Uygulama ayarları
│       │   └── l10n/                 # Yerelleştirme (şimdilik sadece Türkçe)
│       ├── test/                     # Test dosyaları
│       │   ├── unit/
│       │   ├── widget/
│       │   └── integration/
│       ├── assets/                   # Resimler, fontlar
│       ├── .env.example
│       ├── pubspec.yaml
│       └── analysis_options.yaml
│
├── services/
│   └── api/                          # Spring Boot backend API servisi
│       ├── src/
│       │   ├── main/
│       │   │   ├── java/com/sahaflow/
│       │   │   │   ├── SahaFlowApplication.java
│       │   │   │   ├── config/       # Spring konfigürasyonları
│       │   │   │   │   ├── SecurityConfig.java
│       │   │   │   │   ├── TenantContextFilter.java
│       │   │   │   │   ├── AuditLogAspect.java
│       │   │   │   │   ├── CorsConfig.java
│       │   │   │   │   └── OpenApiConfig.java
│       │   │   │   ├── module/       # İş modülleri (aşağıda detaylı)
│       │   │   │   ├── shared/       # Paylaşılan sınıflar
│       │   │   │   │   ├── base/     # BaseEntity, BaseRepository
│       │   │   │   │   ├── error/    # Global exception handler, ApiError
│       │   │   │   │   ├── dto/      # Paylaşılan DTO'lar (PageRequest, vs.)
│       │   │   │   │   └── util/     # Yardımcı sınıflar
│       │   │   │   └── infrastructure/ # Altyapı servisleri
│       │   │   │       ├── email/    # E-posta gönderim servisi
│       │   │   │       ├── storage/  # Object storage (S3) servisi
│       │   │   │       ├── pdf/      # PDF oluşturma servisi
│       │   │   │       └── push/     # Push notification servisi
│       │   │   └── resources/
│       │   │       ├── application.yml
│       │   │       ├── application-dev.yml
│       │   │       ├── application-prod.yml
│       │   │       ├── db/migration/ # Flyway migration dosyaları
│       │   │       └── templates/    # Thymeleaf e-posta şablonları
│       │   └── test/
│       │       ├── java/com/sahaflow/
│       │       │   ├── module/       # Modül testleri
│       │       │   ├── shared/       # Paylaşılan test utilities
│       │       │   └── integration/  # Entegrasyon testleri
│       │       └── resources/
│       ├── build.gradle
│       ├── settings.gradle
│       └── Dockerfile
│
├── infra/                            # Infrastructure as Code
│   ├── docker/                       # Docker Compose (yerel geliştirme)
│   │   ├── docker-compose.yml        # API + DB + MinIO + MailHog
│   │   ├── docker-compose.prod.yml   # Production override
│   │   └── init-scripts/             # DB initialization scripts
│   │       └── 00-create-databases.sql
│   ├── kubernetes/                   # Kubernetes manifests (V1)
│   │   ├── base/
│   │   │   ├── namespace.yaml
│   │   │   ├── api-deployment.yaml
│   │   │   ├── api-service.yaml
│   │   │   ├── web-deployment.yaml
│   │   │   ├── web-service.yaml
│   │   │   ├── configmap.yaml
│   │   │   └── ingress.yaml
│   │   └── overlays/
│   │       ├── staging/
│   │       └── production/
│   └── terraform/                    # Terraform (V1)
│       ├── modules/
│       │   ├── database/
│       │   ├── kubernetes/
│       │   └── storage/
│       └── environments/
│           ├── staging/
│           └── production/
│
├── docs/                             # Proje dokümantasyonu
│   ├── architecture/                 # Mimari dokümanlar
│   │   ├── 00_SISTEM_BAGLAMI.md      # C4 Level 1: System Context
│   │   ├── 01_KONTEYNER_DIYAGRAMI.md # C4 Level 2: Container Diagram
│   │   ├── 02_MODUL_DIYAGRAMI.md     # C4 Level 3: Module Diagram
│   │   ├── 03_ER_DIYAGRAMI.md        # Entity-Relationship Diagram
│   │   ├── 04_IS_EMRI_AKISI.md       # İş emri sequence diagram
│   │   └── 05_GUVENLIK_SINIRLARI.md  # Trust boundary diagram
│   ├── adr/                          # Architecture Decision Records
│   │   ├── 0001-tenant-izolasyon-modeli.md
│   │   ├── 0002-jwt-auth-strategy.md
│   │   ├── 0003-email-service.md
│   │   ├── 0004-customer-device-db-design.md
│   │   ├── 0005-mobile-maps-provider.md
│   │   ├── 0006-work-order-state-machine.md
│   │   ├── 0007-sla-calculation.md
│   │   ├── 0008-assignment-model.md
│   │   ├── 0009-mobile-offline-sync.md
│   │   ├── 0010-pdf-generation.md
│   │   ├── 0011-checklist-versioning.md
│   │   ├── 0012-material-tracking.md
│   │   ├── 0013-dashboard-caching.md
│   │   ├── 0014-audit-log-design.md
│   │   ├── 0015-kvkk-data-management.md
│   │   ├── 0016-high-availability.md
│   │   ├── 0017-api-performance.md
│   │   ├── 0018-backup-strategy.md
│   │   ├── 0019-mobile-security.md
│   │   ├── 0020-tenant-provisioning.md
│   │   ├── 0021-push-notification.md
│   │   ├── 0022-secure-sdlc-tools.md
│   │   ├── 0023-object-storage.md
│   │   ├── 0024-infra-cost-optimization.md
│   │   └── 0025-concurrent-update-strategy.md
│   ├── security/                     # Güvenlik dokümanları
│   │   ├── 07_TEHDIT_MODELLEME.md
│   │   ├── 08_GUVENLIK_KONTROL_LISTESI.md
│   │   └── 09_KVKK_UYUMLULUK.md
│   ├── api/                          # API dokümantasyonu
│   │   └── openapi.yaml              # OpenAPI 3.0 spec (build sırasında oluşur)
│   └── user/                         # Kullanıcı dokümantasyonu
│       ├── onboarding.md
│       ├── is-emri-yonetimi.md
│       └── mobil-kullanim.md
│
├── scripts/                          # Yardımcı script'ler
│   ├── setup-dev.sh                  # Geliştirme ortamı kurulumu
│   ├── setup-dev.ps1                 # Geliştirme ortamı kurulumu (Windows)
│   ├── seed-data.sql                 # Demo veri seti
│   ├── backup-db.sh                  # Veritabanı yedekleme
│   └── restore-db.sh                 # Veritabanı geri yükleme
│
├── .github/                          # GitHub Actions ve şablonlar
│   ├── workflows/
│   │   ├── ci.yml                    # Ana CI: lint, test, build
│   │   ├── deploy-staging.yml        # Staging deploy
│   │   ├── deploy-prod.yml           # Production deploy
│   │   └── security-scan.yml         # Güvenlik taraması (SAST, SCA, container)
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   └── PULL_REQUEST_TEMPLATE.md
│
├── .gitignore
├── .editorconfig
├── AGENTS.md                         # AI asistanlar için proje rehberi
├── CLAUDE.md                         # Claude için proje rehberi
├── CHANGELOG.md
├── CONTRIBUTING.md
├── LICENSE
└── README.md
```

---

## 3. Klasör Sorumlulukları

| Klasör | Sorumluluk | Sahip |
|---|---|---|
| `apps/web/` | Admin paneli: Next.js 14+ ile web uygulaması. Operatör ve admin kullanıcıları için masaüstü web deneyimi. | Frontend Lead |
| `apps/mobile/` | Saha uygulaması: Flutter ile Android/iOS mobil uygulama. Teknisyenler için offline-first mobil deneyim. | Mobile Lead |
| `services/api/` | Backend API: Spring Boot 3+ REST API. Tüm iş mantığı, veri erişimi, dış entegrasyonlar. | Backend Lead |
| `infra/docker/` | Yerel geliştirme ve basit production deployment (Docker Compose). MVP'de primary deployment method. | Backend Lead / DevOps |
| `infra/kubernetes/` | Kubernetes manifests (V1'de geçilecek). Şimdilik hazırlık. | DevOps |
| `infra/terraform/` | Infrastructure as Code (V1'de geçilecek). Şimdilik hazırlık. | DevOps |
| `docs/architecture/` | C4 model diyagramları, ER diyagramı, akış diyagramları. | Tech Lead |
| `docs/adr/` | Mimari karar kayıtları. Her önemli mimari karar için bir ADR. | Tech Lead |
| `docs/security/` | Tehdit modeli, güvenlik kontrol listesi, KVKK dokümantasyonu. | Tech Lead / Product Owner |
| `docs/api/` | OpenAPI/Swagger spec. Build sırasında otomatik oluşur, commit edilir. | Backend Lead |
| `docs/user/` | Kullanıcı yardım dokümantasyonu. Türkçe, sade dil. | Product Owner |
| `scripts/` | Otomasyon script'leri. Setup, backup, restore, seed data. | Backend Lead |
| `.github/` | CI/CD workflow'ları, issue/PR şablonları. | DevOps / Tech Lead |

---

## 4. Backend Modül Yapısı (com.sahaflow.* Paketleri)

```
com.sahaflow
├── config                          # Spring konfigürasyonları
│   ├── SecurityConfig              # Spring Security, JWT filter, CORS
│   ├── TenantContextFilter         # Tenant_id'yi HTTP header'dan context'e taşır
│   ├── AuditLogAspect              # @Auditable anotasyonu ile audit logging AOP
│   ├── CorsConfig                  # CORS izinleri
│   └── OpenApiConfig               # Swagger/OpenAPI konfigürasyonu
│
├── module
│   ├── tenant                      # com.sahaflow.module.tenant
│   │   ├── TenantController        # Tenant CRUD (admin only)
│   │   ├── TenantService
│   │   ├── TenantRepository
│   │   └── Tenant                  # Entity: id, name, subdomain, status, created_at
│   │
│   ├── auth                        # com.sahaflow.module.auth
│   │   ├── AuthController          # Login, logout, refresh, password-reset
│   │   ├── AuthService
│   │   ├── JwtService              # Token oluşturma ve doğrulama
│   │   ├── RefreshTokenService     # Refresh token yönetimi ve rotasyon
│   │   ├── UserController          # Kullanıcı CRUD
│   │   ├── UserService
│   │   ├── UserRepository
│   │   ├── User                    # Entity: id, tenant_id, email, password_hash, role
│   │   ├── Role                    # Enum: ADMIN, OPERATOR, TEKNISYEN
│   │   ├── LoginRequest            # DTO
│   │   └── TokenResponse           # DTO
│   │
│   ├── customer                    # com.sahaflow.module.customer
│   │   ├── CustomerController
│   │   ├── CustomerService
│   │   ├── CustomerRepository
│   │   ├── Customer                # Entity: id, tenant_id, name, phone, email, address
│   │   ├── DeviceController
│   │   ├── DeviceService
│   │   ├── DeviceRepository
│   │   ├── Device                  # Entity: id, tenant_id, customer_id, type, brand, model, serial_no
│   │   └── CustomerSearchService   # Arama optimizasyonu (pg_trgm)
│   │
│   ├── workorder                   # com.sahaflow.module.workorder
│   │   ├── WorkOrderController
│   │   ├── WorkOrderService
│   │   ├── WorkOrderRepository
│   │   ├── WorkOrder               # Entity: id, tenant_id, customer_id, device_id, status, priority, ...
│   │   ├── WorkOrderStatus         # Enum: OPEN, ASSIGNED, IN_PROGRESS, COMPLETED, APPROVED, CLOSED, CANCELLED
│   │   ├── StatusTransitionService # Durum geçiş validasyonu
│   │   ├── SlaCalculator           # SLA hesaplama (iş saatleri)
│   │   └── WorkOrderNote           # Entity: iş emri notları
│   │
│   ├── assignment                  # com.sahaflow.module.assignment
│   │   ├── AssignmentController
│   │   ├── AssignmentService
│   │   ├── AssignmentRepository
│   │   ├── Assignment              # Entity: id, work_order_id, user_id, scheduled_at
│   │   └── TechnicianAvailabilityService  # Müsaitlik ve çakışma kontrolü
│   │
│   ├── checklist                   # com.sahaflow.module.checklist
│   │   ├── ChecklistTemplateController
│   │   ├── ChecklistTemplateService
│   │   ├── ChecklistTemplateRepository
│   │   ├── ChecklistTemplate       # Entity: şablon
│   │   ├── WorkOrderChecklistController
│   │   ├── WorkOrderChecklistService
│   │   ├── WorkOrderChecklistRepository
│   │   └── WorkOrderChecklist      # Entity: iş emrine kopyalanmış checklist
│   │
│   ├── material                    # com.sahaflow.module.material
│   │   ├── MaterialController
│   │   ├── MaterialService
│   │   ├── MaterialRepository
│   │   ├── Material                # Entity: id, tenant_id, name, unit, unit_price
│   │   └── WorkOrderMaterial       # Entity: iş emrinde kullanılan malzeme ve miktar
│   │
│   ├── report                      # com.sahaflow.module.report
│   │   ├── ServiceReportController
│   │   ├── ServiceReportService
│   │   ├── ServiceReportRepository
│   │   ├── ServiceReport           # Entity: id, work_order_id, pdf_url, created_at
│   │   └── SignatureService        # İmza işleme ve PDF'e gömme
│   │
│   ├── dashboard                   # com.sahaflow.module.dashboard
│   │   ├── DashboardController
│   │   ├── DashboardService
│   │   └── DashboardStats          # DTO: toplam iş emri, durum dağılımı, SLA, vs.
│   │
│   └── audit                       # com.sahaflow.module.audit
│       ├── AuditLogController
│       ├── AuditLogService
│       ├── AuditLogRepository
│       └── AuditLog                # Entity: id, tenant_id, user_id, action, entity, old_value, new_value, ...
│
├── shared
│   ├── base
│   │   ├── BaseEntity              # id, created_at, updated_at (MappedSuperclass)
│   │   ├── BaseRepository          # Ortak repository metodları
│   │   └── TenantAwareEntity       # tenant_id alanı için interface
│   ├── error
│   │   ├── GlobalExceptionHandler  # @ControllerAdvice
│   │   ├── ApiError                # Standart hata yanıtı DTO
│   │   ├── NotFoundException
│   │   ├── UnauthorizedException
│   │   └── TenantMismatchException
│   └── dto
│       ├── PageRequest             # Sayfalama isteği
│       └── PageResponse            # Sayfalama yanıtı
│
└── infrastructure
    ├── email
    │   ├── EmailService            # Arayüz (port)
    │   └── MailgunEmailSender      # Mailgun implementasyonu (adapter)
    ├── storage
    │   ├── StorageService          # Arayüz (port)
    │   └── S3StorageService        # S3 implementasyonu (adapter)
    ├── pdf
    │   ├── PdfGenerationService    # PDF oluşturma servisi
    │   └── ServiceReportTemplate   # Servis raporu PDF şablonu
    └── push
        ├── PushNotificationService # Arayüz (port)
        └── FirebasePushSender      # FCM implementasyonu (adapter)
```

**Paketleme Kuralları:**
1. Her iş modülü kendi controller, service, repository, entity ve DTO sınıflarını içerir.
2. Modüller arası bağımlılık sadece `service` katmanından yapılır; `repository`'ye doğrudan erişim yasaktır.
3. `shared` paketi, tüm modüllerin kullanabileceği ortak kodları içerir.
4. `infrastructure` paketi, dış sistemlerle iletişim kuran adapter'ları içerir. Port-adapter (hexagonal) yaklaşımı: arayüz `infrastructure` paketinde, implementasyon aynı pakette.
5. `config` paketi, Spring konfigürasyon sınıflarını içerir.
6. Entity sınıfları `@Entity` anotasyonu ile işaretlenir, `BaseEntity`'den türetilir.
7. DTO'lar `record` (Java 17+) olarak tanımlanır.
8. Validation: Jakarta Bean Validation (`@NotNull`, `@Size`, `@Email`) kullanılır.

---

## 5. Frontend Feature Yapısı (apps/web)

Her feature klasörü aşağıdaki yapıyı takip eder:

```
features/[feature-name]/
├── components/          # Feature'a özel bileşenler
│   ├── [Name]List.tsx
│   ├── [Name]Detail.tsx
│   ├── [Name]Form.tsx
│   └── [Name]Card.tsx
├── hooks/               # Feature'a özel hooks
│   ├── use[Name]List.ts
│   ├── use[Name]Detail.ts
│   └── use[Name]Mutation.ts
├── api/                 # Feature'a özel API çağrıları
│   └── [name].api.ts
├── types/               # Feature'a özel TypeScript tipleri
│   └── index.ts
└── utils/               # Feature'a özel yardımcı fonksiyonlar
    └── index.ts
```

**Örnek — `features/work-orders/`:**
```
work-orders/
├── components/
│   ├── WorkOrderList.tsx         # İş emri listesi tablosu
│   ├── WorkOrderDetail.tsx       # İş emri detay sayfası
│   ├── WorkOrderForm.tsx         # Yeni iş emri / düzenleme formu
│   ├── WorkOrderStatusBadge.tsx  # Durum badge bileşeni
│   ├── WorkOrderTimeline.tsx     # İş emri durum geçmişi zaman çizgisi
│   └── WorkOrderFilter.tsx       # Filtreleme paneli
├── hooks/
│   ├── useWorkOrderList.ts       # İş emri listesi veri çekme
│   ├── useWorkOrderDetail.ts     # İş emri detay veri çekme
│   └── useWorkOrderMutation.ts   # İş emri oluşturma/güncelleme
├── api/
│   └── work-orders.api.ts
├── types/
│   └── index.ts                  # WorkOrder, WorkOrderStatus, Priority, vs.
└── utils/
    └── index.ts                  # Durum rengi, SLA formatı, vs.
```

**Frontend Kuralları:**
1. Her feature kendi kendine yeterlidir; başka feature'ın `components/` klasörüne doğrudan import yapılmaz.
2. Feature'lar arası paylaşım `app/components/shared/` üzerinden yapılır.
3. API çağrıları `lib/api/` altındaki fetch wrapper üzerinden yapılır; her feature'ın kendi `api/` dosyası endpoint fonksiyonlarını tanımlar.
4. Server Components (Next.js App Router) tercih edilir; sadece etkileşimli bileşenler `'use client'` ile işaretlenir.
5. Form validasyonu: React Hook Form + Zod.
6. State management: React Context + useReducer (MVP için yeterli). V1'de Zustand veya TanStack Query değerlendirilecek.

---

## 6. Mobil Feature-First Yapı (apps/mobile)

Her feature klasörü aşağıdaki yapıyı takip eder:

```
features/[feature_name]/
├── presentation/        # UI katmanı
│   ├── screens/         # Tam ekran sayfalar
│   │   ├── [name]_list_screen.dart
│   │   ├── [name]_detail_screen.dart
│   │   └── [name]_form_screen.dart
│   ├── widgets/         # Feature'a özel widget'lar
│   │   ├── [name]_card.dart
│   │   └── [name]_list_tile.dart
│   └── providers/       # State management (Riverpod / ChangeNotifier)
│       └── [name]_provider.dart
├── domain/              # İş mantığı (framework bağımsız)
│   ├── entities/        # Temel varlıklar
│   │   └── [name].dart
│   ├── repositories/    # Repository arayüzleri (port)
│   │   └── [name]_repository.dart
│   └── usecases/        # İş kuralları
│       └── [use_case_name].dart
├── data/                # Veri katmanı
│   ├── models/          # DTO'lar, JSON serialization
│   │   └── [name]_model.dart
│   ├── datasources/     # Remote (API) ve local (DB) veri kaynakları
│   │   ├── [name]_remote_datasource.dart
│   │   └── [name]_local_datasource.dart
│   └── repositories/    # Repository implementasyonları (adapter)
│       └── [name]_repository_impl.dart
└── sync/                # Senkronizasyon mantığı (bu feature için)
    ├── [name]_sync_service.dart
    └── [name]_conflict_resolver.dart
```

**Örnek — `features/work_orders/`:**
```
work_orders/
├── presentation/
│   ├── screens/
│   │   ├── work_order_list_screen.dart
│   │   ├── work_order_detail_screen.dart
│   │   └── work_order_status_update_screen.dart
│   ├── widgets/
│   │   ├── work_order_card.dart
│   │   ├── work_order_status_chip.dart
│   │   └── work_order_timeline.dart
│   └── providers/
│       ├── work_order_list_provider.dart
│       └── work_order_detail_provider.dart
├── domain/
│   ├── entities/
│   │   └── work_order.dart
│   ├── repositories/
│   │   └── work_order_repository.dart          # Arayüz (port)
│   └── usecases/
│       ├── get_assigned_work_orders.dart
│       ├── update_work_order_status.dart
│       └── sync_pending_changes.dart
├── data/
│   ├── models/
│   │   └── work_order_model.dart               # JSON serialization
│   ├── datasources/
│   │   ├── work_order_remote_datasource.dart   # REST API
│   │   └── work_order_local_datasource.dart    # SQLite
│   └── repositories/
│       └── work_order_repository_impl.dart      # Arayüz implementasyonu
└── sync/
    ├── work_order_sync_service.dart
    └── work_order_conflict_resolver.dart
```

**Mobil Kuralları:**
1. Feature-first: Her özellik kendi kendine yeterlidir, başka feature'ın iç detaylarına erişmez.
2. Clean Architecture: `presentation → domain ← data` bağımlılık yönü.
3. State management: Riverpod (MVP için). Basit, test edilebilir, DI ile uyumlu.
4. Dependency injection: Riverpod provider'ları veya GetIt (tercih: Riverpod).
5. Offline-first: Tüm okuma işlemleri önce yerel DB'den, sonra API'den yapılır. Yazma işlemleri önce yerel kuyruğa, sonra API'ye senkronize edilir.
6. JSON serialization: `json_serializable` (code generation) veya `freezed`.
7. Routing: `go_router` (declarative routing).
8. Platform kanalları: Kamera, konum, biometrik gibi native özellikler için ayrı `core/platform/` klasörü.

---

## 7. Infrastructure-as-Code Yapısı

### MVP (Docker Compose)

```
infra/docker/
├── docker-compose.yml              # Tüm servisler
│   # Servisler:
│   # - postgres: PostgreSQL 16
│   # - api: Spring Boot API (build from ../services/api/Dockerfile)
│   # - web: Next.js web (build from ../apps/web/Dockerfile)
│   # - minio: S3-compatible storage (dev)
│   # - mailhog: SMTP test sunucusu (dev)
│   # - grafana: Monitoring (opsiyonel, dev)
│   # - prometheus: Metrics (opsiyonel, dev)
├── docker-compose.prod.yml         # Production override (external DB, real S3, vs.)
├── Dockerfile.api                  # Multi-stage: build + runtime
├── Dockerfile.web                  # Multi-stage: build + runtime (Next.js standalone)
└── init-scripts/
    └── 00-create-databases.sql     # Dev ortamı için initial DB ve kullanıcı
```

### V1 (Kubernetes)

```
infra/kubernetes/
├── base/
│   ├── namespace.yaml
│   ├── configmap.yaml              # Ortak konfigürasyon
│   ├── secrets.yaml                # Şablon (gerçek secret dışarıdan)
│   ├── api-deployment.yaml
│   ├── api-service.yaml
│   ├── api-hpa.yaml                # HorizontalPodAutoscaler
│   ├── web-deployment.yaml
│   ├── web-service.yaml
│   └── ingress.yaml                # Traefik / Nginx Ingress
└── overlays/
    ├── staging/
    │   └── kustomization.yaml
    └── production/
        └── kustomization.yaml
```

---

## 8. Doküman Klasörü (docs/)

| Alt Klasör | İçerik | Format | Hedef Kitle |
|---|---|---|---|
| `architecture/` | C4 diyagramları, ER diyagramı, akış diyagramları | Markdown + PlantUML / Mermaid | Teknik ekip |
| `adr/` | Mimari karar kayıtları | Markdown (ADR formatı) | Teknik ekip |
| `security/` | Tehdit modeli, güvenlik kontrol listesi, KVKK | Markdown | Teknik ekip, güvenlik, hukuk |
| `api/` | OpenAPI spec | YAML (build ile oluşur) | Frontend/Mobil geliştiriciler, entegratörler |
| `user/` | Kullanıcı kılavuzları | Markdown | Son kullanıcılar, destek ekibi |

---

## 9. Test Klasörleri

### Backend (services/api)

```
src/test/java/com/sahaflow/
├── module/
│   ├── auth/
│   │   ├── AuthServiceTest.java               # Birim test
│   │   └── AuthControllerIntegrationTest.java  # Entegrasyon testi
│   ├── customer/
│   │   ├── CustomerServiceTest.java
│   │   └── CustomerTenantIsolationTest.java    # Tenant izolasyon testi
│   └── ...
├── shared/
│   ├── TenantIsolationTestBase.java           # Tenant izolasyon testleri için base
│   └── TestDataFactory.java                   # Test verisi oluşturucu
└── integration/
    └── WorkOrderE2EFlowTest.java              # Uçtan uca iş emri akış testi
```

### Frontend (apps/web)

```
tests/
├── unit/                     # Jest + React Testing Library
│   ├── components/
│   └── hooks/
├── integration/              # API mock ile entegrasyon
│   └── features/
└── e2e/                      # Playwright
    ├── auth.spec.ts
    ├── work-order-flow.spec.ts
    └── tenant-isolation.spec.ts
```

### Mobil (apps/mobile)

```
test/
├── unit/                     # Dart test
│   ├── domain/usecases/
│   └── data/repositories/
├── widget/                   # Widget test (Flutter)
│   └── presentation/screens/
└── integration/              # Entegrasyon testi (flutter_test)
    └── work_order_flow_test.dart
```

---

## 10. İsimlendirme Kuralları

### Dosya İsimlendirme

| Tür | Kural | Örnek |
|---|---|---|
| Java sınıf dosyası | PascalCase | `WorkOrderService.java` |
| Java test dosyası | PascalCase + `Test` soneki | `WorkOrderServiceTest.java` |
| TypeScript/React dosyası | kebab-case (feature bileşenler), PascalCase (UI bileşenler) | `work-order-list.tsx`, `Button.tsx` |
| Dart dosyası | snake_case | `work_order_list_screen.dart` |
| SQL migration dosyası | `V{versiyon}__{aciklama}.sql` | `V1_0_1__add_device_serial_number.sql` |
| YAML/JSON konfigürasyon | kebab-case veya standart isim | `docker-compose.yml`, `application-prod.yml` |
| Markdown doküman | UPPER_SNAKE_CASE sıra numaralı veya kebab-case | `01_GUVENLIK_POLITIKASI.md`, `deployment-guide.md` |
| ADR dosyası | `{0001}-{slug}.md` | `0001-tenant-izolasyon-modeli.md` |

### Sınıf İsimlendirme

| Tür | Kural | Örnek |
|---|---|---|
| Java Entity | PascalCase, tablo adıyla aynı (tekil) | `WorkOrder`, `Customer`, `Device` |
| Java Repository | Entity + `Repository` | `WorkOrderRepository` |
| Java Service | Entity/İşlev + `Service` | `WorkOrderService`, `JwtService` |
| Java Controller | Entity/İşlev + `Controller` | `WorkOrderController` |
| Java DTO | Açıklayıcı isim + `Request`/`Response`/`Dto` | `LoginRequest`, `TokenResponse`, `DashboardStats` |
| Java Exception | Açıklayıcı isim + `Exception` | `TenantMismatchException` |
| TypeScript Interface | PascalCase, `I` prefix yok | `WorkOrder`, `Customer` |
| TypeScript Component | PascalCase | `WorkOrderList`, `WorkOrderDetail` |
| TypeScript Hook | `use` + PascalCase | `useWorkOrderList` |
| Dart Widget | PascalCase | `WorkOrderListScreen`, `WorkOrderCard` |
| Dart Provider | PascalCase + `Provider` | `WorkOrderListProvider` |
| Dart Repository (abstract) | PascalCase + `Repository` | `WorkOrderRepository` |

### Endpoint İsimlendirme

| Kural | Örnek |
|---|---|
| RESTful, çoğul kaynak ismi | `/api/v1/work-orders` |
| kebab-case, küçük harf | `/api/v1/work-orders/{id}/checklist` |
| HTTP metotları: GET (list/read), POST (create), PUT (full update), PATCH (partial), DELETE (soft) | `GET /api/v1/customers`, `POST /api/v1/work-orders` |
| Sürüm prefix'i: `/api/v1/` | `/api/v1/auth/login` |
| Nested resource (en fazla 2 seviye) | `/api/v1/customers/{id}/devices` |
| Action endpoint'leri (non-CRUD) | `POST /api/v1/work-orders/{id}/assign`, `POST /api/v1/auth/refresh` |

### Tablo İsimlendirme

| Kural | Örnek |
|---|---|
| snake_case, çoğul | `work_orders`, `customers`, `devices` |
| Birleşim tabloları: alfabetik sıralı | `work_order_materials` (work_order önce) |
| Audit/sistem tabloları: tekil | `audit_log`, `flyway_schema_history` |
| Primary key: `id` (UUID) | `id UUID PRIMARY KEY DEFAULT gen_random_uuid()` |
| Foreign key: `{tablo}_id` | `customer_id`, `work_order_id`, `assigned_to` (user FK) |
| Zaman damgası: `created_at`, `updated_at` | `created_at TIMESTAMPTZ NOT NULL DEFAULT now()` |
| Soft delete: `deleted_at` | `deleted_at TIMESTAMPTZ` |
| Tenant kolonu: `tenant_id` (tüm tenant izolasyonlu tablolarda) | `tenant_id UUID NOT NULL REFERENCES tenants(id)` |

### Branch İsimlendirme

| Tür | Kural | Örnek |
|---|---|---|
| Feature | `feature/{epic}-{kisa-aciklama}` | `feature/WO-01-work-order-creation` |
| Bug fix | `fix/{issue-no}-{kisa-aciklama}` | `fix/42-login-rate-limit` |
| Hotfix | `hotfix/{kisa-aciklama}` | `hotfix/db-connection-leak` |
| Release | `release/{versiyon}` | `release/1.0.0` |
| Chore/Tech debt | `chore/{kisa-aciklama}` | `chore/upgrade-spring-boot-3.3` |

---

## 11. Bağımlılık Yönü Kuralları

### Genel Bağımlılık Yönü

```
apps/web ──────► services/api (REST API)
apps/mobile ───► services/api (REST API)
apps/web ──X──► apps/mobile (bağımlılık YOK)
apps/mobile ──X──► apps/web (bağımlılık YOK)
services/api ──X──► apps/web (bağımlılık YOK)
services/api ──X──► apps/mobile (bağımlılık YOK)
```

- `apps/web` ve `apps/mobile` birbirinden bağımsızdır.
- `services/api` hiçbir frontend uygulamasına bağımlı değildir.
- API sözleşmesi (OpenAPI spec) `services/api` tarafından üretilir ve `apps/web` ile `apps/mobile` buna uyar.

### Backend Modüller Arası Bağımlılık

```
module.workorder ──────► module.customer   (iş emri müşteriye referans verir)
module.workorder ──────► module.auth       (iş emri kullanıcıya atanır)
module.assignment ─────► module.workorder   (atama iş emrine bağlıdır)
module.assignment ─────► module.auth       (atama teknisyene yapılır)
module.checklist ──────► module.workorder   (checklist iş emrine bağlıdır)
module.material ───────► module.workorder   (malzeme iş emrine bağlıdır)
module.report ─────────► module.workorder   (rapor iş emrine bağlıdır)
module.report ─────────► module.customer    (rapor müşteri bilgisi içerir)
module.report ─────────► module.checklist   (rapor checklist içerir)
module.dashboard ──────► module.workorder   (dashboard iş emri istatistiği)
module.dashboard ──────► module.auth       (dashboard kullanıcı istatistiği)
module.audit ──────────► (tüm modüllerden bağımsız, olayları dinler)

module.tenant ◄───────── (tüm modüller tenant_id kullanır, ama doğrudan bağımlı değil)
```

**Kurallar:**
1. Modüller arası bağımlılık sadece `service` katmanından yapılır.
2. Döngüsel bağımlılık yasaktır. Tespit için CI'da `jdepend` veya ArchUnit testleri çalıştırılır.
3. `module.audit` tüm modüllerden olayları AOP ile dinler; modüller audit modülüne bağımlı değildir.
4. `shared` paketi tüm modüller tarafından kullanılabilir; `shared` hiçbir modüle bağımlı değildir.
5. `infrastructure` paketindeki adapter'lar modüller tarafından `interface` üzerinden çağrılır; modül, adapter'ın somut implementasyonuna bağımlı değildir (dependency inversion).

### Mobil Feature Bağımlılık Yönü (Clean Architecture)

```
presentation ──────► domain
data ──────────────► domain
domain ──X──► presentation   (bağımlılık YOK)
domain ──X──► data           (bağımlılık YOK)
presentation ──X──► data     (bağımlılık YOK — domain üzerinden)
```

- `domain` katmanı framework ve dış dünyadan tamamen bağımsızdır (pure Dart).
- `data` katmanı, `domain`'deki repository arayüzlerini implemente eder.
- `presentation` katmanı sadece `domain`'deki use case'leri ve entity'leri kullanır.

### Frontend Feature Bağımlılık Yönü

```
features/work-orders ──► lib/api        (API çağrıları)
features/work-orders ──► components/ui  (tasarım sistemi)
features/work-orders ──► lib/auth       (auth context)
features/work-orders ──X──► features/customers  (doğrudan import yok; shared bileşenler üzerinden)
```

---

## Karar Bekleyen Konular

1. State management kütüphanesi (web): MVP için React Context + useReducer yeterli mi? Ölçeklenirse Zustand veya TanStack Query'ye geçiş.
2. State management kütüphanesi (mobil): Riverpod vs Bloc vs Provider? Riverpod önerilir, daha az boilerplate.
3. Monorepo tool'u (Turborepo, Nx, pnpm workspaces) kullanılacak mı? MVP'de pnpm workspaces yeterli; build cache için Turborepo V1'de değerlendirilecek.
4. Shared types package (`packages/shared-types/`): OpenAPI spec'ten otomatik TypeScript/Dart tip üretimi. MVP'de manuel, V1'de codegen (openapi-generator) değerlendirilecek.
5. Veritabanı migration aracı: Flyway vs Liquibase? Flyway daha basit ve Spring Boot ile varsayılan entegrasyon. Karar: Flyway.
6. Log aggregation: MVP'de Loki, V1'de Elasticsearch/OpenSearch?
7. Container registry: Docker Hub vs GitHub Container Registry vs AWS ECR? GitHub Container Registry (zaten GitHub kullanılıyor, CI'a entegre).

## İlgili Dokümanlar

- `01_PROJE_GIRDI_FORMU.yaml` — Proje girdi formu
- `04_MIMARI_VE_TEKNOLOJI_KARARLARI.md` — Mimari karar şablonu
- `06_BACKEND_MIMARI_GUVENLIK.md` — Backend mimarisi ve güvenlik
- `05_FRONTEND_MIMARI_GUVENLIK.md` — Frontend mimarisi ve güvenlik
- `16_ROADMAP_BACKLOG.md` — Roadmap ve Backlog
- `17_DEFINITION_OF_DONE.md` — Definition of Done
- `18_OPERATIONS_RUNBOOK.md` — Operasyon runbook'u
- `19_TRACEABILITY_MATRIX.md` — İzlenebilirlik matrisi
