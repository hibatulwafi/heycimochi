# Hey Mochi

Personal cat website, social media hub, and pixel platformer — built from
[PRD.txt](PRD.txt).

A responsive Vue 3 site introducing Mochi — a seal point Himalayan (Siamese ×
Persian) — through a profile, a photo gallery and a memories archive, pointing
visitors at her Instagram and TikTok, and shipping with a playable 2D pixel
platformer. No backend, no database, no accounts: every page is static and the
whole thing deploys to any static host.

The entire colour scheme is sampled from her own photos: ivory coat, mocha
points, blue eyes, the gold bell on her bow tie, and the rose studio backdrop
as the accent. See [`src/pixel/palette.js`](src/pixel/palette.js).

| | |
|---|---|
| Frontend | Vue 3 (Composition API), Vite, Tailwind CSS v4, Vue Router |
| Game | Phaser 3 |
| Backend | none |
| Language | JavaScript |

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # -> dist/
npm run preview  # serve dist/ locally
```

Node 20+ recommended.

## Routes

| Route | Page |
|---|---|
| `/` | Homepage |
| `/cat` | Cat profile |
| `/socials` | Social media hub |
| `/memories` | Cat memories |
| `/play` | Pixel platformer |
| anything else | 404 |

Vue Router runs in history mode, so **every static host needs a catch-all
rewrite to `index.html`** or a hard refresh on `/play` will 404. Already
configured:

- **Netlify / Cloudflare Pages** — [`public/_redirects`](public/_redirects)
- **Vercel** — [`vercel.json`](vercel.json)
- **GitHub Pages** — no rewrite support; copy `dist/index.html` to
  `dist/404.html` after building, and set `base` in `vite.config.js` if the site
  is served from a subpath.
- **Apache / nginx** — point all unmatched paths at `/index.html`.

---

## Editing content

All copy and data lives in [`src/data/`](src/data/). Nothing in there requires
touching a component.

| File | Contents |
|---|---|
| `siteConfig.js` | Brand name, tagline, nav menu, footer note |
| `catProfile.js` | Mochi's name, birthday, bio, likes/dislikes, gallery, story |
| `socialLinks.js` | Instagram / TikTok / YouTube / WhatsApp accounts |
| `socialVideos.js` | The curated video list for `/socials` |
| `memories.js` | Memory entries and their categories |
| `gameInfo.js` | Game title, blurb, control hints, scoring table |

### Photos

`public/images/` ships empty. Until a file exists, the page draws a pixel
placeholder at the same aspect ratio, so the layout never breaks and no
broken-image icons appear. See
[`public/images/README.md`](public/images/README.md) for the filenames the site
looks for and the recommended sizes.

### Social accounts

Buttons only render when an account has **both** `enabled: true` and a non-empty
`profileUrl` — so a half-filled entry hides itself rather than shipping a link
that goes nowhere. Out of the box everything is `enabled: false` and `/socials`
shows an honest empty state.

```js
// src/data/socialLinks.js
instagram: {
  label: 'Instagram',
  username: 'heymochi',
  profileUrl: 'https://www.instagram.com/heymochi/',
  enabled: true,
  cta: 'Follow'
}
```

### Collaboration contact

`siteConfig.collaboration` drives the Open-collaboration panel on `/socials`
and the button in the footer. It points at `wa.me`, which needs the number in
**full international form with no `+`, spaces or leading zero** — the local
`0858-6304-6869` becomes `6285863046869`. Getting that wrong is the usual
reason a WhatsApp link opens an empty chat.

### Videos

Each card renders from local data (`title`, `caption`, `thumbnail`) and always
links out to `videoUrl`. `embedUrl` is optional:

| Platform | Embed URL format |
|---|---|
| Instagram | `https://www.instagram.com/reel/<SHORTCODE>/embed` |
| TikTok | `https://www.tiktok.com/embed/v2/<VIDEO_ID>` |
| YouTube | `https://www.youtube-nocookie.com/embed/<VIDEO_ID>` |

Three deliberate behaviours:

