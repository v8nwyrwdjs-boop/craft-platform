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
- [x] Define the four stages: binary code, computer/monitor, digital asset, connected ecosystem.
- [x] Use one particle system with continuous morph targets rather than four separate animations.
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

- [x] Add source-level regression tests for scroll progress, accessibility, reduced motion, resource cleanup and responsive styles.
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

The old homepage used a light-dominant layout, a standalone liquid sphere and an automatically rotating product carousel. Those parts did not meet the owner's dark Apple-stage reference or the pasta-style continuous transformation idea.

The new homepage replaces that composition with:
- An obsidian opening stage with accessible DOM typography, a concise promise and clear actions.
- A continuous R3F particle transformation: floating binary digits → assembled computer/monitor → digital coin/asset → connected ecosystem.
- Russian-language story copy and progress synchronized with native scroll, with reverse motion when scrolling upward.
- Four product examples, all eight areas of exploration, the human-feedback principle, six creation stages and three participation formats.
- Mobile-specific composition, passive scroll tracking, demand rendering, low-power WebGL, capped DPR, offscreen unmounting and deterministic resource cleanup.
- A CSS fallback and a reduced-motion state that presents all four stages as readable content.

The older sphere and carousel source files remain unmounted rather than being deleted prematurely; their callers and regression tests can be removed after a separate dependency check.

The TikTok video itself is not available in this repository context, so this implementation follows the CRAFT narrative already supplied in the project documents and the accessible motion reference. It does not claim a shot-by-shot recreation of an unseen video.

A passing CI build is necessary but not visual sign-off. Preview/browser rendering and actual iOS/Android checks remain explicitly open.
