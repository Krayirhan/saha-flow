# DevOps, Gozlemlenebilirlik ve Felaket Kurtarma

> Proje: İşAkış
> Dokuman: DevOps, Gozlemlenebilirlik ve Felaket Kurtarma (DevOps, Observability & Disaster Recovery)
> Durum: Draft
> Uretim tarihi: 2026-07-21
> Kaynak girdi: templates/01_PROJE_GIRDI_FORMU.yaml

---

## 1. Ortam Ayrimi (Environment Separation)

| Ozellik | Development | Staging | Production |
|---|---|---|---|
| Amac | Yerel gelistirme ve ilk test | Production benzeri test, onay | Canli hizmet |
| Altyapi | Docker Compose (yerel) veya tek VPS | Ayri VPS (4GB RAM, 2 vCPU) | Ayri VPS (8GB RAM, 4 vCPU) veya dedicated |
| Veri Tabani | Local PostgreSQL 15 + PostGIS | Ayri PostgreSQL container, sentetik veri | Ayri PostgreSQL container veya managed PostgreSQL |
| Object Storage | Local MinIO | Ayri MinIO, sentetik veri | Ayri MinIO veya AWS S3 uyumlu |
| Redis | Local | Ayri Redis container | Ayri Redis container |
| Domain | localhost | staging.sahaflow.com | sahaflow.com |
| TLS | Self-signed | Let's Encrypt (auto-renew) | Let's Encrypt veya managed certificate |
| Monitoring | Hafif / opsiyonel | Tam (Prometheus + Grafana + Loki) | Tam + Alarmlar |
| Erisim | Sadece gelistirici | Ekip + test musterileri | Son kullanicilar |
| Deployment | Manuel `docker compose up` | Otomatik (merge to staging) | Otomatik (manuel onay sonrasi) |

---

## 2. Deployment Topolojisi

```mermaid
graph TB
    subgraph "CDN / WAF Layer"
        Cloudflare[Cloudflare DNS + WAF]
    end

    subgraph "Production VPS (Hetzner / UpCloud / Vultr)"
        subgraph "Docker Host"
            Nginx[Nginx Reverse Proxy + TLS Termination]
            NextJS[Next.js Web App - Container]
            SpringAPI[Spring Boot API - Container]
            OTelCollector[OpenTelemetry Collector - Container]

            subgraph "Data Services"
                Postgres[(PostgreSQL 15 + PostGIS)]
                MinIO[(MinIO S3-compatible)]
                Redis[(Redis 7)]
            end

            subgraph "Observability Stack"
                Prometheus[Prometheus]
                Grafana[Grafana]
                Loki[Loki]
                Tempo[Tempo - Tracing]
            end

            subgraph "Security Services"
                ClamAV[ClamAV Container]
            end
        end
    end

    subgraph "Staging VPS"
        StagingStack[Staging - Identical Stack<br/>(reduced resources)]
    end

    subgraph "External Services"
        EmailSvc[Email Service - SendGrid / AWS SES]
        SMSSvc[SMS Service - opsiyonel]
        PaymentSvc[Payment Gateway - Iyzico / Stripe]
    end

    subgraph "Admin Access"
        VPN[WireGuard VPN / Tailscale]
        AdminSSH[SSH Access]
    end

    User[Kullanici] --> Cloudflare
    MSP[Musteri MSP] --> Cloudflare
    MobileApp[Mobil Uygulama] --> Cloudflare

    Cloudflare --> Nginx
    Nginx --> NextJS
    Nginx --> SpringAPI
    SpringAPI --> Postgres
    SpringAPI --> MinIO
    SpringAPI --> Redis
    SpringAPI --> EmailSvc
    SpringAPI --> SMSSvc
    SpringAPI --> PaymentSvc
    NextJS --> SpringAPI
    SpringAPI --> ClamAV

    SpringAPI --> OTelCollector
    NextJS --> OTelCollector
    Postgres --> OTelCollector
    OTelCollector --> Prometheus
    OTelCollector --> Loki
    OTelCollector --> Tempo
    Grafana --> Prometheus
    Grafana --> Loki
    Grafana --> Tempo

    AdminSSH --> VPN
    VPN --> Nginx
    VPN --> Postgres

    StagingStack -.->|identique yapi| Cloudflare

    style Cloudflare fill:#f9a,stroke:#333
    style VPN fill:#afa,stroke:#333
    style Postgres fill:#aaf,stroke:#333
```

