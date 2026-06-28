# Visual Design System

## Contents

- Core tone
- Typography
- Color and depth
- Layouts
- Motion
- Visual metaphor library
- Photography
- Accessibility

## Core tone

Create a reverent, cinematic, warm presentation. Combine dark blue, charcoal, brown, muted teal, and warm gold. Use light as the main emotional device.

Avoid:

- neon UI styling;
- fast particles or spinning decoration;
- unrelated icons;
- multiple competing metaphors;
- excessive glass cards;
- small body text.

## Typography

- Chinese lyrics and scripture: `Noto Serif SC`, `Songti SC`, `SimSun`, then `Microsoft YaHei`.
- UI labels and eyebrows: `Microsoft YaHei`, sans-serif.
- Lyrics: approximately 30–48 px depending on line length.
- Titles: approximately 40–96 px depending on page type.
- Eyebrows: 10–13 px with increased letter spacing.
- Use text shadow over images; avoid thick outlines.

Never rely only on automatic shrink. Add intentional `<br>` or another page when text becomes too small.

## Color and depth

Base background:

```css
background:
  radial-gradient(circle at 78% 28%, rgba(244,214,142,.22), transparent 29vw),
  radial-gradient(circle at 18% 84%, rgba(86,137,159,.2), transparent 38vw),
  linear-gradient(145deg, #071017, #18313b 52%, #322517);
```

Use:

- cream `#fff8e7` for main text;
- warm gold around `#e8c77d` for accents;
- muted teal around `#7aaeb4` for secondary glow;
- coral or burgundy sparingly for love, heart, or sacrifice.

## Layouts

Standard slide:

- 16:9 full viewport;
- copy on the left, visual on the right;
- generous outer padding;
- footer-safe bottom area for the shell progress bar.

Centered scripture:

- maximum width around 980 px;
- left-aligned paragraphs inside a centered column;
- 1.55–1.65 line height.

Hero:

- full-bleed image;
- strong dark gradient behind copy;
- keep the key subject away from the title area.

## Motion

Use three layers of motion:

1. page transition: 600–900 ms fade/translate;
2. text entrance: staggered 80–120 ms per line;
3. ambient loop: 3–12 seconds, subtle and content-related.

Good examples:

- light breathing;
- road glow;
- water ripple;
- chain sway;
- slow wing movement;
- blessing rays;
- 10-second photo Ken Burns motion.

Respect `prefers-reduced-motion`.

## Visual metaphor library

| Theme | Visual |
|---|---|
| Grace/kingdom | gates, stars, golden road |
| Christ within | heart and cross |
| Night/trial | moon, lamp, mountains |
| Shepherd | staff, valley path, guiding light |
| Resurrection | empty tomb, dawn, cross |
| Freedom | broken chains |
| Home/heaven | arch, road, approaching figure |
| Praise | notes, crown, strings |
| Prayer | folded hands, quiet light, or no visual |
| Vine/abiding | branch, grapes, living water |
| Welcome | people, open door, hearts, blessing figures |
| Benediction | descending rays and gathered figures |

Match the metaphor to the current page's words, not merely the song title.

## Photography

For slideshow pages:

- rotate every 10 seconds unless told otherwise;
- crossfade around 1.5 seconds;
- use 1.01–1.08 slow scale motion;
- show landscape images full-bleed;
- show portrait images intact on one side over a blurred fill;
- alternate orientations when possible;
- keep lyrics in a consistent safe area;
- omit photo counters by default;
- allow a transparent lyrics container when requested.

## Accessibility

- Maintain strong contrast over every image.
- Ensure no text is clipped at 1280×720.
- Remove visible focus outlines only from intentionally invisible full-screen click zones; do not globally disable accessibility focus.
- Give meaningful images empty alt text when decorative and descriptive alt text when semantic.
