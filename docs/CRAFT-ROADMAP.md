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
- [x] Replace the legacy point-cloud morph with a first authored InstancedMesh assembly of 640 deterministic components and five scroll-linked layouts.
- [x] Keep binary digits readable by constructing them from structured 0/1 glyph components rather than ambient particles.
- [x] Map monitor bezel/screen/stand, coin milling/engraving, ecosystem hubs/links and three catalogue panels as bounded component layouts.
- [ ] Increase physical-model fidelity with distinct component geometries/material families and richer authored subassemblies; the current 640-part assembly is a structural first pass, not final photorealism.
- [ ] Replace the remaining generic cube-instance vocabulary with model-specific geometry while preserving stable component identity and reversible trajectories.
- [ ] Add scroll-linked camera choreography and text-relative composition across all five chapters.
- [x] Drive the scene from native scroll progress; reverse the same timeline on upward scroll.
- [x] Keep headings and chapter copy in accessible DOM, synchronized to scroll.
- [x] Lazy-load the client-only scene; cap DPR; prefer low-power, demand rendering.
- [x] Pause and unmount the scene offscreen, cleaning up GPU resources.
- [x] Provide a CSS fallback and a reduced-motion path with all story chapters visible.
- [ ] Review the real rendered motion and performance on desktop and physical mobile devices.

## Phase 3 — product-first homepage

- [x] Preserve the truthful product promise and a clear first-screen action.
- [x] Preserve the eight areas of exploration, human-feedback principle, six-step method and three participation formats.
- [x] Keep routes to login, registration, directions and formats intact.
- [x] Keep unapproved prices, fabricated proof and CRAFT CLUB launch claims off the homepage.
- [ ] Align the secondary catalogues and formats with the homepage through visual browser review.

## Phase 4 — quality gate

- [x] Add source-level regression tests for native scroll, accessibility, reduced motion, resource cleanup, five component layouts and removal of the legacy point-cloud renderer.
- [ ] Run the complete security suite and Next.js production build against this branch head.
- [ ] Inspect 320, 360, 390, 430, 768 and 1024 CSS px for overflow, clipped Russian text and visible actions.
- [ ] Exercise keyboard navigation, focus, forms, fallback rendering and empty/error/locked states.
- [ ] Test real iOS Safari and Android Chrome before calling device QA complete.

## Phase 5 — controlled delivery

- [x] Keep the implementation on craft/visual-excellence.
- [x] Keep main unchanged and do not merge a pull request.
- [x] Keep Production untouched.
- [ ] Verify the branch-head workflow and report exact results.

## Implementation record

The previous implementation used a 1,800-point GLSL morph plus separately revealed physical monitor, coin and ecosystem groups. The point cloud obscured binary readability and allowed the forms to feel like unrelated layers. That implementation did not satisfy the owner's requirement for models built from their own meaningful parts.

The current first replacement step:
- Adds `docs/CRAFT-MASTER-SPEC.md` as the canonical product/design/engineering brief and links it from `AGENTS.md` and `docs/CRAFT-PROJECT-BRAIN.md`.
- Removes the point-sprite shader and particle geometry from the active scene.
- Introduces a 640-instance deterministic component assembly with five authored layouts.
- Builds the programming chapter from readable 0/1 glyphs made of micro-components.
- Defines bounded monitor, coin, ecosystem and three-panel catalogue component arrangements.
- Interpolates the same component indices between adjacent layouts, so the transition is reversible and scroll-controlled.
- Moves the overall composition subtly with story progress and retains low-power, capped-DPR, demand-rendered WebGL plus environment reflections.
- Rewrites source-level regression tests to reject the legacy point-cloud renderer and require the component assembly.

This is an architectural foundation, not the final visual finish. The current component instances still share a box primitive; the next implementation pass must introduce model-specific geometries, richer material families, stronger physical construction, more deliberate trajectories and more expressive camera/text choreography. Source-level tests have been updated but have not yet been executed in this environment. The Vercel check was observed pending at the previous inspected commit; final CI/build and browser/device QA remain open.

Do not mark this phase visually complete until the actual Preview has been inspected at desktop and mobile sizes, including the five transitions, upward reversal, reduced-motion fallback and low-end mobile behavior.
