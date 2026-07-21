> Proje: İşAkış / > Doküman: Definition of Done / > Durum: Draft / > Üretim tarihi: 2026-07-21 / > Kaynak girdi: templates/01_PROJE_GIRDI_FORMU.yaml

# İşAkış — Definition of Done

Bu doküman, her kullanıcı hikâyesi, görev ve release için tamamlanmışlık kriterlerini tanımlar. "Done" ifadesi, aşağıdaki kategorilerdeki tüm ilgili maddelerin karşılanması anlamına gelir. Kategoriler her iş tipi için uyarlanabilir; örneğin salt altyapı işinde "kullanıcı kabul kriteri" aranmaz.

---

## 1. Ürün Kriterleri

1. Hikâyedeki tüm kabul kriterleri (Gherkin formatında yazılmış) karşılanmıştır.
2. Kullanıcı arayüzü, Figma'daki son tasarımla birebir eşleşir (±2px tolerans).
3. Tüm metinler, hata mesajları ve bildirimler Türkçe'dir; yabancı dil kalıntısı yoktur.
4. Boş durum (empty state), hata durumu (error state) ve yükleme durumu (loading state) için UI bileşenleri mevcuttur.
5. 403/404/500 gibi hata sayfaları kullanıcı dostu bir mesaj gösterir, ham stack trace göstermez.
6. Feature, en az bir product owner veya paydaş tarafından manuel olarak test edilmiş ve onaylanmıştır.
7. Tarayıcı geri/ileri butonları ve bookmark işlemleri beklendiği gibi çalışır.
8. Mobil uygulamada onboarding (ilk kullanım) akışı tanımlı ve test edilmiştir.

---

## 2. Kod Kriterleri

1. Kod, proje kod stiline uygundur: Checkstyle (backend), ESLint + Prettier (frontend), dart format + flutter_lints (mobil).
2. CI hattındaki tüm lint kontrol adımları hatasız geçmiştir; uyarı (warning) yoktur.
3. Tüm sınıflar, metotlar ve public API'ler ilgili dilin dokümantasyon standardına uygun yorumlanmıştır (Javadoc, JSDoc, DartDoc).
4. Sihirli sayı (magic number) ve sihirli string yoktur; tüm sabitler isimlendirilmiş sabitlerde veya enum'larda tanımlıdır.
5. Kod tekrarı (duplication) %3'ün altındadır; tespit edilen tekrarlar refactor edilmiştir.
6. Kullanılmayan import, değişken ve metot yoktur.
7. Dependency injection kullanılmıştır; `new` anahtar kelimesiyle manuel bağımlılık oluşturulmaz (Spring DI, provider/constructor injection).
8. Exception handling: catch bloğu boş bırakılmaz, hata loglanır ve kullanıcıya anlamlı mesaj döner.
9. Backend'de tüm controller metotları `@PreAuthorize` veya eşdeğer yetkilendirme anotasyonuna sahiptir.
10. Kod incelemesi (code review) en az bir diğer ekip üyesi tarafından yapılmış ve onaylanmıştır.

---

## 3. Test Kriterleri

1. Birim testleri (unit test): iş mantığı içeren tüm servis metotları için yazılmıştır; hedef coverage %80'dir.
2. Entegrasyon testleri: her API endpoint'i için en az bir başarılı (200/201), bir yetkilendirme hatası (403) ve bir validasyon hatası (400) senaryosu mevcuttur.
3. Tenant izolasyon testi: her endpoint için Tenant-A'nın Tenant-B'nin verisine erişemediği otomatik test ile kanıtlanmıştır.
4. Rol bazlı yetkilendirme testi: her endpoint için yetkisiz rolün 403 aldığı doğrulanmıştır.
5. Sınır değer testleri: maksimum/minimum uzunluk, null, boş string, negatif sayı, çok büyük sayı için test mevcuttur.
6. Veritabanı migration testi: her migration için ileri (migrate) ve geri (undo/rollback) adımları test edilmiştir.
7. Contract testi: frontend-backend arasındaki API sözleşmesi OpenAPI spec ile uyumludur; breaking change yoktur.
8. Mobil senkronizasyon testi: çevrimdışı yapılan değişikliğin bağlantı sonrası sunucuya doğru yansıdığı test edilmiştir.
9. End-to-end test: her epic'in ana akışı (happy path) en az bir kez otomatize edilmiştir (Cypress/Playwright veya Appium).
10. Tüm testler CI hattında başarıyla geçmiştir; kırık (flaky) test CI'ı bloke etmez, ayrı bir raporlama ile takip edilir.

---

## 4. Güvenlik Kriterleri

