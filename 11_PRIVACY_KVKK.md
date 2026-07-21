# KVKK Uyumluluk ve Gizlilik Dokumani

> Proje: Saha Flow
> Dokuman: KVKK Uyumluluk ve Gizlilik (Privacy & KVKK)
> Durum: Draft
> Uretim tarihi: 2026-07-21
> Kaynak girdi: templates/01_PROJE_GIRDI_FORMU.yaml

---

> **Onemli Uyari:** Bu dokuman hukuki gorus niteligi tasimaz. KVKK ve ilgili mevzuat kapsaminda nihai degerlendirme ve onay icin bir hukuk danismani / veri koruma uzmani tarafindan gozden gecirilmelidir. Dokuman, teknik ekibe yol gosterme amaciyla hazirlanmistir.

---

## 1. Veri Sorumlusu / Veri Isleyen Rol Varsayimi

| Rol | Taraf | Aciklama |
|---|---|---|
| **Veri Sorumlusu** | Saha Flow'u kullanan Teknik Servis Firmasi (Musteri/Tenant) | Kendi musteri ve personel verilerinin islenme amacini ve yontemini belirler. Saha Flow, musteri firmalarinin veri sorumlusudur. |
| **Veri Isleyen** | Saha Flow (Platform Saglayici) | Veri sorumlusunun talimatlari dogrultusunda, sozlesme kapsaminda veriyi isler. Kendi basina veri isleme amaci belirlemez. |

**Alt Isleyenler:**
| Alt Isleyen | Hizmet | Veri Islenen Konum |
|---|---|---|
| MinIO / S3 Depolama | Dosya (fotograf, imza, PDF) depolama | Turkiye (self-hosted MinIO) |
| PostgreSQL (self-hosted) | Tum yapisal veri | Turkiye |
| Redis (self-hosted) | Oturum ve onbellek | Turkiye |
| E-posta Servis Saglayici (Secilecek) | Bildirim ve sifirla e-postalari | AB (tercih edilen) veya TR |
| Opsiyonel: SMS Saglayici | SMS bildirimleri | TR |

---

## 2. Veri Envanteri

### 2.1 Islenen Kisisel Veriler

| Veri Kategorisi | Veri Unsuru | Kayit Ortami | Islenme Amaci | Hukuki Sebep | Saklama Suresi | Ozel Nitelikli? |
|---|---|---|---|---|---|---|
| Kimlik | Ad, Soyad | PostgreSQL | Musteri kaydi, teknisyen profili, is emri atamasi | Sozlesmenin ifasi | Hesap aktif oldugu surece + 10 yil (ticari defter) | Hayir |
| Iletisim | Telefon Numarasi | PostgreSQL | Is emri bildirimi, teknisyen iletisimi, SMS ile dogrulama | Sozlesmenin ifasi, Acik riza (pazarlama icin) | Hesap aktif + 10 yil | Hayir |
| Iletisim | E-posta Adresi | PostgreSQL | Hesap dogrulama, sifre sifirlama, fatura, bildirim | Sozlesmenin ifasi | Hesap aktif + 10 yil | Hayir |
| Adres | Musteri Adresi (servis adresi) | PostgreSQL + PostGIS | Is emri icin servis konumu, rota planlamasi | Sozlesmenin ifasi | Hesap aktif + 10 yil | Hayir |
| Konum | GPS Koordinati, Zaman Damgasi | PostgreSQL + PostGIS | Teknisyen konum takibi, is emri durum guncellemesi, varis suresi hesaplama | Sozlesmenin ifasi, Acik riza (teknisyenden) | Son 90 gun (canli), 2 yil (arşiv) | Hayir |
| Gorsel / Isitsel | Fotograf (is emri fotografi, hasar tespiti, is bitmis fotografi) | MinIO S3 | Is emri kaniti, hasar tespiti, kalite kontrol | Sozlesmenin ifasi | Hesap aktif + 10 yil | Hayir* |
| Gorsel | Imza (musteri imzasi) | MinIO S3 | Is emri tamamlanma onayi, hukuki gecerli kanit | Sozlesmenin ifasi, Hukuki yukumluluk | Hesap aktif + 10 yil | Hayir* |
| Cihaz Bilgisi | Cihaz modeli, isletim sistemi surumu, uygulama surumu, IP adresi | PostgreSQL + Log | Hata ayiklama, guvenlik denetimi, uygunluk kontrolu | Mesru menfaat (guvenlik) | 90 gun (log), 2 yil (cihaz kaydi) | Hayir |
| Islem Guvenligi | Parola (hash'lenmis), JWT token, Refresh token | PostgreSQL, Redis | Kimlik dogrulama, oturum yonetimi | Sozlesmenin ifasi, Mesru menfaat | Parola: kalici (hash'li), Token: oturum suresi | Hayir |
| Finans | Fatura tutari, odeme durumu | PostgreSQL | Fatura yonetimi, muhasebe entegrasyonu | Hukuki yukumluluk (vergi usul) | 10 yil (yasal zorunluluk) | Hayir |

