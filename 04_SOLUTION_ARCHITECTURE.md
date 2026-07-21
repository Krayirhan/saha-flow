> Proje: İşAkış
> Doküman: 04 Çözüm Mimarisi
> Durum: Draft
> Üretim tarihi: 2026-07-21
> Kaynak girdi: templates/01_PROJE_GIRDI_FORMU.yaml

# 04 Çözüm Mimarisi — İşAkış

---

## 1. Sistem Bağlamı (C4 Context)

```mermaid
C4Context
    title İşAkış - Sistem Bağlam Diyagramı

    Person(ofis, "Ofis Personeli", "Web tarayıcı üzerinden iş emirlerini yönetir")
    Person(teknisyen, "Saha Teknisyeni", "Mobil uygulama ile işleri takip eder")
    Person(musteri, "Müşteri", "Mobil uygulamada imza atar")
    Person(admin, "Admin", "Firma ve kullanıcı yönetimi yapar")

    System(sahaflow, "İşAkış", "Saha servis yönetimi SaaS platformu")

    System_Ext(email, "E-posta Servisi", "İş atama ve tamamlanma bildirimleri")
    System_Ext(s3, "S3 Uyumlu Depolama", "Fotoğraf, imza, PDF rapor saklama")
    System_Ext(maps, "Harita Servisi", "Adres çözümleme ve konum gösterimi")

    Rel(ofis, sahaflow, "İş emri CRUD, raporlama", "HTTPS")
    Rel(teknisyen, sahaflow, "İş listesi, check-in/out, fotoğraf", "HTTPS (REST)")
    Rel(musteri, sahaflow, "İmza atar (teknisyen cihazı üzerinden)", "HTTPS")
    Rel(admin, sahaflow, "Kullanıcı ve tenant yönetimi", "HTTPS")
    Rel(sahaflow, email, "Bildirim e-postası gönderir", "SMTP")
    Rel(sahaflow, s3, "Dosya yükleme/indirme", "HTTPS (Presigned URL)")
    Rel(sahaflow, maps, "Adres -> koordinat, ters coğrafi kodlama", "HTTPS")
```

---

## 2. Container Mimarisi (C4 Container)

```mermaid
C4Container
    title İşAkış - Container Mimarisi

    Person(ofis, "Ofis Personeli")
    Person(teknisyen, "Teknisyen")

    System_Boundary(sahaflow, "İşAkış Platform") {
        Container(web, "Web Panel", "Next.js 14 + TypeScript", "Ofis personeli ve admin için yönetim arayüzü")
        Container(api, "Backend API", "Spring Boot 3 + Java 21", "REST API, iş mantığı, kimlik doğrulama")
        Container(mobile, "Mobil Uygulama", "Flutter 3 + Dart", "iOS ve Android saha uygulaması")
        Container(pdfworker, "PDF Worker", "Spring Boot + iText/Apache FOP", "Asenkron PDF rapor üretimi")
        ContainerDb(db, "Veritabanı", "PostgreSQL 16 + PostGIS", "İlişkisel veri, konum sorguları")
        ContainerDb(redis, "Cache", "Redis 7", "Token blacklist, rate limiting")
        ContainerDb(mq, "Mesaj Kuyruğu", "RabbitMQ", "Asenkron iş kuyruğu (PDF, bildirim)")
        ContainerDb(s3store, "Dosya Depolama", "MinIO (dev) / AWS S3 (prod)", "Fotoğraf, imza, PDF dosyaları")
    }

    System_Ext(email, "E-posta Servisi")
    System_Ext(maps, "Harita Servisi")

    Rel(ofis, web, "Kullanır", "HTTPS")
    Rel(teknisyen, mobile, "Kullanır", "HTTPS")
    Rel(web, api, "API çağrıları", "HTTPS/REST")
    Rel(mobile, api, "API çağrıları", "HTTPS/REST")
    Rel(api, db, "Okuma/yazma", "JDBC")
    Rel(api, redis, "Cache, token blacklist", "TCP")
    Rel(api, mq, "Event publish", "AMQP")
    Rel(mq, pdfworker, "PDF üretim kuyruğu", "AMQP")
    Rel(api, s3store, "Presigned URL oluşturma", "HTTPS")
    Rel(mobile, s3store, "Doğrudan dosya yükleme", "HTTPS (Presigned URL)")
    Rel(pdfworker, s3store, "PDF dosyası yükleme", "HTTPS")
    Rel(api, email, "Bildirim gönderme", "SMTP")
    Rel(api, maps, "Coğrafi kodlama", "HTTPS")
```

