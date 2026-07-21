> Proje: Saha Flow
> Doküman: 00 Executive Summary
> Durum: Draft
> Üretim tarihi: 2026-07-21
> Kaynak girdi: templates/01_PROJE_GIRDI_FORMU.yaml

# 00 Executive Summary — Saha Flow

---

## 1. Problem

Türkiye'de 5-50 teknisyen çalıştıran küçük ve orta ölçekli teknik servis firmaları (klima-kombi, güvenlik sistemi, bakım servisleri) saha operasyonlarını büyük ölçüde kağıt, Excel, WhatsApp ve telefon ile yönetmektedir. Bu durum şu sorunlara yol açar:

- **Kayıp iş emri:** Kağıt formlar kaybolur, eksik doldurulur veya ofise geç ulaşır.
- **Takipsiz saha:** Ofis, teknisyenin nerede olduğunu ve işin ne durumda olduğunu gerçek zamanlı bilemez.
- **Tahsilat kopukluğu:** Yapılan iş ile tahsilat arasında bağlantı kurulamaz; nakit tahsilatlar kayda geçmez.
- **Rapor karmaşası:** Servis raporları manuel hazırlanır, müşteri onayı kağıt üzerinde kalır.
- **Tekrar iş:** Aynı cihaza daha önce yapılan müdahale bilgisine sahada ulaşılamaz.

Mevcut genel çözümler (saha satış/çatı sistemleri) ya çok büyük ölçekli, ya çok pahalı ya da bu segmente uygun değildir. Bu segment, basit, mobil öncelikli, Türkçe, uygun fiyatlı ve sektörden gelen bir çözüme ihtiyaç duyar.

---

## 2. Hedef Müşteri Profili

| Kriter | Açıklama |
|---|---|
| Sektör | Klima-kombi servisi, güvenlik sistemi kurulum/bakım, genel teknik bakım |
| Firma büyüklüğü | 5-50 saha teknisyeni + 2-10 ofis personeli |
| Coğrafya | Türkiye (MVP), sonrasında MENA ve Doğu Avrupa |
| Mevcut süreç | Kağıt form, Excel, WhatsApp grupları |
| Karar verici | Firma sahibi veya operasyon müdürü |
| Aylık yazılım bütçesi | 2.000-20.000 TL aralığı (varsayım) |

---

## 3. Değer Önerisi

Saha Flow, **teknik servis firmalarının saha operasyonlarını uçtan uca dijitalleştiren**, mobil öncelikli, offline çalışabilen ve teknisyen başına uygun aylık ücretle sunulan bir SaaS ürünüdür.

**Üç temel fayda:**
1. **Operasyonel verimlilik:** İş emri oluşturma, atama, takip ve raporlama tek platformda; saha-ofis arası anlık haberleşme.
2. **Gelir güvencesi:** İş-tahsilat bağlantısı ile kaçak tahsilatın önlenmesi, eksiksiz faturalandırma.
3. **Müşteri memnuniyeti:** Profesyonel dijital servis raporu, müşteri onayı, geçmiş kaydı.

---

## 4. MVP Kapsamı

### Kapsam Dahili (MVP v1.0)

| Modül | Özellikler |
|---|---|
| Tenant yönetimi | Çok kiracılı yapı, firma kaydı, alt kullanıcı yönetimi |
| Müşteri yönetimi | Müşteri kaydı, adres (harita entegrasyonu), iletişim bilgileri |
| Cihaz/envanter | Müşteriye bağlı cihaz kaydı, marka/model/seri no, servis geçmişi |
| İş emri | Oluşturma, teknisyene atama, durum takibi, öncelik/beklenen süre |
| Mobil saha uygulaması (Flutter) | İş listesi, iş başlatma (konumlu check-in), iş bitirme (konumlu check-out), fotoğraf çekme, kontrol listesi (checklist), müşteri imza onayı, offline çalışma |
| Servis raporu (PDF) | Otomatik PDF oluşturma; iş detayı, fotoğraflar, kontrol listesi, müşteri onayı |
| Tahsilat takibi | İş bazında tahsilat durumu (tahsil edildi/edilmedi/kısmi), ödeme tipi (nakit/kredi kartı/havale) |
| Temel raporlama | Günlük/haftalık iş özeti, teknisyen performans kartı |

