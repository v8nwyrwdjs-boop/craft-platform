# CRAFT — visual excellence implementation roadmap

This roadmap tracks the dark-first redesign on the visual-excellence branch. The broader product roadmap remains in roadmap.md; launch blockers remain in launch-readiness.md.

## Guiding principle

Build a coherent, recognizably CRAFT experience, not a collection of disconnected effects. The homepage carries the expressive story; learning and admin prioritize focus, readability and speed. Mobile quality is a release criterion throughout.

## Phase 0 — baseline and constraints

- [x] Confirm branch, branch head and latest workflow status.
- [x] Inspect homepage, global styles, route structure, installed stack and current interactions.
- [x] Confirm the mismatch between the light-first homepage implementation and the approved dark product-stage direction.
- [ ] Re-run automated tests and production build on the redesigned commit.
- [ ] Render and inspect the actual Preview when access permits; do not bypass protection.

## Phase 1 — visual system

- [x] Establish obsidian, graphite, porcelain, restrained lime and silver tokens.
- [x] Add a dedicated dark-first stylesheet without rewriting existing global CSS.
- [x] Use deliberate media radii, keylines, editorial type scale and one pale contrast chapter.
- [ ] Refine every secondary route using rendered screenshots, not only source styling.

## Phase 2 — signature narrative

- [x] Replace the sphere-only homepage hero interaction and timed carousel with one scroll-driven story.
- [x] Define five chapters: programming, digital products/monitor, cryptocurrency/coin, ecosystem and CRAFT catalogue.
- [x] Replace the legacy point-cloud morph with an authored InstancedMesh component kit: six geometry families (slab, bar, arc, cylinder, orb, unlit pixel tile), 1,016 instances on high quality and 806 on low, five scroll-linked layouts.
- [x] Keep binary digits readable by constructing them from structured 0/1 glyph components rather than ambient particles.
- [x] Map monitor bezel/screen/stand, coin milling/engraving, ecosystem hubs/links and three catalogue panels as bounded component layouts.
- [x] Increase physical-model fidelity with distinct component geometries and material families (matte slabs, bevelled bars, extruded arcs, cylinders, metallic orbs, unlit pixel tiles) lit by a baked studio environment. Remaining gap: the look is stylised rather than photoreal and has only been reviewed in software-rendered headless Chrome.
- [x] Replace the generic cube-instance vocabulary with model-specific geometry while keeping stable component identity: every instance exists in all five stages and follows a deterministic, curved, staggered path that reverses exactly on upward scroll.
- [x] Add scroll-linked camera choreography: per-chapter authored views fitted to the stage aspect ratio, damped orbit, and pointer parallax with an accent light for mouse/pen only (never touch, disabled under reduced motion).
- [x] Drive the scene from native scroll progress; reverse the same timeline on upward scroll.
- [x] Keep headings and chapter copy in accessible DOM, synchronized to scroll.
- [x] Lazy-load the client-only scene; cap DPR; prefer low-power, demand rendering.
- [x] Pause and unmount the scene offscreen, cleaning up GPU resources.
- [x] Provide a CSS fallback and a reduced-motion path with all story chapters visible.
- [ ] Review the real rendered motion and performance on desktop and physical mobile devices. So far only headless Chrome with software WebGL (SwiftShader) has been used for screenshots; there are no real-GPU frame timings and no physical-device checks.

## Phase 3 — product-first homepage

- [x] Preserve the truthful product promise and a clear first-screen action.
- [x] Preserve the eight areas of exploration, human-feedback principle, six-step method and three participation formats.
- [x] Keep routes to login, registration, directions and formats intact.
- [x] Keep unapproved prices, fabricated proof and CRAFT CLUB launch claims off the homepage.
- [ ] Align the secondary catalogues and formats with the homepage through visual browser review.

## Phase 4 — quality gate

