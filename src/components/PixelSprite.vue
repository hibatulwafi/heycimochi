<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { drawFrame, frameSize } from '@/pixel/render.js'
import { getSprite } from '@/pixel/sprites/index.js'

/**
 * Renders a sprite from src/pixel/sprites to a <canvas>.
 *
 * The same art the Phaser game uses, drawn through the same renderer — which is
 * why the site and the game can't drift. Pass `fps` to animate multi-frame
 * sprites; it respects prefers-reduced-motion and pauses when offscreen.
 */
const props = defineProps({
  /** Sprite name from the registry, e.g. 'catIdle', 'decorPaw'. */
  name: { type: String, required: true },
  /** Integer upscale factor. Non-integers blur the grid, so keep it whole. */
  scale: { type: Number, default: 4 },
  /**
   * 0 = show a single frame (`frame`); > 0 animates.
   * Omit to use the sprite's own `fps` if it declares one.
   */
  fps: { type: Number, default: 0 },
  frame: { type: Number, default: 0 },
  /** Replay order override, e.g. [0, 1, 2, 1] for a coin spin. */
  frameOrder: { type: Array, default: null },
  flip: { type: Boolean, default: false },
  /** Decorative by default; pass alt text to expose it to screen readers. */
  alt: { type: String, default: '' }
})

const canvas = ref(null)
const sprite = computed(() => getSprite(props.name))

const size = computed(() => {
  if (!sprite.value) return { width: 0, height: 0 }
  return frameSize(sprite.value, 0)
})

/**
 * Playback order, most specific first: an explicit prop, then the sprite's own
 * declared `cycle`, then every frame in sequence. Letting the sprite carry its
 * cadence means the cat idles identically here and in the game, instead of each
 * call site picking its own timing.
 */
const order = computed(() => {
  if (!sprite.value) return [0]
  if (props.frameOrder?.length) return props.frameOrder
  if (sprite.value.cycle?.length) return sprite.value.cycle
  return sprite.value.frames.map((_, i) => i)
})

const rate = computed(() => props.fps || sprite.value?.fps || 0)

let rafId = null
let lastSwap = 0
let cursor = 0
let observer = null
let visible = true

function paint(frameIndex) {
  const el = canvas.value
  if (!el || !sprite.value) return

  const ctx = el.getContext('2d')
  ctx.imageSmoothingEnabled = false
  ctx.clearRect(0, 0, el.width, el.height)
  drawFrame(ctx, sprite.value, frameIndex, props.scale)
}

function tick(now) {
  rafId = requestAnimationFrame(tick)
  if (!visible) return

  const interval = 1000 / rate.value
  if (now - lastSwap < interval) return

  lastSwap = now
  cursor = (cursor + 1) % order.value.length
  paint(order.value[cursor])
}

function stop() {
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
}

function start() {
  stop()

  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const animate = rate.value > 0 && order.value.length > 1 && !reduced

  if (!animate) {
    paint(order.value[Math.min(props.frame, order.value.length - 1)] ?? 0)
    return
  }

  cursor = 0
  lastSwap = 0
  paint(order.value[0])
  rafId = requestAnimationFrame(tick)
}

onMounted(() => {
  // Animating a sprite scrolled out of view is wasted battery on mobile.
  if ('IntersectionObserver' in window && canvas.value) {
    observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
      },
      { rootMargin: '64px' }
    )
    observer.observe(canvas.value)
  }
  start()
})

onBeforeUnmount(() => {
  stop()
  observer?.disconnect()
})

watch(() => [props.name, props.scale, props.fps, props.frame], start)
</script>

<template>
  <canvas
    v-if="sprite"
    ref="canvas"
    :width="size.width * scale"
    :height="size.height * scale"
    :class="['pixelated block', flip && 'scale-x-[-1]']"
    :role="alt ? 'img' : 'presentation'"
    :aria-label="alt || undefined"
    :aria-hidden="alt ? undefined : 'true'"
  />
</template>