---

## 3. Docker ve Managed Service Yaklasimi

### 3.1 Docker Compose Servisleri

```yaml
# docker-compose.prod.yml (ozet)
services:
  nginx:
    image: nginx:1.27-alpine
    volumes:
      - ./infrastructure/nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./infrastructure/nginx/conf.d:/etc/nginx/conf.d:ro
      - certbot_data:/var/www/certbot:ro
      - /etc/letsencrypt:/etc/letsencrypt:ro
    ports:
      - "80:80"
      - "443:443"
    depends_on: [api, web]
    restart: unless-stopped

  api:
    image: ghcr.io/sahaflow/api:${API_VERSION}
    env_file: .env.prod
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - DB_URL=jdbc:postgresql://postgres:5432/sahaflow
      - S3_ENDPOINT=http://minio:9000
      - REDIS_HOST=redis
      - OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4318
    depends_on: [postgres, minio, redis]
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/actuator/health"]
      interval: 30s
      timeout: 5s
      retries: 3
    deploy:
      resources:
        limits: { memory: 2G, cpus: '2' }

  web:
    image: ghcr.io/sahaflow/web:${WEB_VERSION}
    env_file: .env.prod
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=https://api.sahaflow.com
      - OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4318
    depends_on: [api]
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 5s
      retries: 3

  postgres:
    image: postgis/postgis:15-3.4
    environment:
      - POSTGRES_DB=sahaflow
      - POSTGRES_PASSWORD_FILE=/run/secrets/db_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "pg_isready", "-U", "sahaflow"]
      interval: 10s
      timeout: 5s
      retries: 5
    deploy:
      resources:
        limits: { memory: 2G, cpus: '2' }

  minio:
    image: minio/minio:RELEASE.2025-01-latest
    command: server /data --console-address ":9001"
    environment:
      - MINIO_ROOT_USER_FILE=/run/secrets/minio_root_user
      - MINIO_ROOT_PASSWORD_FILE=/run/secrets/minio_root_password
    volumes:
      - minio_data:/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 30s
      timeout: 5s
      retries: 3

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD} --appendonly yes
    volumes:
      - redis_data:/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 3

  clamav:
    image: clamav/clamav:1.4
    volumes:
      - clamav_data:/var/lib/clamav
    restart: unless-stopped

  # Observability
  otel-collector:
    image: otel/opentelemetry-collector-contrib:0.110.0
    volumes:
      - ./infrastructure/otel-collector-config.yaml:/etc/otel/config.yaml:ro
    restart: unless-stopped

  prometheus:
    image: prom/prometheus:v2.54
    volumes:
      - ./infrastructure/prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - prometheus_data:/prometheus
    command: --storage.tsdb.retention.time=30d
    restart: unless-stopped

  grafana:
    image: grafana/grafana:11.2
    volumes:
      - grafana_data:/var/lib/grafana
      - ./infrastructure/grafana/dashboards:/etc/grafana/provisioning/dashboards:ro
      - ./infrastructure/grafana/datasources:/etc/grafana/provisioning/datasources:ro
    restart: unless-stopped
    depends_on: [prometheus, loki, tempo]

  loki:
    image: grafana/loki:3.2
    volumes:
      - ./infrastructure/loki-config.yaml:/etc/loki/config.yaml:ro
      - loki_data:/loki
    restart: unless-stopped

  tempo:
    image: grafana/tempo:2.6
    volumes:
      - ./infrastructure/tempo-config.yaml:/etc/tempo/config.yaml:ro
      - tempo_data:/tmp/tempo
    restart: unless-stopped

volumes:
  postgres_data:
  minio_data:
  redis_data:
  clamav_data:
  prometheus_data:
  grafana_data:
  loki_data:
  tempo_data:
  certbot_data:
```