---

## 3. Backend Modül Diyagramı

```mermaid
graph TD
    subgraph "Spring Boot Application"
        subgraph "API Layer"
            AC[AuthController]
            TC[TenantController]
            CC[CustomerController]
            ASC[AssetController]
            WOC[WorkOrderController]
            CHC[ChecklistController]
            FC[FilesController]
            RC[ReportController]
            PC[PaymentController]
        end

        subgraph "Service Layer"
            AS[AuthService]
            TS[TenantService]
            CS[CustomerService]
            ASS[AssetService]
            WOS[WorkOrderService]
            CHS[ChecklistService]
            FS[FileService]
            RS[ReportService]
            PS[PaymentService]
            NS[NotificationService]
            AUS[AuditService]
        end

        subgraph "Domain Layer"
            TA[Tenant Aggregate]
            UA[User Aggregate]
            CA[Customer Aggregate]
            ASA[Asset Aggregate]
            WOA[WorkOrder Aggregate]
            CHA[Checklist Aggregate]
        end

        subgraph "Infrastructure Layer"
            TR[TenantRepository]
            UR[UserRepository]
            CR[CustomerRepository]
            ASR[AssetRepository]
            WOR[WorkOrderRepository]
            CHR[ChecklistRepository]
            AR[AuditRepository]

            S3C[S3Client]
            JC[JwtTokenProvider]
            EC[EmailClient]
            MC[MapClient]
            MQP[RabbitMQ Publisher]
        end

        subgraph "Cross-Cutting"
            TIF[TenantInterceptor]
            AOF[AuditAspect]
            EXH[GlobalExceptionHandler]
        end
    end

    AC --> AS
    TC --> TS
    CC --> CS
    ASC --> ASS
    WOC --> WOS
    CHC --> CHS
    FC --> FS
    RC --> RS
    PC --> PS

    AS --> UR
    TS --> TR
    CS --> CR
    ASS --> ASR
    WOS --> WOR
    CHS --> CHR

    WOS --> AUS
    WOS --> NS
    WOS --> MQP

    RS --> MQP
    FS --> S3C

    TIF --> TS
    AS --> JC
    NS --> EC
    CS --> MC
```

### Modül Sorumlulukları (Paket Yapısı)

```
com.sahaflow
├── auth              # Kimlik doğrulama, JWT, şifre sıfırlama
├── tenant            # Tenant CRUD, tenant yapılandırması
├── customer          # Müşteri ve adres yönetimi
├── asset             # Cihaz/envanter yönetimi
├── workorder         # İş emri, durum makinesi, atama
├── checklist         # Checklist şablonu ve doldurma
├── files             # Presigned URL, dosya metadata
├── report            # PDF rapor üretimi (tetikleyici)
├── payment           # Tahsilat durumu
├── notification      # E-posta bildirimi
├── audit             # Denetim kaydı
├── common            # Paylaşılan DTO, util, exception
└── config            # Security, CORS, Redis, RabbitMQ config
```

---

## 4. Ana İş Akışı Sequence Diyagramı

### İş Emri Oluşturma → Atama → Mobil Başlatma → Tamamlama → Rapor

