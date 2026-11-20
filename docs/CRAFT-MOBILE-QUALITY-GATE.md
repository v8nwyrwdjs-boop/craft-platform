# CRAFT mobile quality gate

Mobile is a first-class product surface, not a compressed desktop layout.

## Supported viewport test set

Run each critical route at these viewport widths:
- 320 × 720 — narrow legacy phone / overflow stress test.
- 360 × 800 — compact modern phone.
- 390 × 844 — common iPhone-sized viewport.
- 430 × 932 — large phone.
- 768 × 1024 — tablet portrait.
- 1024 × 768 — tablet landscape / desktop breakpoint transition.

## Routes and journeys to test

1. Homepage: header navigation, hero CTA, project showcase, directions, mentorship explanation, format discovery, footer.
2. Directions catalogue and each direction detail page.
3. Product concepts catalogue and individual concept detail pages.
4. Formats page, including all four anchors: self-study, mentorship, done-for-you, club.
5. Registration, login, password recovery, and auth callback result states.
6. Student dashboard: empty state, project creation form, project cards.
7. Learning programme: progress indicator, curriculum cards, locked/enrolled states, lesson content and assignment forms.
8. Admin: summary cards, enrollment controls, data tables, feedback form, status controls.

## Mobile acceptance criteria

- No horizontal page overflow at 320, 360, 390, 430, 768, or 1024 CSS px.
- No clipped headlines, buttons, form fields, cards, or important labels.
- Main navigation remains reachable; mobile navigation may scroll horizontally but must not disappear.
- Primary actions and form controls aim for at least 44 × 44 CSS px where practical. WCAG 2.2 AA Target Size (Minimum) requires 24 × 24 CSS px or sufficient spacing, subject to its exceptions.
- Text remains readable without pinch zoom; form fields use comfortable type sizes and spacing.
- Cards and multi-column grids collapse into a clear single-column or intentional two-column layout.
- Tables use an explicit horizontal scroll container rather than forcing page-wide overflow.
- Forms are full-width, keyboard-friendly, and retain visible labels and validation feedback.
- Motion is reduced when the user requests reduced motion; hover-only affordances are not required on touch devices.
- Sticky or anchored navigation does not obscure focused controls or section headings.
- Empty, loading, error, locked, and success states remain understandable.

## Performance and device checks

- Test on a real iOS Safari device and Android Chrome device, not only desktop responsive emulation.
- Check slow mobile network behavior, image loading, font loading, and layout shift.
- Verify keyboard opening does not hide the active field or submit action.
- Check orientation changes, safe-area insets, browser zoom, and long translated strings.
- Capture screenshots at the supported widths and compare before accepting visual changes.

## Current implementation status

A first mobile CSS refinement has been added for homepage, formats, authentication, dashboard, learning catalogue, and admin surfaces. This is a code-level pass, not a completed device QA sign-off. The route-by-route checks above remain required before production.

## Mobile navigation regression fixed

- [x] Keep the homepage's four primary section links visible below the brand/action row at widths up to 760 CSS px.
- [x] Allow horizontal navigation scrolling without hiding links or requiring hover.
- [x] Preserve 44px minimum navigation link height for touch interaction.
- [x] Offset the sticky scroll-story panel by the expanded mobile header height.
- [x] Verify the expanded header and sticky story together in browser screenshots at 320, 360, 390 and 430 CSS px (headless Chrome mobile emulation, 2026-11-21; not a physical device).

## Regression found and fixed from an iPhone screenshot

- [x] Remove emergency mid-word wrapping from the homepage hero heading; use normal Russian word boundaries and balanced heading wrapping.
- [x] Force the homepage hero to a single-column mobile layout so the illustration cannot occupy a narrow side column beside the headline or lead copy.
- [x] Keep the illustration centered below the hero copy with a bounded mobile height.
- [x] Use a single-column direction-card layout on narrow phones (390 CSS px and below) to prevent long Russian labels from being squeezed into narrow tiles.
- [ ] Re-check the latest deployed Preview on iOS Safari at 320, 360, 390 and 430 CSS px; CSS correction is committed and verified in the served stylesheet, but a screenshot/device pass is still required.
- [ ] Scan every public and authenticated route for similar clipped or mid-word heading breaks after the hero regression is confirmed fixed.

## Latest Preview smoke check

The Preview for commit `9b1265b09d3239a921e0289cd9d171ccad999bdd` returned HTTP 200 for:
`/`, `/formats`, `/directions`, `/directions/direction-01`, `/products`, `/products/C-01`, `/login`, `/register`, `/forgot-password`, `/learn`, and `/admin`.
This is a server-response smoke check only. It does not prove visual correctness, successful authenticated journeys, or device-level layout behavior.
The deployed CSS asset was fetched and confirmed to contain the mobile single-column hero, normal word-breaking, manual hyphenation, balanced heading rules, and narrow-phone direction-card layout. Automated CSS regression tests now guard these rules. All 23 automated tests passed in this Preview build. Carousel controls now expose 44px targets, and automatic rotation stops when reduced motion is requested.


## Cross-platform application refinements (source-level)

- [x] Catalog and format navigation uses a horizontally scrollable mobile row with 44px link targets.
- [x] Authentication, assignment, and staff-review controls are full-width constrained and use 16px input text to avoid iOS focus zoom.
- [x] Lesson content and learner responses can wrap long strings without widening the viewport.
- [x] Admin tables remain inside touch-scrollable containers; identifiers and review responses can wrap.
- [x] Hover-only elevation is removed on touch devices and interaction transitions respect reduced-motion.
- [x] Detail-page navigation landmarks have explicit accessible names.
- [ ] Run the Node security/mobile test suite and Next.js production build on the latest branch head.
- [ ] Inspect latest Preview screenshots at all supported widths and complete authenticated journeys.
- [ ] Verify on physical iOS Safari and Android Chrome.

The CSS and test assertions are source-level changes only. The final three items remain release blockers until execution evidence is recorded.

## Homepage story — headless browser pass (2026-11-21)

Production build served locally and driven by headless Chrome with software WebGL (SwiftShader); mobile emulation uses DPR 2, touch and an iOS user agent. Viewport screenshots were taken at several scroll positions per width.

- [x] 320×640, 360×740, 375×667, 390×844, 430×932, 768×1024 and 1024×768: no horizontal page overflow (scrollWidth equals clientWidth), no clipped Russian copy, all five stages visible and legible.
- [x] Short phones: below 720 CSS px of viewport height the story copy compacts and the stage fits completely (verified at 320×640 and 375×667). Before the fix the pinned story was 610px tall, so at 320×640 its bottom edge sat at 714px, below the fold.
- [x] 320px header: all four section links fit without being cut mid-word.
- [x] Reduced motion (320×640 and 390×844): the story is a static, non-pinned section showing a monitor composition, with no horizontal overflow.
- [x] Touch drags that start on the 3D stage scroll the page natively.
- [ ] Not covered: physical iOS Safari and Android Chrome, real-GPU performance, landscape phones (header plus pinned story leave very little height), browser zoom, safe-area insets and the other routes.
