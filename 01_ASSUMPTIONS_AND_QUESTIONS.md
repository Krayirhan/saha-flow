> Proje: İşAkış
> Doküman: 01 Varsayımlar ve Açık Sorular
> Durum: Draft
> Üretim tarihi: 2026-07-21
> Kaynak girdi: templates/01_PROJE_GIRDI_FORMU.yaml

# 01 Varsayımlar ve Açık Sorular — İşAkış

---

## 1. Varsayımlar

Proje girdi formundaki placeholder alanlar ve belirtilmemiş detaylar nedeniyle aşağıdaki varsayımlar yapılmıştır. Her varsayım doğrulanana kadar ilgili tasarım ve geliştirme kararları bu varsayımlara dayanır.

| # | Varsayım | Gerekçe | Etkilediği Kararlar | Doğrulama Yöntemi |
|---|---|---|---|---|
| **V-001** | Hedef firmaların tümü Türkiye'de KDV mükellefidir ve fatura kesme zorunluluğu vardır. | Türkiye'deki ticari faaliyet varsayımı. | Fiyatlandırma, fatura entegrasyonu, tenant modeli. | Pilot firma görüşmesi. |
| **V-002** | Teknisyenlerin tamamı akıllı telefon kullanır; en az Android 10 veya iOS 15 işletim sistemine sahiptir. | Flutter minimum SDK gereksinimi. | Mobil uygulama hedef SDK sürümü, offline mimari. | Pilot firma envanter araştırması. |
| **V-003** | Teknisyen başına aylık ücret 500-750 TL + KDV bandında olacaktır. | Rakip analizi (Jobber, Housecall Pro fiyatının TR pazarına uyarlanmış hali). | Gelir modeli, yatırım geri dönüş hesaplaması. | Fiyat duyarlılık anketi (5 firma). |
| **V-004** | Her firma (tenant) kendi verisine yalnız kendisi erişebilir; firmalar arası veri paylaşımı yoktur. | SaaS çok kiracılı mimari standardı. | Veritabanı şeması (tenant_id), API güvenlik katmanı. | Mimari tasarım gereği standart. |
| **V-005** | Bir iş emri aynı anda yalnızca bir teknisyene atanır. | Sektör pratiği; basitlik. | WorkOrder aggregate tasarımı, atama mantığı. | Pilot firma ile süreç doğrulaması. |
| **V-006** | İş emri durumları: BEKLIYOR, ATANDI, YOLDA, BASLADI, TAMAMLANDI, IPTAL. | Sektördeki tipik iş akışı. | Durum makinesi, API validasyonu. | Mülakat ve mevcut sektör ürünleri karşılaştırması. |
| **V-007** | Müşteri onayı, mobil uygulamada dokunmatik imza ile alınır ve ıslak imza yerine geçer. | e-İmza altyapısı MVP için maliyetli ve karmaşık. | İmza bileşeni, PDF rapor içeriği. | Hukuki danışmanlık (ıslağ imza geçerlilik şartı). |
| **V-008** | Tahsilat, iş tamamlandıktan sonra ofis personeli tarafından manuel işaretlenir; herhangi bir POS/banka entegrasyonu yoktur. | MVP kapsam dışı. | Tahsilat veri modeli, API. | MVP kapsam tanımı gereği. |
| **V-009** | Her iş emri için en fazla 20 fotoğraf, her fotoğraf en fazla 10 MB boyutundadır. | Depolama maliyeti ve mobil performans dengesi. | S3 bucket yapısı, presigned URL limitleri, offline depolama. | Pilot kullanımda fotoğraf sayısı ve boyutu takip edilir. |
| **V-010** | Offline modda, mobil cihazda en fazla 50 iş emri ve 200 fotoğraf saklanabilir. | Mobil cihaz depolama sınırı ve SQLite performansı. | Flutter offline veritabanı (drift/floor) tasarımı. | Test cihazlarında depolama kullanımı izlenir. |
| **V-011** | Kimlik doğrulama, JWT (access + refresh token) ile yapılır; refresh token 7 gün, access token 15 dakika geçerlidir. | Sektör standardı; güvenlik ve kullanıcı deneyimi dengesi. | Spring Security yapılandırması, Flutter token yönetimi. | Güvenlik danışmanlığı. |
| **V-012** | Şifre politikası: En az 8 karakter, en az 1 büyük harf, 1 rakam. MFA MVP'de yoktur. | Basitlik; MFA v2'de. | Kayıt ve giriş akışı. | MVP kapsam kararı. |
| **V-013** | Firma kaydı (tenant onboarding) self-servis değildir; her firma manuel onboard edilir. | MVP'de operasyonel kontrol; self-servis v2'de. | Tenant oluşturma API'si admin paneliyle sınırlı. | Go-to-market stratejisi. |
| **V-014** | Her firmanın bir "Admin" kullanıcısı olur; Admin, firma içindeki tüm kullanıcıları yönetir. | Standart SaaS yetkilendirme modeli. | Rol-permisyon modeli (RBAC). | Genel SaaS pratiği. |
| **V-015** | PostGIS, yalnızca "en yakın teknisyen" sorgusu ve iş konumu kaydı için kullanılır; rota çizimi yoktur. | MVP kapsam sınırı. | Coğrafi sorgu tasarımı, indeks stratejisi. | MVP kapsam tanımı gereği. |
| **V-016** | PDF servis raporu, backend'de Apache FOP veya iText kullanılarak üretilir; asenkron kuyruk ile işlenir. | Java ekosisteminde yaygın kütüphaneler. | Backend servis tasarımı, container kaynak planlaması. | Teknik spike ile kütüphane karşılaştırması. |
| **V-017** | Mobil uygulama ile backend arasındaki iletişim HTTPS REST API üzerinden gerçekleşir; WebSocket MVP'de yoktur. | Basitlik; gerçek zamanlı bildirim v2'de push notification ile. | API tasarımı, Flutter HTTP client. | MVP kapsam kararı. |
| **V-018** | Dosya depolama için S3-uyumlu MinIO, geliştirme ortamında Docker container olarak çalışır; üretimde AWS S3 veya Azure Blob Storage kullanılır. | Maliyet ve taşınabilirlik dengesi. | Dosya servis soyutlaması, deployment yapılandırması. | Üretim altyapı kararı. |
| **V-019** | Loglama ve monitoring MVP'de Spring Actuator + Docker log driver ile sınırlıdır; ELK/Grafana v2'dedir. | MVP hızı; kompleks izleme kurulumu maliyetli. | DevOps planlaması. | MVP kapsam kararı. |
| **V-020** | Veritabanı yedeklemesi günlük alınır ve 30 gün saklanır; point-in-time recovery MVP'de yoktur. | MVP için yeterli; pg_dump + S3. | Backup stratejisi, RPO/RTO. | Operasyonel risk değerlendirmesi. |
| **V-021** | Uygulama yalnızca Türkçe dil desteği ile çıkar; çok dilli altyapı v2'de eklenir ancak veritabanı şeması çok dile hazır tasarlanır. | MVP hızı vs. gelecek genişleme dengesi. | i18n altyapısı, veritabanı tasarımı. | Go-to-market stratejisi. |
| **V-022** | E-posta bildirimleri (iş atama, tamamlanma) MVP'de temel düzeydedir; SMS bildirimi v2'dedir. | Maliyet ve entegrasyon sadeliği. | Bildirim servisi tasarımı. | MVP kapsam kararı. |
| **V-023** | Geliştirme ekibi 4-5 kişidir: 1 backend, 1 web frontend, 1 mobil, 1 DevOps/yarı zamanlı, 1 ürün/tasarım. | Tipik MVP ekibi. | İş planı, sprint planlaması. | Bütçe ve işe alım kararı. |
| **V-024** | Veritabanı "shared database, separate schema" modeli yerine "shared database, shared schema + tenant_id" modeli kullanılır. | 5-50 teknisyenli firmalar için yeterli; operasyonel basitlik. | Veritabanı mimarisi, migration stratejisi. | Ölçekleme analizi. |
| **V-025** | Müşteri bilgileri (ad, soyad, telefon, adres) KVKK kapsamında kişisel veridir ve açık rıza gerektirir. | Türkiye mevzuatı. | Veri saklama, silme, rıza metni, KVKK uyum süreçleri. | Hukuki danışmanlık. |

