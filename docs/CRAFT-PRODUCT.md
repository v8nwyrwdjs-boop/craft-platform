# CRAFT — product strategy

## Purpose

CRAFT helps Russian-speaking people around the world move from consuming information to creating their own digital products. The central outcome is not finishing a video course; it is making informed decisions and progressing on a real project.

The platform should make modern product creation feel understandable and achievable without pretending that success, revenue, employment or market demand is guaranteed.

## Audience and tone

- Primary audience: Russian-speaking aspiring makers, creators, founders and professionals who want to understand and build digital products.
- Geographic scope: Russian-speaking audience worldwide.
- The experience should be welcoming to beginners without talking down to experienced users.
- Voice: clear, energetic, intelligent, human, practical and honest. Avoid hype, empty motivational slogans, jargon without explanation and promises of fast money.

## What learners explore

The ecosystem may cover:
- SaaS and other digital products.
- Artificial intelligence and AI-assisted development.
- Automation and business workflows.
- Design, interfaces and creative technology.
- Media and content products.
- Blockchain and Web3.
- Agentic commerce and AI agents.

These are directions for learning and experimentation. Do not present every topic as a guaranteed business opportunity or claim demand/profitability without evidence.

## Learning philosophy

The learner's own project is the spine of the experience:
1. Find a problem, audience and context.
2. Form and assess a product hypothesis.
3. Research alternatives and test demand.
4. Define the first useful scope.
5. Prototype and build.
6. Test with real people, learn and plan the next iteration.

The programme currently documents six stages and 18 lessons. The canonical lesson source in code and database constraints must remain aligned. Before changing curriculum identifiers, inspect the shared curriculum source, server-side validation and Supabase migrations/tests together.

A direction or business concept is a starting point, not a mandatory template. Learners may adapt or replace it with their own idea.

## Human mentorship

Mentorship is an educational format:
- The learner owns and builds the project.
- The mentor helps reason through decisions, explains errors and trade-offs, reviews actual work and gives actionable feedback.
- The goal is to increase the learner's capability, not silently take over their project.
- Do not promise a response time or availability SLA until staffing and operations can reliably support it.

## Separate service: done-for-you development

Done-for-you is not a premium tier of the course. It is a separately scoped development service:
- CRAFT performs the agreed work.
- Handover should include the agreed deliverable, source code, documentation and operating instructions.
- Scope, milestones, revisions, support, warranty, third-party costs and intellectual-property terms need agreement before work begins.
- Never imply the customer is receiving mentorship when CRAFT is actually doing the development.

## Product formats and preliminary planning prices

| Format | Planning figure | Boundary |
|---|---:|---|
| Self-study | around 2,000 RUB per programme | Learner studies and builds independently. |
| With a mentor | around 10,000 RUB per programme | Learner builds; mentor advises, reviews and gives feedback. |
| Done-for-you | from around 40,000 RUB per project | CRAFT develops and hands over the agreed product. Separate service. |
| CRAFT CLUB | around 990 RUB/month | Concept: community, workshops, templates, group Q&A, discounts and early access. |

These are preliminary planning figures, not approved public terms, an active checkout or a promise that every format is currently available. The homepage should not display prices. The formats page may describe the model only with clear qualification until terms and delivery capacity are approved.

## Website information architecture

Current documented routes include:
- `/` — homepage and primary product story.
- `/directions`, `/directions/[slug]` — learning directions.
- `/products`, `/products/[id]` — product/business concept library.
- `/formats` — participation formats.
- `/register`, `/login`, `/forgot-password` — account flows.
- `/dashboard` — learner projects and personal workspace.
- `/learn`, `/learn/[module]` — programme and lessons, gated by enrollment.
- `/admin` — internal admin/mentor workspace.

Verify actual route files before changing this map.

## Homepage story

The homepage should answer in order:
1. What is CRAFT?
2. What could I create?
3. Why is the learning approach practical and human?
4. How does the path from idea to product work?
5. Which directions can I explore?
6. What is the next step?

The visual hero can be expressive, but the value proposition, navigation and primary call to action must remain immediately clear. Prices do not belong in the homepage hero or main homepage flow.

## Trust and claims

Never fabricate:
- Student testimonials, case studies or work presented as customer work.
- Employment, income, revenue, conversion or completion outcomes.
- Partnerships, customer logos, instructor credentials or learner counts.
- Guarantees, response-time promises or operational capabilities not verified.

Educational concept showcases must be labelled as concepts or examples, not real client results. A successful build or Preview deployment does not mean the service is ready for commercial launch.

## Not in current scope without owner direction

- Social media channels and campaigns.
- Payments, subscriptions and checkout.
- Commercial activation or a public sales promise.
- Legal commitments or publication of legal terms.
- New paid infrastructure or services.

Keep these items in readiness/roadmap documents; do not silently implement them.
