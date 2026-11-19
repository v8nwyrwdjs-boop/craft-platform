# CRAFT — design system and experience principles

## Brand character

CRAFT should feel like a premium creative-technology studio and a practical product-building platform at once: confident, precise, curious, modern, energetic and human.

Avoid generic SaaS templates, noisy gradients everywhere, crypto-bro visual tropes, childish gamification, overdone glassmorphism and effects that make the interface harder to use.

## Color direction

Dark-first palette:
- Obsidian / near-black for hero stages, full-bleed product imagery and signature storytelling chapters.
- Graphite / charcoal for navigation, content bands and elevated dark surfaces.
- Porcelain / soft white for high-contrast typography on dark stages.
- Restrained lime/green for CRAFT's signature focus, action and progress accents.
- Silver/metallic highlights for selected 3D and product-artifact details.
- Warm-white / pale neutral surfaces only as deliberate visual resets, not the dominant canvas.

Map semantic roles to CRAFT tokens. Do not copy Apple's blue, orange or yellow accents as new CRAFT brand colors.

Use semantic tokens rather than scattering raw colors. Before introducing tokens, inspect existing CSS variables and consolidate without causing a broad visual regression. Check contrast for text, controls, focus rings and status states.

## Typography

- Use a strong editorial display face for key headlines and a highly readable text face for body/UI.
- Build a clear scale for display, page title, section title, card title, body, supporting text, label and metadata.
- Headlines should have deliberate line lengths and natural Russian word boundaries.
- Do not force mid-word breaks to fit a layout.
- Keep paragraph measure comfortable; avoid tiny low-contrast supporting copy.
- Typography and content hierarchy should remain clear even if all motion and WebGL are disabled.

Do not add a paid font service. Prefer existing local/system fonts or a free, appropriately licensed font after checking the current setup and license.

## Layout and composition

- Use generous but purposeful whitespace and a consistent spacing rhythm.
- Lead public marketing pages with immersive dark product stages and graphite bands. Use occasional warm-white/pale sections as deliberate contrast, not arbitrary alternation.
- Use rounded cards and controls with consistent radii, restrained borders and subtle depth.
- Keep content widths readable and align sections to a coherent grid.
- Give key content a clear hierarchy; avoid turning every block into a card.
- Keep primary navigation, calls to action and forms obvious.
- Use imagery/3D to explain or create atmosphere, not to obscure text.

## Motion language

Motion should feel smooth, deliberate, tactile and premium:
- Use restrained easing and clear entrances/exits.
- Prefer a few signature moments over continuous movement everywhere.
- Avoid excessive parallax, scroll hijacking, cursor traps, flashing, constant pulsing or movement that competes with reading.
- Respect `prefers-reduced-motion`; reduced-motion users should receive a meaningful static state, not a broken or empty region.
- Ensure essential information is never available only through animation.

## 3D and shader usage

- Treat 3D as a brand and storytelling layer, not the content framework.
- Start with one signature homepage hero scene, then evaluate whether other sections benefit from smaller visual moments.
- Keep text and CTA in accessible DOM, not baked into a canvas.
- Lazy-load client-only scenes and avoid blocking the initial content paint.
- Provide a poster/static fallback and a graceful no-WebGL path.
- Cap device pixel ratio and geometry/material complexity; pause or reduce rendering when the scene is not visible where practical.
- Avoid multiple simultaneous full-screen render loops.
- Ensure the hero remains legible and usable on compact phones, landscape phones and tablets.

## Responsive and mobile-first behavior

Mobile is not a scaled-down desktop:
- Design the narrow layout deliberately, especially at 320–430 CSS px.
- Stack content in a meaningful order; do not squeeze long Russian headlines beside decorative art.
- Preserve comfortable line length, natural wrapping and useful spacing.
- Make controls touch-friendly (aim for 44×44 CSS px where practical).
- Avoid horizontal page overflow. Horizontal scrolling is acceptable only for intentionally scrollable components with visible affordance and no page-level overflow.
- Check safe areas, keyboard overlays, sticky headers and orientation.
- Test at 320×720, 360×800, 390×844, 430×932, 768×1024 and 1024×768 as defined in the mobile quality gate.
- Validate real iOS Safari and Android Chrome before calling device QA complete.

## Accessibility

- Semantic HTML and correct heading hierarchy.
- Keyboard-operable navigation and controls.
- Visible focus styles.
- Form labels, instructions and useful error states.
- Sufficient text and control contrast.
- No hover-only interaction.
- Reduced-motion alternative.
- Do not communicate status by color alone.
- Canvas content must have meaningful surrounding text or an equivalent accessible representation.

## Design consistency across the product

The same design language should extend to:
- Public homepage and catalogues.
- Direction and concept detail pages.
- Formats.
- Registration, login and recovery.
- Student dashboard and project flows.
- Learning programme, lessons and submissions.
- Mentor/admin surfaces.

The amount of visual spectacle should vary by context. The homepage may carry the strongest signature scene; learning and admin should prioritize clarity, focus and speed.

## Quality bar

