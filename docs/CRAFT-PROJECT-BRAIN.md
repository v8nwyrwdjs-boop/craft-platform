# CRAFT Project Brain

This is the project context index for humans and coding agents (including Codex and Claude Code). Read it before planning or changing CRAFT. It connects product intent, visual direction, technical architecture, the implementation roadmap and quality gates.

## Read in this order

1. Product strategy and offer model — docs/CRAFT-PRODUCT.md.
2. Design system and experience principles — docs/CRAFT-DESIGN-SYSTEM.md.
3. Visual references and implementation intent — docs/CRAFT-VISUAL-REFERENCES.md.
4. Architecture and technical constraints — docs/CRAFT-ARCHITECTURE.md.
5. Implementation roadmap — docs/CRAFT-ROADMAP.md.

Also consult README.md, roadmap.md, launch-readiness.md, docs/CRAFT-MOBILE-QUALITY-GATE.md and docs/CRAFT-VISUAL-EXCELLENCE.md where relevant.

## Project in one paragraph

CRAFT is a Russian-language platform for people worldwide who want to create digital products. It guides people from an idea through research, product decisions, prototype and iteration, with the learner's own project at the center. It combines practical learning, optional human mentorship and a separate done-for-you development service. The experience should feel like a premium creative-technology product: dark obsidian and graphite stages, precise porcelain typography, restrained lime accents, silver details, editorial spacing and purposeful motion — while remaining exceptionally usable on phones.

## Current verified baseline

The repository uses Next.js 16 App Router, React 19, TypeScript, Supabase Auth/SSR and PostgreSQL with RLS. The package manifest lists Next 16.4.6 and React 19.3.0. The product includes public pages and catalogues, account flows, student projects, a six-stage/18-lesson learning route, progress and text submissions, and a basic mentor/admin area. Payments are not implemented.

The active work branch is craft/visual-excellence. The homepage now uses a dedicated dark product-story visual foundation and a scroll-controlled R3F scene. Its particle forms transform from binary data into a computer, a digital asset and a connected ecosystem. See docs/CRAFT-ROADMAP.md for implementation and validation status.

The current visual implementation uses stable React Three Fiber v9 and custom Three.js GLSL; ShaderGradient itself was not added because Next.js 16 compatibility was not proven. The previous standalone liquid-metal hero component remains in the repository but is no longer mounted by the homepage.

## Non-negotiable constraints

AGENTS.md is authoritative for branch, security, cost, Production and quality guardrails. In short: only work on craft/visual-excellence; do not modify main, merge PRs or publish Production; do not incur costs or change secrets/infrastructure; preserve existing product/security behavior; prioritize mobile; do not fabricate claims.

## Decision hierarchy

When documents or implementation appear to conflict, use this order:
1. Explicit owner instructions in the current conversation.
2. Root AGENTS.md safety/repository guardrails.
3. Product and design intent in this Project Brain.
4. Current code and schema as the source of truth for what is implemented.
5. Existing roadmap and readiness docs for tracked status.

Do not interpret a future-state design description as proof that a feature exists. Mark uncertain compatibility and implementation status as unverified, then test.
