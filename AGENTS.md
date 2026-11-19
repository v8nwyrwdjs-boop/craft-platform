# CRAFT — instructions for coding agents

Before making changes, read:
1. `docs/CRAFT-PROJECT-BRAIN.md`
2. The linked product, design, visual-reference, architecture and roadmap documents.
3. Existing `README.md`, `docs/roadmap.md`, `docs/launch-readiness.md`, and `docs/CRAFT-MOBILE-QUALITY-GATE.md` when relevant.

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
- Brand palette: warm white, graphite, black used intentionally for contrast, restrained lime/green accents, with silver/metallic treatments only as controlled visual accents.
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
