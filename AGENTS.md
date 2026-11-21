# CRAFT — instructions for coding agents

Before making changes, read:
1. `docs/CRAFT-MASTER-SPEC.md` — canonical product, design, 3D-storytelling and engineering requirements.
2. `docs/CRAFT-PROJECT-BRAIN.md`
3. `docs/CRAFT-V2-DESIGN-RULES.md` (owner decision of 2026-11-21: the v2 world, tokens, anti-slop rules, copy rules, security checklist) and the linked product, architecture and roadmap documents. `docs/CRAFT-APPLE-REFERENCE.md` is historical for visual identity; its measurements remain useful for performance and layout.
4. Existing `README.md`, `docs/roadmap.md`, `docs/launch-readiness.md`, and `docs/CRAFT-MOBILE-QUALITY-GATE.md` when relevant.

## Non-negotiable repository and release rules

- Work only on branch `craft/visual-excellence`.
- Never commit to, push to, merge into, or modify `main`.
- Never merge a pull request or publish/promote a Vercel Production deployment.
- Use Preview/local validation only. Production release requires explicit owner approval.
- Do not add paid services, paid APIs, subscriptions, usage-based services, or create costs.
- Do not change secrets, API keys, service-role keys, infrastructure environment variables, Supabase project settings, DNS, SMTP, billing, or access controls without explicit approval.
- Never put secrets in source, logs, documentation, prompts, screenshots, or client-side code.
- Do not activate payments, sell subscriptions, make legal commitments, or represent the product as commercially launched.
- Do not invent testimonials, student outcomes, customer logos, credentials, metrics, guarantees, response SLAs, or validated business results.
- Do not silently change the product positioning, offer boundaries, or preliminary pricing model.
- Do not remove existing functionality to make visual work easier.

If branch or release context is uncertain, stop and verify before writing.

## Product intent

CRAFT is a Russian-language product-building learning platform for people worldwide. It helps a learner move from an idea to a working digital product through a practical path, modern technology, and human guidance. The learner's own project is the center of the experience; lessons are a means, not the product itself.

Core themes include SaaS and digital products, AI, AI-assisted development, automation, design, media, blockchain/Web3, and agentic commerce. Present these as areas of exploration and creation, not guaranteed paths to income.

## Offer boundaries

- Self-study: preliminary planning price around 2,000 RUB per program.
- Learning with a mentor: preliminary planning price around 10,000 RUB per program. The learner builds the project; the mentor explains, advises, reviews decisions, and gives feedback.
- Done-for-you development: preliminary starting point from 40,000 RUB per project. CRAFT builds and hands over the agreed product, source code, documentation, and instructions. This is a development service, not an education tier.
- CRAFT CLUB: preliminary concept around 990 RUB/month; community, workshops, templates, group Q&A, discounts/early access. Not yet a confirmed live service.
- These are planning figures, not approved public commercial terms. Homepage should not show prices; the formats page may describe preliminary offers with clear qualification.

## Design and experience priorities

- Mobile usability is a first-class requirement and outranks decorative effects.
- Visual direction (owner decision, 2026-11-21, supersedes the earlier obsidian/lime brief): the owner handed the redesign to the agent and fixed only the name CRAFT. The identity is the foundry world defined in `docs/CRAFT-V2-DESIGN-RULES.md`: per-chapter ground colours (void, steel, ember, one chalk contrast chapter), a single heat accent, liquid-metal shading (WebGL, not CSS gradients), and one persistent scroll-following 3D object made of thousands of instanced bricks. Do not drift back to the old palette, and do not add template tells (eyebrows, numbered sections, gradient text, icon-tile cards).
- Strong editorial typography, clear hierarchy, rounded but purposeful shapes, confident spacing, visual depth, and polished transitions.
- Build a coherent system across public pages, catalogues, auth, dashboard, learning and admin.
- 3D, shaders and motion should make CRAFT memorable without obscuring content, navigation or calls to action.
- Respect reduced-motion preferences, keyboard access, visible focus, touch targets, readable contrast and low-end/mobile performance.
- Provide static/fallback experiences when WebGL is unavailable or motion is reduced.

## Engineering rules