> *Not: Fotograf ve imza, baglamina gore (ornegin biyometrik isleme yapilmadigi surece) ozel nitelikli kisisel veri olarak degerlendirilmez. Ancak icinde kisi goruntusu olan fotograflar KVKK kapsaminda kisisel veridir.

### 2.2 Islenmeyen Veriler

- **Kredi karti / odeme bilgisi:** Odemeler harici odeme saglayici (Iyzico, Stripe vb.) uzerinden yapilir. Saha Flow kendi sunucusunda kredi karti bilgisi SAKLAMAZ.
- **TC Kimlik Numarasi:** Zorunlu ise sifreli ayri tabloda saklanir, loglanmaz, maskelenir. MVP kapsaminda toplanmamasi onerilir.
- **Saglik verisi, biyometrik veri, irk/etnik koken, sendika uyeligi, siyasi gorus:** Toplanmaz ve islenmez.
- **Cocuk verisi:** 18 yas alti kullanicisi yoktur; kayit sirasinda yas dogrulamasi yapilmalidir.

---

## 3. Veri Siniflandirmasi

| Siniflandirma | Aciklama | Ornek Veri | Kontroller |
|---|---|---|---|
| **Herkese Acik** | Paylasilmasinda sakinca olmayan | Hizmet aciklamalari | Yok |
| **Dahili** | Sadece platform calisanlarinin erisimi | Hata loglari (maskelenmis), anonim istatistikler | IAM, VPN |
| **Gizli** | Kisisel veri iceren, yetkisiz erisimde zarar doguran | Musteri adi, adres, telefon, e-posta, is emri detaylari | Tenant izolasyonu, RBAC, sifreleme, audit log |
| **Cok Gizli / Hassas** | Ozel nitelikli veya kritik sistem verisi | Parola hash, JWT signing key, DB credential, API key, TC kimlik numarasi (varsa) | Kasa (vault) yonetimi, sifreleme, minimal erisim, cift onay |

---

## 4. Islenme Amaclari ve Hukuki Sebepler

| Amac | Hukuki Sebep | Aciklama |
|---|---|---|
| Kullanici hesabi olusturma ve yonetme | Sozlesmenin ifasi (KVKK m.5/2-c) | Musterinin platformu kullanmasi icin zorunlu |
| Is emri olusturma, atama, takip, tamamlama | Sozlesmenin ifasi (KVKK m.5/2-c) | Hizmetin temel fonksiyonu |
| Teknisyen konum takibi (saha servisi sirasinda) | Acik riza + Sozlesmenin ifasi | Teknisyenden ayrica KVKK metni altinda acik riza alinir, uygulama kullanim suresiyle sinirlanir |
| Fatura kesme, odeme takibi | Hukuki yukumluluk (KVKK m.5/2-c) | Vergi usul kanunu geregi |
| E-posta ile bildirim (is emri durumu) | Sozlesmenin ifasi | Hizmetin bir parcasi |
| E-posta ile pazarlama iletisimi | Acik riza (KVKK m.5/1) | Ayri checkbox ile riza alinir, zorunlu degildir |
| Hata ayiklama ve guvenlik izleme | Mesru menfaat (KVKK m.5/2-f) | Sistem guvenligi ve hata cozumu icin, temel haklara ustun gelmeme sartiyla |
| Yasal yukumluluk durumunda veri paylasimi | Hukuki yukumluluk (KVKK m.5/2-a) | Mahkeme karari veya yetkili kurum talebi |

---

