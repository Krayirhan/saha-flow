# Saha Flow Landing Page Redesign Plan

> Target: `apps/web` marketing landing page  
> Goal: Replace the generic dark-SaaS appearance with a product-specific field-operations narrative.  
> Main visual direction: **Operations Control Center + Flow Line**

---

## 1. Why the Landing Needs Redesign

The current landing page is polished but visually generic.

Main issues:

- generic centered SaaS hero
- blue gradient headline used as the primary identity
- product proof is too small
- technical logos are treated as customer trust signals
- feature tabs follow a common template pattern
- unverified metrics weaken trust
- `0+` counters can appear broken
- testimonial carousel is difficult to verify
- too much empty vertical space
- low-contrast secondary text
- little category-specific visual language
- the page could be rebranded as an AI, cloud, or developer tool

The redesign must preserve implementation quality while replacing the generic visual shell.

---

## 2. Main Creative Direction

### Selected Direction

**Operations Control Center**

The landing should feel like a live field-operation command surface:

- customer requests enter the system
- work orders are created
- technicians are assigned
- routes and field status are visible
- offline actions synchronize
- checklist/photo/signature evidence is collected
- the service report is generated

### Supporting Influences

- **VibeUI:** section structure and composition
- **Refero Styles:** typography, spacing, density, surface hierarchy
- **Aceternity UI:** controlled timeline and sticky reveal interactions
- **SuperDesign:** variation exploration before implementation

---

## 3. New Information Architecture

1. Navbar
2. Split Hero — live operation
3. Trust strip — product assurances
4. Before / After — WhatsApp and manual operations vs Saha Flow
5. Work-order lifecycle — sticky scroll story
6. Web + mobile synchronization showcase
7. Problem-focused feature bento
8. Security and control
9. Pilot program or verified social proof
10. Pricing
11. FAQ
12. Final CTA
13. Footer

---

## 4. Section-by-Section Plan

## 4.1 Navbar

### Purpose

Give fast access to key buying information without competing with the hero.

### Links

- Ürün
- Nasıl çalışır?
- Mobil uygulama
- Güvenlik
- Fiyatlandırma

Actions:

- Giriş yap
- Ücretsiz dene

### Behavior

- transparent at page top
- subtle dark blur after scroll
- compact mobile menu
- visible focus states
- CTA remains visually dominant

### Reference Use

- VibeUI: minimal navbar structure
- Refero: spacing and typography
- No Aceternity effect needed

---

## 4.2 Split Hero — Live Operation

### Purpose

Answer immediately:

- What is Saha Flow?
- Who is it for?
- What operational result does it create?

### Left Content

Eyebrow:

`Teknik servis ekipleri için uçtan uca saha yönetimi`

Heading:

`İş emrinden imzalı servis raporuna kadar tüm saha operasyonu tek akışta.`

Supporting sentence:

`Müşteri taleplerini iş emrine dönüştürün, uygun teknisyeni atayın, sahadaki süreci anlık takip edin ve iş tamamlandığında imzalı servis raporunu otomatik oluşturun.`

Primary CTA:

`14 gün ücretsiz dene`

Secondary CTA:

`Canlı ürünü incele`

Trust line:

`Kredi kartı gerekmez · Kurulum desteği dahil · CSV veri aktarımı`

Unverified statements must be marked `TODO`.

### Right Visual

A connected operation simulation:

- 09:12 New customer request
- 09:13 Work order `#SF-1842` created
- 09:14 Best available technician: Mehmet Kaya
- 09:15 Assigned
- 09:42 Arrived at customer location
- 10:18 Checklist completed
- 10:24 Customer signature captured
- 10:25 Service report sent

Visual layers:

- route line
- timeline
- technician state
- compact web panel
- mobile technician screen

### Interaction

- timeline reveals sequentially
- Flow Line highlights active state
- reduced-motion mode shows the completed sequence statically

### References

- VibeUI: split hero
- Aceternity: timeline/tracing behavior
- Refero: operational density and screenshot treatment
- SuperDesign: generate three hero variants before implementation

---

## 4.3 Trust Strip

### Purpose

Replace technical logos with buyer-relevant assurances.

Suggested items:

- Çevrimdışı çalışma
- Android ve iOS
- Rol bazlı yetkilendirme
- Denetlenebilir işlem geçmişi
- CSV içe/dışa aktarma
- KVKK odaklı veri yönetimi

Only claim features verified in the repository or product scope.

### Layout

