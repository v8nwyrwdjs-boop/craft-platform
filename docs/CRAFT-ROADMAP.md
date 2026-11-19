# CRAFT — visual excellence implementation roadmap

This is the focused roadmap for the visual-excellence branch. The broader product roadmap remains in [roadmap.md](roadmap.md); launch blockers remain in [launch-readiness.md](launch-readiness.md).

## Guiding principle

Build a coherent, recognizably CRAFT experience, not a collection of disconnected effects. The homepage should earn the strongest visual moment; learning and admin should prioritize focus, readability and speed. Mobile quality is a release criterion throughout.

## Phase 0 — verify the baseline

- [ ] Confirm the current branch is `craft/visual-excellence` and inspect git status.
- [ ] Inspect the current hero, header, logo assets, typography, CSS variables and shared components.
- [ ] Re-run existing security tests and production build to establish a fresh baseline.
- [ ] Check the latest Preview only if it can be done without Production promotion or access/security changes.
- [ ] Record current dependencies and lockfile; do not infer package installation from documentation.

Exit criteria: current code and test state are known; no baseline failure is silently attributed to the visual work.

## Phase 1 — design foundation

- [ ] Audit existing CSS variables, typography and spacing before adding tokens.
- [ ] Consolidate color, spacing, radius, shadow, type and motion tokens without broad regressions.
- [ ] Establish consistent button, card, section, container and navigation patterns.
- [ ] Confirm the system works in light/dark sections and at narrow mobile widths.
- [ ] Preserve existing brand/content decisions and the current conversion path.

Exit criteria: reusable visual foundations exist and are validated on representative public and authenticated routes.

## Phase 2 — signature homepage hero

- [ ] Inspect actual CRAFT logo and current hero composition.
- [ ] Define one brand-specific 3D metaphor that supports the idea-to-product story.
- [ ] Prototype React Three Fiber v9 with React 19 in an isolated, reversible change.
- [ ] Evaluate ShaderGradient compatibility with Next.js 16 before adopting it.
- [ ] Prototype a restrained liquid-metal CRAFT logo reveal adapted to the real logo asset.
- [ ] Keep headline, supporting copy and CTA as semantic DOM.
- [ ] Add lazy loading, poster fallback, no-WebGL fallback and reduced-motion path.
- [ ] Tune mobile composition separately; remove or simplify 3D where necessary.

Exit criteria: hero is memorable, readable, responsive, fast enough on mobile and usable with motion/WebGL disabled.

## Phase 3 — extend the visual language

- [ ] Identify only the sections that benefit from depth, light, transitions or small interactive moments.
- [ ] Apply shared typography, surfaces, spacing, card and button language across catalogues and formats.
- [ ] Bring the same visual system into auth, dashboard and learning without making them visually noisy.
- [ ] Keep admin efficient and accessible; decorative 3D is not a priority there.
- [ ] Avoid repetitive gradients, excessive glass effects and motion for motion's sake.

Exit criteria: public and authenticated areas feel like one product, while each area remains optimized for its task.

## Phase 4 — quality and regression

- [ ] Run `npm run test:security` and `npm run build`.
- [ ] Inspect relevant routes at 320, 360, 390, 430, 768 and 1024 CSS px.
- [ ] Check no horizontal page overflow, clipped Russian text or hidden CTAs.
- [ ] Check keyboard operation, visible focus, contrast and reduced-motion behavior.
- [ ] Check loading, empty, error, locked and success states.
- [ ] Check WebGL fallback and low-power behavior.
- [ ] Test real iOS Safari and Android Chrome before claiming device QA complete.
- [ ] Review the diff for accidental changes to security, product scope, SEO, or pricing/claims.

Exit criteria: all available automated checks pass; any unperformed manual/device checks are explicitly recorded as open.

## Phase 5 — handoff and controlled Preview

- [ ] Update Project Brain and roadmap status based on what was actually implemented.
- [ ] Commit only to `craft/visual-excellence`.
- [ ] Use Preview for review; do not merge to `main` or publish Production.
- [ ] Report exact commits, changed files, tests and remaining limitations.

## Deferred unless explicitly requested

- Social media and marketing channels.
- Payments, subscriptions, checkout and commercial activation.
- Paid services, APIs or usage-based infrastructure.
- Legal commitments and publication of legal documents.
- Production deployment, merging or release.