---

## 2. Açık Sorular

Aşağıdaki soruların yanıtlanması, tasarım ve geliştirme kararlarını doğrudan etkiler:

| # | Soru | Öncelik | Etkilediği Alan |
|---|---|---|---|
| S-01 | Üretim ortamı hangi bulut sağlayıcıda barındırılacak? (AWS, Azure, Hetzner, Türk Telekom Bulut?) | Yüksek | Altyapı maliyeti, S3/Blob seçimi, CI/CD tasarımı |
| S-02 | KVKK kapsamında veri sorumlusu sıfatıyla hangi yükümlülükler altında olacağız? Aydınlatma metni ve açık rıza süreci nasıl işleyecek? | Yüksek | Veri modeli, müşteri kayıt akışı, silme/anonimleştirme |
| S-03 | Dokunmatik imza, Türk hukukunda geçerli bir onay yöntemi midir? Islak imza zorunluluğu var mı? | Yüksek | İmza bileşeni, PDF rapor tasarımı |
| S-04 | Pilot firma görüşmeleri ne zaman başlayacak? Hangi firmalar hedefleniyor? | Yüksek | Kullanıcı araştırması takvimi, MVP önceliklendirme |
| S-05 | Stripe Türkiye'de tam olarak destekleniyor mu? Alternatif olarak İyzico, PayTR, CraftGate'ten hangisi tercih edilecek? | Orta | Ödeme altyapısı (v2), abonelik yönetimi |
| S-06 | Firma onboarding sürecinde KYC (Know Your Customer) yapılacak mı? Fatura bilgileri zorunlu mu? | Orta | Tenant kayıt akışı, veri modeli |
| S-07 | Teknisyen konum verileri hangi sıklıkta alınacak? (Yalnızca check-in/check-out, yoksa periyodik?) | Orta | Mobil GPS kullanımı, pil tüketimi, backend yükü |
| S-08 | İş emri numarası formatı ne olacak? Her tenant için ayrı seri mi, global seri mi? | Düşük | İş emri oluşturma mantığı, veritabanı sequence |
| S-09 | Ücretsiz deneme süresi (trial) sunulacak mı? Kaç gün? | Düşük | Abonelik durum makinesi, tenant yaşam döngüsü |
| S-10 | Mobil uygulama Google Play / App Store'da mı yayınlanacak, yoksa kurumsal dağıtım (MDM) ile mi? | Düşük | Dağıtım stratejisi, CI/CD, kod imzalama |

