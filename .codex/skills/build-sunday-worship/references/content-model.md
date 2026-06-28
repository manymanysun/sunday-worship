# Content and Pagination

## Contents

- Worship order
- Page-type rules
- Pagination heuristics
- Text integrity
- Natural-language input model

## Worship order

Honor the user's order. A common flow is:

1. cover;
2. quiet song;
3. call to worship;
4. formal worship songs;
5. creed;
6. sermon and discussion;
7. response song;
8. intercessory prayer;
9. Lord's Prayer;
10. offering;
11. announcements;
12. welcome;
13. benediction;
14. welcome or closing song.

This is a default, not a rule. Never reorder explicit user instructions.

## Page-type rules

| Content | Preferred layout |
|---|---|
| Song verse/chorus | 3–5 short lines plus matching visual |
| Creed/scripture | centered wrapping text, usually 4–6 statements |
| Sermon title | image hero with title, passage, speaker |
| Discussion | same sermon background, large question |
| Prayer topics | numbered items, intentional line breaks, symbolic or empty right side |
| Lord's Prayer | centered scripture layout |
| Offering | two columns: guidance and scripture |
| Empty announcements | title plus blank notice surface |
| Welcome | warm illustration or blessing visual |
| Photo song | full-bleed/portrait-aware slideshow plus stable lyrics |

## Pagination heuristics

- Use one verse or chorus per page when it contains 3–5 lines.
- Keep repeated choruses when the user supplied them; do not deduplicate without instruction.
- Split creed or long prayer text at theological or grammatical boundaries.
- Keep a sermon title and its discussion question on separate pages.
- Use two columns for one-page dense offering material.
- Prefer another page over lyrics smaller than about 26 px at 1280×720.
- Prayer lists may use about 30–34 px when each numbered item is intentionally broken into two lines.
- Scripture can use about 35–40 px when wrapping naturally.
- Photo-backed lyrics may be about 30–33 px with strong text shadow.

## Text integrity

- Preserve names, church names, speaker names, book/chapter references, and translation labels.
- Preserve the user's repeated lyrics.
- Convert arbitrary repeated spaces into normal spacing.
- Replace separator markers such as `---` with page boundaries, not visible text.
- Use Chinese punctuation consistently only when meaning remains unchanged.
- Do not invent missing announcement content.
- If a blessing page lacks supplied wording, a short generic blessing may be used only when clearly presented as an assumption; title-only is safer.

## Natural-language input model

Internally normalize input to:

```yaml
service:
  - type: song
    label: 正式诗歌 3
    title: 歌名
    position: after 正式诗歌 2
    blocks:
      - label: 第一段
        lines: []
    media: optional
  - type: sermon
    title: 丰盛的生命
    scripture: 约翰福音 15:1–8
    speaker: 王牧师
  - type: intercession
    items: []
```

This is an internal reasoning model. Do not require the user to provide YAML.
