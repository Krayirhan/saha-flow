# Yerel Gelistirme Kilavuzu

## On Gereksinimler

| Arac            | Minimum Versiyon | Nasil Kontrol Edilir          |
| --------------- | ---------------- | ----------------------------- |
| Java JDK        | 21               | `java -version`               |
| Node.js         | 20 LTS           | `node -v`                     |
| npm             | 10+              | `npm -v`                      |
| Flutter         | 3.22.x           | `flutter --version`           |
| Docker          | 24+              | `docker --version`            |
| Docker Compose  | v2.20+           | `docker compose version`      |
| Git             | 2.40+            | `git --version`               |
| IntelliJ IDEA   | 2024.1+          | (oneri, Community yeterli)    |
| VS Code         | Son surum        | (oneri, web/mobil icin)       |

## Repository Klonlama

```bash
git clone <repo-url> saha-flow
cd saha-flow
```

## Backend (Spring Boot)

### 1. IDE'de Acma (IntelliJ IDEA)

- File > Open > `saasprojesablon/saha-flow` dizinini secin.
- IntelliJ Gradle projesini otomatik algilayip import edecektir.
- Gradle sync'in tamamlanmasini bekleyin.

### 2. Gradle Import

```bash
cd services/api
./gradlew build -x test
```

Gradle wrapper tum bagimliliklari indirecektir.

### 3. application-dev.yml

`services/api/src/main/resources/application-dev.yml` dosyasinda yerel PostgreSQL ayarlari oldugundan emin olun:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/sahaflow
    username: sahaflow
    password: development_only
  flyway:
    enabled: true
    locations: classpath:db/migration
```

### 4. PostgreSQL Baslatma

Docker ile en kolay yol:

```bash
cd infra
docker compose up -d postgres
```

PostgreSQL'in hazir oldugunu kontrol edin:
```bash
docker compose ps postgres
# postgres-1   /usr/local/bin/docker-...   Up   0.0.0.0:5432->5432/tcp
```

### 5. Flyway Migration

Backend baslatildiginda Flyway otomatik calisir. Manuel tetiklemek icin:

```bash
cd services/api
./gradlew flywayMigrate -Dflyway.url=jdbc:postgresql://localhost:5432/sahaflow \
                        -Dflyway.user=sahaflow \
                        -Dflyway.password=development_only
```

### 6. Backend Calistirma

```bash
cd services/api
./gradlew bootRun
```

Backend `http://localhost:8080` adresinde baslayacaktir. Health check: `http://localhost:8080/actuator/health`

### 7. Debug

IntelliJ'de:
- Run > Edit Configurations > Remote JVM Debug
- `./gradlew bootRun --debug-jvm` ile baslat
- Varsayilan port: 5005

```bash
cd services/api
./gradlew bootRun --debug-jvm
```

## Frontend (Next.js)

### 1. Bagimliliklari Yukleme

```bash
cd web
npm install
```

### 2. .env.local Olusturma

```bash
cp infra/.env.example web/.env.local
```

`web/.env.local` icerigini duzenleyin:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_MAPBOX_TOKEN=placeholder-mapbox-token
```

### 3. Gelistirme Sunucusu

```bash
cd web
npm run dev
```

Tarayicida: `http://localhost:3000`

Bir sonraki degisikliklerde hot-reload otomatik calisir.

### 4. Production Build (test icin)

```bash
cd web
npm run build
npm start
```

## Mobil (Flutter)

### 1. Bagimliliklari Yukleme

```bash
cd mobile
flutter pub get
```

### 2. Emulator / Cihaz

- Android Emulator: Android Studio > AVD Manager'dan baslatin
- iOS Simulator (macOS): `open -a Simulator`
- Fiziksel cihaz: USB ile baglayip `flutter devices` ile goruntuleyin

### 3. Calistirma

```bash
cd mobile
flutter run
```

### 4. API URL Ayari

Emulator'den localhost'a baglanmak icin:
- Android Emulator: `http://10.0.2.2:8080/api`
- iOS Simulator: `http://localhost:8080/api`

`mobile/lib/core/config/app_config.dart` dosyasinda ilgili ayari guncelleyin.

## Docker Compose ile Tum Servisler

En hizli yol:

```bash
cd infra
docker compose up -d
```

Bu komut asagidakileri baslatir:
- PostgreSQL (port 5432)
- Backend (port 8080)
- Web (port 3000)
- Nginx (port 80)

Tumunu durdurmak icin:
```bash
docker compose down
```

Veritabanini da sifirlamak icin:
```bash
docker compose down -v
```

## Test Calistirma

### Backend

```bash
cd services/api
./gradlew test                    # Tum testler
./gradlew test --tests "com.sahaflow.*"  # Paket filtreli
```

Test raporlari: `services/api/build/reports/tests/`

### Web

```bash
cd web
npm test                          # Vitest watch mode
npm test -- --coverage             # Coverage ile
npm test -- -t "LoginPage"        # Belirli test
```

Coverage raporlari: `web/coverage/`

### Mobil

```bash
cd mobile
flutter test                      # Tum testler
flutter test --coverage            # Coverage ile
flutter test test/widget/field_booking_widget_test.dart  # Belirli test
```

## Veritabani Sifirlama

Docker ile:
```bash
cd infra
docker compose down -v postgres
docker compose up -d postgres
# Backend'i yeniden baslat veya Flyway'i manuel calistir
```

Manuel (yerel PostgreSQL):
```bash
psql -h localhost -U sahaflow -d postgres -c "DROP DATABASE sahaflow;"
psql -h localhost -U sahaflow -d postgres -c "CREATE DATABASE sahaflow;"
cd services/api && ./gradlew flywayMigrate
```

## Yaygin Sorunlar

### PostgreSQL baglanamiyor (Connection refused)
- Docker Compose ile PostgreSQL'in calistigindan emin olun: `docker compose ps`
- 5432 portunun baska bir uygulama tarafindan kullanilmadigini kontrol edin

### Flyway migration hatasi
- `flyway_schema_history` tablosu uyumsuz olabilir. Veritabanini sifirlayip tekrar deneyin.

### Gradle build uzun suruyor
- `./gradlew build --no-daemon --parallel` ile paralel build kullanin
- Gradle daemon'i temizleyin: `./gradlew --stop`

### npm install hatasi
- `rm -rf node_modules package-lock.json && npm install`
- Node.js versiyonunun 20 oldugundan emin olun

### Flutter build hatasi
- `flutter clean && flutter pub get`
- `flutter doctor` ile ortam kontrolu yapin

## Kullanisli Komutlar

```bash
# Backend log'lari
docker compose logs -f backend

# Veritabanina bash baglantisi
docker compose exec postgres psql -U sahaflow -d sahaflow

# Gradle proje listeleme
./gradlew projects

# npm paket guncellemesi
cd web && npm outdated

# Flutter analiz
cd mobile && flutter analyze

# Docker temizlik
docker system prune -a --volumes  # DIKKAT: Tum containerlari siler!
```