```mermaid
sequenceDiagram
    actor Ofis as Ofis Personeli
    actor Teknisyen as Saha Teknisyeni
    actor Musteri as Müşteri
    participant Web as Next.js Web
    participant API as Spring Boot API
    participant DB as PostgreSQL
    participant MQ as RabbitMQ
    participant PDF as PDF Worker
    participant S3 as S3 Storage
    participant Email as E-posta Servisi

    %% Aşama 1: İş Emri Oluşturma
    Ofis->>Web: Müşteri, cihaz ve açıklama girer
    Web->>API: POST /api/v1/work-orders
    API->>DB: INSERT work_order (status=BEKLIYOR)
    DB-->>API: OK
    API->>MQ: Publish WorkOrderCreated
    API-->>Web: 201 Created (workOrderId)

    %% Aşama 2: Teknisyene Atama
    Ofis->>Web: Teknisyen seçer, "Ata" butonu
    Web->>API: PATCH /api/v1/work-orders/{id}/assign
    API->>API: check tenant_id, durum kontrolü
    API->>DB: UPDATE status=ATANDI, technician_id=...
    DB-->>API: OK
    API->>MQ: Publish WorkOrderAssigned
    API->>Email: Teknisyene iş atama bildirimi
    API-->>Web: 200 OK

    %% Aşama 3: Mobil Check-in
    Teknisyen->>API: POST /api/v1/work-orders/{id}/check-in {lat, lng}
    API->>API: Konum validasyonu, durum kontrolü
    API->>DB: UPDATE status=BASLADI, check_in_location, check_in_time
    DB-->>API: OK
    API->>MQ: Publish WorkOrderStarted
    API-->>Teknisyen: 200 OK

    %% Aşama 4: İş Yapma (fotoğraf, checklist, imza)
    Teknisyen->>API: GET /api/v1/files/presigned-url?type=photo
    API->>S3: Generate presigned PUT URL (TTL 5 dk)
    S3-->>API: presignedUrl
    API-->>Teknisyen: presignedUrl
    Teknisyen->>S3: PUT fotoğraf (presigned URL)
    S3-->>Teknisyen: 200 OK
    Teknisyen->>API: POST /api/v1/work-orders/{id}/photos {storageKey}
    API->>DB: INSERT photo record

    Teknisyen->>API: PUT /api/v1/work-orders/{id}/checklist {items}
    API->>DB: INSERT/UPDATE filled_checklist

    Teknisyen->>API: GET /api/v1/files/presigned-url?type=signature
    API->>S3: Generate presigned PUT URL
    S3-->>API: presignedUrl
    API-->>Teknisyen: presignedUrl
    Teknisyen->>S3: PUT imza görüntüsü
    Teknisyen->>API: POST /api/v1/work-orders/{id}/signature {storageKey, signerName}
    API->>DB: INSERT signature record

    %% Aşama 5: Check-out ve Tamamlama
    Teknisyen->>API: POST /api/v1/work-orders/{id}/check-out {lat, lng}
    API->>API: Durum=BASLADI, imza var mı? (zorunlu)
    API->>DB: UPDATE status=TAMAMLANDI, check_out_location, check_out_time
    DB-->>API: OK
    API->>MQ: Publish WorkOrderCompleted
    API->>Email: Ofise iş tamamlandı bildirimi
    API-->>Teknisyen: 200 OK

    %% Aşama 6: PDF Rapor (asenkron)
    MQ->>PDF: Consume WorkOrderCompleted
    PDF->>DB: SELECT iş emri, müşteri, cihaz, fotoğraf, checklist, imza
    DB-->>PDF: Tüm veri
    PDF->>S3: GET fotoğraflar ve imza
    S3-->>PDF: Binary content
    PDF->>PDF: PDF üret (iText)
    PDF->>S3: PUT PDF dosyası
    PDF->>DB: UPDATE work_order SET report_storage_key = ...
    PDF->>MQ: Publish ReportGenerated
```

---

## 5. Kimlik Doğrulama Akışı

```mermaid
sequenceDiagram
    participant Client as Web / Mobil
    participant API as Spring Boot API
    participant DB as PostgreSQL
    participant Redis as Redis

    %% Giriş
    Client->>API: POST /api/v1/auth/login {email, password}
    API->>DB: SELECT user WHERE email=? AND tenant_id=? (varsa)
    DB-->>API: user (hashed password)
    API->>API: BCrypt.verify(password, hash)
    API->>API: JWT access token (15 dk) + refresh token (7 gün) üret
    API-->>Client: 200 {accessToken, refreshToken, expiresIn, user}

    %% Erişim
    loop Her API çağrısı
        Client->>API: GET/POST/PATCH + Authorization: Bearer <accessToken>
        API->>API: JWT doğrula (imza, süre, blacklist)
        API->>Redis: Token blacklist kontrolü
        Redis-->>API: Yok (temiz)
        API->>API: TenantContext.set(tenantId) JWT claim'den
        API-->>Client: Response
    end

    %% Token Yenileme
    Note over Client,API: Access token süresi dolduğunda
    Client->>API: POST /api/v1/auth/refresh {refreshToken}
    API->>API: Refresh token doğrula
    API->>DB: SELECT user (aktif mi kontrol et)
    API->>API: Yeni access token + refresh token üret
    API->>Redis: Eski refresh token'ı blacklist'e ekle
    API-->>Client: 200 {accessToken, refreshToken}

    %% Çıkış
    Client->>API: POST /api/v1/auth/logout
    API->>Redis: Access token'ı blacklist'e ekle (TTL=15 dk)
    API->>Redis: Refresh token'ı blacklist'e ekle (TTL=7 gün)
    API-->>Client: 204 No Content
```

