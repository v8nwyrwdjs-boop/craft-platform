# CRAFT Master Specification

> Canonical product, design, 3D-storytelling and engineering brief. Read this document together with `AGENTS.md` and the linked product/architecture/quality documents before substantial work. This is a living specification: implementation status belongs in the roadmap, not inferred from this target-state description.

## 1. Mission

CRAFT is a Russian-language platform for people worldwide who want to move from an idea to a working digital product. The learner's own project is central; lessons are a means, human mentorship is guidance, and done-for-you development is a separate service.

Build a coherent, premium creative-technology product—not a generic AI template, decorative landing page, or technology demo. The site should be memorable, useful, technically reliable, and genuinely usable on phones.

## 2. Decision hierarchy

1. Explicit owner instructions in the current conversation.
2. Repository guardrails in `AGENTS.md`.
3. This master specification and the product/design documents.
4. Existing code and database schema as the source of truth for implemented behavior.
5. Roadmap and status documents.

Do not treat target-state concepts as already implemented. Preserve existing functionality, security, authentication, authorization, RLS, and product boundaries.

## 3. Brand and art direction

- Deep black, obsidian and graphite as primary cinematic surfaces.
- Precise porcelain-white typography.
- Restrained lime/green accents and silver/metallic highlights.
- Editorial typography, confident spacing, strong hierarchy and deliberate negative space.
- Realistic, carefully lit 3D objects with convincing geometry, materials, reflections and micro-detail.
- Rounded forms only when purposeful; restrained borders and shadows.
- Distinctive CRAFT identity; Apple Dark product-showcase quality is an ambition, not a template to copy.
- Every visual element must explain the product, support navigation, establish atmosphere or carry a deliberate narrative moment.

Avoid generic AI layouts, repetitive card grids, arbitrary gradients, glassmorphism everywhere, random decoration, cheap shadows, stock-template aesthetics, pointless animation, and visual noise.

## 4. Homepage: five-chapter scroll-driven 3D story

The homepage tells one educational product story through five chapters:

1. **Programming:** readable binary digits and structured code become the foundation of a digital object. Explain how code, algorithms and logic become software, interfaces and tools.
2. **Digital products and business:** the code's physical structure assembles into a detailed monitor/device. Explain websites, apps, platforms, services and digital businesses.
3. **Cryptocurrency and digital assets:** device components reorganize into a physically convincing engraved metal coin. Explain blockchain, cryptocurrencies, tokens, digital assets and distributed networks accurately.
4. **Ecosystem:** coin components redistribute into a coherent spatial network of meaningful nodes, links and connected systems. Explain how products and technologies interact.
5. **CRAFT catalogue:** the ecosystem resolves into a useful entry point to real CRAFT directions, products, tools and learning.

Text, progress indicator, scene and calls to action must form one coherent composition. The narrative copy remains accessible in the DOM and usable without WebGL.

## 5. 3D quality: replace the particle-cloud model

The previous 1,800-point morph is not the target architecture. It makes binary copy unreadable, lets points spill beyond object silhouettes, and dissolves forms into visual noise. Do not continue polishing that technique as the primary object-construction method.

Each model should be built from hundreds of meaningful, authored components; aim for roughly 500–1,000+ geometric details where justified by the object and performance budget. Detail must be structural or materially meaningful: panels, fasteners, ribs, machined edges, internal mechanisms, engraved elements, connectors, layered surfaces and carefully designed subassemblies.

No arbitrary particle clouds, detached debris, stray digits or decorative fragments outside the model silhouette. Any detached component must have a deliberate mechanical or narrative purpose and a designed trajectory.

Do not create 1,000 heavyweight independent draw calls. Use `InstancedMesh`, merged `BufferGeometry`, shared materials, hierarchical groups, LOD and optimized shaders where appropriate. Count meaningful visual components, not React elements or draw calls.

### Physical object standards

- **Binary/code:** digits must remain legible and organized into designed typographic/structural forms.
- **Monitor:** accurate silhouette, refined enclosure, screen stack, stand, ports, seams, fasteners and believable internal construction.
- **Coin:** credible thickness, milled edge, engraved relief, concentric machining, micro-surface variation, fine scratches, realistic metal response and studio reflections. Use the actual CRAFT brand mark when an approved asset is available; do not invent an official logo.
- **Ecosystem:** intentional nodes, connectors, hubs, rings and depth relationships; no random sphere-and-line cloud.
- **Catalogue:** a clear transition to functional navigation, not fake product cards or invented capabilities.

## 6. Continuous component-to-component transformation

The five forms must not simply fade in and out. Build a deterministic component correspondence system.

Each reusable component/instance needs authored source and destination transforms (position, rotation and scale), plus a designed interpolation path and optional staged visibility. Component trajectories must be stable and reversible.

Examples:
- Code structures become monitor frame, screen, stand and internal components.
- Monitor panels, fasteners and internal assemblies separate and reorganize into coin body, rim, engraving and machined details.
- Coin components redistribute into ecosystem hubs, links and nodes.
- Ecosystem components arrange into the catalogue's final visual/navigation structure.

Scroll progress controls a single normalized story timeline. Users can pause at any point, scrub forward or backward, and see a stable in-between state. No random motion, popping, flicker, arbitrary dissolve-to-dust or discontinuous stage switching.

Use deterministic data generation only where it creates authored repeatable components; randomness must never make geometry appear accidental.

## 7. Scene composition follows the story

The 3D composition must not remain a static object pinned at the center. Across the chapters it should move relative to the text, change scale, orientation, camera framing, depth and visual emphasis. It may move left/right, come forward or recede, and occasionally share the foreground with editorial copy.

Text and 3D must be art-directed as one responsive composition. Avoid clipping important content or making the object compete with the copy.