1. **Click to load.** The `<iframe>` is only created when a visitor presses
   play, so opening `/socials` makes zero third-party requests.
2. **Load watchdog.** A cross-origin iframe fires `load` even for an error page,
   so `load` can't prove success — but an 8s timeout catches blocked embeds,
   deleted posts and offline failures, and flips the card to a fallback.
3. **The source link survives every state**, including failure.

Leave `embedUrl: ''` for platforms that refuse embedding; the card still works
as a link.

> **No automatic sync.** Without a backend or official API access, the video
> list is curated by hand (PRD §4.3). API sync is explicitly out of scope for
> the MVP (FR-11).

---

## The pixel art

There are no image files. Every sprite is a **pixel matrix in JavaScript** under
[`src/pixel/sprites/`](src/pixel/sprites/):

```js
export const itemFish = {
  palette: [null, '#f7cdbb', '#e8906f', '#4a4038'],
  frames: [[
    '.....2222...',
    '.2..222222..',
    '.2221111312.',
    // …
  ]]
}
```

Characters index the palette (`0`-`9` then `a`-`z`); `.` is transparent. A single
renderer, [`src/pixel/render.js`](src/pixel/render.js), feeds two consumers:

- `components/PixelSprite.vue` — draws to a `<canvas>` in the page
- `game/textures.js` — draws to offscreen canvases registered as Phaser textures

That's why the site and the game can't drift visually: editing a sprite updates
both. Colours come from [`src/pixel/palette.js`](src/pixel/palette.js), mirrored
into Tailwind's `@theme` in [`src/assets/main.css`](src/assets/main.css) — keep
the two in step.

To add a sprite: define it, export it from its module, and it joins the registry
in `src/pixel/sprites/index.js` automatically. Reference it by name:
`<PixelSprite name="itemFish" :scale="4" />`.

---

## The game

`Mochi's Little Adventure` lives in [`src/game/`](src/game/).

```
config.js            view size, physics tuning, scoring, createGame()
textures.js          pixel matrices -> Phaser textures + animations
bus.js               scene <-> Vue messaging
input.js             shared touch state the scene polls
audio.js             synthesised blips (muted by default)
storage.js           local best score
entities/Cat.js      movement, coyote time, jump buffering, variable height
scenes/BootScene.js  builds textures, then starts the chosen level
scenes/GameScene.js  parses a level, wires collisions, owns score and lives
levels/index.js      all five levels, as ASCII
```

### The five levels

| # | Name | Difficulty | Gaps | Spikes |
|---|---|---|---|---|
| 1 | Backyard Run | Mudah | 5 (max 4 tiles) | 6 |
| 2 | Garden Path | Mudah | 5 (max 4) | 7 |
| 3 | Fence Line | Sedang | 6 (max 5) | 12 |
| 4 | Thorn Alley | Sulit | 8 (max 5) | 19 |
| 5 | Mochi's Marathon | Brutal | 12 (max 5) | 20 |

All five are selectable from the start gate and from the strip under the
canvas — locking the hard one away would mean most visitors never see it.
Lives reset to 3 per level and best scores are stored per level.

Every level has been verified completable without losing a life; the gaps are
sized against the jump arc, never wider than a running jump can clear.

### Editing a level

A level is text. Every row must be the same length — the parser throws on a
ragged map rather than building a world with holes in it. The grid is 10 rows,
which is what sets `VIEW_HEIGHT`; change one and change the other.

```
#  solid ground      =  floating platform (one-way: landable from above only)
^  spikes            f  fish (+10)
c  coin (+5)         P  player spawn
G  goal basket       .  empty
```

Reachability at the shipped tuning (`GRAVITY 1050`, `JUMP 350`, `WALK 110`,
`RUN 155`): a jump clears ~3.6 tiles of height, ~4.6 tiles of distance walking
and ~6.5 running. **No gap may exceed 5 tiles** — the difficulty curve is gap
width and frequency, not gap impossibility.

### Notes

- **The game boots on an explicit Start press**, not on page load. Phaser
  captures the arrow keys and space so they don't scroll the page, and taking
  that over before the visitor asks to play would hijack the page.
