import Phaser from 'phaser'
import Cat from '../entities/Cat.js'
import { bus, EVENTS } from '../bus.js'
import { touchState, resetTouchState } from '../input.js'
import { play as playSound } from '../audio.js'
import { readBestScore, writeBestScore, writeProgress } from '../storage.js'
import { SCORING, STARTING_LIVES, VIEW_HEIGHT } from '../config.js'
import { LEGEND, LEVELS, levelAt } from '../levels/index.js'
import { TILE_SIZE, SPIKE_TOP } from '@/pixel/sprites/tiles.js'
import { textureKey } from '../textures.js'

const FALL_MARGIN = 24

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'game' })
  }

  /**
   * Which level to build. Carried through `scene.restart({ levelIndex })`, so
   * replaying a level and advancing to the next one are the same code path.
   */
  init(data) {
    this.levelIndex = Number.isInteger(data?.levelIndex) ? data.levelIndex : 0
  }

  create() {
    this.level = levelAt(this.levelIndex)
    this.isLastLevel = this.levelIndex >= LEVELS.length - 1

    this.status = 'playing'
    this.score = 0
    this.lives = STARTING_LIVES
    this.fishCollected = 0
    this.coinsCollected = 0
    this.best = readBestScore(this.level.id)

    const map = this.parseMap(this.level.rows)
    this.standable = map.standable

    this.worldWidth = map.width * TILE_SIZE
    this.worldHeight = map.height * TILE_SIZE
    this.physics.world.setBounds(0, 0, this.worldWidth, this.worldHeight)

    this.buildBackground(map)
    this.buildTerrain(map)
    this.buildPlayer(map)
    this.buildCamera()
    this.bindInput()
    this.bindCommands()

    this.emitState()
  }

  // ---------------------------------------------------------------- parsing

  /**
   * Reads the ASCII grid into typed cell lists.
   * A ragged map is a level-design bug, so it fails loudly here rather than
   * producing a world with mysterious holes in it.
   */
  parseMap(rows) {
    const width = rows[0]?.length ?? 0
    rows.forEach((row, y) => {
      if (row.length !== width) {
        throw new Error(
          `[level] row ${y} is ${row.length} tiles but row 0 is ${width}. Every row must match.`
        )
      }
    })

    const result = {
      width,
      height: rows.length,
      rows,
      /** 'x,y' keys for every standable cell — used for respawn safety checks. */
      standable: new Set(),
      solids: [],
      platforms: [],
      spikes: [],
      fish: [],
      coins: [],
      spawn: null,
      goal: null
    }

    for (let y = 0; y < rows.length; y++) {
      for (let x = 0; x < width; x++) {
        const cell = rows[y][x]
        switch (cell) {
          case LEGEND.SOLID:
            // A column's topmost solid gets the grass cap; everything buried
            // below it is plain dirt. Derived, so the map never has to say so.
            result.solids.push({ x, y, capped: rows[y - 1]?.[x] !== LEGEND.SOLID })
            result.standable.add(`${x},${y}`)
            break
          case LEGEND.PLATFORM:
            result.platforms.push({ x, y })
            result.standable.add(`${x},${y}`)
            break
          case LEGEND.SPIKE:
            result.spikes.push({ x, y })
            break
          case LEGEND.FISH:
            result.fish.push({ x, y })
            break
          case LEGEND.COIN:
            result.coins.push({ x, y })
            break
          case LEGEND.SPAWN:
            result.spawn = { x, y }
            break
          case LEGEND.GOAL:
            result.goal = { x, y }
            break
          default:
            break
        }
      }
    }

    if (!result.spawn) throw new Error('[level] no spawn point (P) in the map')
    if (!result.goal) throw new Error('[level] no goal (G) in the map')

    return result
  }

  /** Centre of a tile cell, in world pixels. */
  static cellCenter(cell) {
    return {
      x: cell.x * TILE_SIZE + TILE_SIZE / 2,
      y: cell.y * TILE_SIZE + TILE_SIZE / 2
    }
  }

  // --------------------------------------------------------------- building

  /**
   * Deterministic 0..1 noise.
   *
   * The garden is scattered rather than evenly spaced, but it must look the
   * same on every run — Math.random() would reshuffle the flowers each restart
   * and make the level feel unstable.
   */
  static noise(n) {
    const x = Math.sin(n * 127.1 + 311.7) * 43758.5453
    return x - Math.floor(x)
  }

  /** Topmost solid row in a column, or -1 when the column is a pit. */
  static surfaceRow(map, col) {
    for (let y = 0; y < map.height; y++) {
      if (map.rows[y][col] === LEGEND.SOLID) return y
    }
    return -1
  }

  buildBackground(map) {
    // Clouds drift slower than the world for a cheap sense of depth.
    const cloudKey = textureKey('decorCloud')
    for (let i = 0; i < 7; i++) {
      this.add
        .image(60 + i * 180, 24 + (i % 3) * 22, cloudKey)
        .setScrollFactor(0.3)
        .setAlpha(0.85)
        .setDepth(-30)
    }

    /*
     * The garden fence follows the ground and stops at every pit.
     *
     * A single parallax strip across the whole world was cheaper, but it left
     * the fence hanging in mid-air over the bottomless gaps, which reads as a
     * bug no matter how far back it sits. So it is built per run of supported
     * ground instead, with an end post capping each break — otherwise the
     * rails get sliced mid-span and look broken rather than finished.
     *
     * "Supported" means the column has solid tile anywhere, not just at the
     * surface: a spike trench is a dip in continuous ground, so the fence
     * carries straight over it at the main ground height. Only a true
     * bottomless pit breaks the run.
     */
    const baseRow = GameScene.surfaceRow(map, 0)
    const fenceBaseY = ((baseRow < 0 ? map.height - 2 : baseRow) + 0.25) * TILE_SIZE
    const supported = (col) =>
      col >= 0 && col < map.width && map.rows.some((row) => row[col] === LEGEND.SOLID)

    const fenceKey = textureKey('decorFence')
    const postKey = textureKey('decorFencePost')

    let runStart = -1
    for (let col = 0; col <= map.width; col++) {
      const ok = col < map.width && supported(col)

      if (ok && runStart < 0) runStart = col
      if (ok || runStart < 0) continue

      const x = runStart * TILE_SIZE
      const width = (col - runStart) * TILE_SIZE

      this.add
        .tileSprite(x, fenceBaseY, width, 12, fenceKey)
        .setOrigin(0, 1)
        .setAlpha(0.9)
        .setDepth(-20)

      // Cap both ends so the break looks deliberate.
      for (const postX of [x, x + width - 3]) {
        this.add.image(postX, fenceBaseY, postKey).setOrigin(0, 1).setAlpha(0.9).setDepth(-19)
      }

      runStart = -1
    }

    const tuftKey = textureKey('decorGrassTuft')
    const bushKey = textureKey('decorBush')
    const flowerKeys = [textureKey('decorFlowerRose'), textureKey('decorFlowerGold')]

    /*
     * Ground dressing, placed per column against the real terrain. Driving it
     * off `surfaceRow` rather than a fixed y keeps it off the pits and lets it
     * follow the ground automatically if the level is ever re-drawn.
     */
    for (let col = 0; col < map.width; col++) {
      const row = GameScene.surfaceRow(map, col)
      if (row < 0) continue

      const groundY = row * TILE_SIZE
      const centerX = col * TILE_SIZE + TILE_SIZE / 2
      const r = GameScene.noise(col)

      if (r < 0.14) {
        this.add.image(centerX, groundY + 1, bushKey).setOrigin(0.5, 1).setDepth(-10).setAlpha(0.9)
      } else if (r < 0.46) {
        this.add.image(centerX, groundY + 1, tuftKey).setOrigin(0.5, 1).setDepth(2)
      } else if (r < 0.62) {
        this.add
          .image(centerX, groundY + 1, flowerKeys[col % 2])
          .setOrigin(0.5, 1)
          .setDepth(2)
      }

      // A couple of butterflies drifting just above the flowers.
      if (r > 0.95) {
        const butterfly = this.add
          .sprite(centerX, groundY - 24, textureKey('decorButterfly'))
          .setDepth(3)
        butterfly.play('butterfly-flap')
        this.tweens.add({
          targets: butterfly,
          y: butterfly.y - 9,
          x: butterfly.x + 14,
          duration: 2200 + r * 900,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        })
      }
    }
  }

  buildTerrain(map) {
    this.solids = this.physics.add.staticGroup()
    this.platforms = this.physics.add.staticGroup()
    this.spikeZones = this.physics.add.staticGroup()

    const grassKey = textureKey('tileGrass')
    const dirtKey = textureKey('tileDirt')
    const platformKey = textureKey('tilePlatform')
    const spikeKey = textureKey('tileSpike')

    for (const cell of map.solids) {
      const { x, y } = GameScene.cellCenter(cell)
      this.solids.create(x, y, cell.capped ? grassKey : dirtKey).setDepth(0)
    }

    for (const cell of map.platforms) {
      const { x, y } = GameScene.cellCenter(cell)
      const tile = this.platforms.create(x, y, platformKey).setDepth(0)
      // One-way: landable from above, pass-through from below and the sides.
      // Without this the stacked platforms (rows 8 then 6 at columns 41-42)
      // would be impossible to reach.
      tile.body.checkCollision.down = false
      tile.body.checkCollision.left = false
      tile.body.checkCollision.right = false
    }

    for (const cell of map.spikes) {
      const { x } = GameScene.cellCenter(cell)
      const top = cell.y * TILE_SIZE + SPIKE_TOP
      const height = TILE_SIZE - SPIKE_TOP

      this.add.image(x, cell.y * TILE_SIZE + TILE_SIZE / 2, spikeKey).setDepth(1)

      // The hitbox is a separate zone rather than a resized sprite body: it
      // matches the drawn teeth exactly, and sizing a StaticBody by offset is
      // fiddly enough to get silently wrong.
      const zone = this.add.zone(x, top + height / 2, TILE_SIZE - 2, height)
      this.physics.add.existing(zone, true)
      this.spikeZones.add(zone)
    }

    this.buildCollectibles(map)
    this.buildGoal(map)
  }

  buildCollectibles(map) {
    this.fishGroup = this.physics.add.group({ allowGravity: false, immovable: true })
    this.coinGroup = this.physics.add.group({ allowGravity: false, immovable: true })

    for (const cell of map.fish) {
      const { x, y } = GameScene.cellCenter(cell)
      const fish = this.fishGroup.create(x, y, textureKey('itemFish')).setDepth(5)
      fish.body.setSize(12, 8)
      this.tweens.add({
        targets: fish,
        y: y - 3,
        duration: 900,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      })
    }

    for (const cell of map.coins) {
      const { x, y } = GameScene.cellCenter(cell)
      const coin = this.coinGroup.create(x, y, textureKey('itemCoin')).setDepth(5)
      coin.body.setSize(10, 10)
      coin.play('coin-spin')
    }

    this.fishTotal = map.fish.length
    this.coinTotal = map.coins.length
  }

  buildGoal(map) {
    const { x, y } = GameScene.cellCenter(map.goal)
    this.goal = this.physics.add.staticImage(x, y, textureKey('itemBasket')).setDepth(4)
    // Only the basket itself counts — the decorative heart floats well above it.
    this.goal.body.setSize(14, 10)
  }

  buildPlayer(map) {
    const spawn = GameScene.cellCenter(map.spawn)
    this.spawnPoint = { ...spawn }
    this.safePoint = { ...spawn }

    this.player = new Cat(this, spawn.x, spawn.y)
    this.player.on('jumped', () => playSound('jump'))

    this.physics.add.collider(this.player, this.solids)
    this.physics.add.collider(this.player, this.platforms)
    this.physics.add.overlap(this.player, this.fishGroup, this.onCollectFish, undefined, this)
    this.physics.add.overlap(this.player, this.coinGroup, this.onCollectCoin, undefined, this)
    this.physics.add.overlap(this.player, this.spikeZones, this.onHazard, undefined, this)
    this.physics.add.overlap(this.player, this.goal, this.onReachGoal, undefined, this)
  }

  buildCamera() {
    const camera = this.cameras.main
    camera.setBounds(0, 0, this.worldWidth, this.worldHeight)
    camera.startFollow(this.player, true, 0.12, 0.12)
    camera.setDeadzone(48, VIEW_HEIGHT)
  }

  bindInput() {
    this.keys = this.input.keyboard.addKeys({
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      d: Phaser.Input.Keyboard.KeyCodes.D,
      w: Phaser.Input.Keyboard.KeyCodes.W,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
      shift: Phaser.Input.Keyboard.KeyCodes.SHIFT,
      r: Phaser.Input.Keyboard.KeyCodes.R
    })

    // Stop arrows and space from scrolling the page out from under the player.
    // Scoped to this scene, so it ends when the route unmounts the game.
    this.input.keyboard.addCapture(['LEFT', 'RIGHT', 'UP', 'DOWN', 'SPACE'])

    this.keys.r.on('down', () => this.restartGame())
  }

  bindCommands() {
    const offRestart = bus.on(EVENTS.RESTART, () => this.restartGame())
    const offPause = bus.on(EVENTS.PAUSE, () => this.pauseGame())
    const offResume = bus.on(EVENTS.RESUME, () => this.resumeGame())
    const offLoad = bus.on(EVENTS.LOAD_LEVEL, (index) => this.loadLevel(index))

    // Essential: scene.restart() re-runs create(), so without this every
    // restart would stack another set of handlers on the module-level bus.
    // Registered for DESTROY too — that is the event that fires when the Vue
    // route tears the whole game down rather than just restarting the scene.
    const cleanup = () => {
      offRestart()
      offPause()
      offResume()
      offLoad()
      resetTouchState()
    }
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, cleanup)
    this.events.once(Phaser.Scenes.Events.DESTROY, cleanup)
  }

  // ------------------------------------------------------------------ state

  emitState() {
    bus.emit(EVENTS.STATE, {
      status: this.status,
      score: this.score,
      lives: this.lives,
      fish: this.fishCollected,
      fishTotal: this.fishTotal,
      coins: this.coinsCollected,
      coinTotal: this.coinTotal,
      best: this.best,
      levelIndex: this.levelIndex,
      levelId: this.level.id,
      levelName: this.level.name,
      levelDifficulty: this.level.difficulty,
      levelCount: LEVELS.length,
      isLastLevel: this.isLastLevel
    })
  }

  addScore(points) {
    this.score += points
  }

  // --------------------------------------------------------------- handlers

  onCollectFish(player, fish) {
    if (this.status !== 'playing') return
    this.popCollectible(fish)
    this.fishCollected += 1
    this.addScore(SCORING.FISH)
    playSound('fish')
    bus.emit(EVENTS.FX, { kind: 'fish', points: SCORING.FISH })
    this.emitState()
  }

  onCollectCoin(player, coin) {
    if (this.status !== 'playing') return
    this.popCollectible(coin)
    this.coinsCollected += 1
    this.addScore(SCORING.COIN)
    playSound('coin')
    bus.emit(EVENTS.FX, { kind: 'coin', points: SCORING.COIN })
    this.emitState()
  }

  /** Detach the body immediately, then let the visual finish on its own. */
  popCollectible(item) {
    item.disableBody(true, false)
    this.tweens.add({
      targets: item,
      y: item.y - 12,
      alpha: 0,
      scale: 1.6,
      duration: 260,
      ease: 'Quad.easeOut',
      onComplete: () => item.destroy()
    })
  }

  onHazard() {
    this.loseLife()
  }

  /**
   * Falling out of the world always costs a life.
   *
   * Invulnerability is cleared first on purpose: a respawn placed next to a pit
   * can send the cat straight back over the edge while still blinking, and
   * `takeHit()` would then refuse the hit every frame — leaving the cat falling
   * forever below the kill plane with no game over.
   */
  onFellOutOfWorld() {
    if (this.status !== 'playing') return

    this.player.invulnerableUntil = 0
    this.loseLife()

    if (this.status === 'playing') this.player.setVelocityY(0)
  }

  onReachGoal() {
    if (this.status !== 'playing') return

    this.status = 'complete'
    this.addScore(SCORING.COMPLETE_BONUS)
    this.best = writeBestScore(this.level.id, this.score)
    // Unlock the next level in the picker.
    writeProgress(Math.min(this.levelIndex + 1, LEVELS.length - 1))
    this.player.freeze()
    playSound('complete')

    this.tweens.add({
      targets: this.goal,
      scaleX: 1.15,
      scaleY: 1.15,
      duration: 180,
      yoyo: true,
      repeat: 1
    })

    this.emitState()
  }

  loseLife() {
    if (this.status !== 'playing') return
    if (!this.player.takeHit()) return

    this.lives -= 1
    playSound('hurt')
    bus.emit(EVENTS.FX, { kind: 'hurt' })
    this.cameras.main.shake(180, 0.008)

    if (this.lives <= 0) {
      this.lives = 0
      this.status = 'gameover'
      this.best = writeBestScore(this.level.id, this.score)
      this.player.freeze()
      // A game over triggered by a fall leaves the cat below the kill plane;
      // without this the camera would pan off the level to chase it.
      this.cameras.main.stopFollow()
      playSound('gameover')
      this.emitState()
      return
    }

    // Back to the last patch of ground that was actually stood on, so a pit
    // doesn't send the player all the way to the start of the level. The
    // recorded y is already a resting position, so it is used as-is.
    this.player.respawnAt(this.safePoint.x, this.safePoint.y)
    this.cameras.main.flash(160, 250, 240, 230)
    this.emitState()
  }

  /** Is there a standable tile under this world-space point? */
  hasGroundUnder(worldX, footY) {
    const cx = Math.floor(worldX / TILE_SIZE)
    const cy = Math.floor(footY / TILE_SIZE)
    return this.standable.has(`${cx},${cy}`)
  }

  /**
   * True only when the cat is standing with ground under both shoulders.
   *
   * Respawn points are recorded from this, not from "is grounded" — otherwise
   * the last recorded spot is the very lip of the pit the player just fell
   * into, and they respawn with one step between them and another death.
   */
  onFirmGround() {
    const footY = this.player.body.bottom + 2
    return (
      this.hasGroundUnder(this.player.x - 10, footY) &&
      this.hasGroundUnder(this.player.x + 10, footY)
    )
  }

  restartGame() {
    this.loadLevel(this.levelIndex)
  }

  /**
   * Replay the current level or jump to another one — both are a scene restart
   * carrying a new index, so there is a single path that rebuilds the world and
   * no partially-reset state to get wrong.
   */
  loadLevel(index) {
    resetTouchState()
    this.scene.restart({
      levelIndex: Number.isInteger(index) ? Math.min(Math.max(index, 0), LEVELS.length - 1) : 0
    })
  }

  pauseGame() {
    if (this.status !== 'playing' || this.scene.isPaused()) return
    resetTouchState()
    this.scene.pause()
  }

  resumeGame() {
    if (this.scene.isPaused()) this.scene.resume()
  }

  // ----------------------------------------------------------------- update

  update() {
    if (this.status !== 'playing') return

    const keys = this.keys
    this.player.setInput({
      left: keys.left.isDown || keys.a.isDown || touchState.left,
      right: keys.right.isDown || keys.d.isDown || touchState.right,
      jump: keys.up.isDown || keys.w.isDown || keys.space.isDown || touchState.jump,
      run: keys.shift.isDown || touchState.run
    })

    // The world's left edge is a wall, but its bottom is not — falling out is
    // meant to be fatal, which rules out setCollideWorldBounds.
    if (this.player.x < TILE_SIZE / 2) {
      this.player.x = TILE_SIZE / 2
      this.player.setVelocityX(0)
    }

    if (this.player.body.blocked.down && !this.player.invulnerable) {
      if (Math.abs(this.player.x - this.safePoint.x) > 8 && this.onFirmGround()) {
        this.safePoint = { x: this.player.x, y: this.player.y }
      }
    }

    if (this.player.y > this.worldHeight + FALL_MARGIN) {
      this.onFellOutOfWorld()
    }
  }
}
