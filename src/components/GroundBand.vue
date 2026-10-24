<script setup>
import PixelSprite from './PixelSprite.vue'
import PixelStrip from './PixelStrip.vue'

/**
 * The garden floor that closes every page, just above the footer.
 *
 * Grass, dirt and fence are repeating CSS backgrounds rather than tiled
 * canvases — covering a 1440px page with 16px tiles would otherwise take ~90
 * <canvas> elements for pure decoration. Only the handful of one-off props
 * (tufts, flowers, the cat) are real sprites.
 */
defineProps({
  /** Hide the cat when a page already ends with one. */
  withCat: { type: Boolean, default: true }
})
</script>

<template>
  <section class="relative mt-16 overflow-hidden" aria-hidden="true">
    <!-- Sky above the grass line. The gradient keeps the cream page from
         meeting the blue in a hard line. -->
    <div
      class="relative h-28 sm:h-36"
      :style="{
        background:
          'linear-gradient(to bottom, var(--color-cream) 0%, var(--color-ice-light) 42%, var(--color-ice) 100%)'
      }"
    >
      <PixelStrip
        name="decorFence"
        :scale="3"
        :height="22"
        anchor="bottom"
        class="absolute inset-x-0 bottom-0 opacity-90"
      />

      <!-- Scattered props sitting on the grass line. -->
      <div class="absolute inset-x-0 bottom-0 flex items-end justify-between px-[6vw]">
        <PixelSprite name="decorGrassTuft" :scale="3" class="animate-sway" />
        <PixelSprite
          name="decorFlowerRose"
          :scale="3"
          class="animate-sway"
          style="animation-delay: -1.1s"
        />
        <PixelSprite name="decorBush" :scale="3" class="hidden sm:block" />
        <PixelSprite
          v-if="withCat"
          name="catIdle"
          :scale="4"
          class="animate-float"
        />
        <PixelSprite
          name="decorFlowerGold"
          :scale="3"
          class="animate-sway"
          style="animation-delay: -2.3s"
        />
        <PixelSprite name="decorGrassTuft" :scale="3" class="animate-sway hidden sm:block" />
        <PixelSprite
          name="decorFlowerRose"
          :scale="3"
          class="animate-sway"
          style="animation-delay: -0.6s"
        />
      </div>
    </div>

    <!-- Grass cap, then dirt down to the footer. -->
    <PixelStrip name="tileGrass" :scale="3" :height="18" class="relative" />
    <PixelStrip name="tileDirt" :scale="3" :height="36" class="relative" />
  </section>
</template>
