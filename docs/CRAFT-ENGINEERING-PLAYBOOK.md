# CRAFT Engineering Playbook — UI, Components & Motion

This document translates three public engineering references into project-specific rules. It is a working standard for future CRAFT changes, not a request to install every tool or copy external defaults.

## 1. Vercel Web Interface Guidelines — source-level quality audit

Reference: [vercel-labs/agent-skills — web-design-guidelines](https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines). The skill fetches its rule set from [vercel-labs/web-interface-guidelines](https://github.com/vercel-labs/web-interface-guidelines/blob/main/command.md), reads the selected files and reports concise `file:line` findings. It audits source; it does not render the site or automatically fix it.

Use the following review categories for touched UI files:

- **Accessibility:** semantic elements; labels; accessible names for icon buttons; keyboard behavior; image alt text; live regions; heading order; skip navigation; media alternatives.
- **Focus:** visible `:focus-visible`; no removed outline without replacement; focus not hidden by sticky elements; `:focus-within` for compound controls.
- **Forms:** correct name/autocomplete/type/inputmode; clickable labels; paste remains available; inline errors; focus first invalid field; sensible loading/submit state; unsaved-change protection where needed.
- **Animation:** reduced-motion variant; compositor-friendly properties; explicit transition properties (never `transition: all`); correct transform origin; interruptibility; pause/stop for long-running decorative motion.
- **Typography/content:** typographic ellipsis; balanced headings; tabular numbers for comparisons; robust truncation/wrapping; empty states; long user-provided strings.
- **Images/performance:** explicit image dimensions; lazy-load below-fold media; prioritize critical hero media; virtualize genuinely large lists; avoid layout reads during render; batch DOM reads/writes; preload critical fonts/preconnect only where justified.
- **Navigation/state:** real links for navigation; URL reflects meaningful filter/tab/pagination state where useful; destructive actions get confirmation or undo.
- **Touch/layout:** manipulation touch behavior; intentional tap highlight; contained modal scrolling; safe-area insets; no unintended horizontal overflow; preserve native touch scrolling.
- **Theme/locale/hydration:** correct color scheme/theme color; native controls legible in dark mode; Intl APIs for dates/numbers; stable server/client rendering; controlled inputs have change handlers.
- **Interaction/copy:** hover and active states where appropriate; higher contrast for interaction states; active voice; specific action labels; errors explain the next step.

For reviews, group findings by file in `file:line - issue → fix` format. Source checks do not prove that a page looks correct at runtime; follow with rendered browser checks when possible.

## 2. shadcn/ui — open-code component architecture

Reference: [shadcn-ui/ui](https://github.com/shadcn-ui/ui). Its stated model is a set of designed components that developers customize, extend and build into their own component library. Apply that philosophy to CRAFT:

- Treat components as inspectable, editable source, not a locked theme or opaque dependency.
- Build from accessible primitives and compose small components into meaningful product patterns.
- Keep variants and design decisions explicit; use semantic tokens for colors, surfaces, borders, radii, spacing and focus.
- Make component APIs predictable and composable. Separate behavior, visual variants and content.
- Preserve semantic HTML, keyboard support, focus management, disabled/loading/error states and responsive behavior.
- Reuse and improve existing CRAFT components before creating duplicates.
- Borrow the component architecture and accessibility discipline; do not copy shadcn's default look into CRAFT.
- Do not install the shadcn CLI/package or replace the current component system wholesale just because this reference was added. Introduce only a justified component or primitive after checking existing dependencies and Next.js 16 / React 19 compatibility.
- Keep CRAFT's dark-first product-stage art direction: obsidian, graphite, porcelain, restrained lime and metallic details.

## 3. Emil Kowalski — design engineering and motion craft

Reference: [emilkowalski/skills](https://github.com/emilkowalski/skills). The repository includes focused workflows for design engineering, animation construction/review, choreography, performance, mobile-native details, animation opportunities, worst-case UI testing, Apple design and learning from design corrections.

### 3.1 Design-engineering taste
- The unseen details compound: interaction should behave exactly as users expect.
- Review before/after decisions with a clear reason, not subjective adjectives.
- Buttons should acknowledge a press; popovers should originate from their trigger; tooltips should not feel sluggish.
- Use springs for interruptible, gesture-driven or naturally inertial movement, not as a default for every transition.

### 3.2 Animation decision gate
Run in order; stop as soon as a gate fails:

1. **Frequency:** keyboard-initiated or 100+ times/day actions should be instant; tens/day get none or barely perceptible feedback; occasional interactions may use standard motion; rare first-run/success moments have the largest delight budget.
2. **Purpose:** every animation must provide feedback, spatial consistency, state indication, prevent a jarring change, explain a feature (marketing/onboarding), or deliver rare delight. “Looks cool” is insufficient for frequent UI.
3. **Tool:** choose the cheapest adequate tool — CSS transition for simple state/hover/press; CSS animation for predetermined compositor-friendly loops; WAAPI for programmatic control; Motion for springs, gestures, layout and exit choreography. Do not add a library for a simple fade.
4. **Properties:** prefer `transform` and `opacity`; avoid layout/paint-triggering properties for motion. Documented exceptions include measured-height accordions and carefully justified `clip-path` interactions.
5. **Easing:** entrances/exits use ease-out; on-screen travel/morph uses ease-in-out; hover/color uses ease; continuous motion uses linear. Avoid ease-in for UI response.
6. **Duration:** button press 100–160ms; tooltip/popover 125–200ms; dropdown/select 150–250ms; ordinary UI under 300ms. Modals/drawers/sheets and toasts are justified exceptions; explanatory marketing sequences can be longer.
7. **Interruption/exit:** rapidly retriggered motion must retarget from current state (transitions rather than restarting keyframes); gesture motion should preserve velocity where feasible; exit should maintain spatial logic with entry.
8. **Accessibility/performance:** ship reduced-motion and hover-capability handling with the feature; pause offscreen loops; clean up observers/animation resources; avoid motion that blocks input or essential content.

Extend existing CRAFT timing/easing tokens rather than creating parallel token systems. The exact curves in Emil's examples are references, not permission to introduce duplicate tokens if CRAFT already has equivalents.

### 3.3 Choreography
- Decide what leads, follows, overlaps or stays still.
- Use stagger only for occasional, meaningful group entrances; keep it restrained and non-uniform.
- Never delay access to core content or controls for a decorative sequence.
- Synchronize marketing copy and visuals around a clear narrative beat.
- Avoid making every section fade or slide in identically.

### 3.4 Animation performance
- Prefer compositor-friendly transforms and opacity.
- Avoid animating layout dimensions or driving many child transforms through parent CSS variables.
- Avoid unnecessary React state updates on every animation frame.
- Use one scene/canvas where practical; cap pixel ratio, lazy-load, pause when offscreen and dispose GPU resources.
- Profile actual frame behavior on mobile/low-power devices; do not infer smoothness from code alone.

### 3.5 Mobile-native quality
- Test real touch behavior, safe areas, viewport-height changes, input zoom, tap feedback, sticky hover residue and scroll behavior.
- Keep controls reachable and touch targets comfortable.
- Never rely on hover or gesture-only behavior; provide tap/click and keyboard alternatives.
- Preserve native scrolling; do not hijack scroll to drive a marketing scene.

### 3.6 Break the UI
Test components with adversarial but realistic data:
- very long and one-character names;
- unusually long emails and labels;
- empty strings, missing images and empty collections;
- huge counts and large numbers;
- slow loading, network failure, validation errors and disabled states;
- narrow widths, zoom, keyboard-only and reduced-motion.
A component is not complete until it remains understandable under these conditions.

### 3.7 Learn taste from corrections
At the end of a substantial design session, capture recurring corrections in this playbook or the relevant design-system doc: what changed, why it changed, and the scope where the rule applies. Do not turn one-off preferences into global rules without evidence; resolve conflicts with existing CRAFT tokens and product needs.

## 4. CRAFT application order

1. Product truth, safety, accessibility, mobile usability and existing project guardrails.
2. CRAFT's dark Apple-stage art direction and semantic design tokens.
3. Accessible, composable, inspectable component architecture inspired by shadcn/ui.
4. Vercel's source-level interface audit.
5. Emil's motion decision gate, choreography and performance review.
6. Rendered browser/device validation when available.

These references are now complementary: Vercel catches interface rule violations, shadcn informs component architecture, and Emil's skills guide motion and interaction craft. None overrides CRAFT's product requirements or brand identity.