- one compact strip on desktop
- two-column list on mobile
- simple category-specific icons

---

## 4.4 Before / After Comparison

### Section Title

`WhatsApp ve kâğıt formlardan izlenebilir saha operasyonuna`

### Left: Without Saha Flow

- WhatsApp messages
- paper service forms
- Excel technician planning
- phone calls for status
- lost photos
- missing signatures
- delayed reports

### Right: With Saha Flow

- standardized work order
- technician assignment record
- live status
- checklist and photos
- customer signature
- PDF service report
- searchable history

### Purpose

Make the category problem concrete and recognizable.

### Reference

- VibeUI before/after structure
- no decorative animation
- strong contrast between fragmented and connected workflows

---

## 4.5 Work-Order Lifecycle

### Title

`Bir iş emrinin tüm yaşam döngüsü`

### Supporting Copy

`Ofiste açılan iş emrinin sahada tamamlanmasına ve müşteriye rapor gönderilmesine kadar her adım aynı sistemde ilerler.`

### Interaction

Desktop:

- sticky product screenshot on the left
- scrolling lifecycle steps on the right

Mobile:

- stacked step cards
- a vertical Flow Line
- screenshot displayed above each related step

### Steps

1. Talebi iş emrine dönüştür
2. Doğru teknisyeni ata
3. Sahadaki süreci takip et
4. Fotoğraf, checklist ve imza topla
5. Servis raporunu otomatik oluştur

### Shared Story

Use the same work order:

`#SF-1842 — Klima Arızası — ABC Plaza`

### Reference

- VibeUI scroll-triggered reveal
- Aceternity sticky scroll reveal behavior
- custom implementation using Saha Flow tokens

---

## 4.6 Web + Mobile Synchronization

### Purpose

Show that office and field users work on the same operational record.

### Main Message

`Ofiste yapılan atama teknisyenin telefonunda görünür. Sahada tamamlanan iş aynı anda ofise düşer.`

### Desktop Layout

Row 1:

- large web operations screenshot
- explanation

Row 2:

- explanation
- large mobile technician screenshot

Row 3:

- synchronization bridge between both screens

### Mobile Layout

- web screenshot
- sync indicator
- mobile screenshot
- short explanation

### Required Product States

Web:

- customer
- technician
- status
- scheduled date
- route/map
- activity history

Mobile:

- start work
- add photo
- complete checklist
- capture signature
- complete work order

---

## 4.7 Problem-Focused Feature Bento

### Title

`Saha ekiplerinin her gün yaşadığı sorunlar için`

### Cards

- İş emirleri kaybolmasın
- Teknisyen planı çakışmasın
- İnternet kesilince iş durmasın
- Servis formları eksik kalmasın
- Müşteri tekrar aranmasın
- Saha ile ofis aynı bilgiyi görsün

### Layout

- asymmetric bento
- two dominant cards:
  - offline work
  - work-order lifecycle
- smaller cards:
  - checklist
  - signature
  - PDF
  - photos
  - audit
  - permissions

### Interaction

- subtle hover depth
- optional glowing edge only on active/hover state
- no continuous animation

---

## 4.8 Security and Control

### Purpose

Build B2B trust with operational controls rather than infrastructure logos.

Possible verified themes:

- tenant isolation
- role-based access
- audit history
- secure file access
- exportable data
- correlation and traceability

### Important

Do not overstate compliance or production readiness.

Use wording such as:

- `KVKK süreçlerini destekleyecek şekilde tasarlanmıştır`
- not `Tam KVKK uyumludur` unless legally verified

---

## 4.9 Pilot Program or Social Proof

### Decision Rule

If testimonials are not verified, remove them.

Use a pilot section instead:

Title:

`İlk pilot ekiplerden biri olun`

Copy:

`Pilot müşterilerimize kurulum, veri taşıma desteği ve ürün ekibiyle doğrudan iletişim sunuyoruz.`

Benefits:

- guided setup
- CSV migration
- direct feedback channel
- priority onboarding
- pilot pricing `TODO`

CTA:

`Pilot programına başvur`

When verified customer outcomes exist, replace with one strong featured testimonial rather than a marquee.

---

## 4.10 Pricing

### Title

`Ekibiniz büyüdükçe sade kalan fiyatlandırma`

### Plan

`Profesyonel`

### Price

`₺119 / kullanıcı / ay`

Status: `TODO — Verify current commercial pricing before publishing.`

### Features

- web management panel
- Android and iOS mobile app
- work-order management
- customer and device management
- photo and file attachment
- checklists
- digital signature
- PDF service report
- roles and permissions
- email support

