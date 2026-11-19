# CRAFT — visual excellence implementation roadmap

This is the focused roadmap for the visual-excellence branch. The broader product roadmap remains in [roadmap.md](roadmap.md); launch blockers remain in [launch-readiness.md](launch-readiness.md).

## Guiding principle

Build a coherent, recognizably CRAFT experience, not a collection of disconnected effects. The homepage should earn the strongest visual moment; learning and admin should prioritize focus, readability and speed. Mobile quality is a release criterion throughout.

## Phase 0 — verify the baseline

- [x] Confirm the current branch is `craft/visual-excellence` and inspect the repository tree and current branch head.
- [x] Inspect the current hero, header, typography, CSS variables and shared page components.
- [ ] Re-run existing security tests and production build to establish a fresh baseline.
- [ ] Check the latest Preview only if it can be done without Production promotion or access/security changes.
- [ ] Record current dependencies and lockfile; do not infer package installation from documentation.

Exit criteria: current code and test state are known; no baseline failure is silently attributed to the visual work.

## Phase 1 — design foundation

- [ ] Audit existing CSS variables, typography and spacing before adding tokens.
- [ ] Consolidate color, spacing, radius, shadow, type and motion tokens without broad regressions.
- [x] Establish consistent button, card, section, container and navigation patterns.
- [ ] Confirm the system works in light/dark sections and at narrow mobile widths.
- [ ] Preserve existing brand/content decisions and the current conversion path.

Exit criteria: reusable visual foundations exist and are validated on representative public and authenticated routes.

## Phase 2 — signature homepage hero

- [ ] Inspect actual CRAFT logo and current hero composition.
- [ ] Define one brand-specific 3D metaphor that supports the idea-to-product story.
- [x] Add a client-only React Three Fiber v9 hero scene with React 19.
- [ ] Evaluate ShaderGradient compatibility with Next.js 16 before adopting it.
- [ ] Prototype a restrained liquid-metal CRAFT logo reveal adapted to the real logo asset.
- [x] Keep headline, supporting copy and CTA as semantic DOM.
- [x] Add lazy loading, CSS no-WebGL fallback, reduced-motion static rendering and viewport-based render pausing.
- [ ] Tune mobile composition separately; remove or simplify 3D where necessary.

Exit criteria: hero is memorable, readable, responsive, fast enough on mobile and usable with motion/WebGL disabled.

## Phase 3 — extend the visual language

- [ ] Identify only the sections that benefit from depth, light, transitions or small interactive moments.
- [x] Apply shared typography, surfaces, spacing, card and button language across catalogues and formats.
- [x] Extend restrained surface, focus, form, dashboard and learning refinements without adding decorative 3D to task-focused areas.
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


## Current implementation note — 2026-11-19

The first signature-hero implementation has been added on `craft/visual-excellence`:
- `components/craft-hero-scene.tsx` contains a client-side React Three Fiber scene with a metallic central form, restrained lime orbit, lighting and pointer-responsive motion.
- `components/craft-hero-scene-loader.tsx` lazy-loads the WebGL scene with SSR disabled and a static CSS fallback.
- `app/page.tsx` mounts the scene inside the existing homepage hero while keeping all headline and CTA content in semantic DOM.
- `app/globals.css` adds the visual composition and compact-screen treatment.
- `package.json` declares the stable R3F 9 / Three.js dependency line and Three.js types.

Validation status: source files were re-read from the target branch after writing. Automated tests, dependency installation, TypeScript, Next.js build, browser rendering, and viewport checks have **not yet been run** against this change. The repository currently has no recognized npm/yarn/pnpm lockfile at its root, so dependency resolution and reproducibility need attention before the implementation can be called validated. ShaderGradient and the original Liquid Logo technique remain unintegrated; this first pass uses native Three.js materials inside R3F rather than adding unverified dependencies.


## Implementation update — 2026-11-19

Implemented on `craft/visual-excellence`:
- The homepage hero now lazy-loads an R3F 9 scene with a custom GLSL liquid-metal sphere, procedural surface displacement, restrained lime orbit geometry and a custom shader atmosphere.
- The scene reacts subtly to pointer movement, respects reduced motion, caps device pixel ratio, uses a low-power WebGL preference and pauses its render loop when outside the viewport.
- The existing homepage content and CTA remain semantic DOM; a CSS fallback remains available when WebGL cannot initialize.
- Shared visual refinement has been added across public catalogues, formats, auth, dashboard, learning and admin: clearer focus states, restrained hover feedback, consistent surfaces, sticky translucent public navigation and improved section composition.
- GitHub Actions now includes the visual-excellence branch in its build trigger, so the same security/audit/build workflow can validate this branch without deploying it to Production.

Still open:
- ShaderGradient package itself is not installed; the atmospheric shader is a custom GLSL implementation pending review against the reference library.
- The typographic CRAFT wordmark now receives a restrained SVG liquid-metal displacement/sheen treatment; a separate image-mask reveal is unnecessary until a dedicated logo asset exists.
- Dependency installation and CI validation are in progress; no browser screenshot, real device, or Vercel Preview QA has been completed.
- The repository has no committed npm lockfile; CI currently uses `npm install`, so reproducible lockfile adoption remains a separate engineering decision.
- This work is not a completed full redesign until CI passes and remaining routes have visual review.
