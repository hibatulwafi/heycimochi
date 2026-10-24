import { frameCount, frameToCanvas } from '@/pixel/render.js'
import { SPRITES } from '@/pixel/sprites/index.js'

/**
 * Turns the pixel-matrix sprites into Phaser textures.
 *
 * One texture per frame, keyed `name-0`, `name-1`, … (or just `name` for
 * single-frame sprites). Animations are then built from explicit frame-key
 * arrays, which sidesteps spritesheet slicing entirely — no atlas, no padding
 * maths, and sprites of different sizes can live side by side.
 *
 * Textures are drawn at scale 1 so the game renders 1:1 with the sprite data;
 * all upscaling happens once, on the canvas, via Scale.FIT.
 */

/** Which sprites the game needs, and how to animate them. */
const GAME_SPRITES = [
  'catIdle',
  'catRun',
  'catJump',
  'catFall',
  'tileGrass',
  'tileDirt',
  'tilePlatform',
  'tileSpike',
  'itemFish',
  'itemCoin',
  'itemBasket',
  'decorCloud',
  'decorBush',
  'decorSparkle',
  'decorFence',
  'decorFencePost',
  'decorGrassTuft',
  'decorFlowerRose',
  'decorFlowerGold',
  'decorButterfly'
]

/**
 * `order` and `frameRate` fall back to the sprite's own `cycle` / `fps` when
 * omitted, so a cadence declared next to the art (catIdle's slow tail flick)
 * is identical in the game and on the website.
 */
const ANIMATIONS = [
  { key: 'cat-idle', sprite: 'catIdle', repeat: -1 },
  { key: 'cat-run', sprite: 'catRun', frameRate: 12, repeat: -1 },
  { key: 'cat-jump', sprite: 'catJump', frameRate: 1, repeat: -1 },
  { key: 'cat-fall', sprite: 'catFall', frameRate: 1, repeat: -1 },
  // Replaying the narrow pass on the way back out reads as a full spin.
  { key: 'coin-spin', sprite: 'itemCoin', frameRate: 10, repeat: -1, order: [0, 1, 2, 1] },
  { key: 'butterfly-flap', sprite: 'decorButterfly', frameRate: 6, repeat: -1 }
]

export function frameKeys(name) {
  const sprite = SPRITES[name]
  if (!sprite) return []
  const total = frameCount(sprite)
  if (total === 1) return [name]
  return Array.from({ length: total }, (_, i) => `${name}-${i}`)
}

/** The texture key to use for a static, single-frame reference to a sprite. */
export function textureKey(name) {
  return frameKeys(name)[0] ?? name
}

/**
 * Register every game texture and animation on this scene.
 * Safe to call again after a scene restart — both managers are checked first.
 */
export function registerTextures(scene) {
  for (const name of GAME_SPRITES) {
    const sprite = SPRITES[name]
    if (!sprite) {
      console.warn(`[textures] sprite "${name}" is missing from the registry`)
      continue
    }

    frameKeys(name).forEach((key, index) => {
      if (scene.textures.exists(key)) return
      scene.textures.addCanvas(key, frameToCanvas(sprite, index, 1))
    })
  }

  for (const anim of ANIMATIONS) {
    if (scene.anims.exists(anim.key)) continue

    const sprite = SPRITES[anim.sprite]
    const keys = frameKeys(anim.sprite)
    const order = anim.order ?? sprite?.cycle ?? keys.map((_, i) => i)

    scene.anims.create({
      key: anim.key,
      frames: order.map((i) => ({ key: keys[i] })),
      frameRate: anim.frameRate ?? sprite?.fps ?? 8,
      repeat: anim.repeat
    })
  }
}

export default registerTextures