Only include implemented or committed product features.

### CTA

`14 gün ücretsiz başla`

Supporting copy:

`Kredi kartı gerekmez. İstediğiniz zaman iptal edebilirsiniz.`

Status: `TODO — Verify trial and cancellation terms.`

### Layout

- single plan card
- adjacent value comparison or setup explanation to avoid empty space

---

## 4.11 FAQ

Questions:

1. Kurulum ne kadar sürüyor?
2. Mevcut müşteri verilerimi aktarabilir miyim?
3. Mobil uygulama internetsiz çalışıyor mu?
4. Teknisyenler birbirlerinin işlerini görebilir mi?
5. Servis raporuna fotoğraf ve imza eklenebilir mi?
6. Verilerim nerede saklanıyor?
7. Ücretsiz deneme için kredi kartı gerekiyor mu?
8. Kullanıcı sayımı sonradan artırabilir miyim?
9. Telefon ve tabletlerde çalışıyor mu?
10. Destek pakete dahil mi?

Answers must be verified before production.

---

## 4.12 Final CTA

### Title

`Bir sonraki iş emrinizi WhatsApp’tan değil, Saha Flow’dan yönetin.`

### Copy

`Ekibinizi oluşturun, ilk müşterinizi ekleyin ve saha operasyonunuzu tek panelden takip etmeye başlayın.`

### Actions

- `14 gün ücretsiz dene`
- `Demo talep et`

### Visual

End the Flow Line with:

- work order completed
- customer signature captured
- service report generated
- report sent

Do not use an abstract glow as the main visual.

---

## 4.13 Footer

### Product

- Özellikler
- Mobil uygulama
- Fiyatlandırma
- Güvenlik
- Sürüm notları

### Resources

- Dokümantasyon
- Yardım merkezi
- API
- Durum sayfası

### Company

- Hakkımızda
- İletişim
- Kariyer

### Legal

- KVKK Aydınlatma Metni
- Gizlilik Politikası
- Kullanım Şartları
- Çerez Politikası

Do not create broken links. Use verified routes or mark routes as TODO during implementation.

---

## 5. Responsive Plan

### 320–767px

- one-column hero
- vertical Flow Line
- full-width CTA buttons where useful
- no sticky scroll
- full-width screenshots
- before/after becomes stacked
- bento becomes one column
- footer becomes accordion or stacked groups
- no horizontal overflow

### 768–1023px

- selective two-column layouts
- simplified sticky behavior
- screenshots remain readable
- avoid compressed desktop spacing

### 1024px+

- asymmetric split hero
- sticky lifecycle section
- alternating web/mobile rows
- full operational visual density

---

## 6. Implementation Phases

## Phase 0 — Audit

- locate current landing routes and components
- identify reusable components
- identify old sections to remove
- verify asset and screenshot availability
- verify product claims
- verify pricing and trial language

No production changes yet.

## Phase 1 — Foundation

- add/update design tokens
- build Flow Line primitives
- update navbar
- implement hero
- add reduced-motion support
- validate responsive behavior

## Phase 2 — Core Story

- trust strip
- before/after
- lifecycle sticky section
- product screenshots and states

## Phase 3 — Product Depth

- web/mobile sync showcase
- feature bento
- security and control

## Phase 4 — Conversion

- pilot/social proof
- pricing
- FAQ
- final CTA
- footer

## Phase 5 — Quality

- lint
- typecheck
- unit tests
- build
- accessibility review
- performance review
- mobile overflow test
- SEO metadata
- schema markup

---

## 7. Acceptance Criteria

The redesign is accepted when:

1. The first viewport clearly communicates technical service and field operations.
2. The Flow Line appears as a meaningful product system.
3. Product evidence is readable and larger than decorative elements.
4. The landing cannot be easily rebranded as an AI or cloud tool.
5. Web and mobile are shown as synchronized interfaces.
6. No fake testimonial, logo, or metric is included.
7. No `0+` or `%0` counters remain.
8. Technology logos are not used as customer trust proof.
9. Secondary text passes readability expectations.
10. All important CTAs use consistent wording.
11. Reduced-motion mode preserves the full experience.
12. No horizontal scroll occurs at 320px.
13. All interactive controls are keyboard accessible.
14. Build and typecheck pass.
15. Unverified pricing, feature, compliance, and trial claims are marked TODO or omitted.
16. The final result visibly reflects the Saha Flow design system.
