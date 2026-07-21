> Proje: İşAkış / > Doküman: Roadmap ve Backlog / > Durum: Draft / > Üretim tarihi: 2026-07-21 / > Kaynak girdi: templates/01_PROJE_GIRDI_FORMU.yaml

# İşAkış — Roadmap ve Backlog

## 1. Genel Zaman Çizelgesi

| Aşama | Kod Adı | Süre | Hafta | Başlangıç | Bitiş | Efor (adam-hafta) |
|---|---|---|---|---|---|---|
| 0 | Discovery | 2 hafta | W1-W2 | 28 Tem 2026 | 8 Ağu 2026 | 4 |
| 1 | Foundation | 3 hafta | W3-W5 | 11 Ağu 2026 | 29 Ağu 2026 | 6 |
| 2 | MVP | 8 hafta | W6-W13 | 1 Eyl 2026 | 24 Eki 2026 | 16 |
| 3 | Pilot | 4 hafta | W14-W17 | 27 Eki 2026 | 21 Kas 2026 | 8 |
| 4 | Production Readiness | 3 hafta | W18-W20 | 24 Kas 2026 | 12 Ara 2026 | 6 |
| 5 | V1 | Sürekli | W21+ | 15 Ara 2026 | — | — |

**Toplam MVP süresi (Discovery + Foundation + MVP):** 13 hafta (~3 ay)
**Pilot başlangıcı:** W14 (2,5 ay sonra ilk pilot müşteri canlıda)
**Production launch hedefi:** W21 (5 ay sonra)

---

## 2. Aşama Detayları

### 2.0 Discovery (W1-W2)

**Amaç:** Problem alanını doğrulamak, en az 5 potansiyel müşteriyle görüşme yapmak, süreç haritası çıkarmak, fiyat hipotezini test etmek, riskli varsayımları listelemek.

**Kapsam:**
- En az 5 teknik servis firmasıyla yarı yapılandırılmış görüşme
- Mevcut süreç haritası (kağıt / WhatsApp / çağrı merkezi eksenli akış)
- Rakip analizi (Logo Servis, ServisSoft, saha yönetimi yapan diğer ürünler)
- Fiyat duyarlılık testi: aylık kullanıcı başı 150-250 TL bandı
- Varsayım kaydı ve risk değerlendirmesi

**Çıktılar:**
- Görüşme notları ve tespitler (Confluence/Notion)
- Süreç haritası diyagramı (Miro/Draw.io)
- Fiyat hipotez raporu
- Güncellenmiş PRD (03_PRD_SABLONU çıktısı)
- "Go/No-Go" kararı için değerlendirme toplantısı

---

### 2.1 Foundation (W3-W5)

**Amaç:** Kod tabanını, CI/CD boru hattını, veritabanı şemasını, kimlik ve tenant altyapısını, audit/telemetry temelini ve design system'i kurmak.

**Kapsam:**
- Monorepo kurulumu: `apps/web`, `apps/mobile`, `services/api`, `infra`
- CI/CD: GitHub Actions ile build, test, lint, Docker image build
- PostgreSQL şema temeli: Flyway migration yapısı, tenant_id bazlı izolasyon
- Kimlik doğrulama: Spring Security + JWT (access/refresh token), e-posta/şifre ile login
- Tenant context filter: her HTTP isteğinde tenant_id context'e bağlanması
- Audit log temeli: `audit_log` tablosu, Spring AOP aspect ile otomatik kayıt
- OpenTelemetry: trace, metric, log enstrümantasyonu (OTLP exporter)
- Design system: Tailwind CSS + shadcn/ui bileşen temeli, Figma temel renk/tipografi token'ları
- Docker Compose ile yerel geliştirme ortamı (api + db + mailhog)

**Çıktılar:**
- Çalışan CI/CD boru hattı (build + test + lint)
- Çalışan login/logout akışı (web + API)
- Tenant context middleware'i
- Audit log yazma ve sorgulama endpoint'i
- Tasarım sistemi storybook'u (en az 10 atom bileşen)
- Yerel geliştirme ortamı dokümantasyonu

---

### 2.2 MVP (W6-W13)

**Amaç:** Pilot müşterinin uçtan uca kullanabileceği minimum iş akışını tamamlamak: müşteri ve cihaz tanımlama, iş emri oluşturma, teknisyen atama, mobilde iş emri görüntüleme ve durum güncelleme, kontrol listesi doldurma, müşteri onayı ve servis raporu üretme, temel dashboard.

**Kapsam:** (Tüm epic'lerin MVP kapsamındaki kullanıcı hikâyeleri — aşağıda Bölüm 3'te detaylandırılmıştır)

