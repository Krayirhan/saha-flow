# İşAkış - Mimari Dokumani

## Mimari Kararlar Ozeti

| Karar                      | Secim                       | Gerekce                                                  |
| -------------------------- | --------------------------- | -------------------------------------------------------- |
| Backend Framework          | Spring Boot 3.4 + Java 21  | Ekosistem, performans, kurumsal olgunluk                 |
| Multi-Tenant Stratejisi    | Shared DB, Row-Level Tenant| Kaynak verimliligi, operasyonel basitlik                 |
| Frontend Framework         | Next.js 14 (App Router)    | SSR/ISR, React ekosistemi, Vercel deployment opsiyonu    |
| Mobil Framework            | Flutter 3.22               | Cross-platform, tek kod tabani, yuksek performans         |
| Database                   | PostgreSQL 16 + PostGIS    | Geospatial sorgular (saha konumlari), JSONB, guvenilir   |
| API Stili                  | REST (OpenAPI 3.0)         | Standart, dokumante edilebilir, client generation        |
| Authentication             | JWT (Access + Refresh)     | Stateless, mobil uyumlu, kolay scale                     |
| Secret Yonetimi            | HashiCorp Vault (production)| Merkezi, audit log, dinamik secret                       |
| CI/CD                      | GitHub Actions             | Repo ile entegre, genis marketplace                      |
| Container                  | Docker + Docker Compose    | Ortam tutarliligi, basit orkestrasyon                    |
| Dosya Depolama             | S3-compatible (MinIO/AWS)  | Standart, cheap, CDN uyumlu                              |

## C4 Diyagramlari

### Level 1 - System Context

```
┌──────────────────────────────────────────────────────────────┐
│                      İşAkış Sistemi                        │
├─────────┬─────────┬─────────┬─────────┬──────────────────────┤
│ Spor    │ Kullanici│ Admin   │ Tesis  │                      │
│ Severler│         │         │ Yonetici│                      │
└────┬────┘    ┌────┘    ┌────┘   ┌────┘                      │
     │         │         │        │                            │
     └─────────┼─────────┼────────┘                            │
               │         │                                      │
        ┌──────▼─────────▼──────────┐                          │
        │      İşAkış API        │                          │
        │    (Spring Boot 3.4)      │                          │
        └──────┬─────────┬──────────┘                          │
               │         │                                      │
      ┌────────▼──┐  ┌───▼────────┐                           │
      │ PostgreSQL │  │ S3 Storage │                           │
      │ (+PostGIS) │  │ (MinIO)    │                           │
      └────────────┘  └────────────┘                           │
```

### Level 2 - Container

```
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│  Mobile App │   │  Web App    │   │  Admin Panel │
│  (Flutter)  │   │  (Next.js)  │   │  (Next.js)   │
└──────┬──────┘   └──────┬──────┘   └──────┬───────┘
       │                 │                  │
       │   HTTPS :443    │                  │
       └─────────────────┼──────────────────┘
                         │
                  ┌──────▼──────┐
                  │ Nginx Proxy │
                  └──────┬──────┘
                         │
            ┌────────────┼────────────┐
            │            │            │
     ┌──────▼─────┐ ┌───▼────┐ ┌────▼────┐
     │ API Gateway│ │  Auth  │ │ Webhook │
     │   :8080    │ │ Service│ │ Handler │
     └──────┬─────┘ │        │ │         │
            │       └───┬────┘ └────┬────┘
            └───────────┼───────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
   ┌────▼────┐    ┌─────▼─────┐   ┌────▼────┐
   │PostgreSQL│   │ Redis     │   │ MinIO   │
   │   16     │   │ (Cache)   │   │  (S3)   │
   └─────────┘   └───────────┘   └─────────┘
```

### Level 3 - Backend Module Structure

```
services/
├── api/                          # Ana API modulu
│   └── src/main/kotlin/com/sahaflow/
│       ├── core/                 # Temel altyapi
│       │   ├── config/           # Security, CORS, Flyway, Jackson konfigurasyonu
│       │   ├── exception/        # Global exception handler
│       │   └── tenant/           # Tenant context resolver
│       ├── domain/               # Domain modulleri
│       │   ├── user/             # Kullanici yonetimi
│       │   ├── auth/             # Kimlik dogrulama (JWT)
│       │   ├── facility/         # Tesis yonetimi (spor salonu, saha vs)
│       │   ├── court/            # Kort/saha yonetimi + PostGIS
│       │   ├── booking/          # Randevu yonetimi
│       │   ├── pricing/          # Fiyatlandirma
│       │   ├── payment/          # Odeme entegrasyonu
│       │   ├── notification/     # Bildirim (push, email, SMS)
│       │   ├── membership/       # Uyelik ve abonelik
│       │   └── reporting/        # Raporlama
│       └── shared/               # Paylasilan DTO'lar, mapper'lar
└── infrastructure/               # Altyapi servisleri (ileride)
    ├── file-service/
    └── notification-service/
```

## Frontend Yapisi

```
web/
├── src/
│   ├── app/                      # Next.js 14 App Router
│   │   ├── (public)/             # Public routes (landing, login, register)
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/          # Auth-gated routes
│   │   │   ├── dashboard/
│   │   │   ├── facilities/
│   │   │   ├── courts/
│   │   │   ├── bookings/
│   │   │   ├── members/
│   │   │   └── settings/
│   │   └── api/                  # API route handlers (BFF pattern)
│   ├── components/               # Paylasilan UI komponentleri
│   │   ├── ui/                   # Temel UI (button, input, modal...)
│   │   ├── layout/               # Layout komponentleri
│   │   └── features/             # Domain-specific komponentler
│   ├── hooks/                    # Custom React hooks
│   ├── lib/                      # Yardimci kutuphaneler
│   │   ├── api/                  # API client (fetch wrapper, interceptors)
│   │   ├── auth/                 # Auth helpers
│   │   └── utils/                # Genel yardimcilar
│   ├── stores/                   # Zustand state management
│   └── types/                    # TypeScript type tanimlari
```

