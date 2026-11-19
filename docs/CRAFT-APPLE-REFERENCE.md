# Apple product-page reference for CRAFT

Status: approved visual/implementation reference, not a request to copy Apple's identity.
Source: owner-provided `DESIGN.md` describing an Apple foldable-device product page. The measurements below are taken from that source file.

## How to use this reference

Use Apple as the benchmark for product storytelling, composition, spacing, typographic discipline, image scale, quiet controls and finish quality. Do not copy Apple's logo, product names, proprietary assets, exact copy, or claim CRAFT is affiliated with Apple.

CRAFT remains CRAFT: warm white / graphite / near-black with restrained lime-green and silver accents. Apple’s monochrome palette and blue conversion controls are reference examples, not a mandate to replace CRAFT brand colors. Translate the principles into CRAFT's own design language.

## Core visual thesis

Apple's product page behaves like a white product gallery:
- Large, centered, high-resolution product imagery is the visual event.
- Typography and controls remain quiet and precise around the imagery.
- Seamless white editorial sections alternate with pale gray feature bands.
- Feature media sits in large rounded, shadowless surfaces rather than dense dashboard cards.
- Product UI is shown as evidence inside device imagery.
- Long-form storytelling uses spacious chapters and optional in-page anchor navigation.
- The page relies on image scale, whitespace, crop and hierarchy for depth, not layers of decoration.

For CRAFT, the analogous visual event should be a meaningful digital artifact or continuous 3D transformation (idea → code → computer/interface → digital product → ecosystem), with readable Russian copy and accessible controls.

## Source tokens and measurements

### Source palette
| Role | Value |
|---|---|
| Gallery White | `#ffffff` |
| Studio Mist | `#f5f5f7` |
| Paper Frost | `#fafafc` |
| Hairline Silver | `#d6d6d6` |
| Control Gray | `#e6e6e8` |
| Ink | `#1d1d1f` |
| Slate | `#707070` |
| Steel | `#86868b` |
| Apple Blue (text links) | `#0066cc` |
| Pricing Blue (compact filled CTA) | `#0071e3` |
| Launch Orange (plain status label) | `#b64400` |

Use these as a reference for contrast and roles. In CRAFT, map roles to existing CRAFT tokens; do not introduce Apple Blue as a universal action color or displace the lime accent.

### Typography
The reference describes:
- SF Pro Display for product names, display headlines and feature claims; weights 400/500/600.
- SF Pro Text for navigation, body, links, compact controls and footnotes; weights 400/500/600.
- Arial only for a specific observed search-input fallback.
- If Apple's proprietary font files are not licensed and supplied by the project, do not download, bundle or redistribute them. Use the existing CRAFT font stack or a lawful system fallback such as `-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, sans-serif`.

Source type scale:
| Role | Size | Weight | Line height | Tracking |
|---|---:|---:|---:|---:|
| Global nav | 12px | 400 | 1 | -0.12px |
| Compact control | 12px | 400 | 1.33 | -0.12px |
| Body small | 14px | 400 | 1.29 | -0.224px |
| Body | 17px | 400 | 1.47 | -0.374px |
| Feature copy | 17px | 400 | 1.24 | -0.374px |
| Product nav title | 19px | 600 | 1.21 | +0.228px |
| Product kicker | 21px | 600 | 1 | +0.231px |
| Feature heading | 40px | 600 | 1 | 0 |
| Hero display | 80px | 600 | 1.05 | -1.2px |

Treat these as desktop reference measurements, not fixed values on narrow screens. Scale fluidly and preserve natural Russian wrapping.

### Spacing, shape and surface
- Base spacing unit: 4px.
- Source spacing scale: 4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 52, 64, 76, 80, 128, 144px.
- Major section gap: 90px.
- Related element gap: 20px.
- Card padding: 28px.
- Cards and media: 28px radius.
- Product-local navigation: 20px radius.
- Pills/buttons: fully rounded.
- Hairline outlines: 1px; source uses `#d6d6d6`, `#86868b`, and `#e6e6e8`.
- Feature cards and floating price callouts: no cast shadow; separate surfaces by background contrast and fine outlines.

## Component and page patterns

### Global navigation
Compact, approximately 44px high; understated text and monochrome controls; controls generally unboxed. Expanded navigation may use a very light frosted surface and a subtle 1px edge. For CRAFT, preserve existing nav behavior and brand mark.

### Product-local navigation
A product/section title at left, compact secondary outlined pill and one compact primary action at right. A floated local bar may use a 20px radius and hairline edge.

### Hero product stage
Full-bleed white/light canvas. Center a small product kicker, then one large, concise display statement. Put the hero object/render directly beneath the text; do not wrap the main visual in a generic card. Keep the headline and CTA in DOM.