## 8. Motion and interaction

- Native page scrolling remains in control; never hijack wheel/touch scrolling.
- Scroll drives a reversible, continuous timeline.
- Smooth camera and object movement; no forced scroll snapping.
- Optional direct object inspection/rotation only when it does not interfere with page navigation.
- Respect `prefers-reduced-motion`; provide a meaningful static or simplified story.
- Keep semantic text, navigation and calls to action outside the WebGL canvas.
- Pause or reduce rendering when the scene is offscreen or inactive.

## 9. Mobile-first delivery

Mobile is a first-class art direction, not a scaled desktop scene. Design a dedicated portrait composition and preserve the five-chapter story. Text must remain readable, navigation reachable, touch targets practical, and the scene performant on mobile GPUs.

Quality gate widths: 320, 360, 390, 430, 768 and 1024 CSS px. Check no horizontal overflow, clipped Russian text, obscured controls, unsafe sticky offsets or keyboard/safe-area issues. Test real iOS Safari and Android Chrome when available; do not claim device QA if not performed.

Use adaptive DPR, geometry/instance budgets, LOD, lazy loading, shared materials, demand rendering and graceful WebGL fallbacks. Reduced-motion and WebGL-unavailable states must remain useful.

## 10. Product-wide consistency

The same design language must extend across homepage, catalogue, directions, learning, lessons, authentication, student dashboard and admin. Maintain a coherent token system, typography, spacing, controls, focus states, responsive behavior and component quality.

The homepage may be the most cinematic surface, but the rest of the product must not feel like an unrelated template.

## 11. Content truth and offer boundaries

Explain programming, digital products, SaaS, AI, automation, design, media, blockchain/Web3 and connected ecosystems accurately.

Never invent testimonials, student outcomes, customer logos, credentials, metrics, guarantees, validated business results, product capabilities or live commercial availability. Do not present planning prices as approved public terms. Do not imply guaranteed income or business success. Respect the existing product positioning and offer boundaries in `AGENTS.md` and `docs/CRAFT-VISUAL-EXCELLENCE.md`.

## 12. Technical architecture

Preserve the existing Next.js App Router, React 19, TypeScript, Supabase and React Three Fiber architecture unless a migration is justified and approved.

Preferred 3D stack: Three.js and React Three Fiber; use Drei or GLSL selectively where they solve a real need. Validate compatibility with the actual dependency versions before adding packages. Prefer free, maintained, license-compatible dependencies. No paid services or usage-based costs without approval.

Separate:
- chapter/story progress and semantic content;
- authored model component definitions;
- component correspondence and transform interpolation;
- scene composition/camera choreography;
- material and lighting systems;
- rendering/performance policies.

Avoid unnecessary React rerenders in frame loops. Keep high-frequency transforms in refs/Three objects. Dispose geometries, materials, textures, render targets and environment resources correctly. Prevent hydration mismatch and global side effects.

## 13. Engineering and repository guardrails

Follow `AGENTS.md` as authoritative:
- Work only on `craft/visual-excellence`.
- Never modify `main`, merge PRs or publish/promote Vercel Production.
- Do not change secrets, keys, infrastructure variables, Supabase settings, DNS, SMTP, billing or access controls without explicit approval.
- Do not add paid services or incur costs.
- Do not activate payments or make legal/commercial commitments without approval.
- Preserve existing product, auth, authorization, validation and security behavior.
- Never put secrets in source, docs, prompts, screenshots or client bundles.

Before editing, inspect current code, relevant docs and branch state. Make small coherent changes, review the diff, update docs and record actual validation.

Required checks where available:
- `npm run test:security`
- `npm run build`
- relevant responsive and reduced-motion checks
- real browser/device checks for visual sign-off when the environment permits.

Never claim a test, build, preview, browser check or device check passed unless it was actually executed and observed.

## 14. Reference projects

Use these as research lenses, not templates:
- OrfeoAI: https://www.orfeoai.com/ — study scroll storytelling, spatial composition, text/visual choreography and transitions; do not copy its identity.
- Taste skill: https://github.com/Leonxlnx/taste-skill
- UI/UX Pro Max: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
- Design motion principles: https://github.com/kylezantos/design-motion-principles
- Vercel agent skills: https://github.com/vercel-labs/agent-skills
- shadcn/ui: https://github.com/shadcn-ui/ui
- Emilkowalski skills: https://github.com/emilkowalski/skills

Apply relevant ideas to CRAFT's product context, stack, accessibility and design system. Do not copy layouts or add dependencies merely because a reference uses them.

## 15. Autonomous execution expectations

The owner expects the AI developer to make routine design and engineering decisions independently, using this specification and repository documents. Do not ask repeated questions when the intent is clear. Choose the strongest option for visual quality, usability, reliability, mobile performance and maintainability.

Do not substitute advice for implementation when repository tools are available. Do not promise a complete system in one step. Deliver coherent increments, preserve working functionality, validate what can actually be validated, and report exact files, commits, checks and remaining work.

## 16. Definition of done

CRAFT is not done merely because it builds. Acceptance requires:
- a distinctive coherent brand and high-quality editorial interface;
- physically convincing, highly detailed authored 3D models;
- a stable reversible component-level transformation across all five chapters;
- meaningful movement of the scene with the narrative and text;
- a functional catalogue transition;
- readable accessible copy independent of WebGL;
- excellent mobile composition and performance;
- reduced-motion and WebGL fallbacks;
- product-wide visual consistency;
- truthful content and no fabricated proof;
- successful automated checks and real visual QA appropriate to the release.

**Core principle:** CRAFT is a visual story about creating digital products, expressed through real geometry, meaningful motion and a useful product experience—not an effects demo.