## 5. Aydinlatma ve Riza Degerlendirmesi

### 5.1 Aydinlatma Yukumlulugu

| Veri Sahibi Grubu | Aydinlatma Yontemi | Zamanlama |
|---|---|---|
| Musteri Firmasi (Veri Sorumlusu) | Sozlesme eki olarak "Veri Isleme Sozlesmesi" (DPA) | Sozlesme imzasi oncesi |
| Musteri Firmasi Calisani / Teknisyen | Mobil uygulama ilk acilista tam ekran aydinlatma metni, Web'de KVKK sayfasi | Veri isleme baslamadan once |
| Musterinin Musterisi (son kullanici / servis alan) | Is emri oncesi kisa aydinlatma (mobil uygulamada "Is emri olusturulurken adiniz, adresiniz ve telefon numaraniz Saha Flow tarafindan..." metni) | Is emri olusturulmadan once |

### 5.2 Riza Degerlendirmesi

| Veri Isleme Faaliyeti | Riza Gerekli mi? | Aciklama |
|---|---|---|
| Is emri yonetimi (ad, adres, telefon) | **Hayir** | Sozlesmenin ifasi icin zorunlu |
| GPS konum takibi (teknisyen) | **Evet** | Acik riza alinmali, ayri checkbox, her zaman geri cekilebilir |
| Pazarlama e-postasi | **Evet** | Ayri checkbox, zorunlu degil |
| Fotograf cekimi | **Duruma bagli** | Is emri kaniti: sozlesmenin ifasi. Musteri fotografi cevirimici paylasimi: acik riza |
| Imza alimi | **Hayir** | Sozlesmenin ifasi ve hukuki yukumluluk |

### 5.3 Riza Yonetimi Teknik Gereksinimler

- Tum rizalar veri tabaninda `consent_id, user_id, consent_type, granted (boolean), timestamp, ip_address, consent_version` ile kaydedilir.
- Riza geri cekme (opt-out): Kullanicinin profil sayfasindan rizayi geri cekebilmesi, API uzerinden `DELETE /api/v1/consents/{id}` endpoint'i
- Riza surumu (versioning): KVKK metni guncellendiginde yeni surum numarasi, tum kullanicilara tekrar onay sorulur.

---

## 6. Saklama ve Imha Politikasi

### 6.1 Saklama Sureleri Tablosu

