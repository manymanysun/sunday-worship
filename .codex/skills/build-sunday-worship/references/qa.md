# Verification Checklist

## Contents

- Static checks
- Browser checks
- Navigation checks
- Content checks
- Handoff

## Static checks

Run:

```powershell
node --check shared/module.js
node --check service.js
git diff --check
python .codex/skills/build-sunday-worship/scripts/audit_worship.py .
```

Confirm:

- every `service.js` source exists;
- every declared page count matches the section;
- local CSS, JS, and image references exist;
- no accidental duplicate service placeholders remain;
- UTF-8 Chinese text is intact.

## Browser checks

Start the project through a local static server. Use the in-app browser skill when available.

At 1280×720, inspect:

- each new page;
- longest lyric line;
- densest scripture or prayer page;
- every custom visual;
- portrait and landscape photo modes;
- image load state;
- console errors and warnings.

Measure bounding boxes when visual screenshots are unavailable. Treat any bottom beyond the viewport or horizontal scroll width beyond client width as overflow.

## Navigation checks

- Enter a new section from the previous section.
- Leave it for the next section.
- Navigate backward across both boundaries.
- Jump to the first, middle, and last page using the progress bar.
- Confirm local page number, global page number, section label, and active iframe source.
- Confirm clicking the progress end reaches the true last page.
- Confirm transparent left/right zones show no white focus box.

## Content checks

- Compare every supplied line against the source request.
- Confirm separator markers are not visible.
- Confirm repeated choruses remain present.
- Confirm names and scripture references.
- Confirm empty sections remain empty.
- Confirm generated or copied media lives inside the project.

## Handoff

Report only verified facts. Mention browser-policy or environment limitations when they prevented visual verification. Include clickable paths to major new section files or assets.
