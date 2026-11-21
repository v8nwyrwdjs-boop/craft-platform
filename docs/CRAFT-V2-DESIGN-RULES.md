# CRAFT v2: design, copy and engineering rules

Owner decision, 2026-11-21: the owner handed the whole redesign to the agent ("rebuild the project the way you see it"), with one fixed point, the name **CRAFT**. This file records what that decision means in practice. It supersedes the dark-obsidian/lime direction in older docs (`CRAFT-APPLE-REFERENCE.md`, parts of `CRAFT-MASTER-SPEC.md`) for visual identity. It does **not** supersede the repository, release, secrets, cost and honesty rules in `AGENTS.md`.

## 1. The world

CRAFT is a foundry and a mint. Raw data is ore, small bricks are castings, and the things a learner ends up holding (a phone app, a coin, a set of words) are what gets cast. The same material runs through every surface: liquid metal, heat, cooled steel, pattern paper.

- Product mechanism, one sentence: the learner's own project is built piece by piece, with a mentor who checks every seam, or CRAFT builds it for them.
- Audience scene: one person, usually on a phone in the evening, with an idea and doubts about building it.
- Rut to avoid: the dark neon "learn AI" page and its pastel opposite.

### Persistent 3D object

One fixed canvas follows the visitor for the whole scroll. One `InstancedMesh` of about 9,000 bricks (about 5,200 on weak devices) morphs between shapes:

1. binary digits, 2. a phone with code on its screen, 3. a coin with the CRAFT emblem (a hexagon-C, deliberately not a Bitcoin lookalike), 4. the intro paragraph itself, as bricks sitting exactly on the DOM text, 5. product names (the same bricks, reassembled into the headings below), 6. ambient dust, 7. the CRAFT wordmark at the foot of the page.

Rules: native scroll only (no scroll hijack, no pinning of the whole page); chapter copy stays in the DOM; the canvas is `aria-hidden`; every chapter has a static fallback (no WebGL, reduced motion, Save-Data); the render loop pauses when the tab is hidden; DPR is capped and an adaptive governor lowers brick count or DPR on slow frames. A visible "Движение" switch lets the visitor stop all non-essential motion.

### Liquid metal

Shine is real shading (a WebGL liquid-metal material: height from a blurred mask, normals, a procedural studio environment, slow noise warp, faint iridescence, glints), never a CSS `linear-gradient`. It is used for the logo everywhere (header, hero, footer) and for a few display words. All liquid elements render in the same single WebGL context as the bricks. The DOM text stays as the accessible, selectable fallback.

## 2. Tokens

Colour is OKLCH, neutrals are tinted, no `#000`/`#fff` outside token blocks. Chapters change the ground colour by scroll; text colour is fixed per section so contrast never depends on animation timing.

| Token | Value | Use |
| --- | --- | --- |
| `--ground-void` | `oklch(0.145 0.014 268)` | default ground, hero |
| `--ground-steel` | `oklch(0.205 0.045 262)` | phone chapter |
| `--ground-ember` | `oklch(0.175 0.03 48)` | coin chapter |
| `--ground-chalk` | `oklch(0.935 0.01 250)` | one light chapter, after the story |
| `--heat` | `oklch(0.70 0.19 38)` | the single accent: primary action, a few bricks |

The accent stays under about 5% of any viewport. Light is not "cream plus serif plus terracotta" (a known generated look): the light chapter is cool chalk and the display face is a sans.

Type (self-hosted, `public/fonts`, `font-display: swap`, metric-matched fallbacks, only used weights):

- Display: **Geologica** variable. Argument: Cyrillic-native variable family with a sharpness axis; at heavy weights the cut corners read as stamped metal, and the sturdy strokes survive being rebuilt out of bricks.
- Text: **Onest** variable. Code only: **JetBrains Mono**. Three families, no more. Mono is never used as a "technical" costume on labels.
- Scale: body 16px minimum, 1.5 to 1.65 line height (more on dark), measure 45 to 75ch, display at most 6rem, tracking not below -0.04em, `text-wrap: balance` on headings and `pretty` on prose.

## 3. What the page must not look like

Distilled from Impeccable (pbakaus) and Hallmark (Nutlope), read as reference only. A tell is fixed by rewriting the element, not by softening it.

Floor (never ship):
- A small label above a heading (eyebrow, kicker, ordinal, category tag). Open the section another way: the heading announces itself, a caption below, a change of ground, a real `<ol>`.
- Gradient text; purple-to-blue or cyan-on-dark gradients anywhere; glow/aurora blobs behind text.
- Cards inside cards; three equal icon-over-heading tiles as page structure; a one-sided coloured stripe on a box.
- Tracked small-caps labels, mono as a costume, an arrow glued to link text, middle-dot meta strings, decorative status dots, `01 / 06` counters, scroll cues, version badges.
- An emoji or a Unicode glyph as an icon. One icon style only.
- An invented metric, testimonial, logo, guarantee or response time. A missing fact is a visible text slot or nothing.
- A form that prints success without a request behind it.
- Content hidden at rest that needs JavaScript to appear. Reveals start visible or sit under a `.js` class.
- Horizontal scroll at 320 to 1920. A hero sized in `vh` (use `svh`/`dvh`). Text under 12px.
- `transition: all`, animating width/height/top/left, bounce or overshoot easing on UI, a focus ring that fades in, motion without a reduced-motion path, moving content with no way to pause it.

