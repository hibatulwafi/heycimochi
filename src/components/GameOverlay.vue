<script setup>
import { computed } from 'vue'
import PixelSprite from './PixelSprite.vue'

/**
 * Game Over / Level Complete screens.
 *
 * Rendered in Vue over the canvas rather than as Phaser text: it stays legible
 * at every canvas scale, reuses the site's buttons and type, and keeps the
 * result copy out of the game loop.
 */
const props = defineProps({
  /** 'playing' | 'gameover' | 'complete' */
  status: { type: String, required: true },
  state: { type: Object, required: true }
})

defineEmits(['restart', 'next'])

const isComplete = computed(() => props.status === 'complete')
const visible = computed(() => props.status === 'gameover' || props.status === 'complete')

const newBest = computed(
  () => props.state.score > 0 && props.state.score >= props.state.best
)

/** Finishing the last level ends the whole run, not just the level. */
const finishedAll = computed(() => isComplete.value && props.state.isLastLevel)

const heading = computed(() => {
  if (!isComplete.value) return 'Game Over'
  return finishedAll.value ? 'Tamat!' : 'Level Complete!'
})

const message = computed(() => {
  if (!isComplete.value) return 'Mochi kehabisan nyawa. Mau coba lagi?'
  return finishedAll.value
    ? 'Kelima level selesai. Mochi resmi menguasai seluruh taman.'
    : 'Mochi sampai di keranjangnya dengan selamat.'
})
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0"
    leave-active-class="transition duration-200 ease-in"
    leave-to-class="opacity-0"
  >
    <div
      v-if="visible"
      class="absolute inset-0 z-20 flex items-center justify-center bg-ink/70 p-4 backdrop-blur-sm"
      role="alertdialog"
      aria-live="assertive"
      :aria-label="isComplete ? 'Level selesai' : 'Permainan berakhir'"
    >
      <div class="cozy-card w-full max-w-sm p-6 text-center sm:p-8">
        <div class="flex justify-center">
          <PixelSprite
            :name="isComplete ? 'catIdle' : 'catFall'"
            :scale="6"
            :fps="isComplete ? 2 : 0"
          />
        </div>

        <p class="mt-4 text-[0.65rem] font-bold tracking-widest text-ink-soft/60 uppercase">
          Level {{ state.levelIndex + 1 }}/{{ state.levelCount }} — {{ state.levelName }}
        </p>

        <h2 class="font-display mt-2 text-sm sm:text-base">{{ heading }}</h2>

        <p class="mt-3 text-sm leading-relaxed text-ink-soft">{{ message }}</p>

        <dl class="mt-5 grid grid-cols-3 gap-2 border-y-2 border-cream-deep py-4">
          <div>
            <dt class="text-[0.6rem] font-bold tracking-widest text-ink-soft/60 uppercase">Skor</dt>
            <dd class="font-display mt-1 text-xs">{{ state.score }}</dd>
          </div>
          <div>
            <dt class="text-[0.6rem] font-bold tracking-widest text-ink-soft/60 uppercase">Ikan</dt>
            <dd class="font-display mt-1 text-xs">{{ state.fish }}/{{ state.fishTotal }}</dd>
          </div>
          <div>
            <dt class="text-[0.6rem] font-bold tracking-widest text-ink-soft/60 uppercase">Koin</dt>
            <dd class="font-display mt-1 text-xs">{{ state.coins }}/{{ state.coinTotal }}</dd>
          </div>
        </dl>

        <p v-if="newBest" class="mt-3 text-xs font-bold text-rose-deep">
          Rekor baru di perangkat ini!
        </p>
        <p v-else class="mt-3 text-xs text-ink-soft/70">Rekor terbaik: {{ state.best }}</p>

        <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            v-if="isComplete && !finishedAll"
            type="button"
            class="btn-rose"
            @click="$emit('next')"
          >
            Lanjut ke level {{ state.levelIndex + 2 }}
          </button>
          <button type="button" class="btn-mocha" @click="$emit('restart')">
            {{ finishedAll ? 'Main lagi' : 'Ulangi level' }}
          </button>
          <RouterLink v-if="!isComplete || finishedAll" to="/memories" class="btn-ghost">
            Lihat kenangan
          </RouterLink>
        </div>
      </div>
    </div>
  </Transition>
</template>