A design change is not complete because it looks good in one desktop screenshot. It must preserve:
- Clear value proposition and conversion path.
- Responsive layout and readable Russian text.
- Functional navigation, forms and controls.
- Loading, empty, error, locked and success states.
- Keyboard and reduced-motion behavior.
- Reasonable performance on mid-range mobile devices.
- Existing security and application behavior.


## Applied visual foundation — 2026-11-19

The current visual-excellence branch should evolve toward a dark-first CRAFT product-gallery direction: obsidian stages, graphite bands, porcelain typography, restrained lime and silver highlights. Warm-white chapters remain selective contrast rather than the default. Public navigation uses a translucent sticky treatment; the homepage carries the signature WebGL moment; catalogues and formats use editorial layouts and quieter depth; authenticated learning and admin surfaces receive focus, form, surface and hover refinements without unnecessary 3D.

The hero scene uses a custom GLSL atmosphere and liquid-metal material in React Three Fiber rather than importing ShaderGradient before Next.js 16 compatibility is proven. Rendering is capped to a 1.25 device-pixel ratio, uses a low-power WebGL preference, pauses outside the viewport and freezes motion for reduced-motion users. Critical copy and actions remain in semantic DOM.


## Context-aware art direction and motion quality gate

CRAFT combines three complementary disciplines: distinctive art direction and a real-browser finish gate; evidence-based UI/UX pattern selection; and context-aware motion design. These are reference lenses, not three competing design systems. Existing CRAFT tokens and product truth remain authoritative.

### Art direction
- Design each page around its real audience, promise, primary action and available evidence.
- Make every visual earn its place: product demonstration, explanation, atmosphere or a deliberate narrative moment.
- Avoid generic SaaS section formulas, interchangeable card grids and decorative imagery unrelated to the product.
- Plan the page as a sequence of readable screens with consistent content edges and a clear first-screen message.
- Verify the rendered result at desktop, tablet and phone sizes; a successful build is not visual approval.

### UX discipline
- Audit the existing route, components, tokens and behavior before changing them.
- Preserve one semantic token system; do not layer a competing preset palette over CRAFT.
- Prioritize hierarchy, navigation, legibility, forms and feedback, keyboard access, responsive behavior and touch targets.
- Use patterns that fit the task, not patterns chosen because they are fashionable.

### Motion discipline
- Product UI: default to restraint, speed and precise feedback.
- Marketing and storytelling: allow more expressive motion when it explains the product or strengthens the narrative.
- Audit both missing state-transition feedback and excessive decorative motion.
- Avoid blanket hover scaling, constant pulsing, blur on every entrance, excessive stagger, uniform timing and bouncy motion on utility actions.
- Every effect must have a purpose, tuned easing/timing, interruption and cleanup behavior, reduced-motion treatment and low-power fallback.

### Scroll-driven storytelling
A signature CRAFT homepage chapter may use one continuous 3D transformation tied to native scroll progress: scattered binary digits gather into a computer, the computer transforms into a digital product/asset, and that asset expands into a connected ecosystem. Russian copy explains each transformation as it happens.
- The scroll position controls the timeline and reverse scrolling reverses the sequence.
- Do not hijack native scrolling or make text part of the WebGL canvas.
- Keep headings, chapter copy and calls to action in accessible DOM.
- Simplify the scene on mobile without losing the story.
- Lazy-load, cap DPR, pause offscreen, dispose GPU resources and provide a meaningful static/reduced-motion fallback.
- Build this only if it improves understanding of CRAFT's promise; do not turn every route into a spectacle.


## Apple product-page benchmark — 2026-11-19

The owner supplied an Apple product-page design specification in `DESIGN.md`. Its detailed interpretation and implementation notes are preserved in `docs/CRAFT-APPLE-REFERENCE.md`. Use it as a benchmark for spacious product storytelling, quiet navigation, precise editorial typography, oversized product imagery, restrained controls, shadowless rounded media and deliberate section pacing.

This is a structural and craft reference, not a brand-copying instruction. CRAFT retains its own warm-white / graphite / restrained-lime identity, product truth and accessibility requirements. Do not copy Apple marks, product assets, proprietary fonts or exact copy. Map reference roles to existing CRAFT tokens; do not introduce a competing Apple-blue palette. Use system/legal font fallbacks unless licensed font assets are supplied. The Apple-style showroom treatment is primarily for public marketing/product-story pages; authenticated learning and admin surfaces remain task-focused.


## Dark Apple-stage direction — owner update 2026-11-19

The owner's second Apple product-page specification is a dark, midnight hardware gallery. It supersedes the earlier light-gallery preference as the primary visual reference. Public homepage and flagship storytelling should lead with Obsidian full-bleed stages, Graphite/Carbon bands, porcelain typography, cinematic product-first imagery, restrained lime and silver highlights. Use occasional white/porcelain comparison surfaces only as deliberate visual resets. Keep 28px media corners, fine 1px keylines and almost no shadows. Use compact quiet navigation and concise display copy. Scroll chapters may transform one continuous 3D artifact from idea to code to computer/interface to digital product to connected ecosystem, synchronized with Russian copy. Preserve CRAFT identity; do not import Apple Blue or proprietary assets/fonts. Keep authenticated learning/admin surfaces task-focused. This dark reference is now the lead art-direction benchmark; do not revert to the prior all-light Apple gallery treatment.
