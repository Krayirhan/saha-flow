# Mimari Karar Kayitlari (ADR)

> Proje: İşAkış
> Dokuman: Mimari Karar Kayitlari (Architecture Decision Records - ADR)
> Durum: Draft
> Uretim tarihi: 2026-07-21
> Kaynak girdi: templates/01_PROJE_GIRDI_FORMU.yaml

---

## ADR-001: Moduler Monolit Mimarisi (Spring Boot)

| Alan | Deger |
|---|---|
| **ID** | ADR-001 |
| **Baslik** | Backend icin Moduler Monolit mimarisi kullanimi |
| **Durum** | Accepted |
| **Tarih** | 2026-06-01 |

### Baglam

2 kisilik bir ekiple SaaS gelistiriyoruz. Mikroservis mimarisi; dagitik transaction, eventual consistency, servis kesfi, API gateway karmasikligi getirir. Ancak ileride bazi modullerin (ornegin bildirim servisi, raporlama) bagimsiz olceklenmesi gerekebilir.

### Karar

Backend, Spring Boot uzerinde **moduler monolit** olarak insa edilecek. Her domain modulu (workorder, customer, invoice, auth, notification) ayri Maven modulu / Java paketi olarak organize edilecek ancak ayni process'te calisacak ve ayni veri tabanini paylasacak.

Paket yapisi:
```
com.sahaflow
├── workorder
├── customer
├── invoice
├── auth
├── notification
├── file
├── webhook
└── common (shared DTOs, exceptions, utilities)
```

### Alternatifler

| Alternatif | Degerlendirme |
|---|---|
| **Tam mikroservis** | Ekip buyuklugu (2 kisi) ve MVP hizi icin uygun degil. Operasyonel karmasiklik cok yuksek. Dagitik transaction yonetimi, circuit breaker, service mesh ek maliyet. |
| **Serverless / FaaS** | Soguk baslangic (cold start) suresi saha uygulamasi icin kabul edilemez. Uzun suren is emri islemleri icin timeout riski. Vendor lock-in. |
| **Tek bir buyuk servis (big ball of mud)** | Moduler yapidan daha kotu; domain'ler arasi bagimlilik yonetimi zor. Kod kalitesi ve maintainability duser. |

### Gerekce

- Moduler monolit: Gelistirme hizi yuksek, operasyonel karmasiklik dusuk, debug kolay
- Paket bazli ayrim sayesinde ileride bir modulun bagimsiz servise ayrilmasi (strangler fig pattern) mumkun
- Transaction yonetimi ACID (tek veri tabani) — is emri olusturma + outbox event ayni transaction'da
- 2 kisilik ekip icin monorepo + moduler monolit dogal uyum

### Olumlu Sonuclar

- Hizli gelistirme ve debug
- Tek transaction ile veri tutarliligi
- Tek deployment artifakti, basit CI/CD
- Dusuk operasyonel maliyet (tek container)

### Olumsuz Sonuclar

- Moduller arasi siki bagimlilik (tight coupling) riski; bunu onlemek icin paket bazli arayuz sozlesmeleri (interface) sart
- Bagimsiz olcekleme mumkun degil; yuksek yuk altinda butun moduller etkilenir
- Bir moduldeki bellek sizintisi tum sistemi etkiler
- Tek veri tabani dar bogaz olabilir

### Guvenlik Etkisi

- Moduller arasi cagrilar ayni JVM'de oldugu icin ag saldirisi riski yok
- Tenant izolasyon filtresi tek noktada uygulanir (guvenlik kontrolu basit ve tutarli)
- Bir moduldeki guvenlik acigi tum modullere erisim saglayabilir; input validation ve RBAC kontrolleri her modulde bagimsiz uygulanmali

### Operasyon / Maliyet Etkisi

- Tek deployment, tek container, dusuk kaynak tuketimi
- Tek veri tabani, tek backup stratejisi
- Aylik altyapi maliyeti ~$60-170

### Dogrulama

- Her domain modulu icin unit ve integration testler mevcut
- Paket bagimlilik grafiginde dairesel bagimlilik (cyclic dependency) yok (ArchUnit testi ile kontrol)
- Kod review sirasinda domain disina tasan bagimliliklar kontrol edilir

### Yeniden Degerlendirme Tetikleyicisi

