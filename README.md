# Saha Flow

Saha spor tesisleri yonetimi ve randevu sistemi SaaS platformu. Tenis kortlari, futbol sahalari, yuzme havuzlari ve diger spor tesisleri icin coklu tenant (cok musteri) mimarisi ile calisan, web ve mobil uygulamalariyla tam kapsamli bir cozum.

## Mimari Ozeti

```
┌──────────┐   ┌──────────┐   ┌──────────┐
│  Mobile  │   │   Web    │   │  Admin   │
│ Flutter  │   │ Next.js  │   │  Panel   │
└────┬─────┘   └────┬─────┘   └────┬─────┘
     │              │              │
     └──────────────┼──────────────┘
                    │ REST / WebSocket
              ┌─────▼──────┐
              │   Nginx    │  Reverse Proxy
              └─────┬──────┘
                    │
              ┌─────▼──────┐
              │ Spring Boot │  Java 21, Multi-Tenant
              │    API      │  JWT Auth, RBAC
              └─────┬──────┘
                    │
         ┌──────────┼───────────┐
         │          │           │
    ┌────▼───┐ ┌───▼────┐ ┌───▼────┐
    │  PostgreSQL │  Redis  │   S3   │
    │   + PostGIS │  Cache  │ Media  │
    └────────────┘ └────────┘ └────────┘
```

## Gereksinimler

| Bilesen          | Versiyon     | Not                           |
| ---------------- | ------------ | ----------------------------- |
| Java (JDK)       | 21           | Eclipse Temurin / Amazon Corretto |
| Node.js          | 20 LTS       | Frontend build                |
| npm              | 10+          | Paket yoneticisi              |
| Flutter          | 3.22+        | Mobil uygulama                |
| Dart             | 3.4+         | Flutter ile gelir             |
| Docker           | 24+          | Container runtime             |
| Docker Compose   | v2.20+       | Orkestrasyon                  |
| PostgreSQL       | 16           | Veritabani (PostGIS destegi)  |

## Kurulum

```bash
# 1. Repository'yi klonlayin
git clone <repo-url> saha-flow
cd saha-flow

# 2. Environment degiskenlerini kopyalayin
cp infra/.env.example infra/.env
# .env dosyasini kendi ortaminiza gore duzenleyin

# 3. Tum servisleri baslatin
cd infra
docker compose up -d

# 4. Servisleri kontrol edin
docker compose ps
# Backend:  http://localhost:8080/actuator/health
# Web:      http://localhost:3000
# Nginx:    http://localhost:80
```

## Environment Ayarlari

Tum environment degiskenleri `infra/.env.example` dosyasinda tanimlidir. Yerel gelistirme icin bu dosyayi `infra/.env` olarak kopyalayip degerleri guncelleyin.

Onemli degiskenler:
- `DB_*` - PostgreSQL baglanti bilgileri
- `JWT_SECRET` - JWT token imzalama anahtari (256-bit)
- `S3_*` - Dosya depolama (MinIO veya AWS S3)
- `CORS_ORIGINS` - Izin verilen frontend origin'leri

## Calistirma

### Tum servisler (Docker Compose)

```bash
cd infra
docker compose up -d
```

### Backend (ayri calistirma)

```bash
cd services/api
./gradlew bootRun
```

### Frontend (ayri calistirma)

```bash
cd web
npm install
npm run dev
```

### Mobil (ayri calistirma)

```bash
cd mobile
flutter pub get
flutter run
```

## Test

```bash
# Backend testleri
cd services/api
./gradlew test

# Web testleri
cd web
npm test

# Mobil testler
cd mobile
flutter test
```

## Migration (Flyway)

Flyway migration'lari backend baslatildiginda otomatik calisir. Migration dosyalari `services/api/src/main/resources/db/migration/` altindadir.

Manuel migration icin:
```bash
cd services/api
./gradlew flywayMigrate
```

## Docker Kullanimi

```bash
# Image build
docker build -f infra/Dockerfile.backend -t sahaflow-backend .
docker build -f infra/Dockerfile.web -t sahaflow-web .

# Tek servis calistirma
docker compose -f infra/docker-compose.yml up backend

# Log takibi
docker compose -f infra/docker-compose.yml logs -f

# Temizlik
docker compose -f infra/docker-compose.yml down -v
```

## Klasor Yapisi

```
saha-flow/
├── README.md
├── docs/
│   ├── ARCHITECTURE.md
│   ├── BOOTSTRAP_REPORT.md
│   ├── DEPLOYMENT.md
│   ├── LOCAL_DEVELOPMENT.md
│   ├── SECURITY.md
│   └── TESTING.md
├── infra/
│   ├── .env.example
│   ├── docker-compose.yml
│   ├── docker-compose.prod.yml
│   ├── Dockerfile.backend
│   ├── Dockerfile.web
│   ├── nginx/
│   │   └── nginx.conf
│   ├── postgres/
│   │   └── init.sql
│   └── ci/
│       └── github-actions.yml
├── services/
│   ├── api/                # Spring Boot backend
│   │   ├── src/
│   │   ├── build.gradle.kts
│   │   └── ...
│   └── ...                 # Diger mikroservisler (ileride)
├── web/                    # Next.js frontend
│   ├── src/
│   ├── package.json
│   └── ...
├── mobile/                 # Flutter mobil uygulama
│   ├── lib/
│   ├── pubspec.yaml
│   └── ...
├── buildSrc/               # Ortak Gradle konfigurasyonu
├── gradle/                 # Gradle wrapper
├── build.gradle.kts
├── settings.gradle.kts
└── gradle.properties
```

## Guvenlik Notlari

- **ASLA** `.env` dosyasini commit etmeyin (`infra/.env` `.gitignore`'da olmali).
- `docker-compose.yml` icindeki `development_only` parolasi **sadece yerel gelistirme** icindir.
- Production ortaminda tum secret'lar bir secret manager (HashiCorp Vault, AWS Secrets Manager, Azure Key Vault) uzerinden saglanmalidir.
- JWT token'lari icin en az 256-bit guvenli bir secret kullanin.
- Production'da HTTPS zorunlu olmalidir.
- Detayli guvenlik bilgileri icin: [docs/SECURITY.md](docs/SECURITY.md)

## Lisans

Proprietary - Tum haklari saklidir.

---

**Son guncelleme:** Temmuz 2026