### 3.2 Managed Service Degerlendirmesi (Ileri Faz)

| Servis | Mevcut (MVP) | Ileri Faz (Olcek > 50 tenant) |
|---|---|---|
| PostgreSQL | Docker container | AWS RDS / Supabase / Crunchy Bridge |
| MinIO / S3 | Docker container | AWS S3 / Cloudflare R2 |
| Redis | Docker container | Upstash / AWS ElastiCache |
| E-posta | SMTP (SendGrid) | Ayni |
| Monitoring | Self-hosted (Prometheus+Grafana+Loki+Tempo) | Ayni veya Grafana Cloud |
| Log | Self-hosted Loki | Ayni veya Grafana Cloud Logs |
| Container Registry | GitHub Container Registry | Ayni |
| CI/CD | GitHub Actions | Ayni |

---

## 4. Ag Guvenligi

| Katman | Kontrol |
|---|---|
| **DNS / CDN** | Cloudflare: DDoS korumasi, WAF, SSL/TLS termination (Full/Strict mod), DDoS korumasi, rate limiting |
| **Reverse Proxy** | Nginx: TLS 1.3, HSTS, CSP/X-Frame-Options header enjeksiyonu, `/actuator`, `/swagger-ui`, `/graphql` endpoint'lere IP whitelist |
| **Host firewall** | UFW: sadece 80, 443, ve VPN (51820) portlari acik |
| **VPN** | WireGuard veya Tailscale ile yonetimsel SSH erisimi; dogrudan SSH public IP'ye acik degil |
| **Docker network** | Servisler ayri bridge network'te: `frontend` (nginx, web), `backend` (api), `data` (postgres, minio, redis), `monitoring` |
| **Container isolation** | `no-new-privileges: true`, `read-only: true` (mumkun olan container'larda), non-root kullanici, cap drop ALL |
| **Secrets** | `secrets:` yontemi ile hassas degisken dosyadan okunur, `.env` dosyasi gitignore'da, prod sunucuda sadece root erisimli |

---

## 5. Domain / TLS

| Domain | Amac | TLS Saglayici |
|---|---|---|
| `sahaflow.com` | Production web uygulamasi | Cloudflare + Let's Encrypt (origin) |
| `api.sahaflow.com` | Production API (Next.js BFF uzerinden de proxy) | Cloudflare + Let's Encrypt |
| `*.sahaflow.com` | Wildcard (gelecekteki subdomain'ler) | Cloudflare |
| `staging.sahaflow.com` | Staging | Let's Encrypt |
| `minio-console.sahaflow.com` | MinIO web konsolu (sadece VPN) | Let's Encrypt (internal, VPN'den erisim) |

**TLS Konfigurasyonu (Nginx):**
```nginx
ssl_protocols TLSv1.3;
ssl_ciphers ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
ssl_prefer_server_ciphers off;
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 1d;
ssl_stapling on;
ssl_stapling_verify on;
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
```

---

## 6. OpenTelemetry ile Gozlemlenebilirlik

### 6.1 Mimari

```
Uygulama (Spring Boot + Next.js + PostgreSQL)
    │
    ▼
OpenTelemetry Agent (OTLP/gRPC export)
    │
    ▼
OpenTelemetry Collector (self-hosted Docker container)
    │
    ├── Metrics ──► Prometheus (scrape from collector)
    ├── Logs   ──► Loki (push from collector)
    └── Traces ──► Tempo (push from collector)
                        │
                        ▼
                    Grafana (unified dashboard)
```

### 6.2 Telemetri Verileri

| Sinyal | Kaynak | Toplama | Hedef |
|---|---|---|---|
| **Metrics** | Spring Boot Actuator + Micrometer, Next.js (opentelemetry-js), PostgreSQL exporter | OTel Collector -> Prometheus | Grafana |
| **Logs** | uygulama loglari (JSON format, stdout/stderr), nginx access/error log, PostgreSQL log | OTel Collector -> Loki | Grafana |
| **Traces** | Spring Boot Micrometer Tracing, Next.js OpenTelemetry SDK, DB sorgu tracing | OTel Collector -> Tempo | Grafana |

### 6.3 Spring Boot OpenTelemetry Entegrasyonu

```yaml
# application-prod.yml
management:
  endpoints:
    web:
      exposure:
        include: health,metrics,prometheus
  metrics:
    export:
      prometheus:
        enabled: true
  tracing:
    sampling:
      probability: 0.1  # Production'da %10 ornekleme
  otlp:
    metrics:
      export:
        url: http://otel-collector:4318/v1/metrics
    tracing:
      endpoint: http://otel-collector:4318/v1/traces

otel:
  service:
    name: sahaflow-api
  resource:
    attributes:
      deployment.environment: production
      service.version: ${APP_VERSION}
```

### 6.4 Next.js OpenTelemetry Entegrasyonu

```typescript
// web/instrumentation.ts
import { registerOTel } from '@vercel/otel';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';

export function register() {
  registerOTel({
    serviceName: 'sahaflow-web',
    traceExporter: new OTLPTraceExporter({
      url: `${process.env.OTEL_EXPORTER_OTLP_ENDPOINT}/v1/traces`,
    }),
    metricExporter: new OTLPMetricExporter({
      url: `${process.env.OTEL_EXPORTER_OTLP_ENDPOINT}/v1/metrics`,
    }),
    attributes: {
      'deployment.environment': process.env.NODE_ENV,
      'service.version': process.env.APP_VERSION,
    },
  });
}
```

---

## 7. Dashboard ve Alarm Onerileri

### 7.1 Grafana Dashboard'lari

| Dashboard | Icerik | Veri Kaynagi |
|---|---|---|
| **İşAkış - Genel Durum** | API yanit sureleri, hata orani, throughput, CPU/memory | Prometheus |
| **İşAkış - Is Emri Analitigi** | Olusturulan/tamamlanan is emri sayisi, durum dagilimi, user aktivitesi | Prometheus (custom metrics) |
| **İşAkış - API Detay** | Endpoint bazli latency, hata orani, request rate | Prometheus + Tempo |
| **İşAkış - Veri Tabani** | Connection pool, slow queries, deadlocks, replication lag | Prometheus + PostgreSQL exporter |
| **İşAkış - Tenant Analitigi** | Tenant bazli request sayisi, storage kullanimi, error rate | Prometheus + Loki |
| **İşAkış - Guvenlik** | Failed login, rate limit hits, 403/401 rate, suspicious IP | Prometheus + Loki |
| **İşAkış - Altyapi** | Host CPU, RAM, disk, network, container health | Prometheus + Node Exporter |

### 7.2 Alarm Listesi

| No | Alarm Adi | Kosul | Siddet | Kanal | Aksiyon |
|---|---|---|---|---|---|
| ALM-01 | API Down | `health check` basarisiz (30sn boyunca) | **Kritik** | PagerDuty / OpsGenie + Slack | Otomatik restart (docker compose), basarisizsa manuel mudahale |
| ALM-02 | API Yuksek Hata Orani | 5 dakikada `http_server_errors > 5%` | **Yuksek** | Slack + E-posta | Son deployment kontrolu, rollback degerlendirmesi |
| ALM-03 | API Yuksek Gecikme | `p95 latency > 2s` (5dk boyunca) | **Yuksek** | Slack | DB slow query analizi, kaynak artirimi |
| ALM-04 | Veri Tabani Baglanti Havuzu Dolulugu | `active_connections > 80% max` | **Yuksek** | Slack + E-posta | Connection pool config gozden gecirimi, leak kontrolu |
| ALM-05 | Disk Kullanimi | Disk kullanimi `> 80%` (tum volume'ler) | **Yuksek** | Slack + E-posta | Log rotasyonu, eski yedek temizligi, volume genisletme |
| ALM-06 | Bellek Kullanimi | Memory `> 85%` (5dk boyunca) | **Orta** | Slack | Memory leak arastirmasi, swap durumu, kaynak artirimi |
| ALM-07 | CPU Kullanimi | CPU `> 90%` (10dk boyunca) | **Orta** | Slack | Kaynak artirimi veya optimizasyon |
| ALM-08 | Basarisiz Giris Denemesi | `failed_logins > 10/dk` (tenant veya genel) | **Yuksek** | Slack + SIEM | IP bloklama, WAF kurali, musteri bilgilendirme |
| ALM-09 | Rate Limit Tetiklenmesi | `rate_limit_hits > 20/dk` | **Orta** | Slack | IP analizi, WAF kurali guncelleme |
| ALM-10 | MinIO Saglik Kontrolu | `minio_health` basarisiz (30sn) | **Kritik** | PagerDuty + Slack | Otomatik restart, basarisizsa manuel mudahale |
| ALM-11 | Yedekleme Basarisiz | Gunluk `backup_success != 1` | **Kritik** | PagerDuty + Slack | Manuel yedek alinmasi, sorun giderme |
| ALM-12 | SSL Sertifikasi Suresi | `cert_expiry < 7 gun` | **Yuksek** | Slack + E-posta | Certbot renew kontrolu |
| ALM-13 | Tenant Kotasi Asimi | `tenant_storage > 90% quota` | **Orta** | Slack (opsiyonel tenant bildirimi) | Tenant bilgilendirme, kota artirimi |
| ALM-14 | ClamAV Sunucusu Down | `clamav_health` basarisiz | **Yuksek** | Slack | Dosya yukleme karantinaya alinir, restart |
| ALM-15 | Oturum Acma Anomalisi | Ayni kullanici 2 farkli IP'den (cografi uzak) eszamanli | **Orta** | Slack | Oturum sonlandirma, kullanici bilgilendirme |

**Bildirim Kanallari:**
- **PagerDuty / OpsGenie:** Kritik alarmlar (ALM-01, ALM-10, ALM-11)
- **Slack kanali (#sahaflow-alerts):** Yuksek ve orta alarmlar
- **E-posta:** Kritik ve Yuksek alarmlar icin yedek kanal

---

## 8. SLI / SLO Tanimlari

| Yolculuk | SLI (Service Level Indicator) | SLO (Service Level Objective) | Olcum Yontemi | Hata Butcesi (Aylik) |
|---|---|---|---|---|
| **Kullanici Girisi** | Basarili login orani | %99.9 | `login_success / login_attempts` (Prometheus) | ~43 dakika |
| **Is Emri Olusturma** | API yanit suresi ve basari orani | `p95 < 1s`, basari > %99.5 | Prometheus + custom metric | ~3.6 saat |
| **Is Emri Listeleme** | API yanit suresi ve basari orani | `p95 < 500ms`, basari > %99.9 | Prometheus | ~43 dakika |
| **Dosya Yukleme** | Basarili yukleme orani + sure | basari > %99.5, p95 < 5s | Prometheus + custom metric | ~3.6 saat |
| **Mobil Senkronizasyon** | Basarili sync orani ve sure | basari > %99.0, p95 < 3s | Custom metric (sync success/failure) | ~7.2 saat |
| **Genel API Kullanilabilirlik** | Tum 2xx / tum istekler | %99.9 | Prometheus `http_server_requests_seconds_count` | ~43 dakika |

---

## 9. Disaster Recovery - RTO / RPO

| Hedef | Deger |
|---|---|
| **RTO (Recovery Time Objective)** | 4 saat |
| **RPO (Recovery Point Objective)** | 1 saat |

### 9.1 Backup Stratejisi

| Varlik | Yedekleme Yontemi | Periyot | Saklama | Konum |
|---|---|---|---|---|
| PostgreSQL | `pg_dump` (tam logical dump) + WAL arsivleme (PITR) | Full: gunluk 03:00, WAL: surekli | Gunluk: 30 gun, Haftalik: 12 hafta, Aylik: 12 ay | MinIO bucket `backups/` + farkli VPS'e rsync |
| MinIO nesneleri | `mc mirror` (MinIO client) | Gunluk 04:00 | 30 gun | Farkli VPS'teki MinIO bucket `backups/` |
| Redis (session/onbellek) | Yedeklenmez (tekrar olusturulabilir) | - | - | - |
| Docker imajlari | Container Registry'de (GHCR) | - | Surum yasam dongusu boyunca | GHCR |
| Yapilandirma dosyalari | Git repo (infrastructure/) | Surekli (her commit) | Surekli | GitHub |

### 9.2 Backup Script Ornegi

```bash
#!/bin/bash
# backup.sh - PostgreSQL ve MinIO yedekleme
set -euo pipefail

BACKUP_DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/${BACKUP_DATE}"
RETENTION_DAYS=30

echo "[$(date)] Starting backup..."

# PostgreSQL full dump + WAL
mkdir -p "${BACKUP_DIR}/postgres"
PGPASSWORD="${DB_PASSWORD}" pg_dump -h localhost -U sahaflow -d sahaflow \
  -Fc -f "${BACKUP_DIR}/postgres/full.dump"
# GPG sifreleme (gerekirse)
gpg --encrypt --recipient backup-key@sahaflow.com "${BACKUP_DIR}/postgres/full.dump"

# MinIO mirror
# mc mirror local/sahaflow-files "remote/backups/${BACKUP_DATE}/files/"

# Eski yedekleri temizle
find /backups/ -type d -mtime +${RETENTION_DAYS} -exec rm -rf {} \; 2>/dev/null || true

# Basari metrigini Prometheus'a push et
echo "backup_success 1" | curl --data-binary @- http://pushgateway:9091/metrics/job/backup

echo "[$(date)] Backup completed: ${BACKUP_DATE}"
```

### 9.3 Felaket Kurtarma Adimlari

```
FELAKET DURUMU: Production sunucu tamamen kullanilamaz (ornegin, veri merkezi yangini)

RTO = 4 Saat, RPO = 1 Saat

Adim 1 (0-30dk): Iletisim ve degerlendirme
  - Olay sorumlusu belirlenir
  - Slack #incident kanalinda olay ilan edilir
  - Musterilere durum sayfasindan bilgilendirme yapilir

Adim 2 (30dk-1sa): Yeni altyapi hazirligi
  - Yeni VPS olusturulur (yedek bolgede veya yeni saglayici)
  - Domain DNS kayitlari yeni IP'ye yonlendirilir (TTL dusuk tutulmali)
  - Docker ve bagimliliklar kurulur (ansible playbook veya manuel)

Adim 3 (1sa-2sa): Veri geri yukleme
  - En son PostgreSQL yedegi yeni sunucuya kopyalanir
  - pg_restore ile veri tabani geri yuklenir
  - WAL dosyalari ile PITR uygulanir (son ana kadar)
  - MinIO dosyalari mc mirror ile geri yuklenir

Adim 4 (2sa-3sa): Uygulama ayaga kaldirma
  - docker compose up -d (production profile)
  - Flyway migration calisir
  - Health check dogrulanir
  - Smoke test yapilir

Adim 5 (3sa-4sa): Dogrulama ve bilgilendirme
  - Kritik yolculuklar manuel test edilir
  - Monitoring alarmlari aktif edilir
  - Musterilere "servis geri geldi" bildirimi yapilir
  - Kok neden analizi baslatilir
```

### 9.4 Yillik DR Tatbikati Takvimi

| Ay | Faaliyet | Katilimcilar |
|---|---|---|
| Q1 | Masaustu tatbikati (tabletop exercise) | Tum ekip |
| Q2 | Backup restore testi (staging'de) | DevOps Lead |
| Q3 | PITR testi (staging'de) | DevOps + Backend Lead |
| Q4 | Tam DR tatbikati (staging'de sifirdan ayaga kaldirma) | Tum ekip |

---

## 10. Kapasite Planlama

### 10.1 MVP Kapasitesi (Ilk 6 Ay)

| Kaynak | Tahmin | Mevcut Limit | Aksiyon Esigi |
|---|---|---|---|
| API istek/dakika | ~500 | 2000 (Nginx rate limit) | > 1500 |
| Eszamanli kullanici | ~20 | 100 (connection pool) | > 80 connection |
| DB boyutu | ~500MB | 50GB disk | > 40GB |
| S3 storage | ~10GB | 100GB disk | > 80GB |
| Gunluk yedek boyutu | ~600MB | 200GB yedek diski | > 160GB |
| CPU kullanimi | ~%30 | 4 vCPU | > %70 surekli |
| Bellek kullanimi | ~4GB | 8GB | > 7GB surekli |

### 5-50 Teknisyenli 10 Tenant Senaryosu (Ilk Yil Tahmini):

| Metrik | Tahmin |
|---|---|
| Aktif kullanici/teknisyen | ~100 |
| Gunluk is emri | ~500 |
| Gunluk dosya yukleme | ~2000 (fotograf/imza) |
| Ortalama DB sorgu suresi | < 50ms |
| Ortalama API yanit suresi | < 200ms |
| Aylik veri artisi | ~5GB |

Olcekleme tetikleyicileri:
- API p95 latency > 1s (surekli)
- DB Connection pool > %80 (surekli)
- Disk > %70 doluluk
- API request rate mevcut Nginx limitine yaklasmasi

---

## 11. Maliyet Kontrolu

### 11.1 Aylik Tahmini Maliyet (MVP, 2026 Yilinda)

| Kalem | Tahmini Aylik Maliyet |
|---|---|
| Production VPS (8GB RAM, 4 vCPU, 160GB NVMe) | ~$40-80 (Hetzner/Hostinger/Vultr) |
| Staging VPS (4GB RAM, 2 vCPU, 80GB NVMe) | ~$20-40 |
| Cloudflare Pro veya Ucretsiz | $0-25 |
| Domain + SSL | ~$15/yil (~$1.25/ay) |
| E-posta servisi (SendGrid ucretsiz katman) | $0 (ilk 100 eposta/gun) |
| GitHub Actions (ek sure gerekirse) | ~$0-20 |
| GitHub Container Registry | $0 (public repos) veya ~$5 |
| Monitoring (self-hosted) | $0 |
| VPN (Tailscale ucretsiz) | $0 (3 kullaniciya kadar) |
| **Toplam (aylik)** | **~$60-170** |

### 11.2 Maliyet Kontrol Onlemleri

| Onlem | Aciklama |
|---|---|
| Auto-scaling yok (MVP'de) | Sabit VPS, manuel upgrade |
| Monitoring retention sinirli | Prometheus: 30 gun, Loki: 90 gun |
| Log sampling | Production'da trace sampling %10, debug loglar kapali |
| Backup retention | 30 gun otomatik temizlik |
| CDN caching | Statik asset'ler Cloudflare'de cache'lenir |
| Ucretsiz/OSS araclar tercihi | self-hosted monitoring, nginx, docker, postgresql |

---

## Karar Bekleyen Konular

1. Production VPS saglayici kesin secimi (Hetzner, UpCloud, Vultr, TR merkezli bir saglayici)
2. KVKK uyumlulugu acisindan sunucu konumu: Turkiye mi AB mi?
3. PagerDuty/OpsGenie gibi on-call yonetim araci butcesi
4. Cloudflare Pro'ya gecis zamani (WAF custom rules, advanced rate limiting)
5. Host-level IDS/IPS (Wazuh) entegrasyonu
6. Status page (statuspage.io veya self-hosted) maliyeti
7. Production ve staging ortamlari arasi veri replikasyonu gerekli mi?

## Ilgili Dokumanlar

- `10_THREAT_MODEL.md` — Tehdit Modeli
- `11_PRIVACY_KVKK.md` — KVKK Uyumluluk ve Gizlilik
- `12_SECURE_SDLC_CICD.md` — Guvenli SDLC ve CI/CD
- `13_TEST_STRATEGY.md` — Test Stratejisi
- `15_ADR.md` — Mimari Karar Kayitlari
