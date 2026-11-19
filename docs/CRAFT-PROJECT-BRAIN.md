# CRAFT Project Brain

This is the project context index for humans and coding agents (including Codex). Read this before planning or changing CRAFT. It connects the product intent, visual direction, technical architecture, current roadmap and quality gates so implementation decisions remain consistent.

## Read in this order

1. [Product strategy and offer model](CRAFT-PRODUCT.md) — who CRAFT serves, what it promises, product experience and commercial boundaries.
2. [Design system and experience principles](CRAFT-DESIGN-SYSTEM.md) — brand character, visual language, layout, motion, accessibility and responsive behavior.
3. [Visual references and implementation intent](CRAFT-VISUAL-REFERENCES.md) — the user's references and how their techniques should be adapted into CRAFT.
4. [Architecture and technical constraints](CRAFT-ARCHITECTURE.md) — current stack, app surfaces, data/security model and rules for introducing 3D.
5. [Implementation roadmap](CRAFT-ROADMAP.md) — recommended order of work and acceptance criteria.

Also consult the existing living documents:
- [README](../README.md) — setup, routes, current capabilities and technologies.
- [Technical roadmap](roadmap.md) — broader feature roadmap and current checkboxes.
- [Launch readiness](launch-readiness.md) — operational, legal, security and commercial launch blockers.
- [Mobile quality gate](CRAFT-MOBILE-QUALITY-GATE.md) — required viewports, routes and mobile acceptance criteria.
- [Visual excellence brief](CRAFT-VISUAL-EXCELLENCE.md) — original strategic and visual direction, including the reference techniques.

## Project in one paragraph

CRAFT is a Russian-language platform for people worldwide who want to create digital products. It guides people from an idea through research, product decisions, prototype and iteration, with the learner's own project at the center. It combines practical learning, optional human mentorship and a separate done-for-you development service. The experience should feel like a premium, modern creative-technology product: confident editorial typography, warm white and graphite surfaces, restrained lime accents, depth, purposeful motion and a distinctive 3D/ shader identity — while remaining exceptionally usable on phones.

## Current verified baseline (documentation snapshot)

The branch is `craft/visual-excellence`. The repository currently documents Next.js 16 App Router, React 19, TypeScript, Supabase Auth/SSR and PostgreSQL with RLS. The package manifest lists Next 16.4.6 and React 19.3.0. The existing product includes public pages/catalogues, account flows, student projects, a six-stage/18-lesson learning route, progress and text submissions, and a basic mentor/admin area. Payments are not implemented.

The current visual-excellence work has documented the desired R3F/Three.js, ShaderGradient and Liquid Logo direction. **These references are not evidence that the packages have been installed or the effects implemented.** Verify the current branch and files before assuming implementation status.

Earlier recorded automated checks and Preview builds are historical evidence only. Re-run checks against the current HEAD before relying on them. Physical-device QA and complete authenticated end-to-end validation remain open according to the existing quality and launch documents.

## Non-negotiable constraints

The root [AGENTS.md](../AGENTS.md) is the operational instruction file for Codex and other coding agents. It is authoritative for branch, security, cost, production and quality guardrails.

In short: only work on `craft/visual-excellence`; do not modify `main`, merge PRs or publish Production; do not incur costs or change secrets/infrastructure; preserve existing product/security behavior; prioritize mobile; do not fabricate claims.

## Decision hierarchy

When documents or implementation appear to conflict, use this order:
1. Explicit owner instructions in the current conversation.
2. Root `AGENTS.md` safety/repository guardrails.
3. Product and design intent in this Project Brain.
4. Current code and schema as the source of truth for what is actually implemented.
5. Existing roadmap and readiness docs for tracked status.

Do not interpret a future-state design description as proof that a feature exists. Mark uncertain compatibility and implementation status as unverified, then test it.
