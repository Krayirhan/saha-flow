# İşAkış Web Design System

> Scope: `apps/web` landing page and shared marketing-facing web components  
> Product: İşAkış — technical service and field operations management  
> Status: Design direction approved for implementation  
> Core direction: **Operational dark interface with editorial clarity**

---

## 1. Brand Purpose

İşAkış helps technical service companies manage the complete field-operation lifecycle:

`customer request → work order → technician assignment → field execution → checklist/photo/signature → PDF service report`

The visual system must make this operational flow visible. The design must not feel like a generic AI, cloud, fintech, developer-tool, or startup template.

The product should feel:

- operational
- reliable
- fast without looking impulsive
- technical without becoming developer-centric
- modern without following every SaaS trend
- field-oriented rather than abstract
- structured and traceable

---

## 2. Core Design Principles

### 2.1 Show the operation, not decoration

Every major visual should explain a product state, action, relationship, or outcome.

Prefer:

- route lines
- work-order state changes
- mobile ↔ web synchronization
- technician availability
- checklist completion
- signature capture
- report generation

Avoid:

- random floating cards
- meaningless particles
- abstract blobs
- generic “AI” gradients
- decorative graphs without product meaning

### 2.2 Flow is the brand metaphor

“Flow” is not only the product name. It is the main visual and interaction language.

Use a recurring **Flow Line** system to connect:

1. Customer request
2. Work order
3. Technician assignment
4. On the way
5. In progress
6. Checklist/photo
7. Customer signature
8. PDF report

The Flow Line must always communicate a real workflow.

### 2.3 Editorial clarity

The page should feel composed, not crowded. Use strong headings, clear sections, large readable screenshots, and restrained animation.

### 2.4 Operational density

Do not over-simplify the product into empty black sections. İşAkış is an operations platform. The page should include enough meaningful detail to feel credible.

### 2.5 Evidence before claims

Do not use fabricated metrics, customer logos, testimonials, guarantees, or production-readiness claims.

If information is not verified:

- mark it as `TODO`
- omit it from production copy
- present it as roadmap, not as a completed feature

---

## 3. Reference Source Rules

### VibeUI

Use only for:

- section structure
- layout patterns
- information hierarchy
- responsive composition ideas

Preferred patterns:

- minimal navbar
- split hero
- before/after comparison
- sticky scroll reveal
- alternating product rows
- controlled asymmetric bento
- single-tier pricing
- single-column FAQ
- multi-column footer

Do not copy a complete landing layout.

### Refero Styles

Use for:

- typography hierarchy
- spacing rhythm
- visual density
- color relationships
- product screenshot treatment
- card and surface behavior
- editorial composition

Search directions:

- operational dashboard
- logistics software
- industrial SaaS
- control center
- technical blueprint
- workflow visualization
- dark editorial product
- field operations
- service management

Do not reproduce one site pixel-for-pixel.

### Aceternity UI

Use for limited interaction patterns only.

Allowed patterns:

- timeline behavior
- tracing beam behavior
- sticky scroll reveal behavior
- subtle glowing border behavior
- stateful button feedback

Maximum: **three distinctive animation patterns across the landing page**.

Do not use:

- meteors
- shooting stars
- sparkles
- lamp effect
- hero parallax
- 3D globe
- random floating cards
- heavy perspective
- decorative shaders
- continuous animated gradient backgrounds

Adapt the behavior to İşAkış tokens. Do not paste a component unchanged.

### SuperDesign

Use for concept exploration before implementation.

Generate three variants for critical sections:

- A — Operations Control Center
- B — Route and Map Driven
- C — Editorial Product Showcase

Select one main direction and borrow only compatible details from the others.

---

## 4. Visual Metaphor: Flow Line

The Flow Line is a reusable system, not a single illustration.

### 4.1 States

| State | Token | Meaning |
|---|---|---|
| Open | `state-open` | Work order created |
| Assigned | `state-assigned` | Technician assigned |
| On the way | `state-on-the-way` | Technician travelling |
| In progress | `state-in-progress` | Field work started |
| Completed | `state-completed` | Work finished |
| SLA risk | `state-sla-risk` | Deadline at risk |
| Offline | `state-offline` | Device disconnected |
| Synced | `state-synced` | Offline activity synchronized |

### 4.2 State Colors

```css
--state-open: #4f8cff;
--state-assigned: #7d6cff;
--state-on-the-way: #74b8ff;
--state-in-progress: #ffaa4c;
--state-completed: #38d996;
--state-sla-risk: #ff5f6d;
--state-offline: #747d8d;
--state-synced: #3dd6d0;
```

### 4.3 Flow Line Rules

- Use consistent node sizes.
- Use icons only when they clarify the state.
- Use movement sparingly.
- Preserve state colors in all sections.
- Never use the Flow Line as meaningless decoration.
- When reduced motion is enabled, render all states statically.

---

## 5. Color System

These are implementation starting tokens and may be refined after visual testing.

```css
--background: #080a0f;
--background-secondary: #0d1118;
--surface: #111722;
--surface-elevated: #151d2a;
--surface-soft: #0f141d;

--brand: #4f8cff;
--brand-light: #7ab3ff;
--brand-deep: #315fd6;

--success: #38d996;
--warning: #ffaa4c;
--danger: #ff5f6d;
--synced: #3dd6d0;

--text-primary: #f5f7fa;
--text-secondary: #a8b0bf;
--text-muted: #747d8d;
--text-disabled: #515865;

--border: rgba(255, 255, 255, 0.08);
--border-strong: rgba(255, 255, 255, 0.14);
--overlay: rgba(8, 10, 15, 0.72);
```

### Color Rules