---

## 6. Tenant Bağlamı Akışı

```mermaid
sequenceDiagram
    participant Client as Client
    participant API as Spring Boot API
    participant TI as TenantInterceptor
    participant TC as TenantContext
    participant Service as Service Layer
    participant DB as PostgreSQL

    Client->>API: GET /api/v1/customers (JWT içinde tenantId: t-123)
    API->>TI: preHandle(request)
    TI->>TI: JWT'den tenantId'yi çıkar
    TI->>TC: TenantContext.setCurrentTenant("t-123")
    TI-->>API: true (devam et)

    API->>Service: CustomerService.findAll()
    Service->>TC: TenantContext.getCurrentTenant() → "t-123"
    Service->>DB: SELECT * FROM customers WHERE tenant_id = 't-123'
    DB-->>Service: [yalnızca tenant t-123'ün müşterileri]
    Service-->>API: customerList

    API->>TI: afterCompletion()
    TI->>TC: TenantContext.clear()
    API-->>Client: 200 {data: customerList}
```

### Tenant İzolasyonu Prensipleri

| Katman | Yöntem |
|---|---|
| Controller | `@PreAuthorize` ile role ve tenant kontrolü |
| Interceptor | Her request'te JWT'den tenantId çıkarılır, `ThreadLocal`'a yazılır |
| Service | Tüm repository sorguları `tenant_id = :tenantId` filtresi içerir |
| Repository | Spring Data JPA `@Query` ile tenant filtresi; native query'lerde zorunlu parametre |
| Veritabanı | `tenant_id` sütunu her tabloda indexed; row-level security (RLS) opsiyonel olarak v2'de |

---

## 7. Dosya Yükleme Akışı (Presigned URL)

```mermaid
sequenceDiagram
    participant Mobile as Flutter Mobile
    participant API as Spring Boot API
    participant S3 as S3/MinIO

    Note over Mobile,S3: Fotoğraf/İmza Yükleme (Presigned URL ile)

    Mobile->>API: GET /api/v1/files/presigned-url?entityType=WORK_ORDER&entityId=123&fileType=PHOTO
    API->>API: JWT doğrula → tenant_id ve kullanıcı rolü kontrol
    API->>API: Depolama key oluştur: tenants/{tenantId}/work-orders/{id}/photos/{uuid}.jpg
    API->>S3: Generate presigned PUT URL (TTL=300s)
    S3-->>API: presignedUrl
    API-->>Mobile: 200 {presignedUrl, storageKey, expiresAt}

    Mobile->>Mobile: Fotoğraf çek veya galeriden seç
    Mobile->>S3: PUT presignedUrl (binary fotoğraf, Content-Type: image/jpeg)
    S3-->>Mobile: 200 OK

    Mobile->>API: POST /api/v1/work-orders/123/photos {storageKey: "tenants/t-1/...", fileName: "foto.jpg"}
    API->>API: storageKey'in tenant'a ait olduğunu doğrula
    API->>DB: INSERT INTO work_order_photos (work_order_id, storage_key, taken_at, location)
    DB-->>API: OK
    API-->>Mobile: 201 Created {photoId, thumbnailUrl}

    Note over Mobile,S3: Presigned URL'ler 5 dakika TTL ile sınırlıdır.
    Note over Mobile,S3: Storage key formatı: tenants/{tenantId}/{entityType}/{entityId}/{fileType}/{uuid}.{ext}
```

### Dosya İndirme (Presigned GET)