- Inspect the existing implementation before editing; prefer targeted changes over rewrites.
- Preserve the current Next.js App Router, React and TypeScript architecture unless a migration is explicitly justified and approved.
- Validate library compatibility with the actual installed Next.js 16 / React 19 setup before adding dependencies. Do not install alpha/beta packages for convenience.
- Prefer free, open-source, actively maintained dependencies with licenses compatible with the project.
- Lazy-load heavy client-only visual scenes. Keep server-rendered content and critical text available without WebGL.
- Avoid hydration mismatches, unnecessary client components, global side effects, unbounded animation loops and excessive GPU work.
- Keep authorization and validation server-side. Respect Supabase RLS and trusted `app_metadata.role`; never trust client-supplied roles.
- Never weaken security, RLS, validation, or tests to make a feature pass.
- Do not edit generated lockfiles or dependency manifests except when a deliberate dependency change is necessary and compatible.
- Do not claim physical-device, browser E2E, production, or integration validation unless it was actually performed.

## Required checks

After code changes, run the checks available in the repository, at minimum:
- `npm run test:security`
- `npm run build` (which includes the security tests)

For visual changes, also check the relevant routes at the widths in `docs/CRAFT-MOBILE-QUALITY-GATE.md`, including 320, 360, 390, 430, 768 and 1024 CSS px. Verify reduced motion, no horizontal page overflow, no clipped Russian text, and usable touch targets. Record anything that could not be tested.

## Working method

1. State the goal and inspect current files and git status.
2. Make a small coherent change on the approved branch only.
3. Run relevant tests/build and inspect the resulting diff.
4. Update the relevant docs when decisions or status change.
5. Report exact files changed, commit/branch, checks actually run, failures, and remaining risks.
6. Do not merge, deploy to Production, change secrets, or incur costs.

When uncertain, preserve the existing behavior and ask rather than making a high-impact irreversible decision.


## Integrated design-agent playbook

Use the following three public skill projects as complementary reference lenses when doing visual/product work. Apply their principles, not their defaults blindly; CRAFT's product brief, existing design system, stack, accessibility requirements and repository guardrails remain authoritative.

### 1. Taste / art direction and finish gate
Reference: `Leonxlnx/taste-skill` (design-taste-frontend).
- Start with the actual product, audience, offer, primary user action and truthful source material. Write the page story and content hierarchy before styling.
- Give each page a distinct art direction, but keep one coherent brand system. Avoid generic template layouts and interchangeable AI-looking sections.
- Every visual must have a job: show the product, explain a system, establish atmosphere or carry a deliberate storytelling moment.
- Plan pages screen-by-screen. Protect the hero's first-screen clarity; make sections feel intentional rather than letting unrelated headings peek into view.
- Use real product UI, truthful imagery and real evidence where available. Never invent customers, outcomes, testimonials or product capabilities.
- Treat visual QA as a finish gate: inspect real rendered pages at desktop, tablet and phone widths; check all visuals load, copy fits, sections align, and no content is clipped. A code build alone is not visual sign-off.
- Borrow restrained interaction craft (precise hover, press and focus feedback), not arbitrary motion rules that conflict with usability.

### 2. UI/UX intelligence and implementation quality
Reference: `nextlevelbuilder/ui-ux-pro-max-skill`.
- For each UI task, identify the product context and user intent first, then select patterns, typography, color roles, density and component behavior to fit that context.
- Audit existing routes, tokens, components and installed stack versions before proposing a redesign. Reuse and improve the existing semantic token system; do not create a competing parallel design system.
- Prioritize information architecture, clear hierarchy, predictable navigation, form feedback, accessibility and responsive behavior before decoration.
- Use mobile-first layouts, semantic color roles, legible body text, visible keyboard focus, touch-friendly controls and no page-level horizontal overflow.
- Motion must communicate state, causality or spatial continuity; avoid animating width/height when transforms or opacity can do the job.
- Use stack-specific guidance only after verifying the actual framework and dependency versions in this repository.
- Use this skill as a searchable UX/pattern reference, not as a generator of arbitrary presets. CRAFT's v2 tokens in `docs/CRAFT-V2-DESIGN-RULES.md` (ground colours, heat accent, Geologica/Onest) are the source of truth.