- Use brand blue for actions, selected states, and meaningful flow.
- Do not apply gradients to every heading.
- Use gradient text only once, if at all.
- Use green only for successful completion.
- Use orange only for active field work or warnings.
- Use red only for SLA risk, destructive action, or error.
- Do not use low-contrast grey for essential information.

---

## 6. Typography

Use the existing project font unless a deliberate migration is approved.

### Desktop Scale

| Role | Size |
|---|---:|
| Hero heading | 56–68 px |
| Section heading | 36–44 px |
| Subsection heading | 26–32 px |
| Card heading | 18–22 px |
| Body | 16–18 px |
| Small text | minimum 14 px |
| Label | 12–14 px |

### Rules

- Hero line-height: approximately `0.98–1.08`.
- Body line-height: `1.5–1.65`.
- Limit long copy to approximately 60–70 characters per line.
- Avoid excessive uppercase labels.
- Do not use 11–12 px text for essential content.
- Use a clear visual difference between product labels and marketing headings.

---

## 7. Layout and Grid

### Container

- Main maximum width: `1200–1280px`
- Standard horizontal padding:
  - mobile: `20px`
  - tablet: `32px`
  - desktop: `48px`
- Large product showcase sections may extend to `1360px`.

### Grid

- Desktop: 12-column grid
- Tablet: 8-column grid
- Mobile: single-column content flow

### Spacing

Use a 4px base system.

Preferred spacing values:

`4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 120`

Section vertical spacing:

- mobile: `72–88px`
- desktop: `96–128px`

Avoid sections with large empty dark areas and little information.

---

## 8. Radius, Borders, and Surfaces

### Radius

- Large product panels: `20–24px`
- Standard cards: `14–18px`
- Buttons: `10–12px`
- Pills/status chips: full radius

### Borders

- Default: `1px solid var(--border)`
- Selected/active: `var(--border-strong)`
- Avoid bright borders around every card.

### Shadows and Glow

- Shadows should create depth, not spectacle.
- Use subtle blue glow only around active product flow.
- Avoid large radial glows behind every section.
- Glowing borders may be used for hover or active states only.

---

## 9. Iconography

Use category-specific icons:

- work order
- technician
- route
- calendar
- checklist
- camera
- signature
- PDF report
- sync
- offline
- audit
- permissions

Avoid generic icons such as:

- magic wand
- rocket
- sparkle
- abstract star
- lightning bolt without operational context

Icon stroke weight and corner style must remain consistent.

---

## 10. Product Screenshot Rules

- Screens must be large enough to read.
- Show real product structure, not decorative fake charts.
- Use one continuous sample work order across the page:

`#SF-1842 — Klima Arızası — ABC Plaza`

- Show web and mobile as connected interfaces.
- Avoid excessive perspective distortion.
- Avoid blur that hides content.
- Use real field names where possible.
- Do not claim unavailable features.

---

## 11. Motion

### Allowed

- Flow Line progression
- timeline state reveal
- sticky screenshot transition
- offline → synced state change
- signature → report generation
- subtle card hover elevation
- CTA loading/success state

### Disallowed

- endless floating cards
- autoplay marquee for social proof
- random particles
- continuous glow movement
- unnecessary parallax
- high-frequency motion
- animation that delays content comprehension

### Reduced Motion

All animation must support:

```css
@media (prefers-reduced-motion: reduce)
```

In reduced-motion mode:

- disable continuous animation
- show final state immediately
- preserve all content and hierarchy
- do not remove information

---

## 12. Accessibility

Requirements:

- WCAG AA contrast
- visible focus states
- semantic heading order
- keyboard-operable accordion and tabs
- minimum touch target: `44x44px`
- meaningful `alt` text for informative images
- empty `alt` for decorative images
- no color-only status communication
- reduced-motion support
- no horizontal overflow at 320px
- buttons and links must remain visually distinct

---

## 13. Responsive Behavior

### Mobile

- Hero becomes one column.
- Product simulation remains visible but simplified.
- Sticky sections become stacked sections.
- Flow Line can switch from horizontal to vertical.
- Comparison sections become sequential cards.
- Screenshots use full available width.
- CTA buttons may become full-width.

### Tablet

- Use two-column layouts selectively.
- Avoid compressed desktop layouts.
- Maintain readable product screenshots.

### Desktop

- Allow asymmetric compositions.
- Keep screenshots readable.
- Do not stretch content into empty space.

---

## 14. Component Guidance

Recommended marketing components:

- `MarketingNavbar`
- `HeroOperationsFlow`
- `FlowLine`
- `WorkflowNode`
- `BeforeAfterOperations`
- `LifecycleStickySection`
- `WebMobileSyncShowcase`
- `OperationalFeatureBento`
- `TrustAndSecuritySection`
- `PilotProgramSection`
- `SinglePlanPricing`
- `LandingFaq`
- `FinalWorkOrderCta`
- `MarketingFooter`

Each component must use centralized tokens and avoid isolated one-off visual styles.

---

## 15. SaaS Clichés to Avoid

Do not use:

- “Everything in one platform”
- “Light-speed management”
- “Transform the future”
- “Next-generation solution”
- repeated gradient headings
- unsupported metrics
- `0+` counters
- fake customer logos
- fake testimonials
- tiny unreadable dashboards
- generic floating pills
- excessive black empty space
- technology-logo trust bars
- multiple incompatible reference styles

---

## 16. Definition of Visual Success

The landing page is visually successful when:

1. The first viewport clearly communicates field-service operations.
2. “Flow” is visible as a product behavior and visual system.
3. The design cannot be rebranded as a generic AI or cloud product without major changes.
4. Web and mobile feel like parts of one operating system.
5. Product evidence is stronger than decoration.
6. Text remains readable in every section.
7. Animations explain product behavior.
8. No unverified claim is used as proof.