- 100'den fazla tenant veya 500+ eszamanli kullanici
- Belirli bir modul digerlerinden bagimsiz olcekleme ihtiyaci (ornegin raporlama modulu agir sorgular uretiyor ve API'yi yavaslatiyor)
- Ekip buyuklugu 5+ kisiye ciktiginda (paralel gelistirme ihtiyaci)

---

## ADR-002: Shared Database / Shared Schema (Coklu Tenant)

| Alan | Deger |
|---|---|
| **ID** | ADR-002 |
| **Baslik** | Coklu tenant icin shared database / shared schema yaklasimi |
| **Durum** | Accepted |
| **Tarih** | 2026-06-05 |

### Baglam

SaaS uygulamasi birden fazla teknik servis firmasina (tenant) hizmet verecek. Her tenant'in verisi digerlerinden izole olmali. MVCC (PostgreSQL) sayesinde satir seviyesi izolasyon mumkun. Veri tabani yonetimini basit tutmak ve maliyeti dusurmek oncelikli.

Dusuk butce ile 2 kisi yonetim yapacak. Ayri veri tabani/sema yonetimi operasyonel yuk getirir. 5-50 teknisyenli kucuk firmalar hedef kitle; tenant basina veri hacmi dusuk.

### Karar

**Shared database / shared schema** yaklasimi kullanilacak. Tum tenant'lar ayni PostgreSQL veri tabaninda, ayni semada, `tenant_id` (UUID) kolonu ile satir seviyesinde izole edilecek. Her sorguda `WHERE tenant_id = ?` zorunlu.

### Alternatifler

| Alternatif | Degerlendirme |
|---|---|
| **Database per tenant** | Guvenlik izolasyonu en yuksek seviyede ancak 100+ tenant oldugunda 100+ veri tabani yonetimi, backup, migration kaotik. Flyway migration her DB'de ayri calismali. 2 kisilik ekip icin uygulanamaz. Maliyet yuksek. |
| **Schema per tenant** | Veri tabani basina schema, PostgreSQL'de `search_path` ile izolasyon. Database per tenant'a gore daha yonetilebilir ancak migration her semada, connection pooling karmaşik, cross-tenant raporlama UNION ile mumkun (yavas). |
| **Hybrid (kritik tenant'lar ayri)** | Ilk asamada gereksiz karmasiklik. Butun tenant'lar ayni oneme sahip. |

### Gerekce

- Tek database, tek backup, tek migration -> dusuk operasyonel yuk
- PostgreSQL MVCC ve row-level security ile yeterli izolasyon saglanir
- Mevcut ekip buyuklugu (2 kisi) icin tek yonetilebilir cozum
- `tenant_id` bazli izolasyon uygulama seviyesinde kolayca test edilebilir

### Olumlu Sonuclar

- Basit veri tabani yonetimi
- Tek connection pool, etkin kaynak kullanimi
- Cross-tenant raporlama (İşAkış'a ozgu degil ama admin paneli icin kolay)
- Backup ve PITR tek noktada

### Olumsuz Sonuclar

- Bir tenant'in veri tabani yukunun digerlerini etkilemesi (noisy neighbor)
- `WHERE tenant_id = ?` unutulursa veri sizintisi — bunu onlemek icin JPA filter (`@Filter`) ve Spring interceptor ile zorunlu hale getirilmeli
- Butun tenant'lar etkilenmeden tek tenant'in verisini silmek/geri yuklemek daha zor
- Veri tabani boyutu buyudukce indeksleme ve sorgu performansi etkilenebilir

### Guvenlik Etkisi

- **Kritik:** `tenant_id` filtresinin her sorguda uygulandigindan emin olmak icin cift katmanli kontrol: JPA `@Filter` + Spring Security `@TenantFiltered` annotation + AOP
- pgAudit ile tum SQL sorgulari denetlenir
- Row-Level Security (RLS) ek katman olarak devreye alinabilir

### Operasyon / Maliyet Etkisi

- Tek veri tabani, dusuk maliyet
- DB boyutu zamanla artar; partition pruning ve archiving stratejisi gerekir
- Indeks yonetimi tek noktada

### Dogrulama

- `TenantIsolationIntegrationTest` ile her varlik icin tenant atlamasi testi
- ArchUnit testi: Tum repository metodlarinda `@TenantFiltered` veya `WHERE tenant_id` varligi kontrolu
- Kod review sirasinda yeni repository metodlari manuel kontrol

### Yeniden Degerlendirme Tetikleyicisi

- 100'den fazla tenant veya herhangi bir tenant'in 100GB+ veriye ulasmasi
- Bir tenant'in surekli olarak digerlerini etkileyen bir noisy neighbor haline gelmesi
- Guvenlik denetiminde shared schema'nin kabul edilemez bulunmasi

---

## ADR-003: Next.js BFF (Backend for Frontend) ve Cookie Tabanli Oturum

| Alan | Deger |
|---|---|
| **ID** | ADR-003 |
| **Baslik** | Next.js'in BFF olarak kullanilmasi ve cookie tabanli oturum yonetimi |
| **Durum** | Accepted |
| **Tarih** | 2026-06-10 |

### Baglam

Web arayuzunden (Next.js) Spring Boot API'ye dogrudan tarayicidan cagri yapilmasi; token saklama (localStorage XSS riski), CORS karmasikligi, ve API URL'inin client'ta gorunmesi gibi sorunlar dogurur. Ayrica Next.js server-side rendering (SSR) icin API'ye sunucu tarafindan erisim gereklidir.

### Karar

**Next.js, BFF (Backend for Frontend)** olarak kullanilacak. Tarayici ile Next.js arasinda `HttpOnly, Secure, SameSite=Strict` cookie ile oturum yonetilecek. Next.js server-side, Spring Boot API'ye JWT token ile istek yapacak.

```
Tarayici --(HttpOnly Cookie)--> Next.js Server --(JWT Bearer)--> Spring Boot API
```

### Alternatifler

| Alternatif | Degerlendirme |
|---|---|
| **SPA + localStorage JWT** | localStorage XSS'e karsi savunmasiz. `HttpOnly` cookie'in sagladigi korumayi saglamaz. CSR (Client-Side Rendering) SEO sorunu. Next.js'in SSR yeteneginden faydalanilamaz. |
| **Dogrudan tarayici -> API (JWT header)** | API URL'i client'ta gorunur. CORS yonetimi karmasik. Token yonetimi guvensiz (XSS). KVKK uyumluluk riski. |
| **NextAuth.js / Auth.js** | Ucuncu parti bagimlilik. Ihtiyac fazlasi ozellikler. Kendi auth implementasyonumuz daha kontrol edilebilir. |

### Gerekce

- HttpOnly cookie XSS ile token calinmasini engeller
- Next.js SSR, ISR (Incremental Static Regeneration) API verisini sunucu tarafinda alabilir
- Backend API URL'i client'a ifsa edilmez
- Token yenileme (refresh) sunucu tarafinda seffaf yonetilir
- KVKK ve guvenlik denetimlerinde cookie guvenligi artisi

### Olumlu Sonuclar

- Token XSS'ten korunmus olur
- SSR/ISR destegi ile daha hizli sayfa yukleme
- API URL gizli kalir, ek guvenlik katmani
- Merkezi oturum yonetimi

### Olumsuz Sonuclar

- Next.js server durum tutmaya baslar (stateful) — scaling dikey olur
- Next.js sunucusu ve Spring Boot arasinda ek ag gecikmesi
- Cookie-based CSRF riski — SameSite=Strict ve CSRF token ile onlenmeli
- Mobil uygulama farkli auth akisi kullanmak zorunda (cookie yerine direkt JWT)

### Guvenlik Etkisi

- Cookie: `HttpOnly=true; Secure=true; SameSite=Strict; Path=/; Max-Age=900` (15dk)
- Refresh token ayri cookie'de, sadece `/api/auth/refresh` path'inde gecerli
- CSRF token cift-submit cookie pattern ile koruma
- Cookie'lerdeki hassas veri sifreli

### Operasyon / Maliyet Etkisi

- Next.js sunucu kaynagi: Session verisi Redis'te, yatay olcekleme mumkun (sticky session gerekmez)
- Ek ag gecikmesi (Next.js -> API): ic agda < 5ms
- Redis bellek kullanimi artar

### Dogrulama

- E2E test: Cookie flag'leri `HttpOnly, Secure, SameSite` dogrulamasi (Playwright)
- Integration test: Cookie olmadan API istegi -> 401
- OWASP ZAP ile cookie guvenlik taramasi

### Yeniden Degerlendirme Tetikleyicisi

- Next.js server olceklenmesi gerektiginde (1000+ eszamanli kullanici)
- Mobil web (PWA) destegi gelirse cookie yerine alternatif auth mekanizmasi
- Next.js sunucu tarafi BFF yuku performans sorunu yaratirsa

---

## ADR-004: Flutter Offline-First Mimarisi

| Alan | Deger |
|---|---|
| **ID** | ADR-004 |
| **Baslik** | Flutter mobil uygulamasinda offline-first mimari kullanimi |
| **Durum** | Accepted |
| **Tarih** | 2026-06-12 |

### Baglam

Teknisyenler sahada calisirken internet baglantisi kesintili veya hic olmayabilir (bodrum kat, kirsal bolge, metro). Is emirlerini goruntuleme, durum guncelleme, fotograf cekme gibi temel islemler cevrimdisi calismalidir. Baglanti geldiginde veri senkronize olmalidir.

### Karar

Mobil uygulama **offline-first** mimari ile gelistirilecek. Veriler once yerel SQLite veri tabanina yazilacak, ardindan arka planda API ile senkronize edilecek. UI her zaman yerel veri tabanindan okuyacak.

Mimari:
```
UI (BLoC) -> Repository -> [Local DB (SQLite/sqlcipher)] + [Remote API Sync]
```

### Alternatifler

| Alternatif | Degerlendirme |
|---|---|
| **Online-first (cache destekli)** | Saha kosullarinda internet kesintisi temel bir durum. Online-first yaklasimda kullanici deneyimi kotu etkilenir, is emri tamamlanamaz. |
| **PWA (Progressive Web App)** | Web teknolojileri ile offline calisma mumkun ancak Service Worker ve IndexedDB Flutter'a gore daha sinirli. Native cihaz erisimi (GPS, kamera, parmak izi) eksik. |
| **React Native** | Ekipte Flutter deneyimi var. |

### Gerekce

- Saha kosullarinda internet baglantisi guvenilir degil
- Offline calisabilme islevsel bir gereklilik (musteri beklentisi)
- Flutter'in `sqflite` / `drift` paketleri ile guclu local DB destegi
- Repository pattern ile online/offline soyutlamasi kolay

### Olumlu Sonuclar

- Internet baglantisi olmasa da teknisyen ise devam edebilir
- Hizli UI (veri her zaman local'den okunur)
- Veri kullanimi azalir (surekli API sorgusu yok)

### Olumsuz Sonuclar

- Sync cakismasi (conflict) yonetimi karmasik: son yazan kazanir (last-write-wins) veya manuel merge
- Mobil cihazda hassas veri saklanmasi — sifreleme zorunlu (sqlcipher)
- Veri tabani semasi mobil ve backend arasinda tutarli tutulmali
- Offline verinin bayatlama riski (stale data)

### Guvenlik Etkisi

- SQLite veri tabani `sqlcipher` ile sifrelenir (AES-256)
- flutter_secure_storage ile hassas token/key saklanir
- Cihaz root/jailbreak tespiti yapilir, tespit edilirse uygulama calismaz veya veri silinir
- 15 dakika inaktivite sonrasi uygulama otomatik kilitlenir
- Uzaktan veri silme komutu desteklenir

### Operasyon / Maliyet Etkisi

- Sync servisi backend'de ek endpoint'ler ve transactional outbox ile yonetilir
- Mobil cihazda depolama alani kullanilir (SQLite ~50-100MB tahmini)
- Gelistirme suresi uzar (sync mantigi + conflict resolution)

### Dogrulama

- Offline mod testi: Wifi kapatilir, is emri durumu guncellenir, wifi acilinca backend'de guncellendigi dogrulanir
- Conflict testi: Ayni is emri hem web'den hem mobil'den guncellenir, conflict resolution dogrulanir
- sqlcipher sifreleme testi: SQLite dosyasi cikarilir, sifresiz acilamadigi dogrulanir

### Yeniden Degerlendirme Tetikleyicisi

- Sync cakismalari sik ve sorunlu hale gelirse CRDT (Conflict-Free Replicated Data Type) degerlendirilir
- Flutter'in resmi sync framework'u cikarsa (Firebase Data Connect gibi)
- Ag baglantisi iyilesir ve musteri offline-first ihtiyaci azalirsa

---

## ADR-005: PostgreSQL + PostGIS Veri Tabani Secimi

| Alan | Deger |
|---|---|
| **ID** | ADR-005 |
| **Baslik** | PostgreSQL 15 + PostGIS 3.4 veri tabani kullanimi |
| **Durum** | Accepted |
| **Tarih** | 2026-06-15 |

### Baglam

Saha servis uygulamasi konum tabanli sorgulara ihtiyac duyar: belirli bir konuma en yakin teknisyeni bulma, rota planlamasi, servis bolgesi tanimi. Ayrica coklu tenant izolasyonu, JSONB ile esnek veri saklama, guclu indexing gereklidir.

### Karar

**PostgreSQL 15 + PostGIS 3.4** uzantisi kullanilacak. Docker uzerinde `postgis/postgis:15-3.4` imaji ile self-hosted calistirilacak.

### Alternatifler

| Alternatif | Degerlendirme |
|---|---|
| **MySQL 8.x** | Konumsal (spatial) sorgu destegi sinirli. PostGIS kadar guclu geometri/geografya fonksiyonlari yok. JSONB karsiligi JSON tipi daha yavas. Row-level security farkli. |
| **MongoDB** | Cografi sorgu destegi var ancak karmasik transaction ve join islemleri NoSQL'de zayif. Is emri-musteri-teknisyen gibi iliskisel veriler icin uygun degil. Coklu tenant izolasyonu zor. |
| **Amazon Aurora PostgreSQL (managed)** | Daha yuksek maliyet (~$50-200/ay). Self-hosted PostgreSQL ile baslamak yeterli. Ileride gecis mumkun. |
| **Supabase** | Guzel cozum ancak vendor lock-in. Self-hosted PostgreSQL ile baslayip ileride gecis degerlendirilebilir. |

### Gerekce

- PostGIS: `ST_DWithin`, `ST_Distance`, `ST_Transform` gibi fonksiyonlarla guclu konumsal sorgu
- MVCC ve row-level security: tenant izolasyonu icin ideal
- `pgAudit`, `pgcrypto` gibi guvenlik uzantilari
- JSONB: esnek veri saklama (is emri meta alanlari, ozel form alanlari)
- Partitioning: buyuk tablolari partition'lama ile performans
- Acik kaynak, ucretsiz, genis topluluk destegi

### Olumlu Sonuclar

- Guclu mekansal sorgu yetenekleri
- ACID uyumlu, guvenilir transaction
- Genis indeksleme secenekleri (B-tree, GIN, GiST, BRIN)
- Flyway ile migration yonetimi kolay

### Olumsuz Sonuclar

- Self-hosted oldugu icin yonetim yuku (yedekleme, guncelleme, tuning)
- Yatay olcekleme zor (cok tenant buyurse read replica ve partition ile olceklenebilir)
- PostGIS uzantisi Docker imaj boyutunu artirir
- Bellek kullanimi yuksek olabilir (tuning gerekir)

### Guvenlik Etkisi

- pgcrypto ile at-rest sifreleme
- pgAudit ile tum sorgular denetlenebilir
- Row-level security ek katman olarak uygulanabilir
- DB rol ayrimi (app_user, app_migration, app_audit) ile yetki minimizasyonu
- Prepared statements ile SQL injection onleme

### Operasyon / Maliyet Etkisi

- Docker container, ozel bir lisans maliyeti yok
- PostGIS nedeniyle container boyutu ~500MB
- Gunluk yedekleme ve PITR icin disk alani gerekir
- Self-hosted oldugu icin DBA bilgisi gerekli

### Dogrulama

- PostGIS fonksiyonlari icin `PostGISFunctionTest.java`: `ST_DWithin`, `ST_Distance` gibi sorgularin dogru calistigi dogrulanir
- `pgAudit` yapilandirmasi dogrulanir
- DB rol ayrimi testi: `app_user` rolunun DDL yetkisi yok

### Yeniden Degerlendirme Tetikleyicisi

- 500GB+ veri tabani boyutuna ulasildiginda (partition + read replica)
- Operasyonel yuk arttiginda managed PostgreSQL'e gecis (Supabase / Crunchy Bridge / AWS RDS)
- NoSQL esnekligi ihtiyaci artarsa JSONB kullaniminin yetersiz kalmasi

---

## ADR-006: Flyway ile Veri Tabani Migration Yonetimi

| Alan | Deger |
|---|---|
| **ID** | ADR-006 |
| **Baslik** | Flyway kullanarak versioned migration yonetimi |
| **Durum** | Accepted |
| **Tarih** | 2026-06-18 |

### Baglam

Veri tabani semasi surum kontrolune tabi olmali. Farkli ortamlarda (local, CI, staging, production) sema degisiklikleri otomatik ve guvenli sekilde uygulanmali. Geri alma (rollback) stratejisi tanimlanmali.

### Karar

**Flyway** migration framework'u kullanilacak. Spring Boot otomatik Flyway entegrasyonu (`flyway-core`) ile uygulama baslangicinda migration'lar sirali olarak calistirilacak. Migration dosyalari `V{versiyon}__{aciklama}.sql` formatinda `api/src/main/resources/db/migration/` altinda saklanacak.

Migration kural ve ornekleri:
```sql
-- V1.0.0__baslangic_semasi.sql (geri alinamaz)
CREATE TABLE tenants (...);

-- V1.0.1__is_emri_tablosu.sql (geri alinabilir)
CREATE TABLE work_orders (...);

-- V1.0.2__is_emrine_durum_ekle.sql
ALTER TABLE work_orders ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'OPEN';
```

### Alternatifler

| Alternatif | Degerlendirme |
|---|---|
| **Liquibase** | Daha fazla ozellik (XML/YAML/JSON migration), ancak Java ekosisteminde Flyway daha yaygin ve hafif. Ogrenme egrisi daha dusuk. |
| **Manuel SQL script** | Insan hatasina acik. Hangi script'in hangi ortamda calistirildigi takip edilemez. CI/CD'ye entegre edilemez. |
| **Prisma Migrate** | Next.js/Node.js ekosisteminde populer ancak Spring Boot ile entegrasyon yok. |

### Gerekce

- Spring Boot ile dogal entegrasyon
- Basit SQL tabanli migration
- Versiyon takibi (`flyway_schema_history` tablosu)
- Checksum ile migration butunlugu dogrulamasi
- Acik kaynak, ucretsiz

### Olumlu Sonuclar

- Sema degisiklikleri kod ile birlikte versiyonlanir
- Tum ortamlarda tutarli sema
- Geri alinabilir migration'lar ile kontrollu rollback
- CI/CD pipeline'ina entegre edilebilir

### Olumsuz Sonuclar

- Geri alinamaz (non-reversible) migration'lar icin manuel rollback plani gerekir
- Migration basarisiz olursa uygulama baslamaz (fail-fast, dogru davranis)
- Birden fazla instance ayni anda migration calistirirsa kilit nedeniyle sorun (Flyway lock mekanizmasi ile cozulur)
- PostgreSQL'e ozgu SQL sözdizimi (PostGIS fonksiyonlari) migration scriptlerinde kullanilir, baska veri tabanina gecersiz

### Guvenlik Etkisi

- Migration script'leri kod incelemesinden gecmelidir (kotu niyetli migration riski)
- Migration kullanicisi (`app_migration`) sadece DDL yetkisine sahiptir, uygulama kullanicisi (`app_user`) sadece DML yetkisine sahiptir
- Migration oncesi staging'de calistirilip dogrulanir
- Production'da migration oncesi otomatik backup alinir

### Operasyon / Maliyet Etkisi

- Otomatik migration, manuel mudahale ihtiyacini azaltir
- Migration oncesi backup otomatize edilmelidir
- Geri alma icin manuel plan veya `flyway undo` (Pro surum, ucretli) gerekir

### Dogrulama

- Her migration sonrasi staging'de uygulama health check'i yapilir
- Migration sonrasi sema dogrulamasi: `SchemaVerificationTest.java`
- Geri alma drill'i: migration oncesi backup'tan restore + geri alinabilir migration testi

### Yeniden Degerlendirme Tetikleyicisi

- Cok sik migration hatasi veya karmasik geri alma ihtiyaci olursa
- Flyway Community Edition yetersiz kalirsa (ornegin, Pro surumdeki undo ozelligi gerekirse)

---

## ADR-007: S3 Presigned URL ile Dosya Indirme

| Alan | Deger |
|---|---|
| **ID** | ADR-007 |
| **Baslik** | Dosya indirme icin S3 presigned URL kullanimi |
| **Durum** | Accepted |
| **Tarih** | 2026-06-20 |

### Baglam

İşAkış'ta fotograf, imza ve PDF raporlari gibi dosyalar MinIO (S3 uyumlu) uzerinde saklanacak. Dosyalarin dogrudan S3'ten, API uzerinden proxy olmadan indirilmesi performans ve bant genisligi acisindan tercih edilir. Ancak yetkisiz erisimi onlemek gerekir.

### Karar

Dosya indirme islemleri icin **S3 presigned URL** kullanilacak. API, yetkilendirme kontrolunden sonra 15 dakika gecerli presigned URL ureterek client'a donecek. Client bu URL ile dogrudan MinIO'dan dosyayi indirecek veya goruntuleyecek.

```
1. Client: GET /api/v1/files/{id}/download-url
2. API:   Yetkilendirme kontrolu (tenant_id, rol, dosya erisim hakki)
3. API:   MinIO presigned URL olustur (15dk TTL)
4. API:   200 { "url": "http://minio:9000/bucket/uuid.jpg?X-Amz-..." }
5. Client: minio_url'den dogrudan GET -> dosya indirilir
```

### Alternatifler

| Alternatif | Degerlendirme |
|---|---|
| **API Proxy indirme** | API uzerinden stream ederek dosya gonderme. Backend yuksek bant genisligi kullanir, API performansi etkilenir. Buyuk dosyalar (fotograf) icin verimsiz. |
| **Public bucket** | Guvenlik acisindan kabul edilemez. KVKK ihlali. Dosyalar yetkilendirme olmadan erisilebilir olur. |
| **Long-lived signed URL** | Presigned URL suresi uzun olursa (ornegin 24 saat) URL'in sizma riski artar. KVKK ve guvenlik acisindan riskli. |

### Gerekce

- Performans: Dosyalar dogrudan MinIO'dan indirilir, API bant genisligi kullanilmaz
- Guvenlik: Presigned URL kisa omurlu (15dk), her istek icin yeniden dogrulanir
- Yetkilendirme: API uzerinde tenant ve rol kontrolu yapilir
- KVKK uyumlu: Dosyalara yetkisiz erisim onlenir
- MinIO'nun yerlesik presigned URL ozelligi kullanilir

### Olumlu Sonuclar

- Dusuk API yuku
- Guvenli dosya erisim kontrolu
- Hizli dosya indirme
- Geçici URL'ler URL sizintisi riskini azaltir

### Olumsuz Sonuclar

- MinIO'nun ic agdaki endpoint'i donuluyorsa (private network), client URL'e erisemez. Cozum: MinIO'ya public-facing veya ic proxy uzerinden erisim.
- Presigned URL'i alan kisi URL sure icinde paylasabilir — surenin kisa olmasi bu riski azaltir
- CDN cache'leme presigned URL ile zor

### Guvenlik Etkisi

- Her presigned URL talebinde yeniden yetkilendirme kontrolu
- Presigned URL TTL: 15 dakika (yapilandirilabilir)
- Indirme islemleri audit log'a kaydedilir: `file_id, user_id, tenant_id, timestamp, ip_address`
- Upload icin de presigned URL kullanilir (PUT method), ayni yetkilendirme akisi

### Operasyon / Maliyet Etkisi

- MinIO'nun ic endpoint'i public'e acilmamali; reverse proxy (nginx) uzerinden `/minio/` path'i proxy edilebilir
- Presigned URL olusturma islemi cok hafif (API uzerinde ek yuk yok)

### Dogrulama

- `PresignedUrlSecurityTest.java`: Presigned URL ile dosya indirilebilir, ayni URL 16. dakikada gecersiz olur
- Tenant atlamasi: Tenant A'nin dosyasi icin Tenant B'nin presigned URL talep etmesi -> 404
- Audit log testi: Indirme log kaydi olustugu dogrulanir

### Yeniden Degerlendirme Tetikleyicisi

- CDN cache ihtiyaci olusursa (sik indirilen raporlar vs.)
- Presigned URL TTL yetersiz kalirsa (ornegin mobil online olmayan senaryo)

---

## ADR-008: Transactional Outbox Pattern ile Event Yonetimi

| Alan | Deger |
|---|---|
| **ID** | ADR-008 |
| **Baslik** | Domain event'leri icin transactional outbox pattern kullanimi |
| **Durum** | Accepted |
| **Tarih** | 2026-06-22 |

### Baglam

Is emri olusturuldugunda e-posta bildirimi gonderilmeli, is emri tamamlandiginda fatura olusturulmali, webhook tetiklenmeli. Bu yan etkilerin (side effect), ana islemle (is emri kaydi) ayni transaction'da garanti edilmesi ancak asenkron calismasi gerekir. Dual-write problemi (DB'ye yaz + mesaj kuyruguna yaz) tutarlilik sorunu yaratabilir.

### Karar

**Transactional Outbox** pattern kullanilacak. Domain event'i once ayni transaction icinde `outbox_event` tablosuna yazilacak. Ayri bir background job (Spring `@Scheduled` veya Debezium CDC) bu tabloyu okuyarak event'leri ilgili handler'lara gonderecek.

```java
@Service
@Transactional
public class WorkOrderService {
    public WorkOrder create(CreateWorkOrderDto dto) {
        WorkOrder saved = repository.save(dto.toEntity());

        // Ayni transaction'da outbox'a yazilir
        outboxRepository.save(new OutboxEvent(
            "WORK_ORDER_CREATED",
            saved.getId(),
            saved.getTenantId(),
            toJson(saved)
        ));

        return saved;
    }
}
```

### Alternatifler

| Alternatif | Degerlendirme |
|---|---|
| **Dual-write (DB + Kafka/RabbitMQ)** | Iki sistem arasinda atomic transaction mumkun degil. DB yazimi basarili, kuyruk yazimi basarisiz olursa tutarsizlik. Saga pattern gerektirir. |
| **Debezium CDC (Change Data Capture)** | PostgreSQL WAL'dan dogrudan event okuma. Guclu cozum ancak ek operasyonel yuk (Kafka Connect, Kafka cluster). 2 kisilik ekip ve dusuk olcek icin asiri karmasik. |
| **Spring Application Events (in-process)** | Ayni JVM'de calisir ancak crash durumunda event kaybolur. Transaction commit olmadan event yayinlanabilir. |

### Gerekce

- Atomic: Event, veri ile ayni DB transaction'inda garanti edilir
- Basit: Ek altyapi (Kafka, RabbitMQ) gerektirmez
- Tutarli: `outbox_event` tablosu idempotent tuketim ile en-az-bir-kere (at-least-once) teslimat saglar
- Acik kaynak ve hafif

### Olumlu Sonuclar

- Veri ve event ayni transaction'da, tutarlilik garanti
- Ek mesaj kuyrugu altyapisi gerektirmez
- Outbox tablosundan event'ler sirali ve hatasiz tuketilir
- Test edilebilir: `OutboxRepositoryTest.java` ile event yazimi dogrulanir

### Olumsuz Sonuclar

- Polling bazli (scheduled) outbox isleme gecikme getirebilir (1-5 sn)
- Outbox tablosu buyurse sorgu performansi etkilenir; periyodik temizlik gerekir
- Event siralamasi (ordering) polling ile garanti edilir ancak paralel islemede zorlasir
- Ayni event'in birden fazla islenmesini onlemek icin idempotency mekanizmasi gerekir

### Guvenlik Etkisi

- Outbox tablosu tenant_id tasir, tenant izolasyonu korunur
- Event payload'inda hassas veri bulunmamalidir (masking/sadece ID referans)
- Outbox tablosuna sadece uygulama kullanicisi yazabilir, okuma sadece ic servis

### Operasyon / Maliyet Etkisi

- Ek tablo ve scheduled job, DB yuku minimal
- Kafka/RabbitMQ gibi ek altyapi maliyeti yok
- Outbox temizleme (cleanup) batch job: 7 gunden eski islenmis event'leri siler

### Dogrulama

- `TransactionalOutboxTest.java`: Is emri kaydedildiginde outbox event olustugu dogrulanir
- Idempotency testi: Ayni event iki kez islenir, ikinci islem yan etki olusturmaz
- Crash recovery testi: Transaction commit sonrasi crash; outbox worker kaldigi yerden devam eder

### Yeniden Degerlendirme Tetikleyicisi

- Event hacmi arttiginda (1000+/dk) polling yetersiz kalirsa Debezium CDC degerlendirilir
- Event ordering ve paralel isleme ihtiyaci artarsa Kafka degerlendirilir
- Outbox polling gecikmesi kabul edilemez seviyeye ulasirsa

---

## ADR-009: OpenTelemetry ile Gozlemlenebilirlik

| Alan | Deger |
|---|---|
| **ID** | ADR-009 |
| **Baslik** | OpenTelemetry standardi ile gozlemlenebilirlik (log, metric, trace) |
| **Durum** | Accepted |
| **Tarih** | 2026-06-25 |

### Baglam

Mikroservis veya moduler monolit fark etmeksizin, sistemin calisma aninda gozlemlenebilir olmasi gerekir. Hata ayiklama, performans analizi, guvenlik denetimi icin log, metric ve trace verileri toplanmalidir. Vendor bagimliligindan kacinilmali, ileride farkli backen'lere gecis mumkun olmalidir.

### Karar

**OpenTelemetry (OTel)** standardi kullanilacak. Tum telemetri verileri (log, metric, trace) OTel Collector'a gonderilecek, oradan ilgili backen'lere dagitilacak:

- **Logs** -> Grafana Loki
- **Metrics** -> Prometheus (OTel Collector'dan scrape) + Grafana
- **Traces** -> Grafana Tempo

### Alternatifler

| Alternatif | Degerlendirme |
|---|---|
| **ELK Stack (Elasticsearch + Logstash + Kibana)** | Agir kaynak tuketimi. Sadece log icin uygun, metric ve trace icin ayri sistem gerekir. Elasticsearch JVM heap yuksek. |
| **Datadog / New Relic (SaaS)** | Yuksek maliyet (host basina $15-30+). KVKK uyumlulugu acisindan veri yurt disina cikar. Dusuk butceli proje icin uygun degil. |
| **Grafana Cloud** | Orta maliyet. KVKK icin veri yurt disina cikar. Ileri fazda degerlendirilebilir. |
| **Sadece log (ELK, Loki)** | Metric ve trace olmadan performans sorunlari ve dagitik islem zinciri takip edilemez. Yetersiz. |

### Gerekce

- Vendor-neutral: OTel standardi, backen'den bagimsiz. Yarinki gun backen degistirilebilir.
- Otomatik enstrumantasyon: Spring Boot (Micrometer Tracing), Next.js (Vercel OTEL), PostgreSQL
- Self-hosted: Veri Turkiye'de kalir, KVKK uyumlu
- Uc cozgun bir arada: Log (Loki), Metric (Prometheus), Trace (Tempo) + Grafana dashboard
- Acik kaynak, ucretsiz

### Olumlu Sonuclar

- Tum sistem gozlemlenebilir: bir istegin baslangicindan bitisine tam gorunurluk
- Vendor lock-in yok
- KVKK uyumlu (veri yurt disina cikmaz)
- Genis ekosistem: Spring Boot, Next.js, PostgreSQL, Nginx entegrasyonu hazir

### Olumsuz Sonuclar

- Self-hosted oldugu icin yonetim yuku (Loki, Tempo, Prometheus, Grafana konteynerleri)
- Storage maliyeti (ozellikle trace verileri hizli birikir, sampling ile yonetilir)
- Baslangicta kurulum ve yapilandirma zamani (~1-2 hafta)
- Ekip OpenTelemetry ogrenme egrisi

### Guvenlik Etkisi

- Telemetri verileri hassas veri icermemeli (log maskeleme sarti)
- OTel Collector endpoint'i sadece ic agda erisilebilir
- Grafana erisimi VPN + MFA ile korunur
- Telemetri depolama (Loki, Tempo) erisim kontrollu

### Operasyon / Maliyet Etkisi

- Ek container'lar (otel-collector, prometheus, grafana, loki, tempo): ~2-3GB RAM, ~100GB disk
- Self-hosted: sunucu kaynagi disinda ek maliyet yok
- Production'da trace sampling orani %10 (maliyet dusuk)

### Dogrulama

- Staging'de OpenTelemetry entegrasyon testi: Bir istegin trace'i Tempo'da goruntulenebilir
- Dashboard ve alarmlar manuel test edilir
- Hassas veri log'a karismamasi icin regex taramasi

### Yeniden Degerlendirme Tetikleyicisi

- Self-hosted yonetim yuku cok artarsa Grafana Cloud'a gecis degerlendirilir
- KVKK yurt disi veri aktarimina izin verirse SaaS cozumler tekrar degerlendirilir
- Telemetri veri hacmi depolama maliyetini artirirsa

---

## ADR-010: Veri Tabani Rol Ayrimi

| Alan | Deger |
|---|---|
| **ID** | ADR-010 |
| **Baslik** | PostgreSQL'de uygulama, migration ve audit icin ayri roller |
| **Durum** | Accepted |
| **Tarih** | 2026-06-28 |

### Baglam

Guvenlik en iyi uygulamalari, uygulamanin veri tabanina minimum yetkiyle baglanmasini gerektirir. Gelistirmede sikca "tek kullanici, tum yetkiler" yaklasimi gorulur; bu, SQL injection veya yetkisiz erisim durumunda butun veri tabaninin tehlikeye girmesine yol acar.

### Karar

PostgreSQL'de **uc ayri rol** tanimlanacak:

| Rol | Baglanti Havuzu | Yetki | Kullanim |
|---|---|---|---|
| `app_user` | HikariCP (primary) | SELECT, INSERT, UPDATE, DELETE (sadece uygulama tablolari) | Uygulamanin tum CRUD islemleri |
| `app_migration` | Flyway (ayri) | DDL (CREATE, ALTER, DROP), DML | Flyway migration calistirma |
| `app_audit` | pgAudit / read-only | SELECT (salt okunur) | Denetim, raporlama, backup |

### Alternatifler

| Alternatif | Degerlendirme |
|---|---|
| **Tek rol (owner)** | En basit ancak en guvensiz. SQL injection basarili olursa `DROP TABLE` calistirilabilir. OWASP ASVS Level 2 kriterlerini karsilamaz. |
| **Uygulama + admin ayrimi** | Iki rol yeterli gorunebilir ancak audit/read-only senaryolari icin ayri rol gerekir. Ornegin, destek ekibi read-only erisim ister. |

### Gerekce

- **Least privilege:** Uygulama sadece ihtiyaci olan yetkilere sahiptir
- SQL injection riskini azaltir: `app_user` DDL calistiramaz
- Audit ve raporlama ayri rol uzerinden yapilir, uygulama performansini etkilemez
- OWASP ASVS V2.1 "Database security configuration" kriterini karsilar

### Olumlu Sonuclar

- Guvenlik seviyesi artar
- SQL injection hasari sinirlanir
- Audit/raporlama ayri havuzdan, uygulamayi etkilemez
- Roller arasi net sorumluluk ayrimi

### Olumsuz Sonuclar

- Connection pool yonetimi: en az 2 pool (app + migration), opsiyonel 3. pool (audit)
- Migration sirasinda uygulamanin `app_user` ile calismaya devam etmesi gerekir
- Gelistirme ortaminda da rolleri yapilandirmak gerekir (tekrar is)
- Yeni tablo eklendiginde `app_user`'e GRANT vermek unutulabilir

### Guvenlik Etkisi

- SQL injection: saldirgan `app_user` yetkisiyle sinirli kalir, `DROP TABLE` calistiramaz
- `app_user` parolasi degisse uygulama durmazsa sadece yeni baglantilar etkilenir
- pgAudit, `app_user` yetkisinin olmadigi audit semasinda calisarak denetim butunlugunu korur

### Operasyon / Maliyet Etkisi

- Ek connection pool sayisi bellek kullanimi artirir (minimal, ~50MB)
- GRANT yonetimi otomasyonu: Flyway callback ile yeni tablolara `app_user` yetkisi otomatik verilir
- Rol olusturma script'i Docker entrypoint'te calisir

### Dogrulama

- `DbRoleSeparationTest.java`: `app_user` rolunun `CREATE TABLE` calistiramadigi dogrulanir
- `app_user` rolunun diger tenant'larin verisine erisemedigi dogrulanir (RLS ile)
- `app_migration` rolunun DML calistirabildigi, `app_user`'in calistiramadigi dogrulanir

### Yeniden Degerlendirme Tetikleyicisi

- Uygulama gereksinimleri `app_user`'in daha fazla yetkiye ihtiyac duymasi (ornegin stored procedure cagrisi)
- Connection pool karmasikligi sorun yaratirsa
- Denetim gereksinimleri artarsa (`app_audit` rolune ek yetkiler)

---

## ADR-011: Kubernetes'i Erteleme (Docker Compose ile Baslama)

| Alan | Deger |
|---|---|
| **ID** | ADR-011 |
| **Baslik** | MVP'de Docker Compose, Kubernetes'i erteleme |
| **Durum** | Accepted |
| **Tarih** | 2026-07-01 |

### Baglam

Container orkestrasyonu icin Kubernetes endustri standardi haline gelmistir. Ancak Kubernetes'in ogrenme egrisi, yonetim yuku ve minimum kaynak gereksinimi (3 node, en az 6GB RAM) dusuk butceli, 2 kisilik bir ekip ve MVP gelistirme icin asiri agir olabilir.

### Karar

MVP fazinda **Docker Compose** ile tek sunucuda (VPS) container yonetimi yapilacak. Kubernetes, 50+ tenant'a ulasildiginda veya coklu sunucu/olcekleme ihtiyaci dogdugunda degerlendirilecek.

### Alternatifler

| Alternatif | Degerlendirme |
|---|---|
| **Managed Kubernetes (GKE/EKS/AKS)** | En az ~$70/ay cluster yonetim ucreti + worker node maliyeti. KVKK acisindan yurt disi veri merkezi sorunu. 2 kisilik ekip icin asiri karmasik. |
| **Self-hosted Kubernetes (k3s/MicroK8s)** | Kaynak tuketimi dusuk ancak yonetim yuku yuksek. Yama, sertifika rotasyonu, RBAC yonetimi zaman alir. 2 kisi icin fazla. |
| **Docker Swarm** | Dusuk kaynak ve ogrenme egrisi. Ancak topluluk kucuk, Docker'in Swarm'a yatirim yapip yapmayacagi belirsiz. |
| **Nomad** | HashiCorp'un hafif orchestrator'u. Docker Compose'tan daha iyi olcekleme ancak ek ogrenme. |

### Gerekce

- 2 kisilik ekip; Kubernetes yonetimi MVP hizini yavaslatir
- MVP'de tek sunucu yeterli; olcekleme ihtiyaci yok
- Docker Compose: basit, bilinen, CI/CD'ye kolay entegre
- `docker compose up -d` ile tek komutla deployment
- Kubernetes'e gecis karari alindiginda, uygulama zaten containerize oldugu icin gecis kolay

### Olumlu Sonuclar

- Hizli gelistirme dongusu
- Dusuk operasyonel yuk
- Dusuk maliyet (tek VPS)
- Kolay debug (docker logs, docker exec)
- Basit rollback (onceki image)

### Olumsuz Sonuclar

- Yatay olcekleme yok (tek sunucu)
- Zero-downtime deployment zor (rolling update `--no-deps` ile kisitli)
- Service discovery yok (container isimleri yeterli)
- Health check ve restart `restart: unless-stopped` ile sinirli
- Ileride Kubernetes'e gecis icin migration maliyeti

### Guvenlik Etkisi

- Docker Compose'un secrets yonetimi sinirli (.env dosyasi); Kubernetes Secrets daha guvenli
- Network izolasyonu Docker bridge ile sinirli; Kubernetes NetworkPolicies daha guclu
- Container runtime guvenligi (seccomp, AppArmor) manuel yapilandirma gerektirir

### Operasyon / Maliyet Etkisi

- Tek sunucu: ~$40-80/ay
- Kubernetes cluster maliyeti yok
- Yonetim suresi: haftada ~2 saat (backup, guncelleme, kontrol)

### Dogrulama

- `docker compose up` ile tum servisler ayaga kalkar ve healthcheck'ten gecer
- `docker compose down && docker compose up -d` ile restart testi
- Uygulama yaniti suresi docker stats ile izlenir

### Yeniden Degerlendirme Tetikleyicisi

- 50+ tenant, coklu sunucu ihtiyaci, yatay olcekleme gereksinimi
- Yuksek erisilebilirlik (HA) gereksinimi (%99.9+)
- Zero-downtime deployment zorunlulugu
- Ekip buyuklugu ve DevOps kapasitesi arttiginda
- Musteri SLA gereksinimleri Kubernetes'i zorunlu kildiginda

---

## ADR-012: RBAC (Role-Based Access Control) Modeli

| Alan | Deger |
|---|---|
| **ID** | ADR-012 |
| **Baslik** | Dört seviyeli RBAC yetkilendirme modeli |
| **Durum** | Accepted |
| **Tarih** | 2026-07-05 |

### Baglam

Her teknik servis firmasinin kendi icinde farkli rolleri vardir: sirket sahibi (admin), operasyon yoneticisi (supervisor), saha teknisyeni (technician), muhasebe (accountant). Ayrica platform yoneticisi (super_admin) tum tenant'lari yonetir. Her rolun erisim haklari farklidir.

### Karar

Dort seviyeli **RBAC modeli** uygulanacak:

| Rol | Tenant Kapsami | Yetkiler |
|---|---|---|
| **SUPER_ADMIN** | Tum tenant'lar | Platform yonetimi, tenant olusturma/silme, fatura ayarlari, global rapor |
| **TENANT_ADMIN** | Sadece kendi tenant'i | Kullanici yonetimi, fatura, rapor, tum is emirleri, teknisyen atama |
| **SUPERVISOR** | Sadece kendi tenant'i | Is emri olusturma/atama/durum guncelleme, musteri yonetimi, rapor |
| **TECHNICIAN** | Sadece kendi tenant'i | Sadece kendine atanmis is emirlerini gorme ve durum guncelleme, fotograf yukleme |
| **ACCOUNTANT** | Sadece kendi tenant'i | Fatura goruntuleme, odeme takibi, finansal rapor (salt okunur) |

Yetkilendirme iki katmanda uygulanir:
1. **API Gateway / Interceptor:** JWT'den `roles` ve `tenant_id` cikarilir, her istekte dogrulanir
2. **Method-level:** `@PreAuthorize("hasRole('TENANT_ADMIN') or hasRole('SUPERVISOR')")` ile endpoint bazli

### Alternatifler

| Alternatif | Degerlendirme |
|---|---|
| **ACL (Access Control List)** | Her kullaniciya ozel izin tanimlamasi. 5-50 teknisyenli firmalar icin asiri granular ve yonetimi zor. |
| **ABAC (Attribute-Based Access Control)** | Policy-based, ornegin "Sadece kendi bolgesindeki is emirlerini gorsun." MVP'de bu seviyede granularity gerekmiyor. Ileride eklenebilir. |
| **Sadece Admin/Teknisyen ayrimi** | Yetersiz. Supervisor ve accountant rolleri islevsel olarak gerekli (isletme gereksinimi). |

### Gerekce

- Basit ve anlasilir rol modeli, musteri firmalarinin mevcut is yapisina uygun
- OWASP ASVS V4.1 kriterini karsilar (role-based access control)
- Spring Security `@PreAuthorize` ile kolay implementasyon
- JWT icinde roller tasinir, ek veri tabani sorgusu gerekmez
- Genisletilebilir: Ileride belirli izinler (permission) eklenebilir

### Olumlu Sonuclar

- Her rolun net sinirlari var
- Kolay test edilebilir (rol bazli testler)
- JWT icinde tasindigi icin hizli yetkilendirme
- Auditor rolleri (muhasebe) salt okunur erisim saglar

### Olumsuz Sonuclar

- Roller sabit 5 tane; yeni bir rol eklemek kod degisikligi gerektirir
- Granular izin (permission) olmadigi icin "teknisyen sadece kendi bolgesindeki isleri gorsun" gibi ince ayarlar yok
- JWT'deki roller token suresi boyunca degismez; rol degisikligi icin yeniden login gerekir
- Tenant'lar arasi rol yapisi ayni olmak zorunda (ozellestirilemez)

### Guvenlik Etkisi

- En dusuk yetki prensibi uygulanir
- SUPER_ADMIN platform genelinde yetkili, JWT'si ele gecirilirse tum tenant verilerine erisim: bu nedenle SUPER_ADMIN icin MFA zorunlu, session suresi daha kisa (5dk)
- Her endpoint `@PreAuthorize` annotation'i ile korunur; unutulmamasi icin ArchUnit testi kosulur
- Tenant izolasyonu rollere ek olarak ayrica kontrol edilir (tenant_id filtreleme)

### Operasyon / Maliyet Etkisi

- Rol yonetimi kodda enum ve veri tabaninda sabit tablo olarak tutulur
- Yeni rol eklemek kod degisikligi gerektirir ancak 5-50 teknisyenli firmalar icin mevcut roller yeterlidir
- ArchUnit testi ile tum controller metodlarinda `@PreAuthorize` varligi kontrol edilir

### Dogrulama

- `AuthorizationTest.java`: Parametreli test ile her rol -> endpoint -> beklenen HTTP status
- `ArchUnitTest.java`: Tum `@RestController` metodlarinda `@PreAuthorize` varligi kontrolu
- Tenant izolasyonu + RBAC etkilesimi: Tenant A'nin SUPERVISOR'u, Tenant B'nin is emrine erisemez

### Yeniden Degerlendirme Tetikleyicisi

- Musteriler granular izinler talep ederse (permission-based erisim)
- "Teknisyen sadece kendi bolgesindeki is emirlerini gorsun" gibi ABAC gereksinimleri
- Rol sayisi 10+ olursa yonetim zorlasabilir

---

## Karar Bekleyen Konular

- ADR-011'de belirtilen Kubernetes'e gecis icin net bir zaman cizelgesi
- ADR-005'te belirtilen managed PostgreSQL'e gecis karari
- ADR-008'de belirtilen Debezium CDC'ye gecis tetikleyicileri
- ADR-012'de belirtilen ABAC gereksinimi icin musteri taleplerinin izlenmesi

## Ilgili Dokumanlar

- `10_THREAT_MODEL.md` — Tehdit Modeli (ADR-003, ADR-004, ADR-012 guvenlik etkileri iliskili)
- `11_PRIVACY_KVKK.md` — KVKK Uyumluluk ve Gizlilik (ADR-002, ADR-007 veri saklama iliskili)
- `12_SECURE_SDLC_CICD.md` — Guvenli SDLC ve CI/CD (ADR-001 monorepo iliskili)
- `13_TEST_STRATEGY.md` — Test Stratejisi (tum ADR'lerin dogrulama kriterleri iliskili)
- `14_DEVOPS_OBSERVABILITY_DR.md` — DevOps, Gozlemlenebilirlik ve Felaket Kurtarma (ADR-009, ADR-011 iliskili)
