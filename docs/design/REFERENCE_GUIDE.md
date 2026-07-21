# Saha Flow Landing Reference Guide

> Purpose: Define how external design references may be used without creating a copied or fragmented interface.

---

## 1. Core Rule

External references are used to improve decision quality, not to assemble a page from unrelated templates.

The final landing must feel like one coherent Saha Flow product system.

Do not create “Frankenstein UI” by combining:

- one hero style
- an unrelated bento style
- a different pricing style
- several animation libraries
- inconsistent typography and radii

Every borrowed idea must pass through the Saha Flow design system.

---

## 2. VibeUI

URL:

`https://vibeui.online`

### Use For

- section architecture
- information hierarchy
- responsive layout patterns
- page rhythm
- common landing structures

### Approved Patterns

- minimal navbar
- split hero
- before/after comparison
- scroll-triggered reveal
- alternating product rows
- controlled bento layout
- single-tier pricing
- single-column accordion
- multi-column footer

### Do Not Use For

- final visual identity
- direct copy
- color decisions
- typography decisions
- full-page cloning

### Evaluation Questions

- Does this pattern clarify the product?
- Is this pattern already overused in the current page?
- Can it support readable product screenshots?
- Does it work without animation?
- Does it remain useful on mobile?

---

## 3. Refero Styles

URL:

`https://styles.refero.design`

### Use For

- typography hierarchy
- spacing systems
- surface relationships
- information density
- screenshot treatment
- editorial composition
- dark-theme nuance
- component proportion

### Search Directions

- operational dashboard
- logistics software
- field service management
- industrial SaaS
- technical blueprint
- control center
- workflow visualization
- dark editorial product
- service operations
- route planning

### Extraction Method

From each reference, record only:

- what the heading hierarchy achieves
- how spacing creates rhythm
- how surfaces differ
- how screenshots are framed
- how much information is visible
- where color is used
- how action hierarchy is expressed

Do not reproduce:

- exact page composition
- brand-specific illustrations
- proprietary icons
- copy
- screenshots
- unique motion sequences
- logos

### Reference Limit

Use at most three primary style references for one redesign direction.

---

## 4. Aceternity UI

URL:

`https://ui.aceternity.com/components`

### Use For

Behavior patterns only.

### Allowed

- Timeline
- Tracing Beam
- Sticky Scroll Reveal
- subtle Glowing Effect
- Stateful Button

### Maximum

No more than three distinctive animation behaviors across the full landing page.

### Adaptation Requirements

Every adapted component must:

- use Saha Flow colors
- use Saha Flow typography
- use Saha Flow radius and border tokens
- support reduced motion
- preserve keyboard accessibility
- work on mobile
- explain a real product behavior

### Forbidden Patterns

- meteors
- shooting stars
- sparkles
- lamp effect
- 3D globe
- hero parallax
- infinite floating cards
- decorative shader backgrounds
- heavy perspective
- autoplay testimonial marquee
- excessive spotlight effects

### Rejection Test

Reject a component when:

- it attracts more attention than the product
- it has no operational meaning
- it introduces a new visual language
- it harms performance
- it is difficult to make accessible
- it looks like an Aceternity demo after adaptation

---

## 5. SuperDesign

URL:

`https://superdesign.dev`

### Use For

- concept exploration
- section variation
- early design comparison
- testing different layout directions

### Required Variants

For hero, lifecycle, and web/mobile showcase, generate:

#### A — Operations Control Center

Focus:

- live work-order flow
- operational states
- dashboard density
- timeline

#### B — Route and Map Driven

Focus:

- technician route
- map progression
- assignment and arrival
- location-aware workflow

#### C — Editorial Product Showcase

Focus:

- strong copy
- large screenshots
- restrained animation
- premium product storytelling

### Selection Criteria

Score each direction on:

- category specificity
- product clarity
- originality
- implementation feasibility
- mobile behavior
- accessibility
- performance
- consistency with Saha Flow

Do not combine all three equally.

Choose one primary direction.

---

## 6. Anti-Copy Rules

Never:

- copy a full section without transformation
- copy wording from reference sites
- reproduce logos or customer names
- reuse proprietary screenshots
- duplicate illustration assets
- imitate a unique brand motif
- preserve source-specific colors and typography unchanged
- claim a component is original when it is visibly copied

When using an open-source component:

- retain license notices if required
- inspect the license
- adapt code and visuals
- document the source in code comments when appropriate

---

## 7. Coherence Checklist

Before accepting a section, confirm:

- Does it use the shared design tokens?
- Does it use the same typography hierarchy?
- Does it support the Flow Line system?
- Does it show a real Saha Flow concept?
- Does it use the same corner and border language?
- Does it fit the selected main direction?
- Does it work in reduced-motion mode?
- Does it remain understandable without animation?
- Does it work on mobile?
- Does it avoid unsupported claims?

If three or more answers are “no,” redesign the section.

---

## 8. Originality Checklist

The landing is sufficiently original when:

- the hero is based on a field-operation sequence
- the page uses a consistent work-order story
- the web and mobile screens are visibly synchronized
- status colors have product meaning
- the Flow Line appears in multiple sections
- the visuals include route, technician, checklist, signature, and report concepts
- the page could not be rebranded as an AI tool with only copy changes
- external references are no longer obvious in the final composition

---

## 9. Practical Workflow

1. Read `apps/web/DESIGN.md`.
2. Read `docs/design/LANDING_REDESIGN_PLAN.md`.
3. Read `docs/design/LANDING_CONTENT.md`.
4. Audit the existing landing implementation.
5. Explore references for one section at a time.
6. Record design decisions before implementation.
7. Generate multiple variants only for critical sections.
8. Select one direction.
9. Implement with centralized tokens.
10. Validate accessibility, performance, and responsiveness.
11. Remove any visual element that does not explain the product.
