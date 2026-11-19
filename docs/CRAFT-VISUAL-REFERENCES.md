# CRAFT — visual references and implementation intent

The references in this document were supplied by the project owner with the explicit intention that their visual techniques should be brought into CRAFT. They are implementation direction, not merely optional mood-board inspiration. Adapt the techniques to CRAFT's identity; do not clone another website or embed a reference project's demo UI.

## 1. React Three Fiber / Three.js

Reference: https://github.com/pmndrs/react-three-fiber

Intent:
- Declarative React renderer for Three.js.
- Use for authored 3D objects, scenes, lighting, depth and purposeful interactions.
- Likely first application: a distinctive CRAFT homepage hero scene.

Implementation guardrails:
- The documented app baseline is React 19. Use the stable React Three Fiber v9 line for React 19; do not adopt an alpha major version without explicit technical justification.
- Evaluate `three`, `@react-three/fiber` and selected `@react-three/drei` helpers only after inspecting the current lockfile and testing compatibility.
- Keep the Canvas client-only and lazy-loaded where appropriate.
- Never put essential text, navigation or CTA only inside WebGL.
- Provide a static fallback and reduced-motion behavior.
- Limit device pixel ratio, scene complexity and animation work on mobile.

## 2. ShaderGradient

Reference: https://github.com/ruucm/shadergradient

Intent:
- Use animated shader gradients to create atmospheric color, light, depth and a living environment around the CRAFT hero.
- Use selectively in key visual moments; do not place a distracting animated gradient behind every section.

Compatibility caution:
- The library README documents React 18/19 support and an explicit Next.js 15 App Router + R3F 9 combination.
- CRAFT's documented baseline is Next.js 16 App Router and React 19. Next.js 16 compatibility is not established by the reference alone. Test in an isolated branch/local environment before adopting it.
- If compatibility or performance is poor, implement a smaller custom shader or CSS/WebGL alternative only if it is maintainable and accessible; do not force a dependency into the app.

## 3. Liquid Logo

Reference: https://github.com/collidingScopes/liquid-logo

Intent:
- Use the liquid-metal treatment as inspiration for a distinctive CRAFT logo reveal or restrained brand-motion moment.
- The referenced project describes client-side WebGL, GLSL fragment shaders, edge detection, vector fields, noise and metallic shading, with a logo-image input and export tooling.
- Adapt the material/shader technique to the actual CRAFT logo asset and brand palette.

Visual treatment:
- Graphite, silver, near-black and restrained lime reflections.
- Premium, controlled liquid metal rather than generic chrome.
- Keep the logo recognizable and legible.
- Prefer a short reveal or intentional transition over a permanently animated logo that drains battery or distracts.

Do not:
- Embed the reference tool's standalone editor, dat.GUI controls or export interface into the public CRAFT site.
- Assume the tool's implementation can be dropped into Next.js without adaptation.
- Copy assets or code without checking the license and attribution requirements.
- Introduce a separate animation system if a lightweight custom treatment can achieve the effect safely.

## Combined visual direction

A potential signature composition:
1. A readable DOM-based CRAFT hero headline and CTA.
2. A lazy-loaded 3D scene built with React Three Fiber.
3. ShaderGradient atmosphere and lighting, if compatibility is verified.
4. A liquid-metal CRAFT logo reveal integrated into the scene or a separate brand moment.
5. A graceful poster/static version for reduced-motion, unsupported WebGL and low-power devices.

The composition should feel like CRAFT, not a technical demo. The 3D should support the story of moving from idea to product — for example, forms assembling, connecting or resolving into a clear product-oriented visual metaphor. Choose a visual metaphor only after inspecting the current brand assets and hero content.

## Adoption checklist

Before installing:
- [ ] Confirm current branch and clean working tree.
- [ ] Inspect Next.js, React, TypeScript, bundler and lockfile versions.
- [ ] Check package maintenance, license, peer dependencies and known Next.js 16 issues.
- [ ] Build a minimal isolated proof of concept before wiring into the main homepage.
- [ ] Check SSR/client boundaries and hydration.
- [ ] Check mobile GPU cost and reduced-motion fallback.
- [ ] Confirm no paid account, API, asset subscription or usage-based service is required.

Before accepting:
- [ ] First content and CTA are visible without waiting for WebGL.
- [ ] No hydration or console errors.
- [ ] Static fallback looks intentional.
- [ ] Reduced motion disables or substantially simplifies animation.
- [ ] No horizontal overflow or clipped content at required widths.
- [ ] Scene does not block scrolling, keyboard navigation or touch.
- [ ] Performance is acceptable on a mid-range mobile device.
- [ ] No production deployment is triggered.
