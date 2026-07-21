> Proje: Saha Flow / > Doküman: Operasyon Runbook / > Durum: Draft / > Üretim tarihi: 2026-07-21 / > Kaynak girdi: templates/01_PROJE_GIRDI_FORMU.yaml

# Saha Flow — Operasyon Runbook

Bu doküman, Saha Flow üretim ortamında karşılaşılabilecek kritik operasyonel olaylar için adım adım müdahale rehberidir. Her runbook; belirti, ilk kontroller, mitigasyon, kalıcı çözüm, rollback, eskalasyon, kanıt toplama ve olay sonrası aksiyonları içerir.

---

## Saha Flow Operasyonel Bağlam

| Parametre | Değer |
|---|---|
| Hosting | Managed Kubernetes (AWS EKS / GKE / DigitalOcean) veya tek sunucu (MVP için Docker Compose) |
| Database | PostgreSQL 16+ (managed service veya self-hosted) |
| Object Storage | S3-uyumlu (AWS S3 / MinIO / DigitalOcean Spaces) |
| Monitoring | OpenTelemetry → Grafana + Prometheus + Loki |
| Alerting | Grafana AlertManager → e-posta / Slack |
| CI/CD | GitHub Actions |
| Backup | pg_dump + WAL archiving, günlük, 30 gün retention |
| RTO | 4 saat |
| RPO | 1 saat |
| Çalışma saatleri | 09:00-18:00 (GMT+3), kritik (P0) olaylar 7/24 |

---

## Runbook 1: Giriş Sorunu (Login Başarısızlık Oranı Arttı)

**Belirti:**
- Grafana: `login_failure_rate > %5` alarmı tetiklendi.
- Kullanıcılardan "şifre kabul edilmiyor" veya "giriş yapamıyorum" şikayetleri geliyor.
- `/api/auth/login` endpoint'i 401 veya 500 dönüyor.

**Kullanıcı Etkisi:** Tüm kullanıcılar sisteme giriş yapamaz. Kritik (P0).

**İlk 5 Dakikada Yapılacaklar:**
1. Grafana → Saha Flow Dashboard → Auth panelini aç.
2. `login_failure_rate` ve `login_success_rate` grafiklerini kontrol et.
3. Hatanın tek tenant'a mı yoksa tüm tenant'lara mı ait olduğunu belirle: Grafana'da tenant_id filtresi uygula.
4. Son 15 dakikadaki error log'larına bak: `{service="sahaflow-api"} |= "login" |= "error"`.
5. DB bağlantı havuzu durumunu kontrol et: `db_connection_pool_active` metriği.

**Dashboard/Log Sorguları:**
```logql
# Loki: Son 15 dk login hataları
{service="sahaflow-api"} | json | method = "POST" and path = "/api/auth/login" and status >= 400
```
```promql
# Prometheus: Login başarı oranı
rate(login_success_total[5m]) / rate(login_attempt_total[5m])
```

**Güvenli Teşhis Adımları:**
1. API pod'una bağlan: `kubectl exec -it deploy/sahaflow-api -- /bin/sh` (veya `docker exec -it sahaflow-api sh`)
2. JWT signing key'in yüklü olduğunu doğrula: `echo $JWT_SECRET | wc -c` (boş değilse >0)
3. `users` tablosunda son 5 kullanıcıyı kontrol et: `SELECT id, email, enabled, locked_until FROM users ORDER BY created_at DESC LIMIT 5;`
4. Rate limit konfigürasyonunu kontrol et: rate-limit bucket değerleri yanlışlıkla çok düşük ayarlanmış olabilir.

**Geçici Azaltma (Mitigasyon):**
- Tüm tenant'ları etkiliyorsa: DB bağlantı sorunu → DB bağlantı havuzunu yeniden başlat.
- Tek tenant etkileniyorsa: tenant'ın rate-limit'ini geçici olarak kaldır/yükselt.
- JWT secret değişmişse: eski secret ile pod'u yeniden başlat, key rotation'ı planlı yap.
- DB şifresi değişmişse: Kubernetes secret/ortam değişkenini güncelle ve pod'u yeniden başlat.

**Kalıcı Çözüm:**
- Rate limit: tenant bazlı aşırı agresif limitleri gevşet; login için 10 deneme/dk/tenant.
- JWT secret rotasyonu için otomatik mekanizma kur (V1).
- DB bağlantı havuzu: minimum idle bağlantı sayısını artır (5 → 10).
- Health check endpoint'i DB bağlantısını da kontrol etsin.

**Rollback Koşulu:** Son deploy'u geri al. Eğer son 1 saat içinde deploy yapıldıysa ve öncesinde login çalışıyorsa, deploy rollback'i uygula.

**İletişim ve Eskalasyon:**
- Slack #incidents kanalına bildir.
- 15 dakika içinde çözülemezse: kıdemli backend geliştiriciye eskalasyon.
- 30 dakika içinde çözülemezse: tüm kullanıcılara e-posta ile bilgilendirme ve tahmini düzelme süresi.

**Olay Sonrası Aksiyonlar:**
- Root cause analysis (RCA) dokümanı oluştur.
- Rate limit değerlerini gözden geçir ve gerekirse güncelle.
- Login metrikleri için daha hassas alert threshold belirle.
- Postmortem toplantısı yap (48 saat içinde).

---

## Runbook 2: Yetki İhlali Şüphesi

**Belirti:**
- Audit log'da bir kullanıcının normalde erişememesi gereken tenant verisine eriştiği görülüyor.
- Kullanıcı, kendi rolünün izin vermediği bir işlemi gerçekleştirmiş (örn: teknisyen müşteri silmiş).
- Grafana: `unauthorized_access_attempt > 0` alarmı.
- Kullanıcı şikayeti: "başka firmanın verilerini görüyorum" — en kritik belirti.

**Kullanıcı Etkisi:** Tenant veri izolasyonu ihlali. KVKK ve ticari açıdan kritik (P0).

**İlk 5 Dakikada Yapılacaklar:**
1. Etkilenen kullanıcının oturumunu derhal sonlandır: `UPDATE users SET refresh_token_revoked_at = now() WHERE id = ?;`
2. Audit log'da ilgili kullanıcının son 1 saatlik işlemlerini listele:
   ```sql
   SELECT * FROM audit_log WHERE user_id = ? AND created_at > now() - interval '1 hour' ORDER BY created_at DESC;
   ```
3. Kullanıcının hangi tenant verilerine eriştiğini belirle.
4. Kullanıcının rolünü ve tenant bağlantısını kontrol et.

**Dashboard/Log Sorguları:**
```sql
-- Kullanıcının eriştiği tenant_id'leri bul
SELECT DISTINCT entity_type, tenant_id FROM audit_log WHERE user_id = ? AND created_at > now() - interval '24 hours';
```

