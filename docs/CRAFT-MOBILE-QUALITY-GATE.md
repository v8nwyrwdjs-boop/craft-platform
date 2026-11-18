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

## Regression found and fixed from an iPhone screenshot

- [x] Remove emergency mid-word wrapping from the homepage hero heading; use normal Russian word boundaries and balanced heading wrapping.
- [x] Force the homepage hero to a single-column mobile layout so the illustration cannot occupy a narrow side column beside the headline or lead copy.
- [x] Keep the illustration centered below the hero copy with a bounded mobile height.
- [x] Use a single-column direction-card layout on narrow phones (390 CSS px and below) to prevent long Russian labels from being squeezed into narrow tiles.
- [ ] Re-check the latest deployed Preview on iOS Safari at 320, 360, 390 and 430 CSS px; CSS correction is committed and verified in the served stylesheet, but a screenshot/device pass is still required.
- [ ] Scan every public and authenticated route for similar clipped or mid-word heading breaks after the hero regression is confirmed fixed.

## Latest Preview smoke check

The Preview for commit `612904583f716a25e9f8aea28e7e53172c07e723` returned HTTP 200 for:
`/`, `/formats`, `/directions`, `/directions/direction-01`, `/products`, `/products/C-01`, `/login`, `/register`, `/forgot-password`, `/learn`, and `/admin`.
This is a server-response smoke check only. It does not prove visual correctness, successful authenticated journeys, or device-level layout behavior.
The deployed CSS asset was fetched and confirmed to contain the mobile single-column hero, normal word-breaking, manual hyphenation, balanced heading rules, and narrow-phone direction-card layout. Automated CSS regression tests now guard these rules. All 20 automated tests passed in this Preview build.