1. Statik kod analizi (SAST): SonarQube veya Semgrep taraması yapılmış; "Blocker" ve "Critical" seviyesinde açık yoktur.
2. Bağımlılık taraması (SCA): `npm audit`, `mvn dependency-check`, `flutter pub outdated` — bilinen CVE içeren paket yoktur.
3. Gizli anahtar (secret) taraması: Gitleaks veya truffleHog ile taranmış, commit'lerde secret bulunmamaktadır.
4. Container image taraması: Trivy veya Docker Scout ile taranmış, bilinen açık yoktur.
5. OWASP ASVS Level 2 kontrol listesindeki ilgili maddeler gözden geçirilmiş ve karşılanmıştır.
6. Tüm API yanıtlarında güvenlik başlıkları (CSP, X-Content-Type-Options, X-Frame-Options, Strict-Transport-Security) mevcuttur.
7. Kullanıcıdan alınan tüm girdiler (input) sunucu tarafında validate edilmiştir; sadece client-side validasyona güvenilmez.
8. SQL injection, XSS, CSRF saldırılarına karşı savunma katmanı mevcuttur (parametrik sorgu, output encoding, CSRF token).
9. Hassas veri (şifre, token, kimlik no) hiçbir log, hata mesajı veya API yanıtında görünmez.
10. Rate limiting: auth endpoint'leri ve dosya yükleme endpoint'leri için IP bazlı rate limit uygulanmıştır.

---

## 5. Veri ve Migration Kriterleri

1. Her veritabanı değişikliği Flyway migration dosyası ile yönetilir; manuel şema değişikliği yapılmaz.
2. Migration dosyası isimlendirmesi: `V{versiyon}__{aciklama}.sql` formatındadır (örn: `V1_0_1__add_device_serial_number.sql`).
3. Her migration'ın rollback senaryosu belgelenmiştir (`undo/` klasöründe veya migration yorum satırında).
4. Yeni eklenen her kolon için varsayılan değer (default value) tanımlanmıştır veya NOT NULL constraint yoktur.
5. Veritabanı indeksi: sorgu performansı kritik olan her kolon için uygun indeks oluşturulmuştur; EXPLAIN ANALYZE ile doğrulanmıştır.
6. JSONB kolonlar için GIN indeks, full-text search için GIN/GiST indeks, sıralama ve filtreleme için B-tree indeks kullanılır.
7. Tenant_id kolonu, tenant izolasyonu gerektiren tüm tablolarda mevcuttur ve NOT NULL'dur.
8. Kişisel veri içeren kolonlar belgelenmiştir; KVKK veri envanterine işlenmiştir.
9. Migration, staging ortamında önce çalıştırılmış ve başarılı olmuştur; production'a ancak staging onayı sonrası alınır.
10. Büyük tablolarda migration (ALTER TABLE) için lock süresi değerlendirilmiş, gerekiyorsa çevrimiçi şema değişikliği stratejisi belirlenmiştir.

---

## 6. Dokümantasyon Kriterleri

1. API endpoint'leri OpenAPI (Swagger) spec'te güncel olarak dokümante edilmiştir; örnek istek/yanıt mevcuttur.
2. Yeni eklenen her ortam değişkeni `.env.example` dosyasına eklenmiştir.
3. Mimari karar değişikliği varsa yeni ADR (Architecture Decision Record) oluşturulmuştur.
4. Veritabanı ER diyagramı güncellenmiştir (veya otomatik oluşturuluyorsa güncel hali repoya eklenmiştir).
5. README.md'de yerel geliştirme ortamı kurulum adımları günceldir.
6. Release notları (CHANGELOG.md) güncellenmiştir; breaking change varsa açıkça belirtilmiştir.
7. Kullanıcı dokümantasyonu (yardım merkezi) ilgili maddeleri güncellenmiştir (Pilot sonrası zorunlu).
8. Runbook'larda ilgili endpoint veya bileşen için yeni bir runbook gerekiyorsa eklenmiştir.

---

## 7. Gözlemlenebilirlik Kriterleri

1. Her yeni endpoint için request count, latency (p50/p95/p99) ve error rate metrikleri otomatik olarak toplanır (OpenTelemetry).
2. İş mantığı açısından kritik her işlem (iş emri oluşturma, durum değiştirme, atama) için özel business metric emit edilir.
3. Hata durumlarında (exception) trace context ile birlikte structured log (JSON format) atılır; hassas veri içermez.
4. Span/trace: dış servis çağrıları (e-posta, S3) için span oluşturulur; trace bütünlüğü korunur.
5. Audit log: kullanıcı tarafından yapılan her veri değişikliği (CREATE, UPDATE, DELETE) audit_log tablosuna kaydedilir.
6. Mobil uygulamada crash reporting (Firebase Crashlytics veya Sentry) entegredir; hata raporları tenant bilgisi olmadan gönderilir.
7. Frontend'de kullanıcı etkileşim hataları (butona tıklayıp hata alma) Sentry/RUM ile yakalanır.
8. Alert: tanımlı SLO'ları aşan durumlar için alarm kuralları Grafana/Prometheus'ta tanımlanmıştır.
9. Health check endpoint'i (`/actuator/health`) tüm kritik bağımlılıkları (DB, S3) kontrol eder.
10. Mobil senkronizasyon başarı/başarısızlık oranı metrik olarak toplanır.