---

## 3. Eksik Şablon / Kaynak Dosyaları

Aşağıdaki şablon ve kaynak dosyalarının proje dizininde bulunması beklenir. Mevcut olmayanlar "Eksik" olarak işaretlenmiştir:

| Dosya | Durum | Açıklama |
|---|---|---|
| `templates/01_PROJE_GIRDI_FORMU.yaml` | Referans | Kaynak girdi olarak referans verilmiş; içeriği teyit edilemedi. Varsayımlar bu formdaki placeholder'lar doldurulmadan yapılmıştır. |
| `templates/PAZAR_ANALIZI.md` | Eksik | Hedef pazar büyüklüğü, rakip analizi, fiyatlandırma kıyaslaması içermeli. |
| `templates/KULLANICI_ARASTIRMASI.md` | Eksik | Mülakat özetleri, persona tanımları, kullanıcı ihtiyaç hiyerarşisi. |
| `templates/TEKNIK_SPIKE_DOKUMANI.md` | Eksik | Offline sync, presigned URL, PDF üretimi spike sonuçları. |
| `designs/figma/` | Eksik | Figma tasarım dosyaları veya ekran görüntüleri. |
| `legal/KVKK_DEGERLENDIRME.md` | Eksik | KVKK uyum değerlendirmesi ve alınması gereken aksiyonlar. |

---

## 4. Varsayımlardan Etkilenen Başlıca Kararlar

| Karar | Etkileyen Varsayımlar | Risk Seviyesi |
|---|---|---|
| Tenant veri izolasyonu modeli (shared schema) | V-004, V-024 | Düşük (standart pratik) |
| Offline-first mobil mimari | V-002, V-010, V-017 | Yüksek (karmaşık senkronizasyon) |
| JWT token stratejisi | V-011 | Orta |
| PDF asenkron üretim | V-016 | Orta |
| Dokunmatik imza ile müşteri onayı | V-007, S-03 | Yüksek (hukuki risk) |
| Fiyatlandırma modeli | V-003 | Yüksek (gelir modeli) |
| Dil desteği stratejisi | V-021 | Düşük |
| Self-servis onboarding olmaması | V-013 | Orta (operasyon yükü) |

---

## Karar Bekleyen Konular

- Açık Sorular bölümündeki S-01, S-02, S-03, S-04 numaralı sorular öncelikle yanıtlanmalıdır.
- Eksik şablon dosyalarının (`PAZAR_ANALIZI.md`, `KULLANICI_ARASTIRMASI.md`) oluşturulması veya mevcut olanların paylaşılması gerekmektedir.
- V-007 (dokunmatik imza geçerliliği) için hukuki görüş alınana kadar ilgili tasarım kararları askıdadır.

## İlgili Dokümanlar

| Doküman | Açıklama |
|---|---|
| `00_EXECUTIVE_SUMMARY.md` | Proje özeti ve riskler |
| `02_PRD.md` | Ürün gereksinimleri dokümanı |
| `03_DOMAIN_MODEL.md` | Domain modeli ve iş kuralları |
| `04_SOLUTION_ARCHITECTURE.md` | Çözüm mimarisi dokümanı |
