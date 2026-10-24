<script setup>
import PixelSprite from './PixelSprite.vue'

/**
 * Clouds drifting across a sky panel.
 *
 * Each cloud is one canvas moved by a CSS keyframe on `transform`, so the
 * whole layer costs a handful of composited elements and zero JavaScript per
 * frame. Durations and offsets are fixed rather than random so the sky looks
 * the same on every visit and on every re-render.
 *
 * The parent must be `position: relative` and clip overflow.
 */
defineProps({
  /** Fewer, slower clouds read as calmer; more reads as busier. */
  density: { type: String, default: 'normal' }
})

// top: % down the panel · scale: pixel upscale · duration/delay: seconds
const CLOUDS = [
  { top: 8, scale: 3, duration: 62, delay: 0, opacity: 0.95 },
  { top: 26, scale: 2, duration: 84, delay: -22, opacity: 0.75 },
  { top: 46, scale: 2, duration: 72, delay: -48, opacity: 0.6 },
  { top: 16, scale: 4, duration: 96, delay: -66, opacity: 0.85 }
]
</script>

<template>
  <div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
    <PixelSprite
      v-for="(cloud, i) in density === 'sparse' ? CLOUDS.slice(0, 2) : CLOUDS"
      :key="i"
      name="decorCloud"
      :scale="cloud.scale"
      class="animate-drift absolute left-0"
      :style="{
        top: `${cloud.top}%`,
        opacity: cloud.opacity,
        animationDuration: `${cloud.duration}s`,
        animationDelay: `${cloud.delay}s`
      }"
    />
  </div>
</template>