```mermaid
sequenceDiagram
    participant Web as Next.js Web
    participant API as Spring Boot API
    participant S3 as S3/MinIO

    Web->>API: GET /api/v1/files/presigned-download-url?storageKey=tenants/t-1/wos/123/photos/uuid.jpg
    API->>API: JWT doğrula, tenant kontrolü (storageKey tenant'ınkiyle eşleşmeli)
    API->>S3: Generate presigned GET URL (TTL=300s)
    S3-->>API: presignedDownloadUrl
    API-->>Web: 200 {presignedDownloadUrl}
    Web->>S3: GET presignedDownloadUrl
    S3-->>Web: 200 (binary içerik)
```

---

## 8. Senkron ve Asenkron Akışlar

```mermaid
graph LR
    subgraph "Senkron Akışlar"
        A1[CRUD İşlemleri]
        A2[Kimlik Doğrulama]
        A3[Presigned URL Oluşturma]
        A4[İş Listesi Sorgulama]
    end

    subgraph "Asenkron Akışlar (Event-Driven)"
        B1[PDF Rapor Üretimi]
        B2[E-posta Bildirimi]
        B3[Audit Log Yazımı]
    end

    subgraph "Message Queue"
        MQ[RabbitMQ]
    end

    A1 -.->|doğrudan| DB[(PostgreSQL)]
    A2 -.->|doğrudan| DB
    A3 -.->|doğrudan| S3[(S3)]
    A4 -.->|doğrudan| DB

    B1 -->|consumer| MQ
    B2 -->|consumer| MQ
    B3 -->|consumer| MQ
```

| Akış | Tip | Gerekçe |
|---|---|---|
| CRUD işlemleri | Senkron | Kullanıcı anında yanıt bekler |
| Kimlik doğrulama | Senkron | Oturum açma anında yanıt gerekir |
| Presigned URL | Senkron | Mobil anında URL'ye ihtiyaç duyar |
| PDF üretimi | Asenkron | Ağır I/O; kullanıcıyı bekletmemek için |
| E-posta bildirimi | Asenkron | SMTP gecikmesi; kullanıcı işlemini bloke etmemek için |
| Audit log | Asenkron | Fire-and-forget; ana iş akışını yavaşlatmamak için |

### Retry ve Dead-Letter Stratejisi

| Senaryo | Yaklaşım |
|---|---|
| Geçici hata (DB bağlantı, S3 timeout) | Exponential backoff, 3 retry |
| Kalıcı hata (validation, 404) | Retry yok; doğrudan dead-letter queue (DLQ) |
| DLQ'daki mesaj | Admin panelinden izlenir; manuel replay veya discard |

---

## 9. Ölçekleme Yaklaşımı

### MVP Aşaması (Yatay Ölçekleme Yok)

```mermaid
graph TD
    LB[Cloud Load Balancer]
    subgraph "Tek Sunucu (VM/EC2, 4 vCPU, 16 GB RAM)"
        WP[Web: Next.js :3000]
        API[API: Spring Boot :8080]
        PDFW[PDF Worker :8081]
        DB[(PostgreSQL)]
        R[(Redis)]
        MQ[(RabbitMQ)]
        S3[(MinIO)]
    end
```

### Üretim Aşaması (v1.1+)

```mermaid
graph TD
    LB[Load Balancer]
    subgraph "Web Tier (Auto Scaling 2-4)"
        W1[Next.js]
        W2[Next.js]
    end
    subgraph "API Tier (Auto Scaling 2-4)"
        A1[Spring Boot]
        A2[Spring Boot]
    end
    subgraph "Worker Tier"
        PW1[PDF Worker]
        PW2[PDF Worker]
    end
    subgraph "Data Tier"
        DBP[(PostgreSQL Primary)]
        DBS[(PostgreSQL Replica - Read)]
        R[(Redis Cluster)]
        MQ[(RabbitMQ Cluster)]
    end
    S3P[(AWS S3 / Azure Blob)]

    LB --> W1 & W2
    W1 & W2 --> A1 & A2
    A1 & A2 --> DBP
    A1 & A2 --> DBS
    A1 & A2 --> R
    A1 & A2 --> MQ
    MQ --> PW1 & PW2
    PW1 & PW2 --> S3P
    A1 & A2 --> S3P
```

