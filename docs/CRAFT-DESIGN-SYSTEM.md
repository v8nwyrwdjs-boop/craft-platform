# CRAFT — design system and experience principles

## Brand character

CRAFT should feel like a premium creative-technology studio and a practical product-building platform at once: confident, precise, curious, modern, energetic and human.

Avoid generic SaaS templates, noisy gradients everywhere, crypto-bro visual tropes, childish gamification, overdone glassmorphism and effects that make the interface harder to use.

## Color direction

Core palette:
- Warm white / soft ivory for open, calm content surfaces.
- Graphite for the principal dark surface and brand depth.
- Near-black for deliberate contrast and typography.
- Restrained lime/green for focus, action, progress and small moments of energy.
- Silver/metallic highlights for selected brand-motion and 3D details, not as a replacement for the core palette.

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
- Combine light and dark sections to create pacing, not arbitrary alternation.
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
