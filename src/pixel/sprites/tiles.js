import { C } from '../palette.js'

/**
 * 16x16 terrain tiles. TILE_SIZE is the contract between these and the level
 * parser in src/game/levels/ — changing one means changing the other.
 */
export const TILE_SIZE = 16

const GROUND = [
  null,
  C.sageLight,
  C.sage,
  C.sageDeep,
  C.dirtLight,
  C.dirt,
  C.dirtDeep
]

/** Surface tile — grass cap over dirt. Used wherever a column is exposed. */
export const tileGrass = {
  palette: GROUND,
  frames: [
    [
      '1111111111111111',
      '1121112111211121',
      '2222222222222222',
      '2232223222322232',
      '3333333333333333',
      '4444444444444444',
      '4454444454444544',
      '4444444444444444',
      '4444544444454444',
      '5555555555555555',
      '5565555565555565',
      '5555555555555555',
      '5555655555565555',
      '5555555555555555',
      '5565555565555565',
      '5555555555555555'
    ]
  ]
}

/** Fill tile — anything buried under a grass cap. */
export const tileDirt = {
  palette: GROUND,
  frames: [
    [
      '5555555555555555',
      '5565555565555565',
      '5555555555555555',
      '5556555555655556',
      '5555555555555555',
      '6555555655555556',
      '5555655555555555',
      '5555555555655555',
      '5655555555555565',
      '5555555565555555',
      '5555655555555655',
      '6555555555555555',
      '5555555655555555',
      '5565555555565555',
      '5555555555555555',
      '5555655555555565'
    ]
  ]
}

/** Floating ledge — wooden plank, visually distinct from the ground. */
export const tilePlatform = {
  palette: [null, C.woodLight, C.wood, C.woodDeep, C.goldLight],
  frames: [
    [
      '3333333333333333',
      '3444444444444443',
      '3411111111111143',
      '3111211111121113',
      '3111111111111113',
      '3222222222222223',
      '3221222122212223',
      '3222222222222223',
      '3333333333333333',
      '3222122212221223',
      '3222222222222223',
      '2221222122212222',
      '2222222222222222',
      '3222222222222223',
      '3332333233323333',
      '3333333333333333'
    ]
  ]
}

/**
 * Hazard — four teeth filling the bottom 10px of the cell.
 * SPIKE_TOP tells the game where the art starts so the hitbox can match it
 * instead of covering the whole empty tile.
 */
export const SPIKE_TOP = 6

export const tileSpike = {
  palette: [null, C.stoneLight, C.stone, C.stoneDeep],
  frames: [
    [
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '...11......11...',
      '...11......11...',
      '..1221....1221..',
      '..1221....1221..',
      '.122221..122221.',
      '.122221..122221.',
      '1222222112222221',
      '1222222112222221',
      '1333333113333331',
      '3333333333333333'
    ]
  ]
}

// Sprites only — TILE_SIZE is a named export so the registry in index.js stays
// a pure name→sprite map.
export default { tileGrass, tileDirt, tilePlatform, tileSpike }