**Çıktılar:**
- Uçtan uca çalışan iş emri akışı (oluştur → ata → sahada yap → onayla → raporla)
- Mobil uygulama APK/IPA (TestFlight/Play Store internal testing)
- Web admin paneli
- Veritabanı backup/restore dokümanı ve otomatik daily backup
- API dokümantasyonu (OpenAPI/Swagger)
- Kullanıcı kabul test senaryoları
- Pilot müşteri onboarding checklist'i

---

### 2.3 Pilot (W14-W17)

**Amaç:** 1-2 pilot müşteriyle canlı kullanım, geri bildirim toplama, hata düzeltme, eksik özellikleri MVP'ye ekleme, onboarding sürecini iyileştirme.

**Kapsam:**
- Pilot müşteri tenant'ı oluşturma ve veri aktarma (eski sistemden CSV import)
- Haftalık müşteri görüşmeleri ve geri bildirim kaydı
- Kritik hata düzeltmeleri (hotfix)
- Kullanıcı deneyimi iyileştirmeleri (bulgulara göre)
- Mobil senkronizasyon performans iyileştirmesi (offline-first deneyimi)
- Yardım dokümantasyonu ve onboarding videoları (Loom)

**Çıktılar:**
- Pilot geri bildirim raporu
- Düzeltilen hataların listesi
- Güncellenmiş backlog
- NPS skoru
- "Production'a hazır" onayı

---

### 2.4 Production Readiness (W18-W20)

**Amaç:** SLO tanımlama, alarm kurulumu, yük ve güvenlik testleri, KVKK uyumluluk kontrolü, incident ve support süreçlerini kurma, runbook'ları tamamlama.

**Kapsam:**
- SLO tanımları: API p95 < 500ms, availability %99,9, login başarı oranı > %99
- Grafana dashboard: iş emri throughput, hata oranı, p95 latency, DB connection pool, mobile sync queue
- Alarm kuralları: p95 > 1s, error rate > %1, DB pool > %80, disk > %80
- k6 ile yük testi: 30 RPS hedef, kırılma noktası tespiti
- OWASP ZAP ile güvenlik taraması
- KVKK kontrol listesi: veri envanteri, saklama süreleri, silme/anonimleştirme, açık rıza, aydınlatma metni
- Incident response planı
- Support süreci: Freshdesk/Zendesk entegrasyonu veya e-posta biletleme

**Çıktılar:**
- SLO dashboard'u
- Yük testi raporu
- Güvenlik tarama raporu
- KVKK uyumluluk kontrol listesi (işaretli)
- Incident response runbook'u
- Production deployment checklist'i

---

### 2.5 V1 ve Sonrası (W21+)

**Amaç:** Pilot geri bildirimlerine göre büyüme özellikleri, yeni entegrasyonlar, ölçeklenebilirlik iyileştirmeleri.

**Kapsam (ön taslak):**
- Çoklu şube / ekip yönetimi
- Rota optimizasyonu (açık kaynak OR-Tools veya harita API)
- Stok ve yedek parça yönetimi
- Sözleşme ve abonelik yönetimi
- Fatura entegrasyonu (e-fatura/e-arşiv)
- Müşteri portalı (web)
- Public API
- SSO / OIDC entegrasyonu
- Beyaz etiketleme (white label)

---

## 3. Epic Detayları

### Epic 1: Tenant ve Kimlik Yönetimi (EPIC-AUTH)

**Amaç:** Çoklu kiracılı (multi-tenant) yapıda kullanıcıların güvenli şekilde sisteme giriş yapmasını, yetkilendirilmesini ve tenant bağlamında çalışmasını sağlamak.

**Kullanıcı Hikâyeleri (MVP):**
| ID | Hikâye | Öncelik | Puan |
|---|---|---|---|
| AUTH-01 | Admin olarak, e-posta ve şifre ile giriş yapabilmeliyim. | Must | 3 |
| AUTH-02 | Admin olarak, şifremi unuttuğumda sıfırlama e-postası alabilmeliyim. | Must | 3 |
| AUTH-03 | Admin olarak, tenant'ıma kullanıcı ekleyip rol atayabilmeliyim. | Must | 5 |
| AUTH-04 | Kullanıcı olarak, giriş yaptığımda sadece kendi tenant'ımın verilerini görmeliyim. | Must | 5 |
| AUTH-05 | Admin olarak, kullanıcı hesabını devre dışı bırakabilmeliyim. | Must | 2 |
| AUTH-06 | Sistem, başarısız giriş denemelerini 5'te kilitlemelidir. | Must | 2 |
| AUTH-07 | Admin olarak, kullanıcı oturumlarını görüntüleyip sonlandırabilmeliyim. | Should | 3 |
| AUTH-08 | Kullanıcı olarak, refresh token ile oturumumu yenileyebilmeliyim. | Must | 3 |

