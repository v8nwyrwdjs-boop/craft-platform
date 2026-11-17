# CRAFT — launch readiness

This document separates what exists in code from what must be verified operationally. A successful Preview build is not a production launch approval.

## Current state

- [x] Public website, directions catalogue, product concepts and formats page.
- [x] Student registration, login and password-reset flows implemented with Supabase Auth.
- [x] Student projects, learning progress and text assignment submissions.
- [x] Basic admin/mentor workspace with manual enrollment and assignment review.
- [x] Responsive styles across public pages, authentication, dashboard, learning and admin.
- [x] Search metadata, social metadata, environment-aware robots rules and a conditional sitemap.
- [x] Security helper tests run as part of every build.
- [x] Server actions validate lesson IDs against the actual six-module curriculum.
- [x] Preview build for commit `495c5b87b7385b20cd38d365c817598d4e8d3058` completed successfully; 11 security tests passed and TypeScript/page generation completed.
- [ ] Verify the latest documentation-only follow-up Preview build before handing off.

## Required before inviting real students

### Identity, database and access

- [ ] Register a dedicated test student and verify email confirmation, login, logout and password reset.
- [ ] Confirm the deployed Supabase project is the intended environment.
- [ ] Apply `supabase/schema.sql` and every migration in order; record the applied migration state.
- [ ] Test RLS with separate student, mentor and admin accounts.
- [ ] Verify that a student cannot read another student's projects, progress, submissions or feedback.
- [ ] Verify that mentor/admin privileges are limited to the intended actions.
- [ ] Verify SMTP delivery and sender-domain authentication.

### Learning quality and operations

- [ ] Complete a methodical edit of all lessons, tasks and evaluation criteria.
- [ ] Define what counts as a completed stage and what evidence the learner must submit.
- [ ] Define mentor availability, communication channel, review workflow and realistic response expectations.
- [ ] Test the full student journey from registration to mentor feedback.
- [ ] Decide how support requests, refunds and account/data requests will be handled.

### Mobile and accessibility

- [ ] Test on real iOS Safari and Android Chrome devices.
- [ ] Complete the viewport matrix in `docs/CRAFT-MOBILE-QUALITY-GATE.md`.
- [ ] Check keyboard behavior, safe areas, orientation, long content and slow network conditions.
- [ ] Run keyboard-only and reduced-motion checks.
- [ ] Confirm no horizontal overflow or clipped primary actions on supported widths.

## Required before commercial launch

- [ ] Approve final programme contents, deliverables and format boundaries.
- [ ] Approve public pricing, payment terms, cancellation and refund rules.
- [ ] Obtain appropriate legal review for terms, privacy notice and required consents in target markets.
- [ ] Configure a canonical HTTPS domain in `NEXT_PUBLIC_SITE_URL`; verify canonical metadata and `/sitemap.xml`.
- [ ] Choose and implement a payment provider with verified server-side webhooks.
- [ ] Implement paid enrollment, revocation, refunds and payment history.
- [ ] Verify transactional email, monitoring, backups and incident handling.
- [ ] Complete a production security and privacy review.

## Release guardrails

- Preview is for validation, not a promise that every integration is live.
- Never publish invented testimonials, student outcomes, case studies or guarantees.
- Do not publish a response-time promise until the mentor operation can reliably meet it.
- Do not sell CRAFT CLUB until its schedule, content and delivery capacity are confirmed.
- Do not treat done-for-you development as a higher tier of education; it is a separate service with its own scope and agreement.
- Production deployment, merging to `main`, paid services and commercial activation require explicit owner approval.
