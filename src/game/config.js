import Phaser from 'phaser'
import BootScene from './scenes/BootScene.js'
import GameScene from './scenes/GameScene.js'

/**
 * A 320x160 canvas — 20x10 tiles at TILE_SIZE 16, matching the level grid in
 * levels/level1.js exactly, so the whole world height is always on screen and
 * the camera only ever scrolls sideways.
 *
 * Rendering small and letting Scale.FIT upscale is what makes the pixels look
 * right: the game draws 1:1 with the sprite data, then the whole canvas is
 * scaled with smoothing off. Rendering at CSS resolution instead would mean
 * fractional sprite scaling and mush.
 */
export const VIEW_WIDTH = 320
export const VIEW_HEIGHT = 160

/**
 * Tuning. See the reachability note in levels/level1.js before changing these.
 *
 * The numbers are picked from the jump arc, not by feel: airtime is 2v/g and a
 * 3-tile pit needs ~58px of travel to clear from the edge. At 1200/100/360 that
 * came out at 60px — technically possible, but it demands a frame-perfect
 * take-off for the level's very first obstacle. 1050/110/350 gives 73px, which
 * is a comfortable margin while still keeping the stacked platform at columns
 * 41-42 out of reach from ground level.
 */
export const PHYSICS = {
  GRAVITY: 1050,
  WALK_SPEED: 110,
  RUN_SPEED: 155,
  JUMP_VELOCITY: 350,
  /** Jump still works this long after walking off a ledge. */
  COYOTE_MS: 90,
  /** A jump pressed this long before landing still fires on touchdown. */
  JUMP_BUFFER_MS: 120,
  /** Releasing jump early cuts the rise, giving variable jump height. */
  JUMP_CUT_MULTIPLIER: 0.45
}

export const SCORING = {
  FISH: 10,
  COIN: 5,
  COMPLETE_BONUS: 50
}

export const STARTING_LIVES = 3

/** Invulnerability window after a hit, in ms. */
export const HURT_INVULN_MS = 1200

export function createGameConfig(parent) {
  return {
    type: Phaser.AUTO,
    parent,
    backgroundColor: '#d3e6f0',
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: VIEW_WIDTH,
      height: VIEW_HEIGHT
    },
    render: {
      pixelArt: true,
      antialias: false,
      roundPixels: true
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: PHYSICS.GRAVITY },
        debug: false
      }
    },
    // No audio files ship with the game — audio.js synthesises its blips — so
    // Phaser's sound manager has nothing to do. Disabling it also stops Phaser
    // from creating an AudioContext at boot (PRD §10: no autoplay).
    audio: { noAudio: true },
    banner: false,
    scene: [BootScene, GameScene]
  }
}

/**
 * Boots a game instance into `parent`.
 *
 * Exported alongside the config so GameCanvas can dynamically import this one
 * module and never reference Phaser itself — which is what keeps Phaser out of
 * every bundle except /play's.
 */
export function createGame(parent, startLevelIndex = 0) {
  return new Phaser.Game({
    ...createGameConfig(parent),
    // preBoot runs before any scene, so BootScene can read the chosen level
    // out of the registry on its very first frame.
    callbacks: {
      preBoot: (game) => game.registry.set('startLevel', startLevelIndex)
    }
  })
}

export default createGameConfig
