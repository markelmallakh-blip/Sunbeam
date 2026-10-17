# Sunbeam Spaces — Design System Reference

Source: Figma file `3AAWzwwDbvVYIfbJTlVcbw` — Components page `15:1343`, Homepage frame `24:847` (page "UI" `8:23`).
Values were read from the published components and sampled from Figma renders; the code tokens live in
`src/app/globals.css` (`@theme`). **Never introduce a color, font or CTA style outside this list.**

## Colors

| Token   | Hex       | Figma usage                                                              |
| ------- | --------- | ------------------------------------------------------------------------ |
| `ink`   | `#2C2929` | Primary / text, headings, dark CTA default, footer wordmark              |
| `black` | `#000000` | Dark CTA hover                                                           |
| `white` | `#FFFFFF` | Page background, light CTA hover                                         |
| `stone` | `#EEEDEB` | Gray / section background (Services), light CTA default                  |
| `linen` | `#F6F5F3` | Gray / soft section background (Testimonials, Consult), inputs           |
| `slate` | `#595B61` | Secondary text, input labels & placeholders                              |
| `line`  | `#707176` | Input focus border, outline strokes                                      |
| `rust`  | `#AC401F` | Secondary / Rusty Orange — the single accent (quote mark, Explore links) |

## Typography

| Role               | Family                      | Notes                                                                                                       |
| ------------------ | --------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Display / headings | **Alqest** (local font)     | Hero ~80px, section H2 ~64px, H3 ~56px, card titles ~28px. Self-hosted from `src/fonts/Alqest-Regular.otf`. |
| Body / UI          | **Montserrat** (variable)   | Body 14–16px, lead 28px, nav & CTA 14px uppercase                                                           |
| Eyebrow            | Montserrat, uppercase, 14px | Sits above every section heading                                                                            |

## CTA (component set `15:3087`)

Variants: `Type` = Black · white · border white · border black; `Status` = Default · Hover;
`left icon` / `right icon` (arrow-right-01-sharp chevron); `size` = medium · large. Square corners (radius 0), uppercase label.

| Type         | Default                                   | Hover                   |
| ------------ | ----------------------------------------- | ----------------------- |
| Black        | bg `ink`, text white                      | bg `black`              |
| white        | bg `stone`, text `ink`                    | bg `white`              |
| border white | 1px white border, transparent, white text | fills white, text `ink` |
| border black | 1px `ink` border, transparent, `ink` text | fills `ink`, text white |

| Size   | Height | Padding-x | Text |
| ------ | ------ | --------- | ---- |
| medium | 42px   | 20px      | 14px |
| large  | 58px   | 32px      | 16px |

Text link (`Link` `35:1006`): uppercase label + chevron, rust color (e.g. "EXPLORE").

## Input Fields (`48:4780`)

Types: Default · Choose (select w/ chevron) · Mobile (country code + number). States: Default · Focus.
bg `linen`, radius 4px, height ~56px; focus adds 1px `line` border and a floating label (12px, `slate`) above the value (16px, `ink`).

## Icons

Hugeicons (stroke 1.5, round caps, `#141B34` source color → use `currentColor`). Icons used on the site:
arrow-right-01-sharp, arrow-left-01-sharp, arrow-down-01-sharp, plus-sign, minus-sign, mail-01, location-04,
clock-01, globe, video-01, play-circle, cancel-01, facebook-fill, instagram-original, tiktok-alt.

## Layout

Frame width 1440px · side padding 60px (content 1320px) · section padding 100px vertical (some 60px).
Full-width vertical sections; alternating `white` / `stone` / `linen` backgrounds.

Arabic text (future): **Risala Medium** — file in the brand assets folder (`Assets/Fonts/risala.otf`).

## Window shape

Brand mark from `Assets/windows-shape.svg`: a 5 × 6 grid of window panes, indexed row by row (0 = top-left, 29 = bottom-right).
Data lives in `src/lib/window-shape.ts`.

- `<WindowShape />` draws the whole grid, or a subset with `panes={[0, 6, 12]}`.
- `<WindowPane pane={n}>` masks any content (image, video, color) to one pane.
- Page transitions (`src/components/transitions/PageTransition.tsx`): the current page shrinks into one pane, folds shut, then a neighbouring pane unfolds with the next page and grows to full screen. Only near-rectangular panes (`fullPaneIndexes`) are used. Same-page anchors, new tabs and reduced motion skip it.

## Media formats

Images ship as WebP (`public/images/**`), videos as WebM. The only JPEG is the social share image (`public/og/home.jpg`), because not every platform accepts WebP there.

## Motion

- **Smooth scrolling:** Lenis (`SmoothScroll`), driven by the GSAP ticker so ScrollTrigger stays in sync. Off for reduced motion.
- **Image parallax:** every filled `ResponsiveImage` drifts ±6% at 1.14 scale inside its frame (`ImageParallax`, rendered once per page). Opt out with `parallax={false}`.
- **Story:** the image pair is sticky and eases through window-pane outlines while the section scrolls, landing level with the video teaser.
- **Services:** the headline sticks and recedes (scale + blur) while the rows scroll over it; images arrive tilted and straighten by mid-screen. Hovering an image pair turns the cursor into the "Explore" disc (`ExploreCursor`).
- **Projects:** on desktop the section pins and vertical scroll steps through the projects in the focus slider.
