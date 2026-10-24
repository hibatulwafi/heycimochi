<script setup>
import { computed, ref, watch } from 'vue'
import PixelSprite from './PixelSprite.vue'

/**
 * A real photo with a graceful empty state.
 *
 * `public/images/` ships empty, so every photo in src/data points at a file
 * that may not exist yet. Rather than broken-image icons, a missing or failed
 * load falls back to a pixel placeholder at the same aspect ratio — the layout
 * never shifts and the page still looks intentional.
 */
const props = defineProps({
  src: { type: String, default: '' },
  alt: { type: String, default: '' },
  /** Tailwind aspect utility, e.g. 'aspect-square', 'aspect-[4/5]'. */
  ratio: { type: String, default: 'aspect-[4/3]' },
  rounded: { type: String, default: 'rounded-cozy' },
  /** Above-the-fold images should load eagerly. */
  eager: { type: Boolean, default: false },
  placeholderSprite: { type: String, default: 'catIdle' },
  placeholderScale: { type: Number, default: 4 },
  placeholderNote: { type: String, default: '' }
})

const failed = ref(false)
const loaded = ref(false)

const showPhoto = computed(() => Boolean(props.src) && !failed.value)

// A new src deserves a fresh attempt.
watch(
  () => props.src,
  () => {
    failed.value = false
    loaded.value = false
  }
)
</script>

<template>
  <figure
    :class="[
      ratio,
      rounded,
      'relative w-full overflow-hidden border-2 border-cream-deep bg-cream-deep/60'
    ]"
  >
    <img
      v-if="showPhoto"
      :src="src"
      :alt="alt"
      :loading="eager ? 'eager' : 'lazy'"
      :fetchpriority="eager ? 'high' : 'auto'"
      decoding="async"
      class="h-full w-full object-cover transition-opacity duration-300"
      :class="loaded ? 'opacity-100' : 'opacity-0'"
      @load="loaded = true"
      @error="failed = true"
    />

    <!-- Empty state. Also sits under the photo while it decodes, so there is
         never a blank rectangle. -->
    <div
      v-if="!showPhoto || !loaded"
      class="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-cream px-3 text-center"
      :aria-hidden="showPhoto ? 'true' : undefined"
    >
      <PixelSprite
        :name="placeholderSprite"
        :scale="placeholderScale"
        :fps="2"
        class="opacity-60"
      />
      <figcaption v-if="!showPhoto" class="text-[0.65rem] leading-tight font-bold text-ink-soft/70">
        {{ placeholderNote || alt || 'Foto menyusul' }}
      </figcaption>
    </div>
  </figure>
</template>