Reflex (a real reason, stated in code comments, may overrule): one identical entrance on every section; the same hover on every card; an "AI nav" (wordmark left, links, button right, hairline) and a four-column footer; a stock email-signup close; the hero, three features, call to action template. Prefer one authored scroll story, then different compositions for later sections (an index, a statement, a short list), with different gaps between them.

Browser surfaces are themed too: selection, caret, focus ring, scrollbar, underline offset, tabular numerals.

## 4. Copy rules (Russian)

Write the way the owner would say it across a counter: our own nouns (проект, наставник, направление, сборка, кирпич, монета), a number we can prove, the verb a learner would use.

- Swap test: if a line fits any other school, rewrite it with a noun only CRAFT has. Three tests per line: can the reader picture it, could it be proven false, could only we say it.
- Budget: headline 7 words or fewer; section heading 6 or fewer; one-line subhead (12 words or fewer); paragraph of two short sentences; about 80 words in any 900px window; the home page near 450 words in total.
- Section headings say what the visitor gets or sees, never a category label (not «Преимущества», «О нас», «Почему мы»).
- Ground a term before leaning on it (Web3, MVP, агентная коммерция get one plain line the first time).
- One pun per page at most. Verbs over adjectives. No triads of adjectives.
- Stop-list: «раскройте потенциал», «погрузитесь в мир», «инновационные/передовые решения», «уникальная возможность», «революция», «будущее уже здесь», «всё, что нужно для», «не просто X, а Y» and its rebuttal cadence, «путь/путешествие» as a metaphor for lessons, «бесшовный», «мощный», «безграничные возможности», «присоединяйтесь к сообществу», stock second buttons («Узнать больше»).
- Punctuation: «ёлочки», `…`, a non-breaking space before units and short prepositions, no dash-led rhythm (use a comma, a colon or a full stop; keep the dash for real grammar only).
- Buttons name the action («Выбрать направление», «Сохранить в проекты»). Errors say what happened, why if known and what to do; no «Упс», no exclamation marks. Empty states say what is empty, why it matters, one action.
- Honesty (from `AGENTS.md`): no prices on the home page; formats and prices are preliminary planning figures, qualified, on `/formats` only; no income promises; concept pages stay labelled «Демонстрационная бизнес-гипотеза»; CRAFT CLUB is a concept, not a live service; the coin is a symbol, not a token for sale.

## 5. Motion

- One earned scroll pattern per page: the persistent 3D story. Everything else is reveal-once, press feedback and state change.
- Never on body text. Motion has a job (continuity, state, causality) or it goes. Exponential ease-out from a visible default; transform and opacity first.
- Every animation has cleanup, interruption behaviour and a static alternative. Shader time stops when the tab is hidden or the canvas is off-screen.
- Moving content responds to scroll, not to a timer, or has a pause control.

## 6. Engineering discipline

From Ponytail, Matt Pocock's skills and everything-claude-code, adapted to this repo:
- Smallest complete change. Reuse before adding; no abstraction, option or wrapper nobody needs. Pure generators stay in `lib/` without `three` imports so Node tests can run them.
- New non-trivial logic gets a test (shape generators, catalogue integrity, safe paths). Security tests are never weakened.
- Verification loop before every commit: `npm run test:security`, `npx tsc --noEmit`, `npm run build`, grep for secrets and stray `console.log`, read the diff against these rules.
- Review in two axes: standards (this file, `AGENTS.md`) and spec (the owner's request). Flag smells as judgement calls (duplication, speculative generality, shotgun surgery).
- The final report says what was skipped or could not be checked.

## 7. Security review checklist (guidance mode of Cloudflare's security-audit skill)

Run as a focused source review, read-only, no live probing, dummy data only:
- Browser sessions: cookie-authenticated mutations (Server Actions, route handlers) have an effective Origin/same-site check; `return_to`/`next` values pass an allow-list (`lib/safe-internal-path.ts`); sessions end on logout.
- Authorization: roles are read from trusted `app_metadata.role` on the server; every owner-scoped query binds the authenticated user; RLS policies match application filters (`schema-rls.test.mjs`).
- Client side: no `dangerouslySetInnerHTML` with user data; no `postMessage` sinks; storage holds only harmless preferences (motion switch).
- Supply chain: the repo has no lockfile (open finding; owner decision needed, see roadmap); no new dependencies for this redesign.
- Deployment: CSP stays `default-src 'self'`; fonts and the WebGL scene are same-origin; secrets never appear in source, logs or docs.
- Resource use: render-loop cost is bounded (brick count, DPR, governor, pause when hidden).

## 8. Sources

Read as reference text, none of their scripts or installers were executed: `pbakaus/impeccable`, `Nutlope/hallmark`, `wheresryan22/anatomy` (principles: the object is the explanation, parts before geometry, nothing pops, check at close range), `DietrichGebert/ponytail`, `mattpocock/skills`, `cloudflare/security-audit-skill`, `WorldFlowAI/everything-claude-code`. Their detectors and linters were not run here; any "audit" in this repo's docs is a source review by the agent unless stated otherwise.
