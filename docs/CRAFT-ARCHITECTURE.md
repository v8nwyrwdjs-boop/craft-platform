# CRAFT — architecture and implementation constraints

## Current documented stack

The current branch README and package manifest document:
- Next.js 16.4.6 with App Router.
- React 19.3.0 and React DOM 19.
- TypeScript.
- Supabase Auth and Supabase SSR helpers.
- Supabase PostgreSQL with Row Level Security.
- Vercel Preview workflow and GitHub Actions checks.

The package manifest currently lists Supabase libraries and does not list Three.js, React Three Fiber, Drei or ShaderGradient. Verify the live branch manifest and lockfile before dependency work. This document records the inspected baseline, not a guarantee that no later commit has changed it.

## Application surfaces

The documented route map:
- Public: home, directions catalogue/details, product concepts catalogue/details, formats.
- Identity: registration, login, password recovery and auth callback.
- Learner: dashboard, student projects, learning catalogue, module/lesson pages, progress and text submissions.
- Staff: admin/mentor workspace.

Inspect the actual `app/` tree and server actions before modifying any surface. Preserve existing routes and user journeys unless a change is explicitly part of the task.

## Data and authorization model

The documented Supabase schema includes:
- `profiles`
- `student_projects`
- `enrollments`
- `lesson_progress`
- `assignment_submissions`
- `mentor_feedback`

Security principles:
- Row Level Security is enabled on user data tables.
- Student records are owner-scoped.
- Staff roles are read from trusted `app_metadata.role` values, not user-editable metadata.
- Enrollment is controlled by trusted server/admin workflows; a student cannot grant themselves access.
- Server actions validate lesson identifiers against the canonical six-stage/18-lesson curriculum.
- Curriculum slug changes must be coordinated across the shared curriculum source, server validation, schema/migrations and regression tests.

Treat the current schema, migrations and tests as the source of truth. Do not weaken policies or assume a migration has been applied to the hosted Supabase project just because it exists in Git.

## Visual implementation architecture

Preferred integration shape for the signature 3D work:
- Keep the page shell, headline, description, CTA and navigation in semantic DOM.
- Put the 3D scene behind a dedicated client component, dynamically imported with SSR disabled only at the appropriate client boundary.
- Keep the scene self-contained with explicit props and a small public interface.
- Use a static poster/illustration fallback before the scene loads and when WebGL is unavailable.
- Detect reduced-motion and use a static or near-static scene.
- Limit DPR, geometry, texture sizes, shader complexity and active frame rate based on device capability.
- Avoid creating multiple renderers or animation loops for decorative details.
- Pause rendering when off-screen or when the page is backgrounded where practical.
- Keep pointer/touch interaction optional; never require hover or precise cursor movement.
- Do not bake meaningful text into a canvas.

Do not assume this exact structure matches the current app. Inspect existing components and conventions before selecting file paths or abstractions.

## Next.js and React compatibility

The visual references must be tested against the actual app:
- React Three Fiber stable v9 is the expected major line for React 19.
- ShaderGradient's documented Next.js 15 example does not prove Next.js 16 compatibility.
- Any use of `window`, WebGL or browser-only APIs must stay inside a client-only boundary and must not execute during server rendering.
- Avoid hydration mismatches and module-level browser side effects.
- Test the actual production build, not only the dev server.
- Do not upgrade Next.js or React to make a library work unless the owner explicitly approves a migration and its risks.

## Quality and security

- Keep secrets server-side; do not expose service-role keys or secret environment variables.
- Validate all untrusted input server-side and enforce authorization in server actions and RLS.
- Preserve secure redirects and trusted-origin checks.
- Do not add analytics, telemetry, remote fonts, hosted assets or external API dependencies that create privacy or cost implications without approval.
- Keep public Preview pages noindex according to the existing environment-aware SEO behavior.
- Do not claim full E2E, device or production validation based on unit tests or HTTP 200 smoke checks.

## Validation

Use the repository's actual scripts. The README currently documents:
- `npm run test:security`
- `npm run build` (runs security tests before Next.js build)

For 3D and design work additionally validate:
- No SSR/hydration/console errors.
- Static fallback and reduced-motion paths.
- Required mobile viewport matrix.
- Touch, keyboard, scroll and form usability.
- Performance and layout shift on a real mobile device before declaring mobile QA complete.

## Unknowns to verify, not guess

- Exact current app component tree and CSS token strategy.
- Whether a current Preview deployment reflects HEAD.
- Whether every Supabase migration is applied in the hosted project.
- Whether real student/mentor/admin E2E and RLS role tests have been completed.
- Whether ShaderGradient supports the exact Next.js 16 bundling/runtime setup.
- Actual physical-device performance of any new 3D scene.