### Kapsam Dışı (MVP v1.0)

| Özellik | Gerekçe |
|---|---|
| Stok/yedek parça yönetimi | MVP'de araç stoku yeterli; envanter modülü v2'de |
| Canlı araç takibi | Maliyet ve karmaşıklık; iş başlatma/bitirme konumu MVP için yeterli |
| Müşteri portalı (web) | Uçtan uca müşteri self-servisi v2'de |
| Yapay zeka ile rota optimizasyonu | Veri birikimi ve validasyon sonrası v3'te |
| Ödeme entegrasyonu (POS, banka) | Tahsilat durumu manuel işaretlenir; entegrasyon v2'de |
| Beyaz etiket (white label) | v2'de |
| Çok dilli arayüz (MVP sadece Türkçe) | v2'de |
| Takvim/planlama panosu (drag-drop) | MVP'de liste bazlı atama; görsel planlama v2'de |
| API dış entegrasyonları (muhasebe, ERP) | v2'de |
| SLA ve garanti süreç yönetimi | v2'de |

---

## 5. Teknoloji Yığını

| Katman | Teknoloji | Gerekçe |
|---|---|---|
| Web ön yüz | Next.js 14 (App Router) + TypeScript | SSR/SSG, SEO uyumu, geniş ekosistem |
| UI kütüphanesi | Tailwind CSS + shadcn/ui | Hızlı prototipleme, tutarlı tasarım |
| Mobil uygulama | Flutter 3.x + Dart | iOS/Android tek kod tabanı, offline-first mimari |
| Backend API | Spring Boot 3.x + Java 21 | Kurumsal dayanıklılık, geniş ekosistem, transaction yönetimi |
| Veritabanı | PostgreSQL 16 + PostGIS | Konum sorguları (en yakın teknisyen, iş konumu), JSONB desteği |
| Dosya depolama | S3-uyumlu (MinIO geliştirme, AWS S3/Azure Blob üretim) | Fotoğraf, PDF, imaj saklama; presigned URL güvenliği |
| Cache/Oturum | Redis 7.x | Token blacklist, rate limiting, oturum yönetimi |
| Mesaj kuyruğu | RabbitMQ (isteğe bağlı; MVP'de Spring Events + async) | PDF üretimi, bildirim gibi asenkron işler |
| Container | Docker + Docker Compose (MVP) | Geliştirme ve MVP deployment kolaylığı |
| CI/CD | GitHub Actions | Otomatik test, build, container push |
| Monitoring | Spring Actuator + basit health endpoint (MVP) | Hafif izleme; v2'de Prometheus/Grafana |
| Loglama | ELK stack (v2); MVP'de stdout + Docker log driver | Üretim hata ayıklama |

---

## 6. En Büyük 5 Ürün Riski

1. **Ürün-pazar uyumu sağlanamaması:** Hedef segmentin mevcut alışkanlıklarını (WhatsApp, kağıt) terk etmek istememesi. MVP'nin yeterince basit ve alışkanlıklara yakın olmaması.
2. **Fiyat itirazı:** Teknisyen başına aylık ücret modelinin küçük firmalarca yüksek bulunması ve rakip fiyat baskısı.
3. **Saha kullanım direnci:** Teknisyenlerin mobil uygulamayı kullanmayı angarya olarak görmesi; ofis personelinin çift veri girişi yapmak zorunda kalması.
4. **Veri taşıma zorluğu:** Firmaların mevcut müşteri/cihaz verilerini Saha Flow'a aktarmak istememesi veya aktarımın manuel kalması.
5. **Segment kayması:** Ürünün, talep üzerine büyük ölçekli firmalara (50+ teknisyen) kayması ve MVP'nin bu segment için yetersiz kalarak kötü referans oluşması.

---

## 7. En Büyük 5 Teknik/Güvenlik Riski

1. **Offline veri senkronizasyonunda çakışma (conflict):** Aynı iş emrine iki farklı teknisyenin offline müdahalesi veya ofisten yapılan güncelleme ile mobil değişikliğin çakışması. Çözüm yaklaşımı: Last-write-wins + versiyon vektörü.
2. **Tenant veri izolasyonu ihlali:** Bir firmanın verilerinin başka bir firmaya sızması. Her sorguda tenant_id filtrelemesi; row-level security veya uygulama katmanında zorunlu filtre.
3. **Mobil cihazda hassas veri kalıntısı:** Çalınan/kaybolan telefonlardaki müşteri verileri, fotoğraflar ve iş emirleri. Uygulama seviyesinde şifreleme ve uzaktan veri silme mekanizması.
4. **Presigned URL kötüye kullanımı:** Uzun süreli presigned URL'ler ile yetkisiz erişim. Kısa TTL (5 dakika) ve tenant-scope kontrolü.
5. **PDF üretiminde performans darboğazı:** Eş zamanlı çok sayıda PDF rapor üretimi backend'i kilitleyebilir. Asenkron kuyruk (RabbitMQ) + worker havuzu ile çözüm.

---

## 8. Tahmini Geliştirme Aşamaları

| Aşama | Süre (takvim) | Hedef |
|---|---|---|
| Aşama 0 — Keşif ve Tasarım | 4 hafta | Kullanıcı araştırması (en az 5 firma), Figma prototipi, teknik spike'lar |
| Aşama 1 — Core Backend + Web MVP | 8 hafta | Tenant, kullanıcı, müşteri, cihaz CRUD; iş emri durum makinesi; basit web paneli |
| Aşama 2 — Mobil MVP | 6 hafta | Flutter uygulama: iş listesi, iş başlatma/bitirme, fotoğraf, checklist, imza, offline |
| Aşama 3 — Servis Raporu + Tahsilat | 4 hafta | PDF üretimi, tahsilat durumu, temel raporlama |
| Aşama 4 — Entegrasyon ve Test | 4 hafta | Uçtan uca test, güvenlik testi (penetrasyon), performans testi, pilot kullanıcı onboarding |
| Aşama 5 — Pilot ve Çıkış | 4 hafta | 3-5 firma ile pilot, geri bildirim döngüsü, hata düzeltme, lansman |

**Toplam tahmini süre:** 26-30 hafta (6,5-7,5 ay), 4-5 kişilik çekirdek ekip ile.

---

## 9. İnsan Kararı Bekleyen Konular

1. **Fiyatlandırma:** Teknisyen başına aylık ücret TL cinsinden ne olmalı? (Varsayım: 500-750 TL/teknisyen/ay)
2. **Şirket yapısı:** Hangi ülkede kurulacak? Fatura muhatabı neresi olacak?
3. **Pilot firma seçimi:** Hangi firmalarla pilot yapılacak? Ücretsiz pilot mu, ücretli mi?
4. **Marka tescili:** "Saha Flow" marka tescili yapılacak mı?
5. **Veri saklama bölgesi:** Üretim ortamı Türkiye'de mi (KVKK uyumu), yoksa AB'de mi barındırılacak?
6. **Açık kaynak stratejisi:** Mobil uygulama veya belirli modüller açık kaynak yapılacak mı?
7. **Yatırım stratejisi:** Bootstrapped mi, yatırım alınacak mı?
8. **Ödeme altyapısı:** Hangi ödeme sağlayıcı ile çalışılacak? (Varsayım: Stripe, ancak TR'de İyzico/PayTR alternatifi gerekiyor)

---

## Karar Bekleyen Konular

- Yukarıdaki "İnsan Kararı Bekleyen Konular" bölümünde listelenen 8 maddenin tamamı bu dokümanın yayınlanmasından önce karara bağlanmalıdır.
- Fiyatlandırma hipotezinin pazar araştırması ile doğrulanması gerekmektedir.

## İlgili Dokümanlar

| Doküman | Açıklama |
|---|---|
| `01_ASSUMPTIONS_AND_QUESTIONS.md` | Varsayımlar ve açık sorular |
| `02_PRD.md` | Ürün gereksinimleri dokümanı |
| `03_DOMAIN_MODEL.md` | Domain modeli ve iş kuralları |
| `04_SOLUTION_ARCHITECTURE.md` | Çözüm mimarisi dokümanı |
