import cat from './cat.js'
import tiles from './tiles.js'
import items from './items.js'
import decor from './decor.js'

/**
 * Flat registry of every sprite, keyed by name.
 *
 * Lets content reference art as a string — e.g. `pixelAvatar: 'catIdle'` in
 * src/data/catProfile.js, or <PixelSprite name="decorPaw" /> — so data files
 * never need to import sprite modules.
 */
export const SPRITES = {
  ...cat,
  ...tiles,
  ...items,
  ...decor
}

export function getSprite(name) {
  const sprite = SPRITES[name]
  if (!sprite) {
    console.warn(`[pixel] unknown sprite "${name}". Known: ${Object.keys(SPRITES).join(', ')}`)
    return null
  }
  return sprite
}

export { TILE_SIZE } from './tiles.js'
export default SPRITES
