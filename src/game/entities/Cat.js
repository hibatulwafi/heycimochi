import Phaser from 'phaser'
import { HURT_INVULN_MS, PHYSICS } from '../config.js'
import { textureKey } from '../textures.js'

/**
 * Mochi.
 *
 * The controls carry three standard platformer affordances, because without
 * them a 16px character on 16px tiles feels broken rather than merely simple:
 *
 *   - Coyote time: a jump registers briefly after walking off a ledge.
 *   - Jump buffering: a jump pressed just before landing fires on touchdown.
 *   - Variable height: releasing jump early cuts the rise short.
 *
 * `setInput()` takes an already-merged intent object, so the entity never has
 * to know whether the player is on a keyboard or a touchscreen.
 */
export default class Cat extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, textureKey('catIdle'))

    scene.add.existing(this)
    scene.physics.add.existing(this)

    // The sprite is 16x16 but the drawn cat is inset; a body matching the art
    // keeps the ear tips from snagging on ceilings and ledges.
    this.body.setSize(10, 12)
    this.body.setOffset(3, 4)
    this.body.setMaxVelocity(260, 700)

    this.setDepth(10)

    this.facing = 1
    this.isDead = false
    this.invulnerableUntil = 0

    this.intent = { left: false, right: false, jump: false, run: false }
    this.lastGroundedAt = 0
    this.jumpQueuedAt = -Infinity
    this.wasJumpDown = false
    /** Armed by a jump, spent by the first early release. */
    this.canCutJump = false

    this.play('cat-idle')
  }

  setInput(intent) {
    this.intent = intent
  }

  get invulnerable() {
    return this.scene.time.now < this.invulnerableUntil
  }

  /** Starts the hurt flash and returns false if a hit should be ignored. */
  takeHit() {
    if (this.invulnerable || this.isDead) return false

    this.invulnerableUntil = this.scene.time.now + HURT_INVULN_MS
    return true
  }

  /**
   * Puts Mochi back on solid ground after losing a life.
   *
   * Must be `body.reset()`, not `setPosition()`. A respawn teleports the cat
   * from below the kill plane back up to the ledge, and Arcade physics resolves
   * collisions using the body's previous position: after a plain setPosition it
   * sees a huge upward delta, decides the cat is entering the tile from beneath,
   * and separates it *downward* — dropping it through the floor and wedging it
   * inside the terrain with movement blocked. `reset()` syncs prev/prevFrame to
   * the new position, so the next step starts from a clean slate.
   */
  respawnAt(x, y) {
    this.isDead = false
    this.body.enable = true
    this.body.reset(x, y)
    this.setAlpha(1)
  }

  /** Freezes the body — used for game over and level complete. */
  freeze() {
    this.isDead = true
    this.setVelocity(0, 0)
    this.body.enable = false
    this.play('cat-idle', true)
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta)
    if (this.isDead) return

    const onGround = this.body.blocked.down || this.body.touching.down
    if (onGround) this.lastGroundedAt = time

    // --- horizontal -------------------------------------------------------
    const speed = this.intent.run ? PHYSICS.RUN_SPEED : PHYSICS.WALK_SPEED
    const direction = (this.intent.right ? 1 : 0) - (this.intent.left ? 1 : 0)

    if (direction !== 0) {
      this.setVelocityX(direction * speed)
      this.facing = direction
      this.setFlipX(direction < 0)
    } else {
      // Snap to a stop rather than drifting; precision matters more than
      // momentum on platforms this small.
      this.setVelocityX(0)
    }

    // --- jump -------------------------------------------------------------
    const jumpPressed = this.intent.jump && !this.wasJumpDown
    if (jumpPressed) this.jumpQueuedAt = time

    const withinCoyote = time - this.lastGroundedAt <= PHYSICS.COYOTE_MS
    const bufferedJump = time - this.jumpQueuedAt <= PHYSICS.JUMP_BUFFER_MS

    if (bufferedJump && (onGround || withinCoyote) && this.body.velocity.y >= -40) {
      this.setVelocityY(-PHYSICS.JUMP_VELOCITY)
      this.jumpQueuedAt = -Infinity
      this.lastGroundedAt = -Infinity
      this.canCutJump = true
      this.emit('jumped')
    }

    // Variable jump height: cut the rise once, on the first early release.
    // `canCutJump` is what keeps this from re-firing every frame the button is
    // up, which would compound 0.45x per frame and erase the jump outright.
    if (this.canCutJump && !this.intent.jump && this.body.velocity.y < 0) {
      this.setVelocityY(this.body.velocity.y * PHYSICS.JUMP_CUT_MULTIPLIER)
      this.canCutJump = false
    }
    if (onGround || this.body.velocity.y >= 0) this.canCutJump = false

    this.wasJumpDown = this.intent.jump

    // --- animation --------------------------------------------------------
    let next = 'cat-idle'
    if (!onGround) next = this.body.velocity.y < 0 ? 'cat-jump' : 'cat-fall'
    else if (direction !== 0) next = 'cat-run'

    if (this.anims.currentAnim?.key !== next) this.play(next, true)

    // Blink through the invulnerability window so a hit is legible.
    this.setAlpha(this.invulnerable && Math.floor(time / 90) % 2 === 0 ? 0.35 : 1)
  }
}