| Veri Grubu | Saklama Suresi (Aktif) | Arsiv Suresi | Imha Yontemi | Imha Periyodu |
|---|---|---|---|---|
| Kullanici hesap bilgileri | Hesap aktif + 30 gun | Sozlesme sonrasi 10 yil | PostgreSQL soft-delete + anonimlestirme, suresi dolunca tam silme (DELETE) | 6 ayda bir periyodik |
| Is emri kayitlari | Hesap aktif, hesap silindikten 30 gun sonra | Sozlesme sonrasi 10 yil | Anonimlestirme (musteri adi hash'lenir), sonra DELETE | 6 ayda bir |
| GPS konum verisi | Son 90 gun | 2 yil (rota analizi icin anonim) | Zaman bazli otomatik silme (Loki retention policy), PostgreSQL partition pruning | Surekli (otomatik) |
| Fotograf ve imza | Hesap aktif, hesap silindikten 30 gun sonra | Sozlesme sonrasi 10 yil | MinIO bucket lifecycle policy ile silme | Surekli (otomatik) |
| Log kayitlari (erişim, hata) | 90 gun | Yok (tamamen silinir) | Loki retention policy | Surekli (otomatik) |
| Yedekler | Gunluk yedek: 30 gun, Haftalik: 12 hafta, Aylik: 12 ay | Yok | Sifreli yedeklerin suresi doldugunda guvenli imha (shred) | Otomatik (backup script) |
| Parola hash ve token | Oturum kapandiginda gecersiz | Yok | Redis TTL, PostgreSQL DELETE | Otomatik |
| Denetim (audit) logu | 2 yil | Yok | PostgreSQL partition rotation | 3 ayda bir |

### 6.2 Imha Yontemleri

| Ortam | Imha Yontemi | Standart |
|---|---|---|
| PostgreSQL | Anonimlestirme (once) + DELETE/TRUNCATE + VACUUM FULL | NIST SP 800-88 |
| MinIO / S3 | Object delete + bucket lifecycle policy | NIST SP 800-88 |
| Redis | FLUSHDB veya TTL bazli | - |
| Yedek medyasi | GPG sifreli dosyanin shred / srm ile imhasi | NIST SP 800-88 |
| Log dosyalari | Retention policy ve disk overwrite | - |

---

## 7. Ilgili Kisi Talepleri (Basvuru Sureci)

### 7.1 Basvuru Kanallari

| Kanal | Adres / Yontem | Teyit Yontemi |
|---|---|---|
| E-posta | `kvkk@sahaflow.com` (ornek) | Basvuru sahibine kimlik teyit e-postasi |
| Yazili Basvuru | Sirket adresine posta | Islak imza ve kimlik fotokopisi |
| Web Formu | `https://sahaflow.com/kvkk-basvuru` (ornek) | E-posta dogrulamasi + telefon dogrulamasi |

### 7.2 Basvuru Kategorileri ve Yanit Sureci

| Talep Turu | Yasal Sure | Hedef Yanit Suresi | Teknik Uygulama |
|---|---|---|---|
| Veri erisim talebi | 30 gun | 7 gun | API: `GET /api/v1/gdpr/user-data/{userId}` endpoint'iyle JSON cikti |
| Veri duzeltme talebi | 30 gun | 3 gun | API + admin paneli |
| Veri silme talebi | 30 gun | 7 gun | Hesap soft-delete -> 30 gun sonra hard delete. `POST /api/v1/accounts/{id}/request-deletion` |
| Islenmenin kisitlanmasi | 30 gun | 7 gun | Flag bazli: `processing_restricted = true` tum isleme kontrollerinde |
| Veri tasinabilirligi | 30 gun | 7 gun | JSON / CSV formatinda makinece okunabilir cikti, S3 presigned URL |
| Itiraz (otomatik karar) | 30 gun | 7 gun | Manuel inceleme surecine yonlendirme |

### 7.3 Basvuru Yanit Sureci

```
Basvuru Alindi -> Kimlik Dogrulama (1 gun)
                 -> Icerik Degerlendirme ve Veri Toplama (3 gun)
                 -> Hukuk Danismani Incelemesi (gerekirse, 2 gun)
                 -> Yanit Olusturma ve Gonderme (1 gun)
```

---

## 8. Yurt Disi Aktarim

| Durum | Aciklama |
|---|---|
| **Yurt disi veri aktarimi ongorulmemektedir.** | Tum sunucular Turkiye'de (veya AB'de, musterinin tercihine gore) barindirilir. |
| E-posta servis saglayici secimi | TR merkezli veya AB merkezli (GDPR uyumlu) bir saglayici tercih edilir. Yeterlilik karari olan ulkelere oncelik verilir. |
| CDN hizmeti | Statik icerik dagitimi icin kullanilan CDN (Cloudflare) kisisel veri islemez, sadece statik asset'leri dagitir. Full (strict) SSL modunda calisir. |

Eger ileride yurt disi aktarim gerekirse, KVKK m.9 kapsaminda:
- Yeterlilik karari olan ulkeye aktarim tercih edilir.
- Yeterlilik karari yoksa, KVKK m.9/2 kapsaminda ilgili kisinin acik rizasi veya KVKK m.9/2 hallerinden biri aranir.
- Standart sozlesme maddeleri (SCC) kullanilir.

---

## 9. Guvenlik ve Teknik Tedbirler

### 9.1 Alinan Teknik Tedbirler

| Tedbir | Aciklama | Kontrol |
|---|---|---|
| Erisim kontrolu | RBAC ile role bazli erisim, tenant bazli veri izolasyonu | Spring Security `@PreAuthorize`, `WHERE tenant_id = ?` |
| Sifreleme (at-rest) | PostgreSQL pgcrypto, MinIO AES-256 SSE, yedeklerde GPG | Konfigurasyon kontrolu, pentest |
| Sifreleme (in-transit) | TLS 1.3 (HTTP/2), HSTS, SSL pinning (mobil) | SSL Labs A+ puani |
| Guvenli yazilim gelistirme | SAST, SCA, secret scanning CI'da zorunlu, kod incelemesi | CI/CD pipeline loglari |
| Erisim loglama | pgAudit, uygulama seviyesinde audit log, Loki'de merkezi log | SIEM alert |
| Yedekleme | Gunluk, sifreli, farkli ortamda | Aylik restore tatbikati |
| Guvenlik duvari | WAF (Cloudflare), Nginx rate limiting, private subnet | Yapilandirma kontrolu |
| Guvenlik testleri | SAST/DAST/SCA, 6 ayda bir bagimsiz pentest, bug bounty (opsiyonel) | Test raporlari |
| Zafiyet yonetimi | Dependabot + Trivy ile surekli tarama, kritik zafiyetlerde 48 saat icinde guncelleme | Patch timeline raporlari |

