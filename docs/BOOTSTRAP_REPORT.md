# İşAkış - Proje Bootstrap Raporu

## Proje Olusturma Bilgisi

| Bilgi                 | Deger                                         |
| --------------------- | --------------------------------------------- |
| Olusturma Tarihi      | 21 Temmuz 2026                                |
| Proje Kodu            | `saha-flow`                                   |
| Proje Dizini          | `D:\saasprojesablon\generated\saha-flow`      |
| Bootstrap Yontemi     | AI-assisted code generation (infra + docs)    |
| Mevcut Faz            | **Altyapi + Dokumantasyon**                   |

## Kullanilan Teknolojiler

| Kategori               | Teknoloji                          | Versiyon |
| ---------------------- | ---------------------------------- | -------- |
| Backend Framework      | Spring Boot                        | 3.4      |
| Backend Dil            | Java / Kotlin                      | 21 / 2.0 |
| Build Tool             | Gradle (Kotlin DSL)                | 8.x      |
| Web Framework          | Next.js (App Router)               | 14       |
| Mobil Framework        | Flutter                            | 3.22     |
| Veritabani             | PostgreSQL + PostGIS                | 16       |
| Container              | Docker                             | 24+      |
| Reverse Proxy          | Nginx                              | 1.27     |
| CI/CD                  | GitHub Actions                     | -        |
| Secret Yonetimi (prod) | HashiCorp Vault                    | -        |
| Monitoring             | Prometheus + Grafana + Loki        | -        |

## Uretilen Dosyalar

| #  | Dosya                                               | Tur             |
| -- | --------------------------------------------------- | ---------------- |
| 1  | `README.md`                                         | Dokumantasyon    |
| 2  | `infra/docker-compose.yml`                          | Infrastructure   |
| 3  | `infra/docker-compose.prod.yml`                     | Infrastructure   |
| 4  | `infra/Dockerfile.backend`                          | Infrastructure   |
| 5  | `infra/Dockerfile.web`                              | Infrastructure   |
| 6  | `infra/.env.example`                                | Infrastructure   |
| 7  | `infra/nginx/nginx.conf`                            | Infrastructure   |
| 8  | `infra/postgres/init.sql`                           | Infrastructure   |
| 9  | `infra/ci/github-actions.yml`                       | Infrastructure   |
| 10 | `docs/LOCAL_DEVELOPMENT.md`                         | Dokumantasyon    |
| 11 | `docs/ARCHITECTURE.md`                              | Dokumantasyon    |
| 12 | `docs/SECURITY.md`                                  | Dokumantasyon    |
| 13 | `docs/TESTING.md`                                   | Dokumantasyon    |
| 14 | `docs/DEPLOYMENT.md`                                | Dokumantasyon    |
| 15 | `docs/BOOTSTRAP_REPORT.md`                          | Dokumantasyon    |

**Toplam:** 15 dosya (9 infrastructure, 6 documentation)

## Bilinen Eksikler

| #  | Eksik                                   | Oncelik | Not                                                  |
| -- | --------------------------------------- | ------- | ---------------------------------------------------- |
| 1  | `.gitignore` dosyasi                    | Yuksek  | Proje olusturulurken eklenmeli                       |
| 2  | `services/api/` - Backend kaynak kodu   | Yuksek  | Bir sonraki fazda gelistirilecek                     |
| 3  | `web/` - Frontend kaynak kodu           | Yuksek  | Bir sonraki fazda gelistirilecek                     |
| 4  | `mobile/` - Flutter kaynak kodu         | Yuksek  | Bir sonraki fazda gelistirilecek                     |
| 5  | `buildSrc/` - Gradle Convention Plugins | Orta    | Kod uretiminde otomatik                              |
| 6  | `gradle/` - Gradle Wrapper              | Orta    | `gradle wrapper` ile olusturulmali                   |
| 7  | `build.gradle.kts` - Root build         | Orta    | Backend olusturmaya bagli                            |
| 8  | `settings.gradle.kts`                   | Orta    | Backend olusturmaya bagli                            |
| 9  | `gradle.properties`                     | Orta    | JVM/Gradle ayarlari                                  |
| 10 | Kubernetes manifest'leri                | Orta    | Production deployment icin gerekli                   |
| 11 | Terraform / Pulumi IaC                  | Dusuk   | Infrastructure as Code (opsiyonel)                   |
| 12 | `.gitleaks.toml`                        | Dusuk   | Gitleaks konfigurasyonu                              |
| 13 | Code of Conduct, Contributing guide     | Dusuk   | Open source degilse gerekli degil                    |

## Sonraki Adimlar

### Faz 1: Temel Backend (oncelikli)

1. Root Gradle projesi olustur (`build.gradle.kts`, `settings.gradle.kts`, `gradle.properties`)
2. `buildSrc/` convention plugins olustur
3. `services/api/` Spring Boot projesi iskelet:
   - `Application.kt` - main class
   - Security konfigurasyonu (JWT)
   - Tenant context resolver
   - Flyway migration (V1: temel tablolar)
   - `application.yml`, `application-dev.yml`, `application-prod.yml`
4. Temel domain entity'leri (Tenant, User, Role)
5. CI'da acilan PR'a gore test'lerin gecmesi

### Faz 2: Web Frontend

1. `web/` Next.js projesi iskelet (`create-next-app` veya template)
2. Login/kayit sayfalari
3. Dashboard, booking akisi
4. API client (`web/src/lib/api/`)

### Faz 3: Mobil

1. `mobile/` Flutter projesi iskelet (`flutter create`)
2. Login/kayit ekranlari
3. Booking, kort secimi
4. API client

### Faz 4: CI/CD ve Deployment

1. `.gitignore` olustur
2. GitHub Actions workflow'unu test et
3. `.gitleaks.toml` konfigurasyonu
4. Test ortamina deployment
5. Production deployment checklist

## Notlar

- Tum dosyalardaki parolalar ve secret'lar **placeholder** degerlerdir. Gercek ortamda degistirilmelidir.
- `docker-compose.yml` icindeki `development_only` sifresi sadece yerel gelistirme icindir.
- Guvenlik kontrolleri ve hardening production ortaminda tamamlanmalidir.
- Flyway migration'lari geriye donuk uyumlu (backward-compatible) yazilmalidir.
- Coklu tenant yapisinda her sorgunun `tenant_id` filtrelemesi yaptigindan emin olun.
