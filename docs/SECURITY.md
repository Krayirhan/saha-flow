# Saha Flow - Guvenlik Dokumani

## Guvenlik Modeli Ozeti

Saha Flow, coklu tenant yapisina sahip bir SaaS platformu olarak katmanli bir guvenlik yaklasimi uygular:

```
┌─────────────────────────────────────────┐
│          Transport Security             │  TLS 1.3, HTTPS
├─────────────────────────────────────────┤
│          Network Security               │  WAF, Rate Limiting, DDoS
├─────────────────────────────────────────┤
│          Authentication                 │  JWT, OAuth2, MFA
├─────────────────────────────────────────┤
│          Authorization                  │  RBAC, Tenant Isolation
├─────────────────────────────────────────┤
│          Application Security           │  Input Validation, CORS, CSP
├─────────────────────────────────────────┤
│          Data Security                  │  Encryption at Rest/Transit
└─────────────────────────────────────────┘
```

## Authentication ve Session Yonetimi

### JWT Tabanli Auth

- **Access Token**: 15 dakika omurlu, kisa sureli
- **Refresh Token**: 7 gun omurlu, rotate edilir
- **Token imzalama**: HMAC-SHA256 (HS256), en az 256-bit secret
- **Token blocklisting**: Logout ve sifre sifirlama sonrasi Redis'te kara liste
- **Token storage**: Web - httpOnly secure cookie; Mobile - secure device storage

### Guvenlik Onlemleri

- Sifre politikalari: min 8 karakter, zorunlu karmasiklik (buyuk/kucuk harf, rakam, ozel karakter)
- Sifre hash: BCrypt (cost factor >= 12)
- Brute-force korumasi: Redis-based rate limiting (5 basarisiz / 15 dakika)
- Basarili/basarisiz giris loglari
- Oturum suresi asimi sonrasi zorunlu yeniden giris

### Multi-Factor Authentication (MFA)

- TOTP (Time-based One-Time Password) destegi
- TENANT_ADMIN ve SUPER_ADMIN rolleri icin zorunlu (opsiyonel)
- SMS/Email fallback opsiyonu

## Authorization (RBAC)

### Rol Hiyerarsisi

```
SUPER_ADMIN      → Tum sisteme erisim (platform yoneticisi)
  ├── TENANT_ADMIN  → Kendi tenant'indaki tum kaynaklara erisim
  │     ├── MANAGER      → Tesis yonetimi, raporlama
  │     ├── STAFF        → Gunluk operasyon (randevu onayi, giris kontrolu)
  │     └── COACH        → Antrenor erisimi
  └── CUSTOMER       → Kendi randevulari, profil
```

### Izin Yapisi

Her endpoint izni `[domain]:[action]` formatinda:

```
courts:read, courts:write, courts:delete
bookings:read, bookings:create, bookings:cancel
users:read, users:write, users:delete
reports:read, reports:export
billing:read, billing:manage
settings:read, settings:write
```

Yetkilendirme kontrolu Spring Security `@PreAuthorize` annotation'lari ile yapilir:

```kotlin
@PreAuthorize("hasAuthority('courts:write') and hasTenantAccess(#tenantId)")
fun updateCourt(tenantId: UUID, courtId: UUID, request: CourtUpdateRequest): CourtResponse
```

## Tenant Izolasyonu

- Her istek JWT'den tenant ID cozulur
- Hibernate `@Filter` ile otomatik `WHERE tenant_id = ?` filtresi
- SUPER_ADMIN harici tum roller tenant filtresine tabidir
- Cross-tenant veri erisimi mumkun degildir (sizma testi ile dogrulanir)

## API Guvenligi

### Input Validation

- Bean Validation (Jakarta Validation) tum DTO'larda zorunlu
- SQL Injection: JPA parameterized queries, native query onayi
- XSS: Tum output encoding, Content-Type basligi
- Path Traversal: Dosya yolu sanitizasyonu

### Rate Limiting

```nginx
# Nginx seviyesi
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

# Application seviyesi (Spring)
@RateLimit(key = "#request.email", rate = "5/15m", type = RateLimitType.AUTH)
fun login(request: LoginRequest): AuthResponse
```

### CORS

- Production'da sadece bilinen origin'lere izin verilir
- Wildcard origin kullanilmaz
- Credentials gonderimi sadece guvenli origin'lere

```yaml
cors:
  allowed-origins:
    - https://app.sahaflow.example.com
    - https://admin.sahaflow.example.com
  allowed-methods:
    - GET
    - POST
    - PUT
    - PATCH
    - DELETE
  allow-credentials: true
```

### Security Headers