---

## 8. Operasyon Kriterleri

1. Feature flag arkasında açılıp kapatılabilme: kullanıcıya doğrudan etki eden her yeni özellik bir feature flag arkasındadır.
2. Deployment rollback planı: geri dönüşü olan ve olmayan değişiklikler ayrıştırılmıştır; rollback adımları release notunda belirtilmiştir.
3. Migration rollback planı: migration'ın geri alınabilir olup olmadığı, değilse roll-forward stratejisi belirtilmiştir.
4. Database migration ve uygulama deploy'u ayrı aşamalardır; önce migration, sonra deploy yapılır.
5. Production ortamında tüm kritik konfigürasyon değerleri secret manager veya environment variable üzerinden gelir; hard-coded değer yoktur.
6. Backup: veritabanı yedekleme sıklığı ve retention süresi belgelenmiştir; yeni tablo eklenirse backup kapsamına alındığı teyit edilmiştir.
7. Dosya/Object storage: lifecycle policy tanımlanmıştır; silinme/arşivleme kuralları belgelenmiştir.
8. Rate limit ve circuit breaker: dış servis çağrılarında timeout ve retry stratejisi tanımlanmıştır.

---

## 9. Release Kriterleri

1. Tüm otomatik testler (birim, entegrasyon, contract, E2E) CI hattında başarıyla geçmiştir.
2. SAST, SCA ve container scanning adımları CI'da başarıyla geçmiştir; yeni açık eklenmemiştir.
3. Staging ortamında en az 24 saat süreyle çalışmış, kritik bir hata (P0/P1) alınmamıştır.
4. Pilot müşteri(ler) için regression test manuel olarak yapılmış ve onaylanmıştır.
5. Release notları (CHANGELOG.md) yazılmış, breaking change varsa vurgulanmıştır.
6. Database migration önce staging'de, sonra production'da başarıyla çalıştırılmıştır.
7. Health check'ler production sonrası yeşil durumdadır.
8. Rollback planı gözden geçirilmiş ve ekip tarafından onaylanmıştır.
9. Production sonrası ilk 1 saat boyunca hata oranı, latency ve iş emri throughput izlenmiştir.
10. Release, iş saatleri içinde ve en az 2 ekip üyesinin müsait olduğu zamanda yapılmıştır.

---

## 10. DoD Kontrol Listesi (İş Tipine Göre Uyarlama)

| İş Tipi | Geçerli DoD Kategorileri |
|---|---|
| Backend API geliştirme | Ürün (1,5,6), Kod (tümü), Test (1-7,10), Güvenlik (tümü), Veri (1-9), Gözlemlenebilirlik (1-6,10), Dokümantasyon (1-4,6), Operasyon (1-6) |
| Frontend UI geliştirme | Ürün (tümü), Kod (1-7,10), Test (1,7,9,10), Güvenlik (1-4,6,7), Gözlemlenebilirlik (7), Dokümantasyon (6,7) |
| Mobil geliştirme | Ürün (tümü, özellikle 8), Kod (1-7,10), Test (1,8-10), Güvenlik (1-4,9), Gözlemlenebilirlik (6,10), Dokümantasyon (6) |
| Altyapı/DevOps | Kod (1,2,6), Test (6,10), Güvenlik (1-4,8), Veri (5,9,10), Gözlemlenebilirlik (9), Operasyon (tümü), Release (tümü), Dokümantasyon (2,5,8) |
| Dokümantasyon | Dokümantasyon (tümü) |
| Tasarım (UI/UX) | Ürün (2,8), Dokümantasyon (8) |

---

## Karar Bekleyen Konular

1. Birim test coverage hedefi %80 yeterli mi, yoksa %90'a çıkarılmalı mı? → MVP sonrası değerlendirilecek.
2. E2E test framework'u: Cypress mi Playwright mı? → Playwright daha hızlı ve mobile web desteği daha iyi, ancak ekip deneyimine göre karar verilecek.
3. SAST aracı: SonarQube Community yeterli mi, yoksa SonarCloud/Snyk'e geçilmeli mi? → Community ile başlanır.
4. Container scanning CI'a her commit'te mi yoksa sadece release öncesi mi? → Release öncesi yeterli, her commit'te süreyi uzatır.
5. Mobil E2E testi (Appium/Patrol) MVP'de zorunlu mu? → MVP'de manuel test yeterli, V1'de otomasyon eklenir.

## İlgili Dokümanlar

- `15_ROADMAP_BACKLOG_DOD.md` — Şablon
- `16_ROADMAP_BACKLOG.md` — Roadmap ve Backlog
- `10_SECURE_SDLC_CICD.md` — Secure SDLC ve CI/CD
- `11_TEST_STRATEJISI.md` — Test stratejisi
- `12_DEVOPS_GOZLEMLENEBILIRLIK_DR.md` — DevOps ve gözlemlenebilirlik
- `18_OPERATIONS_RUNBOOK.md` — Operasyon runbook'u