## Veritabani Semasi (Temel Tablolar)

```sql
-- Multi-tenant yapisi her tabloda tenant_id ile saglanir

tenants             -- Tenant (musteri) tanimlari
users               -- Kullanicilar (tenant bagimli)
roles               -- Roller (SUPER_ADMIN, TENANT_ADMIN, MANAGER, STAFF, CUSTOMER)
permissions         -- Izinler
user_roles          -- Kullanici-rol iliskisi
role_permissions    -- Rol-izin iliskisi

facilities          -- Spor tesisleri
courts              -- Kort/saha tanimlari (geometry: nokta/alan)
court_schedules     -- Kort/saha calisma saatleri

bookings            -- Rezervasyonlar
booking_items       -- Rezervasyon kalemleri (birden fazla kort)
payments            -- Odemeler
invoices            -- Faturalar

memberships         -- Uyelik paketleri
user_memberships    -- Kullanici uyelikleri
pricing_rules       -- Fiyatlandirma kurallari (peak/off-peak, uyelik indirimi)

notifications       -- Bildirim loglari
audit_logs          -- Denetim kayitlari
```

## API Tasarimi

RESTful prensipler, JSON:API specification'dan esinlenerek:

```
GET    /api/v1/tenants/{tenantId}/courts              # Kort listesi
POST   /api/v1/tenants/{tenantId}/courts              # Kort ekleme
GET    /api/v1/tenants/{tenantId}/courts/{id}         # Kort detay
PUT    /api/v1/tenants/{tenantId}/courts/{id}         # Kort guncelleme
DELETE /api/v1/tenants/{tenantId}/courts/{id}         # Kort silme

POST   /api/v1/tenants/{tenantId}/bookings            # Rezervasyon olusturma
GET    /api/v1/tenants/{tenantId}/bookings            # Rezervasyon sorgulama
GET    /api/v1/tenants/{tenantId}/bookings/{id}       # Rezervasyon detay
PATCH  /api/v1/tenants/{tenantId}/bookings/{id}/cancel # Iptal

POST   /api/v1/auth/login                             # Giris
POST   /api/v1/auth/refresh                           # Token yenileme
POST   /api/v1/auth/register                          # Kayit
```

Swagger UI: `http://localhost:8080/swagger-ui.html`

## Kimlik Dogrulama Akisi

```
┌─────────┐                    ┌─────────┐               ┌──────────┐
│ Client  │                    │  Auth   │               │  Redis   │
│         │                    │ Service │               │ (Block)  │
└────┬────┘                    └────┬────┘               └────┬─────┘
     │  POST /auth/login            │                         │
     │  {email, password}           │                         │
     │─────────────────────────────►│                         │
     │                              │ Verify credentials      │
     │                              │────────────────────────►│
     │                              │ Generate JWT (AT + RT) │
     │  {access_token,              │                         │
     │   refresh_token}             │                         │
     │◄─────────────────────────────│                         │
     │                              │                         │
     │  GET /api/... (Bearer AT)    │                         │
     │─────────────────────────────►│                         │
     │                              │ Validate AT             │
     │                              │ Check blocklist         │
     │                              │────────────────────────►│
     │  Response                    │                         │
     │◄─────────────────────────────│                         │
     │                              │                         │
     │  [AT expired]                │                         │
     │  POST /auth/refresh {RT}     │                         │
     │─────────────────────────────►│                         │
     │                              │ Rotate RT, issue new AT │
     │  {new_access_token,          │                         │
     │   new_refresh_token}         │                         │
     │◄─────────────────────────────│                         │
     │                              │                         │
```

- Access Token suresi: 15 dakika (configurable)
- Refresh Token suresi: 7 gun (configurable)
- Refresh token rotation aktif
- Token bloklama (logout) Redis ile

## Tenant Izolasyonu

**Strateji: Shared Database, Row-Level Security + Query Filter**

1. Her tabloda `tenant_id` (UUID) kolonu bulunur.
2. Spring Security + JWT'den tenant ID cozulur.
3. Hibernate `@Filter` ve Spring `TenantContext` ile otomatik tenant filtreleme.
4. SUPER_ADMIN tenant filtrelemesinden muaftir.
5. Veritabani seviyesinde PostgreSQL Row-Level Security (RLS) opsiyonel katman.

```kotlin
@Target(AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
@FilterDef(name = "tenantFilter", parameters = [ParamDef(name = "tenantId", type = UUID::class)])
@Filter(name = "tenantFilter", condition = "tenant_id = :tenantId")
annotation class TenantAware
```

## Dosya Depolama

- S3-compatible storage (development: MinIO, production: AWS S3 veya uyumlu servis)
- Presigned URL'ler ile guvenli dogrudan yukleme
- Dosya turleri: profil fotograflari, tesis fotograf/videolari, faturalar, raporlar
- Maksimum dosya boyutu: 50MB (server-side validation)
- Virus taramasi entegrasyonu (production)

## Deployment

Detayli deployment dokumani: [DEPLOYMENT.md](DEPLOYMENT.md)