Tum HTTP yanitlari icin:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-XSS-Protection: 1; mode=block`
- `Permissions-Policy`: kamera, mikrofon, konum kapsamli kisitlama (sadece kendi domain)
- `Strict-Transport-Security` (production): `max-age=31536000; includeSubDomains; preload`

## Frontend Guvenligi

### Next.js Web

- CSP (Content Security Policy) basligi
- Subresource Integrity (SRI) harici script'ler icin
- Sensitive token'lar httpOnly cookie'de (JWT refresh token)
- XSS korumasi: React varsayilan output encoding
- CSRF korumasi: SameSite=Strict cookie + CSRF token
- Bagimlilik guvenligi: `npm audit` CI'da zorunlu
- Environment degiskenleri: Client-side `NEXT_PUBLIC_*` disinda sizinti yok

### Flutter Mobil

- Secure storage (Keychain / EncryptedSharedPreferences)
- SSL pinning (production)
- Root/jailbreak tespiti (istege bagli)
- Ekran goruntusu engelleme (hassas ekranlar)
- ProGuard/R8 obfuscation

## Veritabani Guvenligi

- Connection encryption (SSL/TLS)
- Minimum yetki prensibi: Servis hesabi sadece kendi DB'sine erisebilir
- Hassas veri sifreleme: pgcrypto (database-level encryption)
- Audit log: `audit_logs` tablosu, sensitive islem kaydi
- Backup encryption: Encrypted pg_dump
- PostgreSQL Row-Level Security (opsiyonel katman):

```sql
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON bookings
  USING (tenant_id::text = current_setting('app.current_tenant_id'));
```

## Secret Yonetimi

### Development
- `.env` dosyasi (`.gitignore`'da)
- `infra/.env.example` placeholder degerlerle commit edilir

### Production
- **HashiCorp Vault** veya **AWS Secrets Manager**
- Dinamik veritabani credential'lari (Vault ile)
- Secret rotasyonu (90 gun)
- Docker secrets / Kubernetes secrets ile enjeksiyon
- Secret'lar asla environment variable olarak image icinde gomulu degildir

## Tehdit Modeli Ozeti

| Tehdit                              | Risk      | Onlem                                      |
| ----------------------------------- | --------- | ------------------------------------------ |
| Cross-Tenant veri erisimi            | Kritik    | TenantID zorunlu filtreleme, otomatik test  |
| JWT token calma / replay            | Yuksek    | Kisa AT suresi, RT rotasyonu, blocklist    |
| Brute force login                   | Yuksek    | Rate limiting, hesap kilitleme, MFA         |
| SQL Injection                       | Yuksek    | Parameterized queries, HQL/JPQL            |
| XSS                                | Orta      | Output encoding, CSP, React sanitizasyonu   |
| CSRF                               | Dusuk     | SameSite cookie, CSRF token                |
| Hassas veri sizintisi (log)        | Orta      | Log sanitizasyonu, PII masking             |
| Supply chain (bagimlilik)           | Orta      | Dependabot, OWASP Dependency Check, SCA    |
| Insan hatasi (yanlis yapilandirma) | Orta      | Infra as Code, security review checklist   |
| DDoS                               | Orta      | CDN/WAF, Nginx rate limit, auto-scaling    |

## KVKK Uyumlulugu (Turkiye)

Saha Flow, 6698 sayili Kisisel Verilerin Korunmasi Kanunu'na (KVKK) uygun olarak tasarlanmistir:

- **VERBIS kaydi**: Veri sorumlusu olarak yukumluluk
- **Aydinlatma metni**: Kayit ve giris ekranlarinda zorunlu onay
- **Acik riza**: Marketing ve analytics icin opt-in
- **Veri minimizasyonu**: Sadece isletme amaci icin gerekli veriler toplanir
- **Silme/anonimlestirme**: Kullanici verisi silme talepleri 30 gun icinde
- **Veri tasinabilirligi**: Export (JSON/CSV) API'si
- **Loglama**: Erisim loglari, silme loglari, guvenlik olay loglari
- **Yurtdisi aktarim**: Kullanici onayi olmadan yapilmaz
- **Veri guvenligi**: Sifreleme, erisim kontrolu, audit

## Guvenlik Testleri

CI/CD pipeline'inda otomatik:
- **SAST**: SonarQube, SpotBugs
- **SCA**: OWASP Dependency Check, npm audit
- **Secret scanning**: Gitleaks
- **Container scanning**: Trivy

Manuel / periyodik:
- **DAST**: OWASP ZAP (en az quarterly)
- **Penetrasyon testi**: Yillik 3. parti pentest
- **Dependency update**: Aylik `npm audit fix`, `gradle dependencyUpdates`

## Incident Response

1. **Tespit**: Monitoring alert (Prometheus + Grafana), audit log, kullanici raporu
2. **Onleme**: Etkilenen servis izolasyonu, gecici cut-off
3. **Analiz**: Log inceleme, root cause analysis
4. **Giderme**: Patch, yapilandirma degisikligi
5. **Bildirim**: 72 saat icinde ilgili taraflara (KVKK geregi)
6. **Post-mortem**: Belge, onleyici aksiyonlar

## Guvenlik Kontrol Listesi

- [ ] Production secret'lar Vault/Secrets Manager'da
- [ ] HTTPS zorunlu, HSTS acik
- [ ] JWT secret >= 256-bit, rotasyonlu
- [ ] MFA tenant admin'ler icin zorunlu
- [ ] Rate limiting tum endpoint'lerde
- [ ] Input validation tum API'lerde
- [ ] CSP header web'de aktif
- [ ] Audit log tum sensitive islemlerde
- [ ] Bagimlilik guvenlik taramasi CI'da
- [ ] Container vulnerability taramasi CI'da
- [ ] Veritabani backup'lari sifreli
- [ ] Incident response plani hazir
- [ ] KVKK aydinlatma ve acik riza metinleri aktif
