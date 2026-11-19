# CRAFT Visual Excellence

## Product ambition

Build CRAFT as a serious, modern technology and digital-product education brand for Russian-speaking learners worldwide. The ambition is category leadership; it is not a claim that CRAFT already has the scale, outcomes, or reputation of established platforms.

The core promise is a guided path from an idea to a working digital product. Lessons are a tool, mentorship is support, and the learner's own project is the practical outcome.

## Positioning

**CRAFT helps people move from consuming information to creating digital products.**

Differentiators to communicate:
- Human guidance and substantive feedback instead of an impersonal support experience.
- Learning through the creation of an individual project.
- Clear explanations of modern technologies, including AI, SaaS, automation, design, media, and Web3.
- A practical progression from idea research to prototype, testing, and next steps.

Do not make unverified comparative claims about response times, competitor quality, student outcomes, or employment.

## Human mentorship principles

When a learner chooses a mentored format:
- Their questions receive a human response.
- Feedback addresses the learner's actual project and decisions.
- The mentor explains errors and trade-offs, not only the correction.
- Guidance helps the learner make progress while retaining ownership of the work.

Do not publish a guaranteed response SLA until staffing and workload make it operationally reliable. Do not describe the current mentor headcount.

## Offer architecture

The same learning-format prices apply across learning directions. The preliminary model is:
- Self-study: 2,000 RUB per program.
- Mentored learning: 10,000 RUB per program.
- CRAFT CLUB: 990 RUB per month.
- Done-for-you development: from 40,000 RUB per project, individually scoped.

These are planning prices, not a live offer or public promise. Confirm scope and terms before opening sales.

### Important separation: mentorship vs done-for-you

Mentorship is education: the learner creates the project with guidance.

Done-for-you is a development service: CRAFT performs the agreed work and hands over the deliverable, source code, documentation, and transfer instructions. Project scope, schedule, revisions, warranty/support, third-party costs, and intellectual-property terms must be agreed before work begins.

CRAFT CLUB is a separate community product and does not replace individual mentorship.

## Homepage conversion strategy

The homepage should first communicate:
1. What CRAFT stands for.
2. What a learner can create.
3. Why the practical, human-guided approach matters.
4. What the learning journey looks like.
5. The available directions and next step.

Do not put prices on the homepage. Introduce formats and pricing only after a visitor has understood the product. A dedicated formats page may show the preliminary model with a clear notice until final terms are approved.

## Brand and interface direction

- Palette: warm white, graphite, true black for deliberate contrast, and restrained lime.
- Character: confident, precise, modern, energetic, human.
- Strong typographic hierarchy and memorable editorial headlines.
- Rounded cards and controls, purposeful motion, clear focus states.
- Mobile-first usability; avoid desktop-only compositions.
- Motion must respect reduced-motion preferences.
- Visual polish must support clarity and conversion, not obscure the offer.

### 3D, shaders, and visual references

The visual references supplied for CRAFT are intended as implementation direction, not merely mood-board inspiration. The target is to bring their underlying visual techniques into the product while adapting them to CRAFT's identity rather than copying another site.

- **React Three Fiber / Three.js:** use for authored 3D scenes, objects, depth, and purposeful interactions.
- **ShaderGradient:** evaluate and use for animated shader-based gradient environments, lighting, and atmospheric color transitions.
- **Liquid Logo (collidingScopes/liquid-logo):** use its liquid-metal logo treatment as a reference for a CRAFT mark reveal or restrained brand-motion moment. The repository uses WebGL/GLSL fragment shaders, edge detection, vector fields, noise, and metallic shading. Prefer adapting the shader/material technique to CRAFT's actual logo asset rather than embedding the standalone tool or its dat.GUI/export UI into the public site.
- The liquid-metal treatment should use graphite, silver, near-black, and restrained lime reflections; it should feel premium and controlled, not like a generic chrome template.
- Combine these techniques selectively: for example, a distinctive 3D hero scene with a shader-gradient environment and a liquid-metal CRAFT logo reveal, then smaller visual moments in key sections where they reinforce the story.
- Keep typography, navigation, calls to action, and learning content readable and visually dominant where needed. Avoid effects that compete with the message.
- Build graceful fallbacks for unavailable WebGL, lazy-load heavy scenes, cap rendering cost/pixel density, and provide reduced-motion/static alternatives.
- Treat mobile performance and usability as release criteria, not later polish.
- Validate library compatibility against this app's actual Next.js 16 / React 19 / App Router setup before installing or upgrading dependencies. The ShaderGradient README documents React 18/19 support and an explicit Next.js 15 App Router + R3F 9 combination; Next.js 16 compatibility must be tested rather than assumed.
- Prefer free/open-source dependencies and do not introduce paid services or usage-based costs without explicit approval.

## Trust and claims policy

- Never fabricate student testimonials, employment outcomes, partner logos, instructor credentials, or enrollment numbers.
- Until student work exists, demonstrate product possibilities as clearly labeled educational concepts, not customer outcomes.
- Do not imply that a concept is a profitable or validated business without evidence.
- Do not claim a course is open for sale until curriculum, support capacity, pricing, and terms are confirmed.

## Launch guardrails

- Work in Preview and a dedicated feature branch.
- Do not merge to production or publish Production without explicit approval.
- Do not add paid services or incur costs without approval.
- Payments, legal pages, support operations, real program content, and production verification remain separate launch requirements.


## Ten-stage platform unification pass

This pass extends the dark-first CRAFT language beyond the homepage while preserving server actions, authentication, Supabase queries, enrollment rules, progress tracking, and staff permissions.

1. **Route and component audit** — reviewed public catalogues, detail routes, auth, dashboard, curriculum, lesson submission, and admin surfaces.
2. **Shared visual foundations** — aligned application controls, page surfaces, typography behavior, borders, and focus treatment to the existing CRAFT tokens.
3. **Mobile navigation** — kept homepage navigation visible with horizontal scrolling and corrected the sticky scroll-story offset; applied the same reachable pattern to catalog and format headers.
4. **Authentication forms** — standardized full-width, 16px mobile-safe fields, readable status messages, and consistent action sizing.
5. **Student workspace** — constrained project cards, empty states, and project creation controls to prevent narrow-screen overflow.
6. **Learning catalogue** — retained readable curriculum rows and progress presentation across mobile breakpoints.
7. **Lesson workspace** — made lesson content, assignment submission, feedback, and status actions adapt to a single-column mobile flow.
8. **Team workspace** — contained admin tables, allowed long learner responses and identifiers to wrap, and preserved horizontal table scrolling.
9. **Interaction accessibility** — retained visible keyboard focus, reduced-motion behavior, and hover-independent touch behavior.
10. **Regression guardrails** — added source-level tests for navigation, forms, table containment, motion preferences, and semantic navigation landmarks.

### Verification boundary

The code and source-level regression assertions above are committed to the working branch. They are not a substitute for executing the full test suite, a production build, browser screenshots, authenticated end-to-end journeys, or real iOS Safari / Android Chrome checks. Do not mark the visual redesign as release-ready until those checks have been run against the latest Preview. No production deployment is authorized by this pass.
