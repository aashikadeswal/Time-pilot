---
name: Chronos Flow
colors:
  surface: '#121413'
  surface-dim: '#121413'
  surface-bright: '#383939'
  surface-container-lowest: '#0d0e0e'
  surface-container-low: '#1a1c1c'
  surface-container: '#1e2020'
  surface-container-high: '#292a2a'
  surface-container-highest: '#343535'
  on-surface: '#e3e2e1'
  on-surface-variant: '#bec9c6'
  inverse-surface: '#e3e2e1'
  inverse-on-surface: '#2f3130'
  outline: '#889391'
  outline-variant: '#3f4947'
  surface-tint: '#88d4cc'
  primary: '#88d4cc'
  on-primary: '#003733'
  primary-container: '#2d7d76'
  on-primary-container: '#d7fff9'
  inverse-primary: '#106a63'
  secondary: '#f0bd8b'
  on-secondary: '#482904'
  secondary-container: '#65411a'
  on-secondary-container: '#e1af7e'
  tertiary: '#accae3'
  on-tertiary: '#133347'
  tertiary-container: '#57758b'
  on-tertiary-container: '#f2f8ff'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#a4f1e8'
  primary-fixed-dim: '#88d4cc'
  on-primary-fixed: '#00201d'
  on-primary-fixed-variant: '#00504b'
  secondary-fixed: '#ffdcbd'
  secondary-fixed-dim: '#f0bd8b'
  on-secondary-fixed: '#2c1600'
  on-secondary-fixed-variant: '#623f18'
  tertiary-fixed: '#c8e6ff'
  tertiary-fixed-dim: '#accae3'
  on-tertiary-fixed: '#001e2e'
  on-tertiary-fixed-variant: '#2c4a5e'
  background: '#121413'
  on-background: '#e3e2e1'
  surface-variant: '#343535'
typography:
  display:
    fontFamily: Manrope
    fontSize: 44px
    fontWeight: '700'
    lineHeight: 52px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1200px
  gutter: 24px
  margin-desktop: 48px
  margin-mobile: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The design system is rooted in **Humanist Minimalism**. It aims to reduce the cognitive load often associated with productivity tools, replacing "hustle culture" urgency with "intentional focus" clarity. The target audience is students and lifelong learners who require a professional yet gentle environment to manage their cognitive labor.

The emotional response should be one of **composed reliability**. In this dark mode configuration, the UI acts as a focused, immersive workspace that minimizes light emission to support late-night study sessions and deep concentration. The aesthetic avoids the sterility of pure corporate SaaS by introducing warmth through organic tones and soft geometry, ensuring the product feels like a sophisticated digital sanctuary rather than a cold ledger.

## Colors

The palette is optimized for a dark environment, anchored by a deep neutral background that maintains the warmth of the original concept while reducing eye strain. The primary accent, **Deep Teal**, provides a grounding sense of professional stability, while secondary "Sand" and tertiary "Muted Blue" tones are used for categorization with high legibility against dark surfaces.

- **Primary (Deep Teal):** Used for primary actions, active progress indicators, and key navigational focus.
- **Secondary (Sand):** Used for highlighting "soft" milestones or secondary functional areas like scheduling.
- **Tertiary (Muted Blue):** Reserved for information-heavy data or reference links.
- **Error (Soft Red):** Utilized strictly for destructive actions or critical warnings, ensuring it remains an "alarm" in an otherwise calm environment.

## Typography

The design system utilizes **Manrope** exclusively to maintain a modern, balanced, and highly legible interface. In the dark theme, font weights are carefully preserved to ensure clarity against dark backgrounds without "glowing" or "bleeding" effects.

- **Headlines:** Use tighter letter-spacing and heavier weights to create clear visual entry points.
- **Body Text:** Optimized for long-form reading of notes or task descriptions with a relaxed line-height.
- **Labels:** Used for metadata, tags, and small captions. Label-sm should be used sparingly in all-caps for categories to provide a distinct stylistic break from body text.

## Layout & Spacing

This design system follows a **Fluid Grid** model with a hard preference for large safe margins to emphasize the "lightweight" feel.

- **Desktop:** 12-column grid, 1200px max width, centered. Large internal padding within containers (32px+) to prevent information crowding.
- **Tablet:** 8-column grid with 24px margins. 
- **Mobile:** 4-column grid. Vertically stacked content with 16px horizontal margins.

Spacing follows an 8px base unit. Always lean towards the larger spacing option when in doubt (e.g., prefer `stack-lg` over `stack-md` between major functional sections) to preserve the "calm" brand promise.

## Elevation & Depth

Hierarchy in the dark theme is achieved through **Tonal Layering**, where higher elevation levels use progressively lighter surface colors to simulate proximity to a light source.

- **Level 0 (Base):** The main background (`#191C1B`).
- **Level 1 (Cards/Surface):** Dark surfaces slightly lighter than the base background. These use an extremely diffused shadow or tonal shift to create depth.
- **Level 2 (Modals/Popovers):** Higher contrast surfaces with a slightly more defined presence.
- **Interaction:** On hover, cards should subtly lift or use a 1px inner stroke of the primary color at low opacity (20%) to indicate focus.

## Shapes

The shape language is **Soft and Friendly**. Circles and highly rounded rectangles are used to avoid the "sharpness" of traditional productivity tools.

- **Standard Elements (Buttons, Inputs):** 0.5rem (8px) radius.
- **Containers (Cards, Sections):** 1rem (16px) radius.
- **System Accents (Tags, Chips):** Pill-shaped (Full radius) to distinguish them from actionable buttons.

## Components

### Buttons
- **Primary:** Solid Deep Teal with high-contrast text. No gradients.
- **Secondary:** Ghost style with a Deep Teal border (1px) or a muted, semi-transparent surface fill.
- **Tertiary:** Text-only with an underline on hover for low-priority actions.

### Input Fields
- **Default:** Muted dark background with a subtle bottom border.
- **Focus:** The background shifts slightly lighter, and a 2px Deep Teal border appears. Label floats above the field in `label-sm`.

### Cards (Task/Event)
- **Structure:** 16px internal padding. Clear separation between the title (`headline-md`) and metadata (`label-md`). 
- **Indicator:** Use a small 4px vertical pill on the left edge of the card to denote category color (Sand, Teal, Blue).

### Chips & Tags
- Used for "Study", "Personal", "Work". Pill-shaped with low-opacity background fills of the respective category color to maintain a subtle, non-distracting presence.

### Progress Indicators
- Linear, 4px height with rounded ends. The unfilled portion should use a subtle "track" color slightly lighter than the base background to look like an "etched" path.

### Lists
- Generous vertical padding (12px+) between items. Use subtle dividers at low opacity only when content is high-density.