### 3. Motion design: restraint, polish and experimentation
Reference: `kylezantos/design-motion-principles`, synthesizing three lenses:
- **Restraint and speed:** first ask whether an element needs motion at all. High-frequency product actions should feel immediate.
- **Production polish:** tune timing, easing, distance and feedback until motion feels quiet, coherent and intentional.
- **Creative experimentation:** reserve expressive physics, morphing, shader and scroll choreography for moments where they strengthen the story.
- Weight these lenses by context. CRAFT's marketing storytelling can be expressive; lessons, dashboards, forms and admin should be calm, fast and predictable.
- Audit both motion gaps (state changes that feel abrupt) and motion excess (pulsing decoration, blanket hover scaling, blur-everywhere entrances, stagger spam, uniform fades and bouncy utility controls).
- Every animation needs a purpose, sensible duration/easing, cleanup, interruption behavior and a static/reduced-motion alternative. Avoid scroll listeners when a robust scroll-driven or observer-based approach is available.
- Respect `prefers-reduced-motion`, keyboard and touch input, low-power devices, GPU budgets and offscreen pause. Never make essential information depend on animation.

### CRAFT signature interaction direction: scroll-driven product storytelling
When a page narrative benefits from it, design one continuous, user-controlled transformation across scroll chapters rather than a collection of unrelated loops. Example narrative for CRAFT: scattered binary data → assembled computer/interface → digital product/asset → connected product ecosystem. The object, camera, lighting and particles should evolve in spatial continuity while the accompanying Russian copy explains the meaning of each stage.
- Scroll position is the story timeline; scrolling upward reverses the transformation naturally.
- Keep chapter copy, headings and CTAs as accessible DOM content, synchronized with but not embedded in the canvas.
- Do not hijack native scrolling or trap touch gestures. On mobile, simplify geometry and choreography while preserving the story and readable copy.
- Use a single controlled scene where possible; lazy-load it, cap DPR, pause offscreen, clean up resources and provide a poster/static fallback.
- Only build a full scroll-story when it serves the page's message and can be validated at desktop and mobile widths. Never add spectacle merely because the technique is available.

### Conflict resolution
1. CRAFT product truth, safety, accessibility, mobile usability and repository/release rules.
2. Existing CRAFT design tokens and established interaction patterns.
3. Task-specific art direction and UX pattern recommendations from the references.
4. Expressive motion and visual experimentation.

Do not run multiple design systems as competing authorities. Combine Taste's art direction/finish discipline, UI/UX Pro Max's structured UX intelligence, and Design Motion Principles' context-aware motion review under one CRAFT design system.


## Frontend quality, component architecture and motion engineering references

The following references are part of the CRAFT engineering playbook. Apply them as review/build methods, not as a mandate to install packages or copy another product's visual identity. Full operating details live in `docs/CRAFT-ENGINEERING-PLAYBOOK.md`.

- **Vercel Web Interface Guidelines** (`vercel-labs/agent-skills/skills/web-design-guidelines`): before a UI quality sign-off, inspect relevant source files against the current guideline set. Check semantics, keyboard/accessibility, focus, forms, motion/reduced-motion, typography, content edge cases, image loading/dimensions, performance, URL/state, touch, safe areas, theming, localization and hydration. Report actionable `file:line` findings; this is a source audit, not proof of rendered browser quality.
- **shadcn/ui** (`shadcn-ui/ui`): treat components as open code to own and compose, not a black-box theme or a visual template. Prefer accessible primitives, composable APIs, variants, consistent tokens and local customization. Reuse existing CRAFT components first; add/adapt only the needed component. Do not add the shadcn package or replace the component system wholesale without a concrete need and compatibility review.
- **Emil Kowalski skills** (`emilkowalski/skills`): use design-engineering taste, animation decision gates, choreography, performance review, Apple-inspired motion principles, mobile-native details, worst-case UI testing and session-level taste learning. Key defaults: decide whether motion is needed before coding; name its purpose; use the cheapest suitable tool; extend existing tokens; prefer transform/opacity; tune easing and duration to frequency; make motion interruptible; honor reduced motion and hover capability; remove decorative motion that harms frequent workflows.

### Required UI review sequence
1. Inspect the relevant route, components, tokens, package versions and current behavior.
2. Make the smallest coherent implementation; keep CRAFT's v2 foundry direction (`docs/CRAFT-V2-DESIGN-RULES.md`) and its heat-accent identity.
3. Run the Vercel guideline audit mentally/source-wise against touched files and record exact file/line issues; never claim this audit was run by a separate executable unless it was.
4. Review animation decisions using Emil's gates: frequency → purpose → cheapest tool → properties → easing/duration → interruption/exit → accessibility/performance.
5. Exercise edge cases using long text, empty states, loading/error states, narrow screens, touch, keyboard and reduced-motion.
6. Validate actual rendering separately when browser access is available. A source audit or successful build is not visual QA.
