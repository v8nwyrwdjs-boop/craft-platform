# CRAFT — dark Apple product-stage reference

Status: primary art-direction benchmark, based on the owner's second uploaded Apple design specification (dark theme). This supersedes the earlier light Apple gallery preference.

## Visual thesis
The reference describes a midnight hardware gallery: each section is a dark, museum-like plinth for one precisely lit product detail. Oversized SF Pro Display headlines sit beneath meticulously rendered hardware imagery. The page moves between absolute-black hero scenes, charcoal information bands and occasional white comparison surfaces. Blue is reserved for purchase/navigation controls in the source; CRAFT must retain its own restrained lime accent instead.

For CRAFT, translate this into a dark-first digital-product gallery: a meaningful artifact or continuous 3D transformation is the visual event, while Russian copy explains what the viewer is seeing and why it matters. This is a composition and craft reference, not an instruction to copy Apple's identity.

## Source colors and CRAFT mapping
| Source role | Value | CRAFT interpretation |
|---|---|---|
| Obsidian | #000000 | Main hero and full-bleed product stage |
| Graphite | #0e0e0e | Navigation and raised dark surfaces |
| Carbon | #1d1d1f | Charcoal content bands and panels |
| Steel | #333336 | Fine borders and translucent controls |
| Slate | #6e6e73 | Outlines and subdued dividers |
| Ash | #86868b | Muted explanatory copy |
| Porcelain | #f5f5f7 | Main text on dark surfaces |
| White | #ffffff | High-contrast details and deliberate comparison surfaces |
| Apple Blue | #0071e3 | Source-only CTA reference; do not add to CRAFT brand palette |
| Electric Link | #2997ff | Source-only dark-surface link |
| Cobalt Link | #0066cc | Source-only pale-surface link |
| Copper New | #b64400 | Source-only release marker |
| Optical Yellow | #ffd500 | Source-only technical accent |

CRAFT mapping: obsidian/graphite/porcelain, restrained lime for brand actions and focus, silver-metallic highlights for selected 3D moments. Warm-white surfaces are occasional contrast resets, not the dominant page canvas. Do not import Apple's blue, copper or yellow as CRAFT identity colors.

## Source typography measurements
The source uses SF Pro Text for navigation/body/controls and SF Pro Display for product labels and display statements. Do not redistribute proprietary font files; use existing CRAFT fonts or lawful system fallbacks unless licensed assets are supplied.

| Role | Size | Weight | Line height | Tracking |
|---|---:|---:|---:|---:|
| Utility nav | 12px | 400 | 1.33 | -0.12px |
| Body | 14px | 400 | 1.29 | -0.224px |
| Body strong | 14px | 600 | 1.29 | -0.224px |
| Section nav | 17px | 500 | 1.47 | -0.374px |
| Product label | 19px | 600 | 1.21 | +0.228px |
| Feature stat | 28px | 600 | 1 | +0.196px |
| Hero product name | 32px | 600 | 1.13 | +0.128px |
| Display | 80px | 600 | 1.05 | -1.2px |
| Display XL | 96px | 600 | 1.04 | -1.44px |

Treat measurements as desktop reference values; scale fluidly for mobile and preserve natural Russian wrapping.

## Spacing, shapes and elevation
- Comfortable density; source spacing scale includes 4, 6, 7, 8, 10, 12, 14, 16, 20, 24, 28, 32, 48, 90, 144 and 210px.
- 28px radius for cards, media and feature tiles; 20px for contained local navigation.
- Fully rounded pills; compact control radius around 36px.
- 16px card padding and 4px element gap inside dense feature modules.
- Spacious 90–210px pauses between major storytelling moments where appropriate.
- No heavy drop shadows. Separate layers through near-black/graphite shifts, fine 1px keylines, lighting, scale and crop.
- Source carbon band has a restrained fade from #1d1d1f to black over 288px; use only when it supports a transition.