- **Audio is off by default** (PRD §10). No `AudioContext` exists until the
  speaker button is pressed — which is also the user gesture browsers require.
- **Best score is local only** — one integer in `localStorage`, nothing sent
  anywhere. Not the cross-device leaderboard, which is out of scope (PRD §13).
- **Touch controls** write into a plain shared object (`game/input.js`) that the
  scene polls each frame, so the Vue side never imports Phaser.
- **Fullscreen** takes the whole shell — canvas, HUD, result overlay and touch
  buttons — not just the canvas, so nothing is left behind on the page. The
  canvas is letterboxed against the dark shell rather than stretched, and the
  button is hidden where the Fullscreen API is unavailable, which on iOS
  Safari means any element that is not a `<video>`.
- **Rotation**: entering fullscreen asks for a landscape lock, which roughly
  doubles the playfield on a phone. Android grants it; iOS and desktop refuse,
  so when the lock fails on an upright touch device the game shows a short
  "rotate your phone" hint instead. No CSS-rotation hack — those break touch
  aim and feel worse than the honest prompt.
- **Phone layout**: below `sm` the HUD sits *above* the playfield instead of
  overlaying it. At 360px the canvas is only ~162px tall and an overlaid HUD
  covered most of it; now the card is a flex column with a two-row compact HUD
  (level number without its name, hearts beside the buttons) and the canvas
  takes 99% of the card width at every width tested from 320px up.

  One ordering trap this creates: the playfield is a flex child that collapses
  to zero height while the start gate still fills the card, and Phaser measures
  its parent once at boot. `started` is therefore set and awaited through
  `nextTick()` *before* `createGame()`, otherwise the canvas boots at 0x0 and
  never recovers.
- Phaser is a separate ~1.5 MB chunk, dynamically imported, so no other page
  downloads it.

---

## Motion, and why it stays cheap

The site drifts, sways and reveals, and still holds 60fps with ~188 KB on the
homepage. Three rules keep it there:

- **Only `transform` and `opacity` animate.** Everything in the ambient-motion
  block of `src/assets/main.css` is composited, so nothing triggers layout and
  nothing runs on the main thread.
- **Sprite motion is stepped, never eased.** A smoothly-interpolated transform
  parks a pixel-art layer on fractional device pixels and the compositor
  resamples it every frame, which reads as the sprite *vibrating*. Rotation is
  worse still. So sprite keyframes use `step-end` with whole, even pixel
  offsets (2px/4px), which stay on-grid at 1x, 1.5x and 2x DPR and give the
  chunky bob a real sprite sheet would. Clouds keep smooth interpolation —
  they are large soft shapes moving slowly, where stepping would look jerky.
- **No per-frame JavaScript on the page.** The only motion-related JS is
  `src/directives/reveal.js`: one shared `IntersectionObserver` that adds a
  class once per element and then stops watching it.
- **Repeating art is a background, not canvases.** `PixelStrip.vue` renders a
  tiled sprite as one CSS background via `frameToDataURL`. Tiling the ground
  and fence with `PixelSprite` instead would cost ~90 extra `<canvas>`
  elements per page.

Measured on the production build: median frame 16.7ms on every route, zero
dropped frames while idle, 3/146 while scrolling aggressively.

Both `prefers-reduced-motion` and a no-JS load are handled: the hiding class
is only ever applied by the directive, so content can never be stranded
invisible, and reduced motion renders everything at once.

## Project layout

```
public/
  images/            real photos go here (see its README)
  _redirects         Netlify/Cloudflare SPA fallback
  favicon.svg
src/
  assets/main.css    Tailwind v4 theme, component classes
  components/        navbar, footer, cards, game host, overlays
  data/              ALL content lives here
  game/              Phaser game
  pixel/             sprite matrices + the shared renderer
  pages/             one per route
  router/
  utils/             date formatting, social-link guards
```

## Out of scope for the MVP

Per PRD §13: no accounts or auth, no backend or database, no admin dashboard, no
visitor photo uploads, no cross-device leaderboard, no Instagram/TikTok API sync,
no live follower stats.
