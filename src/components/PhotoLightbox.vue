<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import PixelSprite from './PixelSprite.vue'

/**
 * Minimal gallery overlay — Escape to close, arrows to page, backdrop to dismiss.
 * Controlled by the parent via `modelValue` (the active index, or null).
 */
const props = defineProps({
  items: { type: Array, required: true },
  modelValue: { type: Number, default: null }
})

const emit = defineEmits(['update:modelValue'])

const failed = ref(false)
const open = computed(() => props.modelValue !== null && props.items.length > 0)
const current = computed(() => (open.value ? props.items[props.modelValue] : null))

function close() {
  emit('update:modelValue', null)
}

function step(delta) {
  if (!open.value) return
  const count = props.items.length
  emit('update:modelValue', (props.modelValue + delta + count) % count)
}

function onKeydown(event) {
  if (!open.value) return
  if (event.key === 'Escape') close()
  else if (event.key === 'ArrowRight') step(1)
  else if (event.key === 'ArrowLeft') step(-1)
}

watch(open, (isOpen) => {
  document.body.style.overflow = isOpen ? 'hidden' : ''
  if (isOpen) window.addEventListener('keydown', onKeydown)
  else window.removeEventListener('keydown', onKeydown)
})

watch(() => props.modelValue, () => { failed.value = false })

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <Transition
    enter-active-class="transition-opacity duration-200"
    enter-from-class="opacity-0"
    leave-active-class="transition-opacity duration-150"
    leave-to-class="opacity-0"
  >
    <div
      v-if="open"
      class="fixed inset-0 z-[70] flex items-center justify-center bg-ink/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      :aria-label="current?.alt || current?.title || 'Foto'"
      @click.self="close"
    >
      <button
        type="button"
        class="absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-xl border-2 border-cream-deep bg-paper text-ink"
        aria-label="Tutup"
        @click="close"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true">
          <path d="M5 5l14 14M19 5 5 19" />
        </svg>
      </button>

      <button
        v-if="items.length > 1"
        type="button"
        class="absolute left-3 flex h-11 w-11 items-center justify-center rounded-xl border-2 border-cream-deep bg-paper text-ink sm:left-6"
        aria-label="Foto sebelumnya"
        @click.stop="step(-1)"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true">
          <path d="M15 5 8 12l7 7" />
        </svg>
      </button>

      <figure class="flex max-h-full w-full max-w-3xl flex-col items-center gap-3" @click.stop>
        <img
          v-if="current?.src && !failed"
          :src="current.src"
          :alt="current.alt || current.title || ''"
          class="max-h-[72vh] w-auto rounded-cozy border-2 border-cream-deep bg-paper object-contain"
          @error="failed = true"
        />
        <div
          v-else
          class="flex aspect-[4/3] w-full max-w-md flex-col items-center justify-center gap-3 rounded-cozy border-2 border-cream-deep bg-cream"
        >
          <PixelSprite name="catIdle" :scale="6" class="opacity-70" />
          <p class="text-xs font-bold text-ink-soft">Foto ini belum tersedia.</p>
        </div>

        <figcaption v-if="current?.title || current?.alt" class="text-center text-sm font-bold text-cream">
          {{ current.title || current.alt }}
          <span v-if="items.length > 1" class="ml-2 text-xs font-normal text-cream/60">
            {{ modelValue + 1 }} / {{ items.length }}
          </span>
        </figcaption>
      </figure>

      <button
        v-if="items.length > 1"
        type="button"
        class="absolute right-3 flex h-11 w-11 items-center justify-center rounded-xl border-2 border-cream-deep bg-paper text-ink sm:right-6"
        aria-label="Foto berikutnya"
        @click.stop="step(1)"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true">
          <path d="m9 5 7 7-7 7" />
        </svg>
      </button>
    </div>
  </Transition>
</template>