## Components and layout patterns
- **Global utility navigation:** compact 44px-high black bar, quiet 12px labels, monochrome controls.
- **Product-local navigation:** contained graphite bar, 20px radius, subtle 1px keyline, compact secondary links.
- **Announcement strip:** restrained charcoal strip with 14px copy; never louder than the hero.
- **Hero product stage:** full-bleed black canvas, one photorealistic or art-directed 3D artifact, 32px product label, concise 80px display statement, compact CTA near the lower edge. No generic card around the hero object.
- **Highlights media:** cinematic image/video in 28px-radius frame, no shadow, minimal overlay copy and compact translucent playback controls.
- **Feature metric tile:** black surface, 28px radius, real technical visual, 28px metric and muted support copy. Avoid dashboard-like stacks.
- **Comparison panel:** graphite surface, 28px radius, soft-white heading, muted support copy and carefully arranged near-black feature tiles; occasional white comparison surfaces can reset the rhythm.
- **Editorial chapter:** small label, oversized statement, readable 14–17px copy and one large product/technical visual.

## Imagery and lighting
Product-first, not lifestyle-first: large isolated product renders, extreme technical close-ups, pure-black/deep-graphite environments, high-contrast rim lighting, glossy metal and controlled reflections. Visuals should explain actual systems or capabilities. For CRAFT, use product UI, code structures, binary particles, abstract digital artifacts, liquid-metal/chrome objects and restrained lime light. Avoid generic stock imagery as the main visual event.

## Motion and scroll storytelling
The dark gallery should feel like a directed exhibition, not an autoplaying effects demo. A suitable CRAFT homepage narrative:
1. Binary digits and fragments float separately in dark space.
2. On scroll, fragments converge and assemble into a computer/interface.
3. The computer morphs into a digital product/asset.
4. The asset expands into a connected ecosystem.

Russian copy explains each stage. Scroll progress controls the timeline and reverse scrolling reverses the transformation. Keep native scrolling, accessible DOM text, keyboard/touch usability and reduced-motion/static alternatives. Prefer one controlled scene; lazy-load, cap DPR, pause offscreen and dispose GPU resources.

## Responsive and accessibility
- Keep the dark visual language on mobile while reducing geometry, particles, lighting complexity and camera travel.
- Recompose rather than shrink a desktop composition.
- Keep text and CTAs outside the WebGL canvas.
- Preserve 44×44px touch targets where practical, keyboard focus and no horizontal page overflow.
- Reduced-motion users receive a meaningful static composition and all copy in document order.

## Implementation guidance
1. Inspect current CRAFT tokens and components before changing CSS.
2. Map source roles to CRAFT semantic variables; do not paste Apple-specific colors or proprietary font declarations as-is.
3. Preserve Next.js App Router, React 19 and existing architecture.
4. Use DOM for headings, paragraphs, navigation and CTAs; WebGL is visual support only.
5. Prefer one scroll-driven scene over several independent canvases.
6. Use transforms/opacity for transitions where possible; avoid layout-thrashing animation.
7. Respect reduced motion, visibility pausing, low-power devices and no-WebGL fallback.
8. Validate actual rendered routes at 320, 360, 390, 430, 768 and 1024 CSS px. Build/test success is not visual QA sign-off.

## CSS reference
```css
:root {
  --reference-obsidian: #000000;
  --reference-graphite: #0e0e0e;
  --reference-carbon: #1d1d1f;
  --reference-steel: #333336;
  --reference-slate: #6e6e73;
  --reference-ash: #86868b;
  --reference-porcelain: #f5f5f7;
  --reference-white: #ffffff;
  --reference-media-radius: 28px;
}
.dark-product-stage {
  background: var(--craft-obsidian, var(--reference-obsidian));
  color: var(--craft-porcelain, var(--reference-porcelain));
}
.dark-product-stage__title {
  font-size: clamp(2.75rem, 7vw, 6rem);
  line-height: 1.04;
  letter-spacing: -0.035em;
  font-weight: 600;
  text-wrap: balance;
}
.dark-product-stage__copy {
  max-width: 42rem;
  color: var(--craft-muted, var(--reference-ash));
  font-size: clamp(.875rem, 1.1vw, 1.0625rem);
  line-height: 1.45;
}
.dark-product-stage__media {
  overflow: hidden;
  border-radius: var(--reference-media-radius);
  box-shadow: none;
}
```