### 9.2 Alinan Idari Tedbirler

| Tedbir | Aciklama |
|---|---|
| Calisan egitimi | Tum ekip icin yillik guvenlik ve KVKK farkindalik egitimi |
| Gizlilik taahhutnamesi | Tum ekip ve alt isleyenlerden imzali taahhutname |
| Erisim yetkilendirme matrisi | Her rol icin minimum yetki prensibi |
| Politika dokumantasyonu | Guvenlik, KVKK, veri ihlali müdahale politikalari yazili |
| Denetim | Yilda bir KVKK uyumluluk denetimi (ic veya dis) |

---

## 10. Veri Ihlali Mudahale Plani

### 10.1 Ihlal Tespiti

| Yontem | Sure |
|---|---|
| SIEM / alarm sistemi (Prometheus + Alertmanager) | Gercek zamanli |
| WAF / IDS loglari | Gunluk inceleme |
| Otomatik anomali tespiti (failed login spike, alisilmadik veri cikisi) | Gercek zamanli |
| Kullanici / musteri bildirimi | Hemen |

### 10.2 Bildirim Sureci

| Adim | Sure | Sorumlu |
|---|---|---|
| Ihlal tespiti | - | DevOps / Guvenlik |
| Ihlal dogrulama ve kapsam belirleme | Ilk 2 saat | Backend Lead |
| Kontrol altina alma (sistem izolasyonu, token invalidasyonu, hesap kilitleme) | Ilk 4 saat | DevOps Lead |
| Veri sorumlusuna (musteri firmaya) bildirim | Ilk 12 saat | Proje Yoneticisi |
| KVKK Kurulu'na bildirim (gerekli durumda) | 72 saat | Hukuk Danismani |
| Ilgili kisiye (veri sahibine) bildirim | Makul en kisa surede | Proje Yoneticisi |
| Kok neden analizi ve iyilestirme | 5 is gunu | Backend + DevOps Lead |

---

## 11. Privacy by Design Kontrol Listesi

| No | Kontrol Maddesi | Durum | Kanit / Yontem |
|---|---|---|---|
| 1 | Veri minimizasyonu: Sadece gerekli veriler toplanir | Planlandi | Veri envanteri ve amac-eslesme kontrolu |
| 2 | Varsayilan olarak gizlilik: En yuksek gizlilik ayarlari varsayilan | Planlandi | Riza checkbox'lari varsayilan olarak isaretsiz |
| 3 | Amac sinirlamasi: Her veri unsuru icin belirli ve mesru amac | Planlandi | Veri envanteri haritasi |
| 4 | Silme hakki: Kullanici profilden hesap silme talebi gonderebilir | Planlandi | `POST /api/v1/accounts/{id}/request-deletion` |
| 5 | Veri tasinabilirligi: JSON/CSV cikti alinabilir | Planlandi | `GET /api/v1/gdpr/user-data/{userId}` |
| 6 | Riza yonetimi: Granuler riza, geri cekilebilir, surumlu | Planlandi | `consents` tablosu ve API |
| 7 | Aydinlatma: Her veri isleme oncesi acik metin | Planlandi | Mobil onboarding + web KVKK sayfasi |
| 8 | Cocuk verisi: Yas dogrulamasi ile 18 yas alti engeli | Planlandi | Kayit formunda dogum tarihi dogrulamasi |
| 9 | Otomatik karar profilleme: Konum verisi otomatik karar icermez | Planlandi | Insan karari her zaman son asamada |
| 10 | Guvenli varsayilan: Tum API'ler authentication zorunlu | Planlandi | Spring Security default-deny |
| 11 | Sifreleme: At-rest ve in-transit tum kisisel veri sifreli | Planlandi | pgcrypto, TLS 1.3, GPG backup |
| 12 | Log maskeleme: Hassas veri loglanmaz | Planlandi | `@Masked` annotation + logback filter |
| 13 | Audit trail: Tum kisisel veri erisimleri loglanir | Planlandi | pgAudit + uygulama audit log |
| 14 | DPIA (Veri Koruma Etki Degerlendirmesi): GPS takibi icin DPIA yapilmali | Planlandi | Hukuk danismani ile birlikte |
| 15 | Alt isleyen sozlesmeleri: Tum alt isleyenlerle yazili sozlesme | Planlandi | DPA (Data Processing Agreement) |
| 16 | Veri ihlali müdahale plani: Yazili ve test edilmis | Planlandi | Yillik masaustu tatbikati |
| 17 | Privacy by default API: Her endpoint varsayilan olarak ID'leri maskeler | Planlandi | DTO seviyesinde `@JsonIgnore` / `@Masked` |

