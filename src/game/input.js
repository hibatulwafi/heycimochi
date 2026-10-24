/**
 * Touch input, as a plain mutable object.
 *
 * TouchControls.vue writes to it on pointer events; GameScene reads it each
 * frame and ORs it with the keyboard. No events, no Phaser imports on the Vue
 * side, and nothing to unsubscribe — the scene simply stops reading when it
 * shuts down.
 */
export const touchState = {
  left: false,
  right: false,
  jump: false,
  run: false
}

export function resetTouchState() {
  touchState.left = false
  touchState.right = false
  touchState.jump = false
  touchState.run = false
}

/**
 * True when the device is touch-primary. Used to decide whether to show the
 * on-screen buttons by default — `pointer: coarse` is more reliable than
 * sniffing the user agent, and a hybrid laptop still gets the keyboard hints.
 */
export function isTouchPrimary() {
  if (typeof window === 'undefined') return false
  return window.matchMedia?.('(pointer: coarse)').matches ?? false
}