**Güvenli Teşhis Adımları:**
1. TenantContextFilter log'larını kontrol et: kullanıcının isteklerinde hangi tenant_id çözümlenmiş?
2. JWT token içeriğini decode et (payload'ı kontrol et, secret ile verify değil).
3. Kullanıcının `users` tablosundaki `tenant_id` değeri ile JWT'deki tenant_id aynı mı?
4. Yetkilendirme aspect/log'larını kontrol et: `@PreAuthorize` kontrolleri atlanmış mı?

**Geçici Azaltma (Mitigasyon):**
- Etkilenen kullanıcı hesabını devre dışı bırak: `UPDATE users SET enabled = false WHERE id = ?;`
- Şüpheli tenant'ların tüm aktif oturumlarını sonlandır.
- Etkilenen tenant için read-only mod aktif et (opsiyonel, uygulama desteği varsa).
- Gerekiyorsa tüm kullanıcıları yeniden login'e zorla (global token revocation).

**Kalıcı Çözüm:**
- İhlalin kök nedenini bul: kod hatası mı (tenant_id filtresi eksik), konfigürasyon mu (RLS yanlış), JWT manipülasyonu mu?
- Eksik tenant izolasyonu kontrolü varsa ilgili repository/controller katmanına ekle.
- Her API isteğinde tenant_id'nin kullanıcının bağlı olduğu tenant ile eşleştiğini kontrol eden merkezi bir aspect/filtre yaz.
- Otomatik tenant izolasyon testini (Runbook 3 ile ilgili) güçlendir.
- Kullanıcı-tenant ilişkisini değiştiren işlemleri audit log'a ekle.

**Rollback Koşulu:** Son deploy bu ihlale neden olduysa derhal rollback yap.

**İletişim ve Eskalasyon:**
- Derhal tüm ekibe Slack'te bildir (#incidents + #security).
- Etkilenen tenant'ın admin kullanıcısına durumu bildir (veri sorumlusu olarak).
- 1 saat içinde KVKK kapsamında değerlendirme: kişisel veri ihlali mi? → KVKK kuruluna 72 saat içinde bildirim gerekebilir.
- Gerekirse hukuk danışmanına eskalasyon.

**Olay Sonrası Aksiyonlar:**
- Kapsamlı güvenlik incelemesi: tüm endpoint'ler için tenant izolasyon testi.
- Penetrasyon testi planla (harici firma ile).
- KVKK veri ihlali bildirimi yap (gerekliyse).
- Kullanıcı eğitimi: şifre güvenliği, oturum yönetimi.
- Olay kaydı ve RCA dokümanı.

---

## Runbook 3: Tenant Veri Sızıntısı Şüphesi

**Belirti:**
- Bir tenant kullanıcısı başka bir tenant'a ait müşteri/cihaz/iş emri verisi gördüğünü raporladı.
- Audit log anomalisi: bir tenant_id altında farklı bir tenant'a ait entity güncellenmiş.
- API yanıtında beklenenden fazla veya farklı veri dönüyor.

**Kullanıcı Etkisi:** Veri gizliliği ihlali, KVKK riski. Kritik (P0).

**İlk 5 Dakikada Yapılacaklar:**
1. Raporu doğrula: rapor edilen kullanıcı ile aynı tenant ve rolde oturum aç, aynı sayfayı/API'yi kontrol et.
2. İlgili endpoint için audit log'u kontrol et:
   ```sql
   SELECT * FROM audit_log WHERE user_id = ? AND entity_type = ? ORDER BY created_at DESC LIMIT 50;
   ```
3. Veritabanında tenant_id bazlı veri sayımı yap:
   ```sql
   SELECT tenant_id, count(*) FROM customers GROUP BY tenant_id;
   SELECT tenant_id, count(*) FROM work_orders GROUP BY tenant_id;
   ```
4. Şüpheli verinin hangi tenant'a ait olduğunu belirle.

**Dashboard/Log Sorguları:**
```sql
-- Tenant A kullanıcısının Tenant B verisine erişim kontrolü
SELECT a.* FROM audit_log a
JOIN users u ON a.user_id = u.id
WHERE u.tenant_id != a.tenant_id
AND a.created_at > now() - interval '7 days';
```

**Güvenli Teşhis Adımları:**
1. İlgili repository/DAO metodunu incele: sorguda `WHERE tenant_id = ?` var mı?
2. RLS (Row-Level Security) politikalarını kontrol et:
   ```sql
   SELECT * FROM pg_policies WHERE tablename IN ('customers', 'work_orders', 'devices');
   ```
3. İlgili controller'da tenant context'in doğru set edildiğini doğrula.
4. Aynı anda iki farklı tenant ile giriş yapıp aynı endpoint'i çağır, yanıtları karşılaştır.

**Geçici Azaltma (Mitigasyon):**
- Etkilenen endpoint'i kapat/korumaya al (feature flag veya geçici rate limit).
- Sızıntı tespit edilen sorgulara manuel `WHERE tenant_id = ?` ekle.
- Etkilenen tenant'ları read-only moda al.
- Etkilenen kullanıcı oturumlarını sonlandır.

**Kalıcı Çözüm:**
- Repository base sınıfına otomatik tenant_id filtresi ekle (Spring Data JPA `@Filter` veya Hibernate `@Where`).
- RLS'i PostgreSQL seviyesinde aktif et: her tenant için policy.
  ```sql
  ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
  CREATE POLICY tenant_isolation ON customers USING (tenant_id = current_setting('app.tenant_id')::UUID);
  ```
- CI hattına tenant izolasyon testi ekle: her yeni endpoint için otomatik cross-tenant erişim testi.
- Tüm repository sorgularını gözden geçir: native query var mı, tenant_id eksik mi?

**Rollback Koşulu:** RLS veya yeni tenant filter mekanizması hatalı çalışıyorsa devre dışı bırak ve önceki uygulama katmanı filtresine dön.

**İletişim ve Eskalasyon:**
- Güvenlik ekibine ve teknik lidere derhal bildir.
- Etkilenen tenant(lar)a durumu bildir.
- KVKK değerlendirmesi: kişisel veri ihlali bildirimi gerekli mi?
- 2 saat içinde çözüm sağlanamazsa harici destek al.

**Olay Sonrası Aksiyonlar:**
- Tüm tablolar için RLS policy'lerini tamamla (kademeli).
- Otomatik tenant izolasyon test suite'ini CI'a ekle.
- Kod inceleme checklist'ine "tenant_id filtresi var mı?" maddesini ekle.
- Veri sızıntısı etki analizi: hangi veriler, hangi tarih aralığında sızmış?
- KVKK bildirimi (gerekliyse).

---

## Runbook 4: Veritabanı Yavaşlığı

**Belirti:**
- Grafana: `db_query_duration_p95 > 500ms` veya `db_query_duration_p99 > 2s` alarmı.
- API yanıt süreleri uzamış, kullanıcılar "sayfa geç yükleniyor" şikayeti.
- Health check timeout vermeye başlamış.
- İş emri listesi, müşteri arama gibi operasyonlar yavaşlamış.

**Kullanıcı Etkisi:** Kullanıcı deneyimi bozulur, iş yapılamaz hale gelebilir. Yüksek (P1).

**İlk 5 Dakikada Yapılacaklar:**
1. Grafana → PostgreSQL Dashboard → Query Performance panelini aç.
2. En yavaş çalışan sorguları bul: `pg_stat_statements` (eğer kuruluysa).
3. Aktif bağlantı sayısını kontrol et: `SELECT count(*) FROM pg_stat_activity WHERE state = 'active';`
4. Lock durumunu kontrol et: `SELECT * FROM pg_locks WHERE NOT granted;`
5. Uzun süren sorguları bul: `SELECT pid, now() - query_start as duration, query FROM pg_stat_activity WHERE state = 'active' ORDER BY duration DESC LIMIT 10;`

**Dashboard/Log Sorguları:**
```sql
-- En yavaş 10 sorgu (pg_stat_statements ile)
SELECT query, mean_exec_time, calls, total_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC LIMIT 10;

-- Tablo boyutları
SELECT tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

**Güvenli Teşhis Adımları:**
1. `EXPLAIN ANALYZE` ile yavaş sorgunun planını incele: sequential scan mı var, indeks kullanılıyor mu?
2. İndeks durumunu kontrol et: `SELECT * FROM pg_indexes WHERE tablename IN ('work_orders', 'customers', 'audit_log');`
3. VACUUM durumu: `SELECT relname, last_vacuum, last_autovacuum, n_dead_tup FROM pg_stat_user_tables ORDER BY n_dead_tup DESC LIMIT 10;`
4. Disk kullanımı: `df -h /var/lib/postgresql/data` (veya managed service'de storage metriği)
5. Connection pool ayarları: `SHOW max_connections; SELECT count(*) FROM pg_stat_activity;`

**Geçici Azaltma (Mitigasyon):**
- En yavaş sorguyu tespit et ve ilgili endpoint'i geçici olarak rate-limit'le veya önbelleğe al.
- Uzun süren sorguları kill et: `SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = 'active' AND now() - query_start > interval '30 seconds';`
- Connection pool boyutunu geçici olarak artır.
- VACUUM FULL veya VACUUM ANALYZE çalıştır (düşük trafik saatinde).
- Read replica varsa okuma sorgularını replica'ya yönlendir.

**Kalıcı Çözüm:**
- Eksik indeksleri ekle: yavaş sorgunun WHERE/JOIN/ORDER BY kolonlarına indeks oluştur.
- Sorgu optimizasyonu: N+1 problemi, gereksiz JOIN, SELECT * yerine spesifik kolon.
- Audit log için partition (aylık) ekle.
- Connection pool tuning: max pool size, min idle, connection timeout değerlerini optimize et.
- PgBouncer veya benzeri connection pooler ekle (V1).
- Read replica ekle (V1, managed service ile kolay).
- Autovacuum ayarlarını agresifleştir.

**Rollback Koşulu:** Yeni eklenen indeks sorgu performansını daha da kötüleştirirse indeksi kaldır.

**İletişim ve Eskalasyon:**
- Slack'te durumu bildir: yavaşlığın nedeni, etkilenen sayfalar, tahmini düzelme süresi.
- 30 dakika içinde çözülemezse: DBA veya kıdemli backend geliştiriciye eskalasyon.
- Kullanıcı etkisi büyükse: e-posta veya in-app bildirim ile bilgilendirme.

**Olay Sonrası Aksiyonlar:**
- Slow query log'u düzenli izlemek için alarm kur.
- İndeks kullanım raporu ve eksik indeks tespiti için haftalık rutin oluştur.
- Veritabanı performans dashboard'unu güncelle.
- Büyüme projeksiyonuna göre kapasite planlaması yap.
- pg_stat_statements'i kalıcı olarak aktif et.

---

## Runbook 5: Veritabanı Bağlantı Havuzu Tükenmesi

**Belirti:**
- Grafana: `db_connection_pool_active >= db_connection_pool_max * 0.9` alarmı.
- API hataları: `HikariPool-1 - Connection is not available, request timed out after 30000ms`.
- Kullanıcılar 502/503 hatası alıyor.
- Health check: DB bağlantısı başarısız.

**Kullanıcı Etkisi:** Tüm sistem çalışamaz hale gelir. Kritik (P0).

**İlk 5 Dakikada Yapılacaklar:**
1. Grafana → DB Connection Pool panelini aç.
2. Aktif, idle, pending ve timeout bağlantı sayılarını kontrol et.
3. DB sunucusunda toplam bağlantı sayısını kontrol et: `SELECT count(*) FROM pg_stat_activity;`
4. Uzun süren sorguları tespit et (Runbook 4'teki sorgular).
5. API log'larında `Connection is not available` hatasını ara.

**Dashboard/Log Sorguları:**
```logql
# Loki: Connection pool hataları
{service="sahaflow-api"} |= "Connection is not available"
```
```promql
# Prometheus: Aktif bağlantı sayısı
hikaricp_connections_active{pool="HikariPool-1"}
```

**Güvenli Teşhis Adımları:**
1. Hangi endpoint'lerin bağlantıları tükettiğini tespit et: thread dump veya APM span süreleri.
2. Bağlantı sızıntısı (connection leak) var mı? `hikaricp_connections_active` sürekli artıyor mu?
3. HikariCP konfigürasyonunu kontrol et:
   - `maximumPoolSize`
   - `minimumIdle`
   - `connectionTimeout`
   - `idleTimeout`
   - `maxLifetime`
   - `leakDetectionThreshold`

**Geçici Azaltma (Mitigasyon):**
- API pod'unu yeniden başlat (bağlantı havuzu sıfırlanır).
- `maximumPoolSize`'ı geçici olarak artır (örn: 10 → 20) ve pod'u yeniden başlat.
- DB sunucusunda `max_connections` değerini kontrol et, yetersizse artır.
- Uzun süren bağlantıları DB tarafında sonlandır.
- Trafiği azaltmak için rate limiting'i agresifleştir.

**Kalıcı Çözüm:**
- Connection leak tespiti: `leakDetectionThreshold: 10000` (10 sn) ayarla, leak varsa log'a düşer.
- `maximumPoolSize` formülü: `max_connections = (core_count * 2) + effective_spindle_count`. Tipik olarak 10-20 arası yeterlidir. Daha fazla bağlantı performansı düşürür.
- Uzun süren sorguları optimize et (Runbook 4).
- PgBouncer transaction pooling ekle (V1).
- Connection timeout süresini düşür: `connectionTimeout: 5000` (5 sn) yeterli.
- Circuit breaker pattern: DB erişilemezse hızlı hata ver (fail-fast).

**Rollback Koşulu:** HikariCP konfigürasyonu değişikliği sorunu daha da kötüleştirirse eski değerlere dön.

**İletişim ve Eskalasyon:**
- Derhal Slack #incidents kanalına bildir.
- 15 dakika içinde çözülemezse: altyapı/backend ekibine eskalasyon.
- Kullanıcılara bilgilendirme: sistem geçici olarak erişilemez durumda, tahmini düzelme süresi.

**Olay Sonrası Aksiyonlar:**
- Connection pool metrikleri için daha erken uyarı threshold'ları belirle (%70 → warning, %90 → critical).
- Connection leak tespiti için `leakDetectionThreshold`'ı kalıcı olarak aktif et.
- Yük testinde connection pool davranışını gözlemle.
- HikariCP konfigürasyonunu dokümante et ve gerekçelendir.

---

## Runbook 6: Dosya Yükleme Sorunu

**Belirti:**
- Mobil uygulamada fotoğraf/imza yükleme başarısız.
- API: `POST /api/files/upload` endpoint'i 413, 500 veya timeout dönüyor.
- Grafana: `file_upload_error_rate > %5` veya `file_upload_duration_p95 > 30s`.
- Object storage (S3) metriklerinde hata oranı artmış.

**Kullanıcı Etkisi:** Teknisyenler servis raporuna fotoğraf ekleyemez, imza alamaz. Yüksek (P1).

**İlk 5 Dakikada Yapılacaklar:**
1. Object storage (S3/MinIO) health durumunu kontrol et: konsoldan veya CLI ile.
2. API log'larında upload hatalarını ara:
   ```logql
   {service="sahaflow-api"} | json | path = "/api/files/upload" and status >= 400
   ```
3. Presigned URL oluşturma testi yap: `aws s3 presign s3://bucket/test.txt --expires-in 60` (veya SDK ile).
4. Disk kullanımı: API pod'unda `/tmp` dolmuş olabilir (multipart upload temp dosyaları).

**Dashboard/Log Sorguları:**
```promql
# Prometheus: Dosya yükleme hata oranı
rate(file_upload_error_total[5m]) / rate(file_upload_total[5m])
```

**Güvenli Teşhis Adımları:**
1. S3 bucket policy ve CORS ayarlarını kontrol et.
2. IAM credentials / access key geçerliliğini kontrol et: `aws sts get-caller-identity`.
3. Dosya boyut limiti: API'de `spring.servlet.multipart.max-file-size` ve `max-request-size` ayarlarını kontrol et.
4. Ağ bağlantısı: API pod'undan S3 endpoint'ine erişim var mı? `curl -I https://s3.amazonaws.com`
5. Bucket kotası dolmuş mu?

**Geçici Azaltma (Mitigasyon):**
- Geçici olarak dosya boyut limitini düşür (örn: 10MB → 5MB).
- S3 yerine geçici olarak yerel diske kaydet (MVP/küçük ölçekte, sonra S3'e senkronize et).
- Presigned URL süresini artır (mobil bağlantı yavaşsa timeout olabilir).
- S3 bucket'ını temizle: eski/geçici dosyaları sil.

**Kalıcı Çözüm:**
- Multipart upload: büyük dosyalar için parçalı yükleme.
- Mobil tarafta sıkıştırma: fotoğraflar yükleme öncesi JPEG %70 kalite ile sıkıştırılsın.
- Exponential backoff retry: başarısız yüklemeler 3 kez tekrar denensin.
- S3 lifecycle policy: geçici dosyalar 24 saat sonra otomatik silinsin.
- File upload için ayrı rate limit ve daha yüksek timeout değeri.
- Object storage health check'i `/actuator/health` kapsamına al.

**Rollback Koşulu:** Yeni dosya yükleme stratejisi (multipart) sorun çıkarırsa eski tek parça yüklemeye dön.

**İletişim ve Eskalasyon:**
- Slack #incidents kanalına bildir: etkilenen kullanıcı sayısı.
- 1 saat içinde çözülemezse: altyapı geliştiriciye eskalasyon.
- Mobil kullanıcılara push notification: "Fotoğraf yükleme geçici olarak çalışmıyor, en kısa sürede düzelecek."

**Olay Sonrası Aksiyonlar:**
- Dosya yükleme metrikleri için daha detaylı dashboard (boyut dağılımı, kaynak: web/mobil).
- CDN değerlendir (büyük ölçekte).
- S3 bucket monitoring ve alarm kur.

---

## Runbook 7: Webhook Retry Birikmesi

**Belirti:**
- Webhook işleme kuyruğunda birikme: `webhook_pending_count > 100` veya sürekli artıyor.
- Webhook hedef sunucularından "timeout" veya "connection refused" hatası.
- `webhook_retry_count` metrikleri yükseliyor.
- Harici sistem (ERP, muhasebe) Saha Flow'dan veri alamıyor.

**Kullanıcı Etkisi:** Entegrasyonlar çalışmaz; müşteri sistemlerine veri akmaz. Orta (P2) — MVP'de webhook yoksa V1'de geçerli.

**İlk 5 Dakikada Yapılacaklar:**
1. Webhook kuyruk boyutunu kontrol et: `webhook_pending_count` metriği.
2. En çok hata alan webhook hedeflerini bul:
   ```sql
   SELECT webhook_url, count(*), max(created_at) FROM webhook_deliveries WHERE status = 'FAILED' GROUP BY webhook_url;
   ```
3. Webhook hedef sunucusunun erişilebilirliğini test et: `curl -I <webhook_url>`.
4. Son başarılı teslimat zamanını kontrol et.

**Dashboard/Log Sorguları:**
```logql
{service="sahaflow-api"} |= "webhook" |= "error"
```

**Güvenli Teşhis Adımları:**
1. Webhook hedef URL'lerini kontrol et: değişmiş veya geçersiz olabilir.
2. Webhook signature/secret doğrulamasını kontrol et: yanlış secret ile 401 alınıyor olabilir.
3. Retry konfigürasyonu: maximum retry sayısı, backoff süresi.
4. Outbound ağ erişimi: API pod'undan hedef sunucuya güvenlik duvarı izni var mı?

**Geçici Azaltma (Mitigasyon):**
- Sürekli hata alan webhook'ları geçici olarak pause et.
- Retry süresi çok kısaysa artır (örn: 5sn → 30sn).
- Webhook kuyruğunu temizle: başarısız ve eski (1 günden eski) kayıtları arşivle.
- Webhook hedef sunucusu geçici olarak kullanım dışıysa, tenant'ı bilgilendir.

**Kalıcı Çözüm:**
- Circuit breaker: sürekli hata alan webhook hedefi için devreyi aç, belirli süre sonra dene.
- Dead letter queue: maksimum retry'yi aşan webhook'ları ayrı bir kuyruğa al, manuel müdahale.
- Exponential backoff: 1dk, 5dk, 15dk, 1sa, 6sa, 24sa.
- Webhook monitoring dashboard: hedef bazında başarı oranı, latency, retry count.
- Webhook hedef sağlık kontrolü: periyodik ping.
- Tenant admin paneline webhook durum paneli ekle: kullanıcı kendi webhook durumunu görebilsin.

**Rollback Koşulu:** Yeni retry stratejisi kuyruğu daha da büyütürse eski stratejiye dön.

**İletişim ve Eskalasyon:**
- Slack'te durumu bildir.
- Etkilenen tenant'ların admin'lerine e-posta ile bildir.
- 2 saat içinde çözülemezse entegrasyon sorumlusu geliştiriciye eskalasyon.

**Olay Sonrası Aksiyonlar:**
- Webhook reliability SLA'sı belirle: %99 teslimat oranı.
- Webhook hedef sağlık kontrolü otomasyonu.
- Başarısız webhook'lar için tenant'a bildirim mekanizması.
- Webhook retry ve circuit breaker konfigürasyonunu dokümante et.

---

## Runbook 8: Deployment Rollback

**Belirti:**
- Yeni deploy sonrası hata oranı arttı (P0/P1 olay).
- Kullanıcı şikayetleri: "önceden çalışıyordu, şimdi çalışmıyor".
- Health check başarısız.
- Grafana'da deploy sonrası metriklerde bozulma: error rate ↑, latency ↑, throughput ↓.

**Kullanıcı Etkisi:** Yeni sürüm hatalı; kullanıcılar etkileniyor. Kritik (P0).

**İlk 5 Dakikada Yapılacaklar:**
1. Deploy zamanını doğrula: GitHub Actions son deploy kaydı, Docker image tag.
2. Hata oranını ve tipini belirle: Grafana'da deploy zamanı öncesi/sonrası karşılaştır.
3. Son deployment'da neler değiştiğini kontrol et: GitHub release notları, commit diff.
4. Database migration yapıldı mı? Yapıldıysa rollback/roll-forward planı var mı?
5. Karar: **Rollback gerekli mi?** Cevap "evet" ise hemen başlat.

**Dashboard/Log Sorguları:**
```promql
# Deploy öncesi/sonrası error rate karşılaştırması
rate(http_server_errors_total[5m])
```
```logql
# Deploy sonrası hatalar
{service="sahaflow-api"} | json | status >= 500
```

**Güvenli Teşhis Adımları:**
1. Son commit'leri incele: hangi değişiklikler yapıldı?
2. Yeni migration var mı? Migration başarılı oldu mu?
3. Konfigürasyon değişikliği var mı? (env var, secret, feature flag)
4. Yeni bağımlılık (library) eklenmiş mi? Uyumsuzluk olabilir mi?
5. Staging'de aynı sorun var mıydı? (Staging'de test edilmediyse süreç hatası)

**Rollback Adımları:**

**A. Migration yoksa (basit rollback):**
```bash
# Kubernetes
kubectl rollout undo deployment/sahaflow-api
kubectl rollout undo deployment/sahaflow-web

# Docker Compose
docker-compose down
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
# (önceki image tag ile)
```

**B. Geri alınabilir migration varsa:**
1. Önce uygulamayı rollback et (önceki image).
2. Sonra migration'ı rollback et:
   ```bash
   # Flyway
   flyway -url=jdbc:postgresql://... undo
   # Veya manuel: V1_0_5__undo.sql çalıştır
   ```

**C. Geri alınamaz migration varsa (roll-forward):**
1. Migration'ı geri almak mümkün değilse, roll-forward stratejisi uygula:
2. Acil fix geliştir ve yeni migration ile deploy et.
3. Bu durumda rollback yapılamaz — sadece ileri gidilebilir.

**Geçici Azaltma (Mitigasyon):**
- Hatalı endpoint'i feature flag ile kapat.
- Read-only moda al (eğer hata veri yazmada ise).
- Trafiği önceki sürüme yönlendir (canary/blue-green varsa).

**Kalıcı Çözüm:**
- Canary deployment: önce trafiğin %10'u yeni sürüme, sorun yoksa kademeli artır.
- Blue-green deployment: yeni sürüm hazır, tek seferde geçiş.
- Staging'de smoke test zorunluluğu: deploy sonrası otomatik E2E test.
- Database migration: her zaman geri alınabilir yaz, değilse big red warning.
- Deploy penceresi: iş saatleri içinde, ekip müsaitken deploy yap.

**Rollback Koşulu:** Rollback başarısız olursa roll-forward (yeni fix) uygula.

**İletişim ve Eskalasyon:**
- Derhal Slack #incidents kanalına bildir: neyin rollback edildiği, tahmini süre.
- Rollback tamamlandığında bilgilendir.
- Kullanıcı etkilendiyse bilgilendirme yap.
- 30 dakika içinde rollback tamamlanmazsa tüm ekibi çağır.

**Olay Sonrası Aksiyonlar:**
- RCA: neden bu hata staging'de yakalanmadı?
- Staging test sürecini gözden geçir: smoke test, regression test.
- Deploy checklist'ini güncelle.
- "Geri alınamaz migration" varsa bunu azaltmak için süreç iyileştir.

---

## Runbook 9: Hatalı Migration

**Belirti:**
- CI/CD hattında migration adımı başarısız: Flyway hata mesajı.
- API pod'u başlamıyor, CrashLoopBackOff durumunda.
- Log'da `FlywayException`, `SQLException`, migration checksum mismatch.
- Veritabanı şeması bozuk; yanlış kolon tipi, eksik tablo, constraint hatası.

**Kullanıcı Etkisi:** Deployment yapılamaz, sistem güncellenemez. Yüksek (P1).

**İlk 5 Dakikada Yapılacaklar:**
1. Flyway hata mesajını oku: hangi migration, hangi satır?
2. Migration dosyasını kontrol et: `git show HEAD -- db/migration/`
3. Flyway schema history tablosunu kontrol et:
   ```sql
   SELECT version, description, type, state, installed_on, checksum FROM flyway_schema_history ORDER BY installed_on DESC LIMIT 10;
   ```
4. Migration'ın başarılı/başarısız durumunu teyit et.

**Dashboard/Log Sorguları:**
```logql
{service="sahaflow-api"} |= "Flyway" or |= "migration"
```

**Güvenli Teşhis Adımları:**
1. Migration checksum hatası: mevcut migration dosyası, veritabanına kaydedilen checksum'dan farklı. Kim değiştirdi?
2. Migration sıralaması bozuk mu? Versiyon numarası çakışması.
3. SQL syntax hatası: migration'ı manuel olarak DB'de dene (staging'de!).
4. Migration'ın production verisi üzerindeki etkisi: büyük tabloda ALTER TABLE lock süresi?

**Hatalı Migration Senaryoları ve Çözümleri:**

**Senaryo 1: Checksum mismatch (eski migration değiştirilmiş)**
- Çözüm: Flyway repair yap:
  ```sql
  UPDATE flyway_schema_history SET checksum = <yeni_checksum> WHERE version = '1.0.5';
  ```
  Veya: `flyway repair` komutu.
- DİKKAT: Sadece değişikliğin güvenli olduğundan eminsen yap. Eski migration'ı değiştirmek kötü pratiktir.

**Senaryo 2: Yeni migration hatalı SQL içeriyor**
- Çözüm: Migration'ı düzelt, yeni versiyon numarası ile commit'le. Eski hatalı migration'ı flyway_schema_history'den sil:
  ```sql
  DELETE FROM flyway_schema_history WHERE version = '1.0.6';
  ```
- Sonra doğru migration'ı deploy et.

**Senaryo 3: Migration production'da lock/performans sorunu**
- Çözüm: Migration'ı iptal et (henüz tamamlanmadıysa), düşük trafik saatinde veya çevrimiçi şema değişikliği stratejisiyle tekrar dene.

**Geçici Azaltma (Mitigasyon):**
- Migration'ı atla (Flyway skip): geçici olarak `spring.flyway.enabled=false` ile API'yi başlat.
- Hatalı migration'ı flyway_schema_history'den kaldır ve API'yi başlat.
- DİKKAT: Migration atlanırsa şema uyumsuzluğu application hatasına yol açabilir.

**Kalıcı Çözüm:**
- Migration geliştirme kuralı: Var olan migration dosyası ASLA değiştirilmez. Her değişiklik yeni versiyon numarası ile yapılır.
- Migration review süreci: her migration PR'da ayrıca incelenir.
- Migration testi: staging'de migration önce çalıştırılır ve smoke test yapılır.
- Büyük tablolarda ALTER TABLE için çevrimiçi strateji (V1): `pt-online-schema-change`, `pgroll` veya `RESHAPE`.
- Migration rollback dosyaları: her migration'ın `undo` karşılığı yazılır.

**Rollback Koşulu:** Hatalı migration'ı flyway_schema_history'den kaldır ve önceki migration sürümüne dön.

**İletişim ve Eskalasyon:**
- Slack'te migration hatasını ve etkisini bildir.
- Deployment'ı durdur, diğer geliştiricileri uyar: "migration sorunu nedeniyle deploy yapmayın".
- 1 saat içinde çözülemezse DBA veya kıdemli backend geliştiriciye eskalasyon.

**Olay Sonrası Aksiyonlar:**
- Migration checklist'ini güncelle.
- "Eski migration değiştirilmez" kuralını CONTRIBUTING.md'ye ekle.
- CI'a migration checksum validasyonu ekle: PR'da eski migration değişmişse uyar.
- Migration test otomasyonunu iyileştir.

---

## Runbook 10: Yedekten Geri Dönüş (Backup Restore)

**Belirti:**
- Veritabanı bozulması, yanlışlıkla veri silinmesi, ransomware.
- Kullanıcı raporu: "tüm müşterilerim silinmiş".
- DB sunucusu çökmüş ve kurtarılamıyor.
- Felaket kurtarma (DR) senaryosu.

**Kullanıcı Etkisi:** Veri kaybı, sistem çalışamaz. Kritik (P0).

**İlk 5 Dakikada Yapılacaklar:**
1. Hasar tespiti: ne kadar veri kayboldu/bozuldu? Hangi tenant'lar etkilendi?
2. Son yedeğin zamanını ve durumunu kontrol et:
   ```bash
   # AWS RDS: son snapshot
   aws rds describe-db-snapshots --db-instance-identifier sahaflow-prod --query 'reverse(sort_by(DBSnapshots, &SnapshotCreateTime))[0]'
   ```
3. RPO'yu hesapla: son yedek ile şimdiki zaman arasındaki fark. Hedef: < 1 saat.
4. Restore süresi tahmini: RTO hedefi < 4 saat.

**Dashboard/Log Sorguları:**
```sql
-- Hasar tespiti: silinen kayıt sayısı
SELECT tenant_id, count(*) FROM audit_log WHERE action = 'DELETE' AND created_at > now() - interval '24 hours' GROUP BY tenant_id;
```

**Güvenli Teşhis Adımları:**
1. Yedek dosyasının bütünlüğünü kontrol et: `pg_restore --list backup.dump | head`
2. Yedeğin hangi tenant'ları ve tabloları içerdiğini kontrol et.
3. Restore yapılacak hedef sunucunun disk alanı yeterli mi?
4. Uygulama ile restore edilecek DB sürümü uyumlu mu? (PostgreSQL major version)

**Restore Adımları:**

**A. Managed DB (AWS RDS / GCP Cloud SQL):**
```bash
# RDS: Snapshot'tan yeni instance oluştur
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier sahaflow-prod-restored \
  --db-snapshot-identifier <snapshot_id>

# Yeni instance endpoint'ini al, uygulama konfigürasyonunu güncelle
```

**B. Self-hosted (pg_dump/pg_restore):**
```bash
# 1. Yeni boş veritabanı oluştur
createdb -h <host> -U <user> sahaflow_restored

# 2. Yedeği geri yükle
pg_restore -h <host> -U <user> -d sahaflow_restored -j 4 /backups/sahaflow_20260721_030000.dump

# 3. Uygulama konfigürasyonunda DB adını değiştir
```

**C. Point-in-Time Recovery (PITR - WAL ile):**
```bash
# Belirli bir zamana geri dön (örn: silme işleminden hemen önce)
pg_restore ... --target-time="2026-07-21 14:25:00+03"
```

**Geçici Azaltma (Mitigasyon):**
- Restore sırasında sistemi bakım moduna al: tüm kullanıcıları bilgilendir.
- Read-only mod: varsa, restore sırasında kullanıcıların veri okumasına izin ver (eski snapshot'tan).
- Sadece etkilenen tenant için restore yapılabiliyorsa tam sistem restore'undan kaçın (tenant bazlı restore stratejisi).

**Kalıcı Çözüm:**
- Point-in-time recovery (PITR): WAL archiving aktif et, belirli bir zamana dönebil.
- Günlük tam yedek + sürekli WAL yedekleme.
- Yedek şifreleme: yedek dosyaları AES-256 ile şifrelenir.
- Yedek testi: ayda bir kez yedekten geri dönüş tatbikatı yap, süreyi ölç.
- Cross-region backup: başka bir bölgede yedek kopyası.
- Tenant bazlı backup/restore stratejisi (V1).

**Rollback Koşulu:** Restore başarısız olursa eski (bozuk) veritabanına dön, başka bir yedek dene.

**İletişim ve Eskalasyon:**
- Derhal tüm kullanıcılara e-posta/SMS: sistem bakımda, tahmini dönüş süresi.
- Slack #incidents kanalında restore sürecini canlı güncelle.
- Restore tamamlandığında bilgilendir ve kullanıcılardan veri doğrulama iste.
- 4 saat içinde restore tamamlanmazsa yönetime eskalasyon.

**Olay Sonrası Aksiyonlar:**
- Restore süresini ölç: RTO hedefi tuttu mu?
- Veri kaybı miktarını belirle: RPO hedefi tuttu mu?
- Backup stratejisini gözden geçir: sıklık, retention, test.
- Tenant bazlı restore yeteneği geliştir.
- Felaket kurtarma (DR) dokümanını güncelle.

---

## Runbook 11: Kayıp Mobil Cihaz / Oturum İptali

**Belirti:**
- Teknisyen cihazının kaybolduğunu/çalındığını bildirdi.
- Admin panelinden oturum sonlandırma talebi.
- Şüpheli oturum aktivitesi: normal dışı saatte, normal dışı konumdan erişim.
- Audit log'da anormal işlem deseni.

**Kullanıcı Etkisi:** Yetkisiz erişim riski, veri ihlali riski. Yüksek (P1).

**İlk 5 Dakikada Yapılacaklar:**
1. Kullanıcının tüm aktif refresh token'larını geçersiz kıl:
   ```sql
   UPDATE users SET refresh_token_revoked_at = now() WHERE id = ?;
   ```
2. Varsa admin panelinden "Oturumu Sonlandır" butonuna bas.
3. JWT signing key rotasyonu: tüm token'ları geçersiz kılmak gerekiyorsa yeni secret key üret.
4. Kullanıcının son aktivitesini kontrol et: audit log'da son işlemler.

**Dashboard/Log Sorguları:**
```sql
-- Kullanıcının son 24 saatteki işlemleri
SELECT * FROM audit_log WHERE user_id = ? AND created_at > now() - interval '24 hours' ORDER BY created_at DESC;

-- Kullanıcının aktif oturumları (session tracking varsa)
SELECT * FROM user_sessions WHERE user_id = ? AND expires_at > now();
```

**Güvenli Teşhis Adımları:**
1. Kullanıcının son IP adreslerini ve user agent'larını kontrol et (audit log'dan).
2. Anormal işlem var mı? Normalde yapmadığı bir işlem, normal dışı saat?
3. Cihazın son konumunu kontrol et (mobil uygulama konum logging yapıyorsa).
4. Etkilenen tenant'ta başka şüpheli oturum var mı?

**Geçici Azaltma (Mitigasyon):**
- Kullanıcının hesabını geçici olarak devre dışı bırak.
- Tenant'taki tüm oturumları sonlandır (aşırı ama güvenli).
- Mobil cihaz için uzaktan veri silme komutu gönder (MDM varsa, MVP'de yok).
- Cihaz ID'sini kara listeye al (yeni oturum açamaz).
- Etkilenen tenant'ı read-only moda al.

**Kalıcı Çözüm:**
- Admin panelinden "Tüm Oturumları Sonlandır" ve "Cihazı Kara Listeye Al" butonları.
- Mobil uygulama: 15 dakika idle sonrası biometrik kilit (parmak izi/yüz).
- Cihaz bazlı oturum takibi: her oturum `device_id` ile ilişkilendirilir.
- Anormal oturum tespiti: yeni cihaz/konumdan girişte e-posta bildirimi.
- Uzaktan oturum sonlandırma API'si (mobil client polling yapar).
- MDM entegrasyonu (V1): uzaktan silme, cihaz kilitleme.

**Rollback Koşulu:** JWT secret rotasyonu tüm kullanıcıları etkiledi; etki kabul edilebilir mi? Değilse sadece etkilenen kullanıcı token'ını geçersiz kıl.

**İletişim ve Eskalasyon:**
- Etkilenen kullanıcıya ve tenant admin'ine derhal telefon/SMS ile ulaş.
- Slack #security kanalına bildir.
- Şüpheli aktivite tespit edilirse KVKK değerlendirmesi yap.
- 30 dakika içinde oturum sonlandırılamazsa güvenlik ekibine eskalasyon.

**Olay Sonrası Aksiyonlar:**
- Cihaz/oturum güvenliği politikasını gözden geçir.
- Biometrik kilit ve idle timeout sürelerini ayarla.
- Kullanıcı eğitimi: cihaz güvenliği, şifre güvenliği.
- Cihaz kaybı/çalıntı runbook'unu test et.

---

## Runbook 12: Secret Sızıntısı

**Belirti:**
- GitHub'ta public repoda secret (API key, DB şifresi, JWT secret) tespit edildi (Gitleaks/truffleHog alarmı).
- CI/CD log'larında secret görünüyor.
- Ortam değişkeni yanlışlıkla client-side koda gömülmüş.
- Harici bildirim: biri JWT token'ları decode edebildiğini söylüyor.

**Kullanıcı Etkisi:** Yetkisiz erişim, veri ihlali, sistem ele geçirilmesi riski. Kritik (P0).

**İlk 5 Dakikada Yapılacaklar:**
1. Sızan secret'ı tespit et: hangi secret, nerede, ne zamandan beri?
2. Secret'ı derhal geçersiz kıl:
   - DB şifresi: `ALTER USER sahaflow_app WITH PASSWORD 'yeni_guvenli_sifre';`
   - JWT secret: yeni secret üret, tüm token'ları geçersiz kıl.
   - API key: servis sağlayıcı dashboard'undan revoke et.
   - S3 access key: IAM'den delete et, yeni key oluştur.
3. Uygulamayı yeni secret ile güncelle ve deploy et.
4. Sızan secret'ın commit geçmişini temizle.

**Dashboard/Log Sorguları:**
```bash
# Git log'da secret ara
git log -p | grep -i "secret\|password\|token\|key"

# GitHub secret scanning alerts
gh secret list --org <org_name>
```

**Güvenli Teşhis Adımları:**
1. Secret'ın hangi ortamlarda kullanıldığını belirle: prod, staging, dev.
2. Secret'ın sızma şekli: commit mi, log mu, ortam değişkeni mi, hata mesajı mı?
3. Sızan secret ile yetkisiz erişim olup olmadığını kontrol et:
   - Audit log'da anormal aktivite.
   - DB log'da tanınmayan IP'lerden bağlantı.
   - API usage pattern'da anomali.
4. Sızan secret'ın yetki seviyesini belirle: sadece okuma mı, yazma mı, admin mi?

**Geçici Azaltma (Mitigasyon):**
- Etkilenen secret'ı derhal revoke et ve yenisini oluştur.
- Sistem genelinde tüm oturumları sonlandır (JWT secret sızdıysa).
- Güvenlik duvarından şüpheli IP'leri engelle.
- Hassas endpoint'leri geçici olarak kısıtla.

**Kalıcı Çözüm:**

**Git geçmişinden secret temizleme (BFG Repo-Cleaner veya git filter-branch):**
```bash
# BFG ile
bfg --delete-files .env --replace-text passwords.txt repo.git

# git filter-branch ile (eski yöntem)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all
git push --force --all
git push --force --tags
```

**Önleyici tedbirler:**
- Pre-commit hook: Gitleaks veya git-secrets ile commit öncesi tarama.
- CI hattına otomatik secret tarama ekle.
- `.gitignore`'a `.env`, `*.pem`, `credentials.*` ekle.
- Ortam değişkenlerini secret manager'da tut (.env dosyası yerine).
- `.env.example` dosyasında sadece şablon değerler, gerçek secret yok.
- JWT secret rotasyonu için otomatik mekanizma (V1).
- Secret scanning alert'lerini e-posta/Slack'e bağla.

**Rollback Koşulu:** Secret rotasyonu sonrası uygulama başlamazsa eski secret'ı geçici olarak geri yükle, sorunu çöz, sonra tekrar rotasyon yap.

**İletişim ve Eskalasyon:**
- Derhal tüm teknik ekibe Slack #security kanalında bildir.
- Secret sızıntısının kapsamı büyükse yönetime ve hukuk danışmanına eskalasyon.
- KVKK değerlendirmesi: kişisel veri ihlali oluştu mu?
- Etkilenen müşterilere bildirim (gerekliyse).
- 1 saat içinde secret rotasyonu tamamlanmazsa acil durum protokolü başlat.

**Olay Sonrası Aksiyonlar:**
- Tüm secret'ları rotasyonla: sızmamış olsa bile önlem olarak.
- Secret management sürecini gözden geçir: HashiCorp Vault, AWS Secrets Manager, GitHub Secrets.
- Geliştirici eğitimi: secret güvenliği, güvenli kodlama.
- Repository visibility'yi kontrol et: yanlışlıkla public olmamış mı?
- Güvenlik olayı kaydı ve RCA.

---

## Runbook 13: Güvenlik Olayı Müdahalesi

**Belirti:**
- OWASP ZAP / Snyk taramasında kritik açık bulundu.
- Müşteriden veya harici araştırmacıdan güvenlik açığı bildirimi.
- Sistemde şüpheli davranış: bilinmeyen admin kullanıcısı, anormal veri trafiği.
- WAF/firewall log'larında saldırı deseni: SQL injection, XSS denemesi.
- KVKK kapsamında veri ihlali şüphesi.

**Kullanıcı Etkisi:** Sistem güvenliği tehlikeye girmiş olabilir; veri ihlali, hizmet kesintisi. Kritik (P0).

**İlk 15 Dakikada Yapılacaklar (Olay Müdahale Süreci):**

**A. Tespit ve Doğrulama (0-15 dk):**
1. Bildirimi doğrula: gerçek bir açık mı? Hangi sistem etkilenmiş?
2. CVSS skoru hesapla: Kritik (9.0+), Yüksek (7.0-8.9), Orta (4.0-6.9)?
3. Açığın istismar edilip edilmediğini araştır:
   - Audit log'da ilgili desen.
   - WAF log'larında saldırı izi.
   - Bilinen bir CVE mi? İstismar kodu (PoC) yayında mı?

**B. Containment (15-60 dk):**
1. Etkilenen sistemi/servisi izole et: güvenlik duvarı kuralı, pod'u durdur.
2. Etkilenen kullanıcı hesaplarını dondur.
3. Ağ segmentasyonu: etkilenen segmenti ayır.
4. Saldırgan IP'lerini güvenlik duvarında engelle.
5. Kritik verilerin yedeğini al (kanıt olarak).
6. Tüm oturumları sonlandır, şifre sıfırlama zorla.

**C. Araştırma ve Analiz (1-4 saat):**
1. Saldırı vektörünü belirle: nasıl girdiler?
2. Etki analizi: hangi verilere erişildi? Hangi tenant'lar etkilendi?
3. Zaman çizelgesi oluştur: ilk erişim, yanal hareket, veri sızıntısı.
4. Log analizi: API log, audit log, DB log, sistem log.
5. Adli bilişim: disk image, memory dump (gerekirse harici uzman).

**D. Kurtarma (4-24 saat):**
1. Açığı kapat: yama, konfigürasyon değişikliği, kod düzeltmesi.
2. Sistemi temizle: backdoor, web shell, kalıcı erişim mekanizmalarını temizle.
3. Secret rotasyonu (tüm ortamlar).
4. Sistemleri güvenli şekilde tekrar devreye al.
5. Monitoring'i artır: ek alarmlar, daha sıkı threshold.

**E. Bildirim ve Yasal (ilk 72 saat):**
1. KVKK veri ihlali bildirimi: Kişisel Verileri Koruma Kurumu'na 72 saat içinde.
2. Etkilenen kişilere (veri sahiplerine) bildirim.
3. Hukuk danışmanı ile koordinasyon.
4. Siber olay bildirimi (USOM/BTK - gerekiyorsa).

**Dashboard/Log Sorguları:**
```sql
-- Şüpheli kullanıcı aktivitesi
SELECT * FROM audit_log WHERE user_id IN (SELECT id FROM users WHERE created_at > now() - interval '24 hours')
AND action IN ('DELETE', 'UPDATE') ORDER BY created_at DESC;

-- Anormal saatte erişim
SELECT * FROM audit_log WHERE EXTRACT(HOUR FROM created_at) BETWEEN 0 AND 5 ORDER BY created_at DESC;

-- Çok sayıda başarısız giriş denemesi
SELECT user_id, count(*) FROM audit_log WHERE action = 'LOGIN_FAILED' AND created_at > now() - interval '1 hour'
GROUP BY user_id HAVING count(*) > 10;
```
```logql
# Anormal error rate
{service="sahaflow-api"} | json | status >= 400 | line_format "{{.path}} {{.status}} {{.message}}"
```

**Geçici Azaltma (Mitigasyon):**
- WAF kuralı ekle: bilinen saldırı desenini engelle.
- Rate limiting'i sıkılaştır: IP bazlı 1 istek/sn.
- Hassas endpoint'leri geçici olarak VPN/IP whitelist arkasına al.
- Sistem genelinde parola sıfırlama zorunluluğu.
- MFA'yı tüm kullanıcılar için zorunlu hale getir.

**Kalıcı Çözüm:**
- Güvenlik açığını kök neden seviyesinde düzelt.
- Güvenlik test sürecini iyileştir: SAST, DAST, dependency scanning.
- Penetrasyon testi planla (harici firma).
- Incident response planını güncelle.
- Güvenlik farkındalık eğitimi (tüm ekip).
- Bug bounty programı başlat (V1).

**Rollback Koşulu:** Yama sonrası sistem çalışmazsa önceki sürüme dön, açığı alternatif yöntemle kapat (WAF kuralı, IP kısıtlaması).

**İletişim ve Eskalasyon:**
- Olay tespit edilir edilmez Slack #security kanalına ve teknik lidere bildir.
- 1 saat içinde müdahale başlamazsa CTO'ya eskalasyon.
- Müşteri bildirimi: yasal zorunluluğa ve etkiye göre.
- Medya/halkla ilişkiler: gerekirse kurumsal iletişim ekibi ile koordinasyon.

**Olay Sonrası Aksiyonlar:**
- Kapsamlı RCA ve postmortem dokümanı.
- Güvenlik açığının CVE kaydı (gerekliyse).
- Incident response planı tatbikatı (6 ayda bir).
- Güvenlik yatırımı: araç, eğitim, süreç.
- Harici güvenlik danışmanı ile mimari ve kod incelemesi.
- Tüm ortamlar için güvenlik taraması.
- Olay kaydı ve lessons learned.

---

## Runbook Çalıştırma Sıklığı ve Test Takvimi

| Runbook | Test Sıklığı | Son Test Tarihi | Sorumlu |
|---|---|---|---|
| 1. Giriş sorunu | Ayda 1 | — | Backend |
| 2. Yetki ihlali | Çeyrekte 1 | — | Güvenlik |
| 3. Tenant sızıntısı | Çeyrekte 1 | — | Güvenlik |
| 4. DB yavaşlığı | Ayda 1 | — | Backend |
| 5. Connection pool | Ayda 1 | — | Backend |
| 6. Dosya yükleme | Ayda 1 | — | Backend/Mobil |
| 7. Webhook birikmesi | Çeyrekte 1 | — | Backend |
| 8. Deploy rollback | Her release | — | DevOps |
| 9. Hatalı migration | Her release | — | Backend |
| 10. Yedekten dönüş | Ayda 1 | — | DevOps/Backend |
| 11. Kayıp cihaz | Çeyrekte 1 | — | Mobil/Güvenlik |
| 12. Secret sızıntısı | Çeyrekte 1 | — | Güvenlik/DevOps |
| 13. Güvenlik olayı | 6 ayda 1 | — | Tüm ekip |

---

## Acil Durum İletişim Zinciri

| Sıra | Rol | İletişim | Ne Zaman |
|---|---|---|---|
| 1 | Nöbetçi geliştirici | Slack + Telefon | Her P0/P1 olayında |
| 2 | Teknik lider | Slack + Telefon | 15 dk içinde çözülemezse |
| 3 | CTO / Ürün sahibi | Telefon | 30 dk içinde çözülemezse, müşteri etkilenirse |
| 4 | Hukuk danışmanı | Telefon | KVKK/veri ihlali şüphesinde |
| 5 | Harici destek (DBA, güvenlik) | Telefon/E-posta | 2 saat içinde çözülemezse |

---

## Karar Bekleyen Konular

1. Managed Kubernetes mi yoksa Docker Compose mu? MVP için Docker Compose yeterli, V1'de Kubernetes'e geçiş değerlendirilecek.
2. Managed DB (RDS/Cloud SQL) vs self-hosted? Managed DB önerilir; otomatik backup, PITR, yüksek erişilebilirlik sağlar.
3. WAF (Web Application Firewall) MVP'de gerekli mi? Cloudflare free tier MVP için yeterli; V1'de managed WAF.
4. SIEM/SOAR çözümü: MVP'de Grafana + Loki + Prometheus yeterli; V1'de gelişmiş SIEM.
5. MDM (Mobile Device Management): MVP'de yok, V1'de değerlendirilecek.
6. Penetrasyon testi: MVP sonrası, production readiness aşamasında yapılmalı.

## İlgili Dokümanlar

- `16_ROADMAP_BACKLOG.md` — Roadmap ve Backlog
- `17_DEFINITION_OF_DONE.md` — Definition of Done
- `09_TEHDIT_MODELLEME.md` — Tehdit modelleme
- `10_SECURE_SDLC_CICD.md` — Secure SDLC ve CI/CD
- `12_DEVOPS_GOZLEMLENEBILIRLIK_DR.md` — DevOps ve gözlemlenebilirlik
- `13_KVKK_GIZLILIK_SABLONU.md` — KVKK ve gizlilik
- `19_TRACEABILITY_MATRIX.md` — İzlenebilirlik matrisi
- `20_PROJECT_STRUCTURE.md` — Proje yapısı