**Teknik İşler:**
- Spring Security + JWT (access token 15dk, refresh token 7 gün)
- `tenants`, `users`, `roles`, `permissions` tabloları ve Flyway migration'ları
- TenantContextFilter: her HTTP isteğinde `X-Tenant-ID` header veya JWT claim'den tenant çözümleme
- Row-Level Security (RLS) veya uygulama katmanında tenant_id filtreleme (shared_db, shared_schema modeli)
- BCrypt ile şifre hash'leme
- E-posta servisi entegrasyonu (şifre sıfırlama, hoş geldin)
- Refresh token rotation (her yenilemede yeni refresh token)

**Güvenlik İşleri:**
- Brute-force koruması: IP ve e-posta bazlı rate limiting (5 deneme/dk)
- JWT signing key rotasyonu için altyapı (şimdilik manuel, V1'de otomatik)
- Hassas bilgilerin (şifre, token) log'lara yazılmadığının kontrolü
- Session fixation koruması: login sonrası yeni session
- CORS konfigürasyonu: sadece izin verilen origin'ler

**Bağımlılıklar:** Yok (ilk epic)

**Risk:** JWT gizli anahtarının sızması → tüm oturumlar geçersiz. RLS yanlış konfigürasyonu → tenant veri sızıntısı.

**Çıkış Kriteri:**
- Farklı iki tenant'tan gelen istekler birbirinin verisini göremiyor (otomatik test ile kanıtlı)
- Login, logout, şifre sıfırlama akışları uçtan uca çalışıyor
- 5 başarısız deneme sonrası hesap kilitleniyor
- Audit log'da tüm auth olayları kaydediliyor
- Refresh token rotation çalışıyor

---

### Epic 2: Müşteri ve Cihaz Yönetimi (EPIC-CUSTOMER)

**Amaç:** Servis verilen müşterilerin ve onlara ait cihazların kaydedilmesi, listelenmesi, aranması ve iş emrine bağlanması.

**Kullanıcı Hikâyeleri (MVP):**
| ID | Hikâye | Öncelik | Puan |
|---|---|---|---|
| CUST-01 | Operatör olarak, yeni müşteri kaydı oluşturabilmeliyim. | Must | 3 |
| CUST-02 | Operatör olarak, müşterileri ada/firmaya göre arayabilmeliyim. | Must | 3 |
| CUST-03 | Operatör olarak, müşteriye cihaz ekleyebilmeliyim. | Must | 3 |
| CUST-04 | Operatör olarak, cihaza marka, model, seri no, garanti bilgisi girebilmeliyim. | Must | 3 |
| CUST-05 | Operatör olarak, müşterinin geçmiş servis kayıtlarını görebilmeliyim. | Should | 3 |
| CUST-06 | Teknisyen olarak, mobilde müşteri adresini haritada görebilmeliyim. | Must | 5 |
| CUST-07 | Sistem, aynı telefon/e-postada mükerrer müşteri kaydını engellemelidir. | Should | 2 |

**Teknik İşler:**
- `customers`, `devices`, `customer_addresses` tabloları
- Adres yapısı: il, ilçe, mahalle, cadde/sokak, bina no, kat/daire, posta kodu
- Koordinat: adres → geocoding (opsiyonel, adres yeterli olmazsa eklenir)
- Cihaz kategorileri: kombi, klima, beyaz eşya, elektrik tesisatı, sıhhi tesisat (enum/CTE)
- Elasticsearch veya PostgreSQL full-text search (pg_trgm) ile arama — MVP'de ILIKE + indeks yeterli
- Müşteri silme: soft delete, KVKK uyumlu

**Güvenlik İşleri:**
- Müşteri kişisel verileri (ad, telefon, adres) KVKK kapsamında — access log, silme/anonimleştirme
- Telefon ve e-posta validasyonu
- Tenant izolasyonu: customer.tenant_id = current_user.tenant_id kontrolü

**Bağımlılıklar:** EPIC-AUTH (tenant ve rol yapısı)

**Risk:** Adres standardizasyonu olmadan rota optimizasyonu zorlaşır. Mükerrer müşteri kaydı veri kalitesini düşürür.

**Çıkış Kriteri:**
- 1000 müşteri kaydı oluşturulabiliyor ve 2 saniyeden kısa sürede listeleniyor
- Cihaz-müşteri ilişkisi doğru kuruluyor
- Telefon/e-posta mükerrerlik kontrolü çalışıyor
- Soft delete ve audit log çalışıyor

---

### Epic 3: İş Emri ve Durum Makinesi (EPIC-WORKORDER)

**Amaç:** Servis taleplerinin iş emrine dönüştürülmesi, durum makinesi üzerinde ilerletilmesi, SLA takibi ve kapatılması.

**Kullanıcı Hikâyeleri (MVP):**
| ID | Hikâye | Öncelik | Puan |
|---|---|---|---|
| WO-01 | Operatör olarak, müşteri ve cihaz seçerek iş emri oluşturabilmeliyim. | Must | 5 |
| WO-02 | Operatör olarak, iş emrine açıklama, öncelik ve son tarih girebilmeliyim. | Must | 3 |
| WO-03 | Operatör olarak, iş emirlerini duruma göre filtreleyebilmeliyim. | Must | 3 |
| WO-04 | Teknisyen olarak, bana atanan iş emirlerini mobilde listeleyebilmeliyim. | Must | 5 |
| WO-05 | Teknisyen olarak, iş emrinin durumunu güncelleyebilmeliyim. | Must | 5 |
| WO-06 | Sistem, iş emri durum değişimlerini audit log'a kaydetmelidir. | Must | 2 |
| WO-07 | Operatör olarak, iş emrine not/ek dosya ekleyebilmeliyim. | Should | 3 |
| WO-08 | Operatör olarak, SLA aşımı yaklaşan iş emirlerini görebilmeliyim. | Should | 5 |

**Durum Makinesi:**
```
OPEN → ASSIGNED → IN_PROGRESS → COMPLETED → APPROVED → CLOSED
  ↓        ↓           ↓             ↓           ↓
CANCELLED ←───────────┴─────────────┴───────────┘ (herhangi bir durumdan)
```

| Durum | Açıklama | Kim değiştirir? | Sonraki durumlar |
|---|---|---|---|
| OPEN | İş emri oluşturuldu, henüz atanmadı | Operatör | ASSIGNED, CANCELLED |
| ASSIGNED | Teknisyene atandı | Operatör | IN_PROGRESS, OPEN, CANCELLED |
| IN_PROGRESS | Teknisyen sahadaki işe başladı | Teknisyen | COMPLETED, CANCELLED |
| COMPLETED | İş tamamlandı, onay bekliyor | Teknisyen | APPROVED, IN_PROGRESS |
| APPROVED | Müşteri onayladı, raporlandı | Operatör/Müşteri | CLOSED |
| CLOSED | İş emri kapatıldı (son durum) | Sistem | — |
| CANCELLED | İptal edildi (son durum) | Operatör | — |

**Teknik İşler:**
- `work_orders` tablosu: id, tenant_id, customer_id, device_id, assigned_to, status, priority, description, scheduled_at, due_at, created_at, updated_at
- `work_order_status_history` tablosu: her durum değişimi kaydı
- Durum geçiş validasyonu: servis katmanında enum + state machine pattern
- SLA hesaplama: `due_at` ile `completed_at` karşılaştırması, iş saatleri içinde hesaplama
- Filtreleme: status, priority, assigned_to, date_range

**Güvenlik İşleri:**
- Durum geçiş yetkisi kontrolü: her role göre izin verilen geçişler
- İş emrine sadece kendi tenant'ındaki kullanıcılar erişebilir
- Hassas iş emri silinmesin: soft delete, audit log

**Bağımlılıklar:** EPIC-AUTH, EPIC-CUSTOMER

**Risk:** Durum makinesi hatalı konfigüre edilirse iş emri tutarsız duruma düşer. SLA hesaplaması iş saatlerini dikkate almayı gerektirir.

**Çıkış Kriteri:**
- Bir iş emri uçtan uca tüm durumları dolaşabiliyor
- Geçersiz durum geçişleri reddediliyor (otomatik test)
- Her durum değişimi audit log'da kayıtlı
- Filtreleme ve sıralama doğru çalışıyor
- Tenant izolasyonu: X tenant'ı Y tenant'ının iş emrini göremiyor

---

### Epic 4: Atama ve Planlama (EPIC-ASSIGN)

**Amaç:** İş emirlerinin teknisyenlere atanması, takvim görünümü, çakışma kontrolü ve iş yükü görünümü.

**Kullanıcı Hikâyeleri (MVP):**
| ID | Hikâye | Öncelik | Puan |
|---|---|---|---|
| ASGN-01 | Operatör olarak, iş emrini bir teknisyene atayabilmeliyim. | Must | 3 |
| ASGN-02 | Operatör olarak, teknisyenin günlük/haftalık programını görebilmeliyim. | Must | 8 |
| ASGN-03 | Operatör olarak, bir iş emrini başka teknisyene transfer edebilmeliyim. | Should | 3 |
| ASGN-04 | Sistem, aynı teknisyene aynı saatte çakışan atamayı uyarmalıdır. | Should | 3 |
| ASGN-05 | Teknisyen olarak, mobilde günlük iş listemi sıralı görebilmeliyim. | Must | 3 |
| ASGN-06 | Operatör olarak, müsait teknisyenleri (iş emri olmayan) listeleyebilmeliyim. | Should | 3 |

**Teknik İşler:**
- `assignments` tablosu: iş emri-teknisyen ilişkisi, atama tarihi, planlanan başlangıç/bitiş
- Takvim görünümü: fullcalendar.js veya benzeri, drag-and-drop atama (V1'de, MVP'de manuel seçim)
- Çakışma kontrolü: aynı teknisyen, aynı zaman dilimi → warning
- İş yükü hesabı: teknisyen başına açık/atanmış iş emri sayısı
- Teknisyen müsaitlik sorgusu: belirli zaman aralığında ataması olmayan kullanıcılar

**Güvenlik İşleri:**
- Atama değişiklikleri audit log'a kaydedilir
- Sadece OPERATOR ve ADMIN rollerinin atama yetkisi vardır

**Bağımlılıklar:** EPIC-WORKORDER

**Risk:** Takvim bileşeni karmaşıklığı MVP'de zaman alabilir → basit liste görünümü ile başlanır.

**Çıkış Kriteri:**
- İş emri başarıyla teknisyene atanıyor ve teknisyen mobilde görebiliyor
- Günlük/haftalık liste görünümü çalışıyor
- Çakışma uyarısı gösteriliyor
- Atama transferi çalışıyor ve audit log'da görünüyor

---

### Epic 5: Mobil Saha Uygulaması (EPIC-MOBILE)

**Amaç:** Teknisyenlerin sahada çevrimdışı da çalışabilen mobil uygulama üzerinden iş emirlerini görüntülemesi, güncellemesi ve servis raporu oluşturması.

**Kullanıcı Hikâyeleri (MVP):**
| ID | Hikâye | Öncelik | Puan |
|---|---|---|---|
| MOB-01 | Teknisyen olarak, mobilde bana atanan iş emirlerini görebilmeliyim. | Must | 5 |
| MOB-02 | Teknisyen olarak, internetsiz ortamda iş emirlerini görüntüleyebilmeliyim. | Must | 8 |
| MOB-03 | Teknisyen olarak, iş emri durumunu çevrimdışı güncelleyip, bağlantı gelince senkronize edebilmeliyim. | Must | 8 |
| MOB-04 | Teknisyen olarak, müşteri adresini haritada görebilmeliyim. | Must | 5 |
| MOB-05 | Teknisyen olarak, müşteriye telefonla ulaşabilmeliyim (tek tıkla arama). | Should | 2 |
| MOB-06 | Teknisyen olarak, iş emrine fotoğraf çekip ekleyebilmeliyim. | Must | 5 |
| MOB-07 | Teknisyen olarak, kontrol listesini mobilde doldurabilmeliyim. | Must | 8 |
| MOB-08 | Teknisyen olarak, müşteriden imza alabilmeliyim. | Must | 5 |

**Teknik İşler:**
- Flutter projesi (`apps/mobile`)
- Offline-first mimari: SQLite (Drift veya Floor) ile yerel veritabanı
- Sync motoru: değişiklik kuyruğu, çakışma çözümü (last-write-wins MVP için yeterli)
- Push notification: Firebase Cloud Messaging (yeni iş emri atandığında)
- Kamera ve fotoğraf: device camera → sıkıştırma → multipart upload
- Harita: Google Maps veya OpenStreetMap (Türkiye'de Google Maps önerilir)
- İmza: custom paint canvas → PNG → upload
- Auth token'ı güvenli saklama: flutter_secure_storage

**Güvenlik İşleri:**
- Token cihazda şifreli saklanır (Keychain/Keystore)
- Uygulama 15 dakika idle sonrası otomatik kilitlenme
- Çalınan cihazda uzaktan oturum sonlandırma (admin panelinden)
- Fotoğraflar cihaz galerisine değil uygulama sandbox'ına kaydedilir
- API iletişimi her zaman HTTPS, certificate pinning (V1)

**Bağımlılıklar:** EPIC-WORKORDER, EPIC-ASSIGN, EPIC-CUSTOMER

**Risk:** Offline senkronizasyon en yüksek riskli alan. Çakışma çözümü, veri kaybı, senkronizasyon performansı. MVP'de basit last-write-wins stratejisiyle başlanır.

**Çıkış Kriteri:**
- WiFi kapatıldığında iş emirleri görüntülenebiliyor
- Çevrimdışı durum güncellemesi yapılıyor, bağlantı gelince senkronize oluyor
- Fotoğraf çekme, sıkıştırma ve yükleme çalışıyor
- İmza alma ve sunucuya gönderme çalışıyor
- Push notification yeni atamada geliyor

---

### Epic 6: Kontrol Listesi ve Malzeme (EPIC-CHECKLIST)

**Amaç:** Her iş tipi için tanımlanabilen kontrol listeleri, teknisyenin sahada adım adım doldurması ve kullanılan malzemelerin kaydedilmesi.

**Kullanıcı Hikâyeleri (MVP):**
| ID | Hikâye | Öncelik | Puan |
|---|---|---|---|
| CHK-01 | Operatör olarak, iş tipine göre kontrol listesi şablonu oluşturabilmeliyim. | Must | 5 |
| CHK-02 | Teknisyen olarak, iş emrine atanan kontrol listesini mobilde doldurabilmeliyim. | Must | 5 |
| CHK-03 | Teknisyen olarak, kullanılan malzemeleri (parça, miktar) kaydedebilmeliyim. | Should | 5 |
| CHK-04 | Teknisyen olarak, kontrol listesi adımlarını "başarılı/başarısız/uygun değil" olarak işaretleyebilmeliyim. | Must | 3 |
| CHK-05 | Operatör olarak, kontrol listesi şablonunu düzenleyebilmeliyim. | Should | 3 |

**Teknik İşler:**
- `checklist_templates` ve `checklist_items` tabloları
- `work_order_checklists` ve `work_order_checklist_items` tabloları (şablondan kopyalanarak oluşturulur)
- `materials` tablosu: stok takibi olmadan sadece kayıt (V1'de stok modülü)
- `work_order_materials` tablosu: iş emrinde kullanılan malzeme ve miktar

**Güvenlik İşleri:**
- Kontrol listesi şablonları tenant bazlı
- İş emrine kopyalanan checklist değiştirilemez (orijinal şablondan bağımsızlaşır)

**Bağımlılıklar:** EPIC-WORKORDER, EPIC-MOBILE

**Risk:** Şablon yönetimi UI'ı MVP'de basit tutulmalı, aşırı özelleştirme süreyi uzatır.

**Çıkış Kriteri:**
- En az 2 farklı iş tipi için kontrol listesi şablonu oluşturulabiliyor
- İş emrine şablon atanıp kopyalanıyor
- Mobilde adımlar işaretlenebiliyor
- Kullanılan malzemeler kaydedilebiliyor

---

### Epic 7: Müşteri Onayı ve Servis Raporu (EPIC-REPORT)

**Amaç:** Teknisyenin işi tamamladıktan sonra müşteriden onay alması (imza), servis raporunun otomatik oluşturulması ve müşteriye PDF/e-posta olarak iletilmesi.

**Kullanıcı Hikâyeleri (MVP):**
| ID | Hikâye | Öncelik | Puan |
|---|---|---|---|
| RPT-01 | Teknisyen olarak, mobilde müşteriden imza alabilmeliyim. | Must | 5 |
| RPT-02 | Sistem, iş emri onaylandığında otomatik servis raporu (PDF) oluşturmalıdır. | Must | 8 |
| RPT-03 | Operatör olarak, servis raporunu müşteriye e-posta ile gönderebilmeliyim. | Should | 3 |
| RPT-04 | Müşteri olarak, e-posta ile aldığım servis raporunu görüntüleyebilmeliyim. | Should | 2 |
| RPT-05 | Operatör olarak, geçmiş servis raporlarını listeleyip indirebilmeliyim. | Must | 3 |

**Teknik İşler:**
- PDF oluşturma: iText, Apache PDFBox veya OpenPDF (Spring Boot uyumlu)
- PDF içeriği: iş emri bilgileri, müşteri ve cihaz bilgileri, kontrol listesi sonuçları, kullanılan malzemeler, fotoğraflar, imza
- İmza: mobilde canvas'ta çizilen imza → PNG → sunucuya upload → PDF'e gömülür
- E-posta gönderimi: Thymeleaf template + JavaMailSender veya Mailgun/SendGrid
- PDF object storage'a yüklenir (S3), presigned URL ile indirme

**Güvenlik İşleri:**
- PDF'te sadece ilgili müşteri ve iş emri bilgileri yer alır, başka tenant verisi sızmaz
- Presigned URL süre sınırlı (1 saat)
- İmza verisi hassas kabul edilir, encryption at rest

**Bağımlılıklar:** EPIC-WORKORDER, EPIC-CHECKLIST, EPIC-MOBILE

**Risk:** PDF layout'u farklı iş tipleri için özelleştirme gerektirebilir. MVP'de tek tip şablon yeterli.

**Çıkış Kriteri:**
- Mobilde imza alınıp sunucuya gönderiliyor
- PDF otomatik oluşturuluyor ve içinde imza, checklist, malzeme ve fotoğraflar yer alıyor
- PDF indirilebiliyor ve e-posta ile gönderilebiliyor
- Geçmiş raporlar listelenebiliyor

---

### Epic 8: Dashboard ve Audit Log (EPIC-DASHBOARD)

**Amaç:** Operatör ve admin için temel metriklerin görüntülendiği dashboard, tüm kritik işlemlerin kaydedildiği ve sorgulanabildiği audit log.

**Kullanıcı Hikâyeleri (MVP):**
| ID | Hikâye | Öncelik | Puan |
|---|---|---|---|
| DASH-01 | Operatör olarak, günlük iş emri sayısı ve durum dağılımını görebilmeliyim. | Must | 5 |
| DASH-02 | Operatör olarak, SLA aşımı olan iş emirlerini listeleyebilmeliyim. | Should | 3 |
| DASH-03 | Admin olarak, tenant genelinde audit log'u sorgulayabilmeliyim. | Must | 5 |
| DASH-04 | Admin olarak, aktif kullanıcı sayısı ve oturum bilgilerini görebilmeliyim. | Should | 3 |
| DASH-05 | Operatör olarak, teknisyen bazında tamamlanan iş emri sayısını görebilmeliyim. | Should | 3 |

**Teknik İşler:**
- Dashboard sayfası: kartlar (toplam iş emri, açık, devam eden, tamamlanan, SLA aşımı) + basit grafik (son 7 gün iş emri trendi)
- Grafik kütüphanesi: Chart.js veya Recharts (Next.js uyumlu)
- Audit log: tüm CRUD işlemlerini, durum değişimlerini, auth olaylarını kaydeden aspect
- `audit_log` tablosu: id, tenant_id, user_id, action, entity_type, entity_id, old_value (JSONB), new_value (JSONB), ip_address, user_agent, created_at
- Audit log sorgulama: tarih aralığı, kullanıcı, işlem tipi filtresi

**Güvenlik İşleri:**
- Audit log salt okunur: hiçbir kullanıcı audit log'u silemez veya değiştiremez
- Audit log erişimi sadece ADMIN rolüne açık
- Kişisel veri içeren alanlar (telefon, e-posta) audit log'da maskelenebilir (opsiyonel)
- Audit log retention: en az 2 yıl (KVKK gereği)

**Bağımlılıklar:** EPIC-WORKORDER (iş emri verisi olmadan dashboard anlamsız)

**Risk:** Audit log tablosu büyüdükçe sorgu performansı düşebilir → partition by month, indeks optimizasyonu.

**Çıkış Kriteri:**
- Dashboard'da güncel iş emri istatistikleri görüntüleniyor
- Audit log'da tüm kritik işlemler kaydediliyor
- Audit log sorgulanabiliyor ve filtrelenebiliyor
- Audit log silinemiyor veya değiştirilemiyor

---

## 4. Backlog Önceliklendirme

### Must Have (MVP'de olmazsa ürün çalışmaz)

| ID | Epic/Feature | Puan |
|---|---|---|
| AUTH-01..AUTH-06, AUTH-08 | Tenant ve kimlik (temel) | 21 |
| CUST-01..CUST-04, CUST-06 | Müşteri ve cihaz (temel) | 17 |
| WO-01..WO-06 | İş emri ve durum makinesi | 23 |
| ASGN-01, ASGN-02, ASGN-05 | Atama ve planlama (temel) | 14 |
| MOB-01..MOB-04, MOB-06..MOB-08 | Mobil saha (temel) | 44 |
| CHK-01, CHK-02, CHK-04 | Kontrol listesi (temel) | 13 |
| RPT-01, RPT-02, RPT-05 | Servis raporu (temel) | 16 |
| DASH-01, DASH-03 | Dashboard ve audit | 10 |

**MVP Must Puan Toplamı: ~158 story puan** (2 kişi × 8 hafta = 16 adam-hafta, ortalama haftada 10 puan → 160 puan kapasite — uygun)

### Should Have (MVP'ye yetişirse iyi, değilse Pilot'ta)

| ID | Epic/Feature | Puan |
|---|---|---|
| AUTH-07 | Oturum yönetimi | 3 |
| CUST-05, CUST-07 | Müşteri geçmişi, mükerrer kontrolü | 5 |
| WO-07, WO-08 | İş emri not/dosya, SLA görünümü | 8 |
| ASGN-03, ASGN-04, ASGN-06 | Atama transfer, çakışma, müsaitlik | 9 |
| MOB-05 | Tek tıkla arama | 2 |
| CHK-03, CHK-05 | Malzeme kaydı, şablon düzenleme | 8 |
| RPT-03, RPT-04 | E-posta rapor, müşteri görüntüleme | 5 |
| DASH-02, DASH-04, DASH-05 | SLA, kullanıcı, teknisyen dashboard | 9 |

**Should Puan Toplamı: ~49 puan** (Pilot aşamasında veya MVP'de kapasite kalırsa)

### Could Have (V1'de)

| ID | Feature |
|---|---|
| — | Rota optimizasyonu |
| — | Stok ve yedek parça yönetimi |
| — | Çoklu şube/ekip |
| — | Fatura entegrasyonu |
| — | Müşteri portalı |
| — | Public API |
| — | SSO / OIDC |
| — | Beyaz etiketleme |

### Won't Have Now (V1 sonrası)

| ID | Feature |
|---|---|
| — | Yapay zeka ile iş emri önceliklendirme |
| — | IoT cihaz entegrasyonu |
| — | Gelişmiş analitik ve raporlama |
| — | Çoklu dil desteği (İngilizce, Arapça) |
| — | Çoklu para birimi |
| — | Müşteri mobil uygulaması |

---

## 5. Risk ve Bağımlılık Matrisi

| Epic | Kritik Bağımlılık | En Büyük Risk | Risk Olasılık | Risk Etki | Azaltma |
|---|---|---|---|---|---|
| EPIC-AUTH | Yok | JWT key sızıntısı | Düşük | Yüksek | Key rotation planı, secret manager |
| EPIC-CUSTOMER | EPIC-AUTH | Mükerrer veri, adres standardizasyonu | Orta | Orta | Telefon bazlı tekil kontrol, adres öneri sistemi ertelendi |
| EPIC-WORKORDER | EPIC-AUTH, EPIC-CUSTOMER | Durum makinesi hatalı geçiş | Orta | Yüksek | Katı enum validasyonu, otomatik test |
| EPIC-ASSIGN | EPIC-WORKORDER | Takvim bileşeni karmaşıklığı | Orta | Orta | MVP'de basit liste görünümü |
| EPIC-MOBILE | EPIC-WORKORDER, EPIC-ASSIGN | Offline sync çakışması, veri kaybı | Yüksek | Yüksek | Last-write-wins, conflict log |
| EPIC-CHECKLIST | EPIC-WORKORDER, EPIC-MOBILE | Şablon UI karmaşıklığı | Orta | Düşük | MVP'de basit dinamik form |
| EPIC-REPORT | EPIC-WORKORDER, EPIC-CHECKLIST | PDF layout/özel şablon talebi | Orta | Orta | MVP'de tek tip, esnek olmayan şablon |
| EPIC-DASHBOARD | EPIC-WORKORDER | Audit log büyümesi ve performans | Düşük | Orta | Partition ve indeksleme |

---

## 6. Kapasite Planı

| Dönem | Adam-Hafta | Planlanan Puan | Buffer (%) |
|---|---|---|---|
| Foundation (W3-W5) | 6 | Teknik işler (hikâye puanı yok) | %20 |
| MVP Sprint 1 (W6-W7) | 4 | 20 puan (AUTH başlangıcı, CUSTOMER) | %20 |
| MVP Sprint 2 (W8-W9) | 4 | 24 puan (AUTH tamamlama, WO başlangıcı) | %20 |
| MVP Sprint 3 (W10-W11) | 4 | 24 puan (WO tamamlama, ASSIGN, MOB başlangıcı) | %20 |
| MVP Sprint 4 (W12-W13) | 4 | 24 puan (MOB tamamlama, CHK, RPT, DASH) | %20 |

**Toplam planlanan puan: 92** (Must hikâyeler)
**Kalan Must puan: ~66 → Should'lardan seçilerek tamamlanır veya Pilot'a kalır.**

Buffer ile birlikte gerçekçi hedef: tüm Must'lar MVP'de tamamlanır, Should'ların çoğu Pilot'ta.

---

## 7. Efor Tahmin Metodolojisi

- 1 puan = yarım günlük iş (bir geliştirici için ~4 saat)
- 2 kişilik ekip, haftada 5 iş günü × 2 kişi = 10 adam-gün = 20 puan kapasite (buffer öncesi)
- Sprint süresi: 2 hafta (kolay planlama, az toplantı)
- Tahminleme: planning poker benzeri, ekip içi oylama
- Velocity: ilk 2 sprint sonrası ölçülür ve plan güncellenir

---

## Karar Bekleyen Konular

1. RLS mi yoksa uygulama katmanında tenant filtreleme mi? → Prototip sonrası performans testi ile karar verilecek.
2. Harita sağlayıcısı: Google Maps (ücretli, yüksek doğruluk) vs OpenStreetMap (ücretsiz, düşük doğruluk)? → Discovery'de müşterilerin harita kullanım yoğunluğuna göre karar verilecek.
3. PDF motoru: iText (lisans maliyeti) vs Apache PDFBox (ücretsiz, daha az özellik)? → PDFBox ile prototip, yetersiz kalırsa iText.
4. Push notification: FCM (Firebase) zorunlu mu, APNS için ek maliyet çıkar mı?
5. E-posta servis sağlayıcısı: Mailgun, SendGrid, yoksa AWS SES?

## İlgili Dokümanlar

- `01_PROJE_GIRDI_FORMU.yaml` — Proje girdi formu
- `02_ANA_URETIM_PROMPTU.md` — Ana üretim promptu
- `03_PRD_SABLONU.md` — Ürün gereksinimleri dokümanı
- `04_MIMARI_VE_TEKNOLOJI_KARARLARI.md` — Mimari karar şablonu
- `17_DEFINITION_OF_DONE.md` — Definition of Done
- `18_OPERATIONS_RUNBOOK.md` — Operasyon runbook'u
- `19_TRACEABILITY_MATRIX.md` — İzlenebilirlik matrisi
- `20_PROJECT_STRUCTURE.md` — Proje yapısı
