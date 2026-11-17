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
