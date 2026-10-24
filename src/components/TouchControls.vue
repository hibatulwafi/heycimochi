<script setup>
import { onBeforeUnmount, onMounted } from 'vue'
import { resetTouchState, touchState } from '@/game/input.js'

/**
 * On-screen D-pad.
 *
 * Writes straight into the shared `touchState` object that GameScene polls each
 * frame — no events, no Phaser import on this side.
 *
 * Pointer events rather than touch events, so a mouse or stylus works too, and
 * `setPointerCapture` keeps a button held when the finger slides off it. Note
 * that `pointerleave` still fires while captured, so it must NOT be used to
 * release — a sliding finger would cancel its own press. The window-level
 * listeners below are the safety net instead: whatever happens, lifting the
 * pointer anywhere clears every key, so the cat can never be left running.
 */
defineProps({
  disabled: { type: Boolean, default: false }
})

function press(key, event) {
  event.preventDefault()
  touchState[key] = true
  event.currentTarget.setPointerCapture?.(event.pointerId)
}

function release(key, event) {
  event.preventDefault()
  touchState[key] = false
}

function releaseAll() {
  resetTouchState()
}

onMounted(() => {
  window.addEventListener('pointerup', releaseAll)
  window.addEventListener('pointercancel', releaseAll)
  // Switching tabs mid-press should not leave an input stuck down.
  window.addEventListener('blur', releaseAll)
})

onBeforeUnmount(() => {
  window.removeEventListener('pointerup', releaseAll)
  window.removeEventListener('pointercancel', releaseAll)
  window.removeEventListener('blur', releaseAll)
  resetTouchState()
})
</script>

<template>
  <div
    class="flex items-end justify-between gap-4 select-none"
    :class="disabled && 'pointer-events-none opacity-40'"
  >
    <div class="flex gap-3">
      <button
        type="button"
        class="flex h-16 w-16 touch-none items-center justify-center rounded-2xl border-2 border-mocha-shadow bg-mocha-deep text-white shadow-cozy active:translate-y-0.5 active:bg-mocha-shadow"
        aria-label="Gerak ke kiri"
        @pointerdown="press('left', $event)"
        @pointerup="release('left', $event)"
        @contextmenu.prevent
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M15 4 7 12l8 8z" />
        </svg>
      </button>

      <button
        type="button"
        class="flex h-16 w-16 touch-none items-center justify-center rounded-2xl border-2 border-mocha-shadow bg-mocha-deep text-white shadow-cozy active:translate-y-0.5 active:bg-mocha-shadow"
        aria-label="Gerak ke kanan"
        @pointerdown="press('right', $event)"
        @pointerup="release('right', $event)"
        @contextmenu.prevent
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M9 4l8 8-8 8z" />
        </svg>
      </button>
    </div>

    <button
      type="button"
      class="flex h-20 w-20 touch-none flex-col items-center justify-center gap-0.5 rounded-full border-2 border-rose-shadow bg-rose-deep text-white shadow-cozy active:translate-y-0.5 active:bg-rose-shadow"
      aria-label="Lompat"
      @pointerdown="press('jump', $event)"
      @pointerup="release('jump', $event)"
      @contextmenu.prevent
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 4 4 13h5v7h6v-7h5z" />
      </svg>
      <span class="text-[0.6rem] font-bold">LOMPAT</span>
    </button>
  </div>
</template>
