/**
 * A three-method event emitter shared by the Phaser scene and the Vue page.
 *
 * The scene pushes one whole `state` snapshot rather than per-field events, so
 * the HUD and result overlays can never render a half-updated score. Vue sends
 * `command:*` back the other way. Keeping this dependency-free (rather than
 * reaching for Phaser's emitter) means the Vue side never imports Phaser.
 */
class Bus {
  #listeners = new Map()

  on(event, handler) {
    if (!this.#listeners.has(event)) this.#listeners.set(event, new Set())
    this.#listeners.get(event).add(handler)
    return () => this.off(event, handler)
  }

  off(event, handler) {
    this.#listeners.get(event)?.delete(handler)
  }

  emit(event, payload) {
    // Copy before iterating: a handler may unsubscribe itself.
    for (const handler of [...(this.#listeners.get(event) ?? [])]) {
      try {
        handler(payload)
      } catch (error) {
        console.error(`[bus] handler for "${event}" threw`, error)
      }
    }
  }

  /** Drop everything — used when the game is torn down on route change. */
  clear() {
    this.#listeners.clear()
  }
}

export const bus = new Bus()

export const EVENTS = {
  /**
   * Scene → Vue: full snapshot
   * { status, score, lives, fish, coins, best, levelIndex, levelName, isLast }.
   */
  STATE: 'state',
  /** Scene → Vue: transient feedback, { kind: 'fish' | 'coin' | 'hurt' | 'jump' }. */
  FX: 'fx',
  /** Vue → Scene. */
  RESTART: 'command:restart',
  PAUSE: 'command:pause',
  RESUME: 'command:resume',
  /** Vue → Scene: payload is the level index to load. */
  LOAD_LEVEL: 'command:load-level'
}

export default bus