---

## 12. Hukuk Danismani Dogrulamasi Gereken Noktalar

1. **Aydinlatma metinlerinin hukuki gecerliligi:** Tum aydinlatma metinlerinin KVKK m.10'a uygunlugu
2. **Acik riza metinlerinin gecerliligi:** Ozellikle konum verisi ve pazarlama riza metinlerinin KVKK'ya uygunlugu
3. **Veri Isleme Sozlesmesi (DPA):** Musteri firmasi ile imzalanacak DPA'nin KVKK m.10 ve m.12'ye uygunlugu
4. **Alt isleyen sozlesmeleri:** KVKK m. 12/5 kapsaminda alt isleyen bildirimleri ve sozlesmeleri
5. **Saklama sureleri:** Ticari defterler icin 10 yil saklama suresinin yasal dayanagi, diger veriler icin belirlenen surelerin orantili olup olmadigi
6. **Yurt disi aktarim degerlendirmesi:** E-posta ve CDN servislerinin veri isleme konumu
7. **VERBIS kaydi:** Saha Flow'un VERBIS'e (Veri Sorumlulari Sicili) kayit yukumlulugu (calisan sayisi ve mali bilanco esikleri degerlendirilerek)
8. **DPIA (Veri Koruma Etki Degerlendirmesi):** Konum takibi icin DPIA'nin zorunlu olup olmadigi, icerigi
9. **KVKK Kurulu'na bildirim yukumlulukleri:** Hangi ihlallerin KVKK Kurulu'na bildirilmesi gerektigi
10. **Cerez (cookie) politikasi:** Web arayuzunde kullanilan cerezlerin KVKK ve eski Ceres Rehberi kapsaminda degerlendirilmesi
11. **KVKK ile GDPR kesisimi:** Eger AB'deki musterilere de hizmet verilecekse, GDPR ile KVKK arasindaki uyumlastirma
12. **CCTV ve biyometrik veri:** Is yeri guvenligi kapsaminda varsa kamera kayitlari veya parmak izi sistemi

---

## Karar Bekleyen Konular

1. VERBIS kayit yukumlulugu kapsaminda kalinip kalinmayacagi (mali/muhasebe danismani ile teyit edilecek)
2. E-posta servis saglayici secimi (TR vs AB merkezli) ve yurt disi aktarim degerlendirmesi
3. DPIA (Veri Koruma Etki Degerlendirmesi) kapsami ve zorunluluk durumu
4. Profesyonel hukuk danismani / veri koruma uzmani ile sozlesme yapilmasi
5. Acik riza metinlerinin KVKK m.5/1 kapsaminda "ozgur iradeyle verilmis" sayilmasi icin calisan-isveren iliskisindeki kisitlamalar (teknisyen rizasi)

## Ilgili Dokumanlar

- `10_THREAT_MODEL.md` — Tehdit Modeli
- `12_SECURE_SDLC_CICD.md` — Guvenli SDLC ve CI/CD
- `13_TEST_STRATEGY.md` — Test Stratejisi
- `14_DEVOPS_OBSERVABILITY_DR.md` — DevOps, Gozlemlenebilirlik ve Felaket Kurtarma
- `15_ADR.md` — Mimari Karar Kayitlari