- [x] Add source-level regression tests for native scroll, accessibility, reduced motion, resource cleanup, five component layouts and removal of the legacy point-cloud renderer.
- [x] Run the complete security suite and Next.js production build locally (52/52 security tests, `tsc --noEmit` clean, `npm run build` succeeded) on the tree that became commit 19440c2. GitHub's `build` check and the Vercel Preview deployment for 19440c2 both reported success (read through the GitHub API on 2026-11-21).
- [x] Homepage story inspected at 320, 360, 390, 430, 768 and 1024 CSS px (plus 375×667 and reduced motion) in headless Chrome: no horizontal overflow and no clipped Russian text after the short-viewport and 320px header fixes.
- [x] All 19 public pages (including every direction and concept detail page) were scanned at 320, 360, 390, 430, 768 and 1024 CSS px in headless Chrome: 114 checks, no horizontal overflow after the fixes below. Visual review was limited to the top of `/directions`, `/login` and `/products/C-06`.
- [x] Fixed: catalogue hero headings used a fixed 55px size, so long Russian words ("направление", "специалистов") overflowed the page at 320-360px, and `/products/C-06` ("профессиональной") overflowed at every phone width. The size now follows the viewport, and detail titles with a word of 14+ letters get a smaller size through `data-long-word`.
- [x] Fixed: the "Подробнее" card links and the account links were only 12-15px tall; on coarse pointers their hit area is now at least 44px (checked with `elementFromPoint` at ±20px).
- [ ] Authenticated routes (`/dashboard`, `/learn`, `/admin`) and the lower sections of each public route still need rendered-screenshot review.
- [x] Touch drags that start on the 3D canvas scroll the page natively (checked with dispatched touch events in headless Chrome).
- [ ] Open finding: `app/globals.css` line 1 `@import`s Google Fonts, which the production CSP (`style-src 'self'`) blocks, so DM Sans and Manrope never load and the console reports a CSP error. Needs an owner decision (self-host through `next/font`, or keep the fallbacks); the CSP was not changed.
- [ ] Open finding: `/favicon.ico` returns 404.
- [ ] Exercise keyboard navigation, focus, forms, fallback rendering and empty/error/locked states.
- [ ] Test real iOS Safari and Android Chrome before calling device QA complete.

## Phase 5 — controlled delivery

- [x] Keep the implementation on craft/visual-excellence.
- [x] Keep main unchanged and do not merge a pull request.
- [x] Keep Production untouched.
- [ ] Verify the branch-head workflow and report exact results. (19440c2: `build` check and Vercel Preview succeeded; re-read the status of the final head.)

## Implementation record

The previous implementation used a 1,800-point GLSL morph plus separately revealed physical monitor, coin and ecosystem groups. The point cloud obscured binary readability and allowed the forms to feel like unrelated layers. That implementation did not satisfy the owner's requirement for models built from their own meaningful parts.

The first replacement step (superseded by the authored component kit below):
- Adds `docs/CRAFT-MASTER-SPEC.md` as the canonical product/design/engineering brief and links it from `AGENTS.md` and `docs/CRAFT-PROJECT-BRAIN.md`.
- Removes the point-sprite shader and particle geometry from the active scene.
- Introduces a 640-instance deterministic component assembly with five authored layouts.
- Builds the programming chapter from readable 0/1 glyphs made of micro-components.
- Defines bounded monitor, coin, ecosystem and three-panel catalogue component arrangements.
- Interpolates the same component indices between adjacent layouts, so the transition is reversible and scroll-controlled.
- Moves the overall composition subtly with story progress and retains low-power, capped-DPR, demand-rendered WebGL plus environment reflections.
- Rewrites source-level regression tests to reject the legacy point-cloud renderer and require the component assembly.

That first pass was an architectural foundation in which every instance shared one box primitive. It has been superseded by the authored component kit below; its remaining caveats (device QA, CI result) are tracked in the Phase 4 checklist.