### Ölçekleme Kararları

| Bileşen | MVP Yaklaşımı | Üretim Yaklaşımı |
|---|---|---|
| Web (Next.js) | Tek container, SSR açık | 2-4 container, CDN önünde |
| API (Spring Boot) | Tek container, 2 thread pool | Auto-scaling (CPU > %70), read replica |
| PostgreSQL | Tek instance, pg_dump yedekleme | Primary + Read Replica, WAL arşivleme |
| Redis | Tek instance | Sentinel / Cluster |
| RabbitMQ | Tek instance | Cluster (3 node) |
| S3 | MinIO (Docker) | AWS S3 / Azure Blob (managed) |

---

## 10. Hata ve Dayanıklılık Senaryoları

### Hata Matrisi

| Hata Senaryosu | Etki | Tespit | Kurtarma |
|---|---|---|---|
| Veritabanı bağlantı kopması | API 503 döner; kullanıcı işlem yapamaz | Spring Actuator health check + alert | Connection pool otomatik reconnect; 30 sn içinde düzelmezse alarm |
| S3 erişilemez | Fotoğraf yükleme/indirme başarısız | Health check endpoint | S3 SLA'sına bağlı; presigned URL oluşturma başarısız olur, kullanıcıya "Dosya servisi geçici olarak kullanılamıyor" mesajı |
| RabbitMQ erişilemez | PDF üretimi ve bildirim birikir | Queue health + dead-letter monitoring | Spring RabbitMQ retry + reconnect; MQ gelince biriken mesajlar işlenir |
| JWT secret sızması | Token'lar sahtelenebilir | Güvenlik olayı | Secret rotasyonu; tüm token'lar geçersiz kılınır, tüm kullanıcılar yeniden giriş yapar |
| Offline sync çakışması | Aynı iş emrinde iki farklı değişiklik | Mobil sync log | Last-write-wins (timestamp bazlı); çakışma durumunda eski değişiklik audit log'a kaydedilir |
| Bellek sızıntısı (PDF worker) | Worker container OOM | Container memory monitoring | Health check başarısız → container restart; Kubernetes/Docker restart policy |
| Redis erişilemez | Token blacklist çalışmaz; rate limiting devre dışı | Health check | Sistem Redis olmadan da çalışır; token blacklist kontrolü atlanır (güvenlik riski kabulü), rate limiting by-pass edilir |

### Circuit Breaker Stratejisi (Resilience4j)

| Servis Çağrısı | Circuit Breaker Ayarı |
|---|---|
| E-posta (SMTP) | 5 hata / 30 sn pencere; 60 sn yarı-açık bekleme |
| Harita (Geocoding) | 3 hata / 20 sn pencere; 30 sn yarı-açık bekleme |
| S3 (Presigned URL) | 3 hata / 10 sn pencere; 15 sn yarı-açık bekleme |

---

## Karar Bekleyen Konular

- Üretim bulut sağlayıcı seçimi (AWS, Azure, Hetzner, Türk Telekom Bulut)
- PostgreSQL row-level security (RLS) MVP'de kullanılacak mı? (Varsayım: Hayır; uygulama katmanında tenant filtresi yeterli)
- RabbitMQ yerine MVP'de Spring Async + database polling yeterli olur mu? (Varsayım: RabbitMQ, asenkron akışlar kritik olduğu için MVP'de de var)
- CDN kullanımı (web statik asset'ler ve PDF'ler için) MVP'de gerekli mi? (Varsayım: Next.js built-in asset optimization yeterli)
- Kubernetes'e geçiş zamanı (varsayım: v1.1+); MVP Docker Compose ile single-VM deployment
- SSL sertifika yönetimi (varsayım: Let's Encrypt + Traefik/Certbot otomatik yenileme)

## İlgili Dokümanlar

| Doküman | Açıklama |
|---|---|
| `00_EXECUTIVE_SUMMARY.md` | Proje özeti ve riskler |
| `01_ASSUMPTIONS_AND_QUESTIONS.md` | Varsayımlar ve açık sorular |
| `02_PRD.md` | Ürün gereksinimleri dokümanı |
| `03_DOMAIN_MODEL.md` | Domain modeli ve iş kuralları |
