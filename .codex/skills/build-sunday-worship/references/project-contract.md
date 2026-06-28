# Project Contract

## Contents

- Discovery
- Shell and service registry
- Shared sections
- Standalone sections
- Parent messaging
- Media paths

## Discovery

Treat a directory as a compatible worship project when it contains:

```text
index.html
service.js
shared/module.css
shared/module.js
sections/
```

Inspect these files before editing. Preserve unrelated user changes and existing visual behavior.

## Shell and service registry

`index.html` owns global navigation, two iframe slots, cross-section transitions, labels, and the clickable progress bar.

`service.js` defines worship order:

```js
window.WORSHIP_SERVICE = [
  { label: "首页", src: "sections/cover.html", pages: 1 },
  { label: "正式诗歌 1", src: "sections/song.html", pages: 4 }
];
```

`pages` is mandatory because the shell uses it for global totals and progress jumps.

## Shared sections

Shared sections load `module.css` and `module.js`, then call:

```js
WorshipModule.mount({
  title: "歌名",
  sectionLabel: "回应诗歌",
  theme: "vine",
  visual: "vine-life",
  accent: "#c9d786",
  accentSoft: "rgba(123, 153, 76, 0.22)",
  particle: "#e7d79b",
  slides: [
    {
      title: "住在主里面",
      eyebrow: "第一段",
      lines: ["第一行", "第二行", "第三行", "第四行"]
    }
  ]
});
```

Useful slide modes:

- default: copy plus right-side visual;
- `mode: "scripture"`: centered, wrapping text;
- `image`: full-bleed hero image;
- `variant`: optional hero-copy styling;
- `theme` and `visual`: per-slide overrides.

The shared module automatically animates lines, fits no-wrap lyrics horizontally, draws ambient particles, and announces state to the shell.

## Standalone sections

Use one root stage and one `.slide` per page. Hide embedded controls. Implement:

- local page state;
- forward/backward stepping;
- boundary notification;
- `worship:go` direct navigation;
- `worship:ready` and `worship:state` messages.

Do not place click targets above the shell's progress footer.

## Parent messaging

Child receives:

```js
{ type: "worship:navigate", delta: 1 }
{ type: "worship:go", index: 3 }
{ type: "worship:go", position: "last" }
{ type: "worship:ping" }
```

Child sends:

```js
window.parent.postMessage({
  type: "worship:ready", // or worship:state
  title: document.title,
  sectionLabel: "公祷",
  current: 0,
  count: slides.length
}, "*");
```

At an edge:

```js
window.parent.postMessage({
  type: "worship:boundary",
  direction: delta > 0 ? 1 : -1,
  title: document.title
}, "*");
```

## Media paths

- Put reusable images in `assets/`.
- Keep user photo collections in their supplied directory, commonly `photo/`.
- Resolve paths relative to the section HTML, usually `../assets/...` or `../photo/...`.
- Use UTF-8 filenames safely in quoted JavaScript strings.
- Verify every referenced asset through the local server.
