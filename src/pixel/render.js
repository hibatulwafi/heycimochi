/**
 * The one pixel renderer.
 *
 * A sprite is plain data — a palette plus one or more frames, where each frame
 * is an array of equal-length strings and every character indexes the palette:
 *
 *   { palette: [null, '#f7e3cf', '#d8a87c'],
 *     frames: [['0110', '1221', '0110']] }
 *
 * Characters map 0-9 then a-z, so a sprite can use up to 36 palette slots.
 * A palette entry of null / '' / 'none' means transparent.
 *
 * Two consumers draw from here and nothing else:
 *   - components/PixelSprite.vue  → a <canvas> in the page
 *   - game/textures.js            → offscreen canvases registered as Phaser textures
 *
 * Keeping both on one renderer is why the site and the game can't drift visually.
 */

const TRANSPARENT = new Set([null, undefined, '', 'none', 'transparent'])

/** '0'-'9' → 0-9, 'a'-'z' → 10-35. Anything else is treated as transparent. */
function paletteIndex(char) {
  const code = char.charCodeAt(0)
  if (code >= 48 && code <= 57) return code - 48
  if (code >= 97 && code <= 122) return code - 97 + 10
  if (code >= 65 && code <= 90) return code - 65 + 10
  return -1
}

export function frameCount(sprite) {
  return sprite.frames.length
}

/** Logical (unscaled) pixel dimensions of a frame. */
export function frameSize(sprite, frameIndex = 0) {
  const rows = sprite.frames[frameIndex] ?? []
  return {
    width: rows.reduce((max, row) => Math.max(max, row.length), 0),
    height: rows.length
  }
}

/**
 * Paint one frame onto a 2D context.
 * Pixels are filled as whole rects, so `scale` can be any positive number and
 * the result stays crisp without relying on image smoothing settings.
 */
export function drawFrame(ctx, sprite, frameIndex = 0, scale = 1, offsetX = 0, offsetY = 0) {
  const rows = sprite.frames[frameIndex]
  if (!rows) return

  const { palette } = sprite

  for (let y = 0; y < rows.length; y++) {
    const row = rows[y]
    for (let x = 0; x < row.length; x++) {
      const index = paletteIndex(row[x])
      if (index < 0) continue

      const color = palette[index]
      if (TRANSPARENT.has(color)) continue

      ctx.fillStyle = color
      // +1 on the far edge would seam at fractional scales; rounding each edge
      // independently keeps adjacent pixels flush.
      const px = offsetX + x * scale
      const py = offsetY + y * scale
      ctx.fillRect(
        Math.round(px),
        Math.round(py),
        Math.round(px + scale) - Math.round(px),
        Math.round(py + scale) - Math.round(py)
      )
    }
  }
}

/** Render a frame to a fresh canvas sized exactly to the scaled sprite. */
export function frameToCanvas(sprite, frameIndex = 0, scale = 1) {
  const { width, height } = frameSize(sprite, frameIndex)
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(width * scale))
  canvas.height = Math.max(1, Math.round(height * scale))

  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = false
  drawFrame(ctx, sprite, frameIndex, scale)

  return canvas
}

/**
 * A sprite as a PNG data URI, for use as a repeating CSS background.
 *
 * Tiling a ground strip or a fence line with one <PixelSprite> per tile means
 * dozens of <canvas> elements for a purely decorative band. One background
 * image repeated by the compositor costs a single element and no per-tile
 * layout, which is the difference between a decorative strip being free and
 * being the heaviest thing on the page.
 *
 * Results are cached: the same sprite at the same scale encodes once.
 */
const dataUrlCache = new Map()

export function frameToDataURL(sprite, frameIndex = 0, scale = 1, cacheKey = null) {
  const key = cacheKey && `${cacheKey}:${frameIndex}:${scale}`
  if (key && dataUrlCache.has(key)) return dataUrlCache.get(key)

  const url = frameToCanvas(sprite, frameIndex, scale).toDataURL('image/png')
  if (key) dataUrlCache.set(key, url)
  return url
}

/**
 * Build a sprite that is `source` mirrored horizontally.
 * Cheaper than authoring left/right art twice, and Phaser's flipX only covers
 * the game side — the site UI needs this too.
 */
export function mirrored(sprite) {
  return {
    palette: sprite.palette,
    frames: sprite.frames.map((rows) => rows.map((row) => [...row].reverse().join('')))
  }
}

/**
 * Recolor a sprite by palette index, e.g. to tint a fish or flash a hurt cat.
 * `swaps` is a map of index → color.
 */
export function recolored(sprite, swaps) {
  const palette = [...sprite.palette]
  for (const [index, color] of Object.entries(swaps)) {
    palette[Number(index)] = color
  }
  return { palette, frames: sprite.frames }
}
