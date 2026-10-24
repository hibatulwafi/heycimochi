# Drop Mochi's photos here

This folder ships empty on purpose. Every photo path in `src/data/` points into
here, and until a file exists the page renders a pixel placeholder at the same
aspect ratio — so the layout never breaks and nothing shows a broken-image icon.

Add a file with the matching name and it appears automatically. No code change,
no rebuild config.

## Start with the two reference photos

These two slots are already written for the pink-backdrop portraits:

| Save this photo as | Which one | Shows up on |
|---|---|---|
| `cat-profile.jpg` | Mochi sitting upright in the red plaid bow tie | `/cat` profile card + homepage preview |
| `gallery-01.jpg` | Mochi in a loaf, front-on | first tile of the `/cat` album |

Both are already square, so no cropping needed — just resize to about 800×800
and save them here under those exact names.

## Every filename the site looks for

| File | Used by | Suggested crop |
|---|---|---|
| `cat-profile.jpg` | Profile photo on `/cat` + homepage preview | square, 800×800 |
| `gallery-01.jpg` … `gallery-06.jpg` | Album grid on `/cat` | square, 800×800 |
| `memory-01.jpg` … `memory-10.jpg` | Cards on `/memories` | landscape 4:3, 1000×750 |
| `video-01.jpg` … `video-08.jpg` | Video thumbnails on `/socials` | portrait 9:16, 720×1280 |

To change a filename, edit the matching entry in `src/data/catProfile.js`,
`src/data/memories.js`, or `src/data/socialVideos.js` — the components read the
path straight from the data.

## Keep them small

The site targets a fast first load (PRD §10). Before adding photos:

- Export at roughly the sizes above — a 4000px phone photo is pure waste here.
- Prefer `.webp` or `.avif` when your tooling supports it, and update the
  extension in the data file to match.
- Aim for under ~200 KB each.

Files in `public/` are copied to the build verbatim and are **not** compressed,
resized, or hashed by Vite. What you put here is exactly what visitors download.
