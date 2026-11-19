# CRAFT — visual references and implementation intent

The references supplied by the project owner are implementation direction, not merely a mood board. Adapt their techniques to CRAFT's identity and product truth; do not clone another website or embed another product's demo UI.

## 1. Visual art direction

The dark Apple product-page specification supersedes the earlier light-gallery direction as the main benchmark:
- Obsidian / near-black full-bleed product stages.
- Graphite and carbon secondary surfaces.
- Porcelain typography with precise, editorial hierarchy.
- Restrained CRAFT lime as the primary color accent.
- Silver and metallic 3D details used sparingly.
- Spacious page pacing, fine keylines, almost no heavy shadows and media corners near 28px.
- Selective pale sections as deliberate contrast resets, not as the default page canvas.

Preserve CRAFT's own identity. Do not copy Apple logos, product assets, proprietary fonts, Apple Blue or exact marketing copy.

## 2. Continuous scroll storytelling

The pasta / noodle-twirl reference demonstrates a continuous, staged transformation rather than unrelated animated sections. The CRAFT-specific story is:
1. Binary digits (0101) float in space.
2. The digits gather into a computer / monitor.
3. The computer morphs into a digital coin / digital asset.
4. The asset expands into a connected digital ecosystem.

Implementation requirements:
- One continuous 3D scene and one particle system where practical.
- Native scroll progress drives the transformation; scrolling upward reverses the same timeline.
- Russian-language DOM copy changes in sync with the current visual chapter.
- Essential text, navigation and calls to action never live only in WebGL.
- Mobile simplifies the composition without removing the narrative.
- Reduced-motion users receive a static, understandable composition and all four narrative chapters.
- Lazy-load the WebGL scene, cap DPR, prefer low-power rendering, unmount it offscreen, use demand rendering and dispose GPU resources.
- Never let motion block touch, keyboard access, reading or primary actions.

The TikTok video itself is not available in the current repository context. No shot-by-shot details are asserted or invented; implementation uses the explicit CRAFT story specification above.

## 3. 3D and shader references

React Three Fiber / Three.js:
https://github.com/pmndrs/react-three-fiber
Use the stable R3F v9 line for React 19. Keep WebGL client-only, lazy-loaded and separate from semantic content.

ShaderGradient:
https://github.com/ruucm/shadergradient
Use shader atmosphere selectively. The documented Next.js 15 integration does not prove Next.js 16 compatibility, so CRAFT uses a custom GLSL implementation rather than an unverified dependency.

Liquid Logo:
https://github.com/collidingScopes/liquid-logo
The liquid-metal surface informs CRAFT's restrained silver/lime material language. Do not embed the original tool UI/assets. The former sphere/wordmark treatment remains separate until reviewed for reuse.

## 4. Taste, UX, component and motion references

- Taste / product truth and intentional art direction: https://github.com/Leonxlnx/taste-skill
- UI/UX Pro Max / context-matched patterns and semantic tokens: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
- Vercel Web Interface Guidelines / source-level review: https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines
- shadcn/ui / open, inspectable, composable components: https://github.com/shadcn-ui/ui
- Design Motion Principles / restraint, polish and purposeful expressive motion: https://github.com/kylezantos/design-motion-principles
- Emil Kowalski / choreography, performance, mobile-native details, worst-case UI testing: https://github.com/emilkowalski/skills

These references are lenses, not competing design systems. Reuse the project's existing stack and CRAFT tokens; do not install unnecessary packages or copy another product's default look.

## 5. Codex and Claude Code workflows

Codex and Claude Code should use the same project constraints and review loop:
- Keep durable project instructions in AGENTS.md.
- Keep a Claude Code entry point in CLAUDE.md that imports the same source of truth rather than duplicating it.
- Scope work with the intended outcome, context, constraints and observable completion criteria.
- Inspect current source before editing.
- Validate with tests/build, inspect the diff, correct findings and repeat.
- Distinguish source review from rendered browser/device QA.
- Preserve human approval boundaries for Production, security, secrets and paid resources.

References:
- Codex best practices: https://learn.chatgpt.com/docs/learn/best-practices
- Claude Code best practices: https://www.anthropic.com/engineering/claude-code-best-practices
- Claude Code project memory and workflow files: https://claude.com/resources/articles/steering-claude-code-skills-hooks-subagents-and-more

## 6. Page hierarchy and acceptance rules

- Homepage: signature narrative, clear product promise, real areas to explore, human guidance, participation formats and one obvious next step.
- Catalogues and formats: editorial presentation, accurate scope and no unsupported guarantees.
- Learning and dashboard: task-focused, clear progress, forms and useful empty/error/locked states.
- Admin: efficient and predictable; no decorative 3D.
- Mobile: deliberate layouts at 320, 360, 390, 430, 768 and 1024 CSS px; no horizontal page overflow or clipped Russian text.
- Motion: no scroll hijacking, no animation-only information, reduced-motion fallback and explicit cleanup.

A passing build is necessary, not visual sign-off. Rendered desktop/tablet/phone checks and real iOS/Android validation remain separate acceptance gates.
