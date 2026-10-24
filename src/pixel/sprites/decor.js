import { C } from '../palette.js'

/** The logo mark — a paw print, 12x12. */
export const decorPaw = {
  palette: [null, C.ink],
  frames: [
    [
      '.11..11..11.',
      '.11..11..11.',
      '.11..11..11.',
      '............',
      '..11111111..',
      '.1111111111.',
      '111111111111',
      '111111111111',
      '.1111111111.',
      '..11111111..',
      '...111111...',
      '............'
    ]
  ]
}

/** Heart, 9x8 — used as a life pip and as page decoration. */
export const decorHeart = {
  palette: [null, C.rose, C.roseDeep, C.white],
  frames: [
    [
      '.11...11.',
      '113111111',
      '111111112',
      '.1111112.',
      '..11112..',
      '...112...',
      '....2....',
      '.........'
    ]
  ]
}

/**
 * Empty heart — the spent-life counterpart to decorHeart.
 * Drawn as a hollow outline in a mid tone: a filled pale heart disappears
 * against the cream HUD, and a life counter has to stay readable.
 */
export const decorHeartEmpty = {
  palette: [null, '#b7a68d'],
  frames: [
    [
      '.11...11.',
      '1..1.1..1',
      '1...1...1',
      '.1.....1.',
      '..1...1..',
      '...1.1...',
      '....1....',
      '.........'
    ]
  ]
}

/** Background cloud, 24x12. */
export const decorCloud = {
  palette: [null, C.white, '#eef5f8'],
  frames: [
    [
      '.........111111.........',
      '.......1111111111.......',
      '....1111111111111111....',
      '..11111111111111111111..',
      '.1111111111111111111111.',
      '111111111111111111111111',
      '111111111111111111111111',
      '.2222222222222222222222.',
      '..22222222222222222222..',
      '....2222222222222222....',
      '........22222222........',
      '........................'
    ]
  ]
}

/** Foreground shrub, 20x12. */
export const decorBush = {
  palette: [null, C.sageLight, C.sage, C.sageDeep],
  frames: [
    [
      '......111111........',
      '....11111111..111...',
      '..1111111111111111..',
      '.111111111111111111.',
      '11111111111111111111',
      '12111211121112111211',
      '22222222222222222222',
      '22322232223222322232',
      '22222222222222222222',
      '33333333333333333333',
      '33333333333333333333',
      '....................'
    ]
  ]
}

/**
 * Sparkle, 7x7 — small accent for headings.
 * Deep gold on the outside, pale in the core: the pale-on-pale version was
 * invisible against the cream background.
 */
export const decorSparkle = {
  palette: [null, C.goldDeep, C.goldLight],
  frames: [
    [
      '...1...',
      '...1...',
      '..121..',
      '1112111',
      '..121..',
      '...1...',
      '...1...'
    ]
  ]
}

/**
 * Picket fence, 16x12 — the garden boundary.
 *
 * Designed to tile horizontally: the two pickets sit 8px apart and the rails
 * run edge to edge, so butting copies together produces one continuous fence
 * with evenly spaced pickets and no visible seam.
 */
export const decorFence = {
  palette: [null, C.woodLight, C.wood, C.woodDeep],
  frames: [
    [
      '..1.......1.....',
      '.111.....111....',
      '.121.....121....',
      '2222222222222222',
      '3333333333333333',
      '.121.....121....',
      '.121.....121....',
      '.121.....121....',
      '2222222222222222',
      '3333333333333333',
      '.121.....121....',
      '.131.....131....'
    ]
  ]
}

/**
 * Fence end post, 3x12 — caps a fence run where the ground stops.
 *
 * Without it the rails get sliced mid-span at a pit edge and read as broken
 * rather than finished.
 */
export const decorFencePost = {
  palette: [null, C.woodLight, C.wood, C.woodDeep],
  frames: [
    [
      '.1.',
      '111',
      '121',
      '121',
      '121',
      '121',
      '121',
      '121',
      '121',
      '121',
      '121',
      '131'
    ]
  ]
}

/** Grass tuft, 10x5 — scattered along the ground so it is not a flat strip. */
export const decorGrassTuft = {
  palette: [null, C.sageLight, C.sage, C.sageDeep],
  frames: [
    [
      '..1....1..',
      '.11...11..',
      '.21..121..',
      '1221.1221.',
      '.33...33..'
    ]
  ]
}

/* One flower shape, two colourways — the garden needs more than one accent. */
const FLOWER = [
  '..222..',
  '.22322.',
  '.22322.',
  '..222..',
  '...1...',
  '..11...',
  '...1...',
  '...1...'
]

/** Rose flower, 7x8. */
export const decorFlowerRose = {
  palette: [null, C.sageDeep, C.rose, C.goldLight],
  frames: [FLOWER]
}

/** Gold flower, 7x8. */
export const decorFlowerGold = {
  palette: [null, C.sageDeep, C.gold, C.white],
  frames: [FLOWER]
}

/** Butterfly, 7x5 — two frames, wings open then folded. */
export const decorButterfly = {
  palette: [null, C.roseLight, C.rose, C.ink],
  frames: [
    ['.2...2.', '221.122', '.21312.', '..131..', '.......'],
    ['.......', '..2.2..', '.22122.', '..131..', '.......']
  ]
}

export default {
  decorPaw,
  decorHeart,
  decorHeartEmpty,
  decorCloud,
  decorBush,
  decorSparkle,
  decorFence,
  decorFencePost,
  decorGrassTuft,
  decorFlowerRose,
  decorFlowerGold,
  decorButterfly
}