### Feature band / highlights
A full-width pale neutral section with a large heading and a restrained text link. Place feature media in white rounded 28px surfaces with no shadow. Carousel controls should be small and visually quiet.

### Editorial feature chapter
A small kicker, a strong left-aligned statement, readable body copy, and oversized media that may enter from the opposite side or crop beyond its frame. Use generous whitespace and a clear chapter rhythm.

### Floating callout
Only use when the callout is contextually attached to the product visual. Keep it compact, rounded and shadowless; do not cover important imagery or content.

### Search
The reference describes a hidden-until-expanded rounded search field, white fill, 1px outline and generous horizontal padding. Apply only if it fits CRAFT's current navigation IA.

## Visual rules distilled from the reference

Do:
- Let one large, meaningful visual dominate a hero.
- Use white as the main editorial canvas and pale neutral bands to pace chapters.
- Use large image scale, cropping and whitespace instead of decorative UI chrome.
- Keep controls compact and typography carefully tuned.
- Use large rounded media frames, fine borders and little or no shadow.
- Make long product stories feel like a sequence of deliberate chapters.
- Use product screenshots/renders as evidence, not generic stock decoration.

Avoid:
- Dense dashboard-like card stacks on marketing pages.
- Heavy shadows, arbitrary gradients, thick borders and decorative containers around every image.
- Oversized colorful CTA blocks or making every link a filled button.
- Overly bold display type, excessive letter spacing or cramped Russian text.
- Tiny copy and controls that become hard to tap on mobile.

## CRAFT-specific translation

- White gallery → CRAFT warm-white editorial canvas.
- Studio Mist → existing light neutral section token.
- Ink → CRAFT graphite/near-black text.
- Apple Blue text-link role → use CRAFT's restrained lime only where it is already the semantic accent; neutral links remain neutral.
- Pricing Blue CTA → use CRAFT's existing primary action style; do not add a new blue brand color.
- Product photography → custom product UI, real project artifacts, carefully art-directed 3D objects and truthful visuals.
- Apple product chapters → CRAFT narrative chapters, with Russian copy explaining each stage.
- The Apple reference is strongest for public marketing pages. Learning, dashboard, forms and admin should borrow its clarity and restraint, not its product-showroom layout.

## Engineering translation

The source's Quick Start CSS/Tailwind token examples are illustrative implementation references, not code to paste blindly. Before coding:
1. Inspect `app/globals.css`, current semantic variables, typography setup, shared components and responsive breakpoints.
2. Map reference roles onto existing CRAFT tokens; consolidate rather than creating duplicate variables.
3. Keep Next.js App Router, React 19 and existing component architecture.
4. Keep critical text and actions in semantic HTML; do not put copy inside canvas or image renders.
5. For scroll-driven 3D storytelling, tie one scene's timeline to native scroll progress; reverse scroll reverses the morph. Do not hijack scroll.
6. Lazy-load heavy scenes, cap DPR, pause offscreen, dispose GPU resources, and provide no-WebGL/reduced-motion poster states.
7. On mobile, simplify the scene and typography fluidly; maintain readable copy, touch targets and no horizontal page overflow.
8. Validate actual rendered routes at 320, 360, 390, 430, 768 and 1024 CSS px. Build/test success is not visual QA sign-off.

## CSS reference snippet

Use only after mapping the roles to the current CRAFT token names:

```css
/* Apple-reference proportions; adapt values to CRAFT tokens and responsive breakpoints. */
.product-story {
  --story-surface: #fff;
  --story-muted-surface: #f5f5f7;
  --story-ink: #1d1d1f;
  --story-secondary: #707070;
  --story-hairline: #d6d6d6;
  --story-media-radius: 28px;
  --story-section-gap: 90px;
  --story-element-gap: 20px;
  --story-card-padding: 28px;
}

.product-story__hero-title {
  font-size: clamp(2.75rem, 7vw, 5rem);
  line-height: 1.05;
  letter-spacing: -0.015em;
  font-weight: 600;
  text-wrap: balance;
}

.product-story__body {
  max-width: 38rem;
  font-size: 17px;
  line-height: 1.47;
  letter-spacing: -0.022em;
}

.product-story__media {
  overflow: hidden;
  border-radius: var(--story-media-radius);
  box-shadow: none;
}

@media (max-width: 700px) {
  .product-story__chapter {
    padding-block: clamp(3.5rem, 12vw, 5rem);
  }

  .product-story__hero-title {
    font-size: clamp(2.5rem, 12vw, 3.75rem);
    letter-spacing: -0.035em;
  }
}

@media (prefers-reduced-motion: reduce) {
  .product-story *,
  .product-story *::before,
  .product-story *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```
