<script setup>
import PixelSprite from './PixelSprite.vue'

defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  sprite: { type: String, default: '' },
  center: { type: Boolean, default: false },
  /** Heading level — pages use h1, sections use h2. */
  as: { type: String, default: 'h2' }
})
</script>

<template>
  <div :class="['flex flex-col gap-3', center && 'items-center text-center']">
    <div v-if="eyebrow || sprite" class="flex items-center gap-2">
      <!-- No fps: each sprite supplies its own cadence, or stays still. -->
      <PixelSprite v-if="sprite" :name="sprite" :scale="2" />
      <span
        v-if="eyebrow"
        class="text-xs font-bold tracking-[0.18em] text-mocha-shadow uppercase"
      >
        {{ eyebrow }}
      </span>
    </div>

    <component :is="as" class="font-display text-lg leading-snug sm:text-xl lg:text-2xl">
      {{ title }}
    </component>

    <p v-if="subtitle" :class="['max-w-2xl leading-relaxed text-ink-soft', center && 'mx-auto']">
      {{ subtitle }}
    </p>
  </div>
</template>