Verification log, 2026-11-20: `node --experimental-strip-types --test tests/security/*.test.mjs` was run locally on branch head c4b0018. 40 of 41 tests passed; the scroll-story test requiring the "readable binary typography" description failed because the scene comment was inaccurate (it claimed 600 components; the layout uses 520 glyph bars and a 120-part baseline rail). The comment was corrected without changing the test. The GitHub `build` check and the Vercel deployment for c4b0018 were reported as failed; their logs were not read, but `npm run build` runs the security tests before `next build`. `next build`, type-checking against installed dependencies and browser rendering were not run in this environment (no installed dependencies, no network).

### Authored component kit (second pass, 2026-11-21)

Supersedes the shared-box assembly above. Files: `lib/craft-story-layout.ts` (pure model, sampler and camera), `components/craft-scroll-story-scene.tsx` (R3F renderer), `tests/security/craft-story-layout.test.mjs` and `tests/security/scroll-story.test.mjs`.

- Six `InstancedMesh` families, i.e. six draw calls: slab, bar (rounded box), arc (24 extruded 15° segments per ring), cylinder, orb (icosahedron) and pix (unlit tile with per-instance colour). High quality uses 1,016 instances; low quality (coarse pointer, width under 760, 4 GB or less memory, or 4 or fewer cores) uses 806.
- Each stage is an authored list of parts per family, grouped as hero / structure / detail. Parts are spread over the same instance slots, so every instance exists in every stage; slots a stage does not use shrink to zero in place and regrow in the next. Paths are curved and staggered with hash-based offsets (no `Math.random`), rotations use quaternion slerp, and scale grows late and shrinks early so flat slabs never dominate a transition. The sampler is a pure function of scroll progress, so scrolling back reverses the story exactly.
- Stages: a binary CRAFT wall built from 0/1 glyph bars; a monitor with bezel, pixel-tile screen, stand and base; a milled coin with ring tracks and a central hexagon mark; an ecosystem of rings, hubs and links; a catalogue of three panels on a plinth with a silver rim.
- Camera: per-stage views fitted to the stage aspect ratio (FOV 34), azimuth/elevation orbit, pointer parallax and an accent light for mouse/pen only, damped and requesting frames only while settling (`frameloop="demand"`).
- Lighting: a dark photo-studio scene baked once with `PMREMGenerator` and assigned to material `envMap`; disposed with geometries and materials on unmount. DPR is capped at 1.5 (high) and 1.15 (low); MSAA is on.

Verification log, 2026-11-21 (branch head 19440c2, local):
- `npm run test:security`: 52 tests, 52 pass, 0 fail (10 are the new layout tests). `npx tsc --noEmit`: no errors. `npm run build`: compiled and generated all 16 pages.
- Rendering: the production build served with `next start` and driven by headless Google Chrome (puppeteer-core) using SwiftShader software WebGL, at 1280×800, 1024×768, 768×1024 and mobile emulation (DPR 2, touch, iOS user agent) at 320×640, 360×740, 375×667, 390×844 and 430×932, plus a reduced-motion pass. All five stages and the transitions were inspected as screenshots; scrollWidth equals clientWidth at every width.
- Touch: drags dispatched through the DevTools protocol scroll the page identically on the copy and on the 3D canvas (`touch-action` stays `auto`, listeners are passive, touch pointers are ignored by the parallax code).
- Public-route sweep after the catalogue fixes: 19 public pages × 6 widths = 114 checks, no horizontal overflow; hit areas of the card and account links verified with `elementFromPoint`.
- Not tested: physical iOS/Android devices, real-GPU frame times and thermal behaviour, landscape phones, the WebGL-unavailable and context-loss paths in a browser (source tests only), rendered screenshots of the other routes, a keyboard-only pass, and the GitHub/Vercel result for this commit.

Do not mark this phase visually complete until the actual Preview has been inspected at desktop and mobile sizes, including the five transitions, upward reversal, reduced-motion fallback and low-end mobile behavior.
