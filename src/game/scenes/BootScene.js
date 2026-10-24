import Phaser from 'phaser'
import { registerTextures } from '../textures.js'

/**
 * There are no files to preload — every texture is drawn from the pixel
 * matrices in src/pixel/sprites. This scene exists purely to build them once,
 * before GameScene starts, so GameScene can assume every key is present.
 */
export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'boot' })
  }

  create() {
    registerTextures(this)
    this.scene.start('game', { levelIndex: this.registry.get('startLevel') ?? 0 })
  }
}
