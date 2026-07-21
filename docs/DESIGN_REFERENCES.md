# İşAkış — Tasarım Referansları

> Bu doküman, İşAkış'ın UI/UX tasarımında ilham alınan ve bileşen/sayfa geliştirirken başvurulacak referans siteleri listeler.

---

## Referans Siteler

### 1. VibeUI — [vibeui.online](https://vibeui.online)
- **Kapsam:** Genel UI kit, uygulama arayüzü şablonları, SaaS panel tasarımları
- **Ne zaman kullanılır:** Dashboard layout, kart bileşenleri, renk paleti ve genel sayfa yapısı tasarımı için

### 2. Refero Design Styles — [styles.refero.design](https://styles.refero.design)
- **Kapsam:** Gerçek ürünlerden alınmış stil ve tasarım desenleri koleksiyonu
- **Ne zaman kullanılır:** Typography seçimi, spacing sistemi, component pattern referansı için

### 3. Aceternity UI — [ui.aceternity.com/components](https://ui.aceternity.com/components)
- **Kapsam:** Animasyonlu, premium görünümlü modern React/Tailwind bileşenler
- **Ne zaman kullanılır:** Landing page hero bölümleri, animasyonlu arka planlar, dikkat çekici UI efektleri için
- **Not:** Landing page bu kaynaktan ilham alınarak yapıldı

### 4. Super Design — [superdesign.dev](https://superdesign.dev)
- **Kapsam:** AI-assisted tasarım araçları, modern SaaS tasarım sistemi örnekleri
- **Ne zaman kullanılır:** Hızlı tasarım kararları, bileşen alternatifleri için

---

## Kullanım Notları

- Landing page → **Aceternity UI** referans alındı
- Panel iç sayfaları → **VibeUI** + **Refero Design** karışımı
- Yeni bileşen eklerken önce bu 4 siteden benzer bir örnek bul, sonra implement et
- Tailwind CSS + shadcn/ui ile implement edilir; referans siteler vanilla CSS veya farklı framework kullanıyor olsa bile fikir olarak alınır

---

## İlgili Dokümanlar

- [`06_FRONTEND_ARCHITECTURE_SECURITY.md`](../06_FRONTEND_ARCHITECTURE_SECURITY.md) — Frontend mimari kararları
- [`05_TECH_STACK_DECISIONS.md`](../05_TECH_STACK_DECISIONS.md) — UI kütüphanesi kararları (Tailwind + shadcn/ui)
