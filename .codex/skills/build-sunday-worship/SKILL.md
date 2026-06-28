---
name: build-sunday-worship
description: Create, extend, restyle, or verify a complete 16:9 Sunday worship HTML presentation with songs, calls to worship, creeds, sermons, discussion questions, intercessions, the Lord's Prayer, offerings, announcements, welcome pages, benedictions, photos, animations, and global navigation. Use when Codex receives Chinese worship-service content such as song lyrics, prayer topics, sermon metadata, scripture, offering notices, announcements, or photos and must turn it into or add it to an interactive projector-ready HTML service deck.
---

# Build Sunday Worship

Build a projector-ready worship service whose pages feel like one coherent presentation, not unrelated web pages. Preserve the supplied Chinese content, use restrained motion, and verify every page at 16:9.

## Load the right references

- Always read [project-contract.md](references/project-contract.md) before editing an existing project.
- Read [content-model.md](references/content-model.md) when deciding sequence, page type, or pagination.
- Read [design-system.md](references/design-system.md) before creating or restyling visuals.
- Read [qa.md](references/qa.md) before final verification.

## Workflow

### 1. Inspect and normalize the input

Identify every supplied unit before writing code:

- service order;
- section type;
- exact title, lyrics, scripture, speaker, prayer items, or announcement content;
- requested images or local photo directory;
- requested position relative to existing sections.

Preserve wording. Normalize accidental whitespace and punctuation only when it does not change meaning. Do not silently rewrite lyrics, scripture, names, church-specific instructions, or theology. Keep an explicitly empty announcement section empty.

If the user supplies content incrementally, treat the existing `service.js` order as authoritative and insert at the requested point.

### 2. Build the service map

Create a page plan before implementation. For each section record:

```text
label | source file | content type | page count | visual idea | media needed
```

Follow the pagination rules in [content-model.md](references/content-model.md). Prefer one meaningful idea per page. Split long material instead of shrinking it below projector-safe sizes.

### 3. Choose the implementation path

Use the existing shared module when the page fits the standard two-column or centered layout:

- four-line song verses or choruses;
- creed or scripture text;
- prayer lists;
- title plus a symbolic visual;
- image-backed hero page.

Use a standalone section when the page needs behavior the shared module does not express cleanly:

- photo slideshows;
- two-column offering instructions and quotations;
- special layouts with their own transition logic;
- unusual media behavior.

Do not force a fragile design into the shared module merely to avoid a new file. Standalone sections must still implement the parent messaging protocol in [project-contract.md](references/project-contract.md).

### 4. Design the page system

Choose a visual metaphor from the content itself: cross, kingdom, light, road, shepherd, empty tomb, broken chains, home, vine, water, song, prayer, welcome, or blessing.

Apply [design-system.md](references/design-system.md). Essential rules:

- retain the dark, warm, cinematic worship atmosphere;
- keep text contrast strong;
- use one dominant metaphor per page;
- animate entrance, ambience, and one symbolic action;
- avoid busy, fast, or decorative motion unrelated to the words;
- use photographs as atmosphere without sacrificing lyrics.

When the user explicitly requests a generated raster image, use the available image-generation skill and save the final asset inside the project. Prefer HTML/CSS/Canvas for animated symbols and generated images for photographic or illustrative backgrounds.

### 5. Implement content pages

For shared-module sections:

1. Add an HTML file under `sections/`.
2. Load `../shared/module.css` and `../shared/module.js`.
3. Call `WorshipModule.mount({...})`.
4. Give every slide a title, eyebrow, lines, theme, and matching visual when useful.
5. Use `<br>` inside a long prayer item to create intentional two-line phrasing instead of allowing automatic font collapse.

For standalone sections:

1. Keep all page CSS and behavior self-contained unless it is genuinely reusable.
2. Implement forward/backward navigation and parent messages.
3. Respect reduced-motion preferences.
4. Avoid UI controls inside embedded sections; the shell owns navigation and progress.

### 6. Add media intelligently

For a local photo directory:

1. Enumerate every supported image.
2. Inspect dimensions and classify portrait versus landscape.
3. Alternate orientations when practical.
4. Render landscape images full-bleed with slow Ken Burns motion.
5. Render portrait images intact over a blurred fill of the same image.
6. Crossfade at the requested interval; default to 10 seconds.
7. Keep the lyrics in a stable safe area with text shadow or a user-approved background treatment.
8. Do not show photo counters unless requested.

Never reference a project image that remains only in a temporary or generated-image directory.

### 7. Register the section

Add each section to `service.js` in worship order:

```js
{ label: "回应诗歌", src: "sections/response-song.html", pages: 2 }
```

The declared `pages` value must equal the actual number of slides. Keep commas valid. Update obsolete commented placeholders to avoid duplicate labels.

### 8. Preserve global navigation

The shell must continue to support:

- click-left/click-right page navigation;
- ArrowLeft, ArrowRight, PageUp, PageDown, and Space;
- Home and End when implemented;
- clickable global progress navigation;
- direct jumps across sections;
- no visible focus rectangle on transparent click zones;
- accurate local and global page totals.

Do not alter this behavior unless the user asks.

### 9. Verify and iterate

Run the deterministic audit:

```powershell
python .codex/skills/build-sunday-worship/scripts/audit_worship.py <project-root>
```

Then follow [qa.md](references/qa.md). Use the in-app browser skill when available. Test at 1280×720 at minimum, inspect every new page, exercise section boundaries in both directions, and test the progress bar at the beginning, middle, and end.

Fix any text overflow, missing media, console error, incorrect page count, or visually weak metaphor before handoff.

## Input examples

Accept natural-language input. The user does not need to fill out a schema. Typical requests include:

```text
正式诗歌：《歌名》
歌词：……
放在正式诗歌 3 后面，每段一页。
```

```text
证道：丰盛的生命
经文：约翰福音 15:1–8
讲员：王牧师
证道后加讨论问题：……
```

```text
公祷：
1. 为教会服侍祷告
2. 为有需要的伙伴祷告
报告事项：留空
照片目录：photo，每 10 秒轮换
```

Infer the structure from these inputs and proceed. Ask a question only when a missing choice would materially change the worship order, wording, or output location.

## Completion report

Report:

- sections and pages added or changed;
- final total page count;
- important media paths;
- verification performed;
- any intentional assumption.

Keep the report concise. Do not claim visual verification if only static checks were possible.
