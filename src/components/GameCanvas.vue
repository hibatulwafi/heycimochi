<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, shallowRef } from 'vue'
import GameOverlay from './GameOverlay.vue'
import PixelSprite from './PixelSprite.vue'
import TouchControls from './TouchControls.vue'
import { bus, EVENTS } from '@/game/bus.js'
import { isTouchPrimary, resetTouchState } from '@/game/input.js'
import { isEnabled as isAudioEnabled, setEnabled as setAudioEnabled } from '@/game/audio.js'
import { readBestScore, readProgress } from '@/game/storage.js'
import { LEVELS } from '@/game/levels/index.js'
import gameInfo from '@/data/gameInfo.js'

/**
 * Hosts the Phaser game inside Vue.
 *
 * Two deliberate choices:
 *
 * 1. The game is created on an explicit Start press, not on mount. Phaser
 *    captures the arrow keys and space to stop them scrolling the page, and
 *    taking that over before the visitor has asked to play would hijack the
 *    page. It also means no canvas or RAF loop exists until it is wanted.
 * 2. The instance is destroyed on unmount. Without that, navigating away and
 *    back would leak a canvas and a second input binding every time.
 */
const mountPoint = ref(null)
const shell = ref(null)
const game = shallowRef(null)
const booting = ref(false)
const started = ref(false)
const paused = ref(false)
const soundOn = ref(isAudioEnabled())
const showTouch = ref(isTouchPrimary())
const isFullscreen = ref(false)
/** False when the browser refused the landscape lock (iOS, desktop). */
const lockedLandscape = ref(false)
const isPortrait = ref(false)

/**
 * Worth nudging only when rotating would actually help: a touch device, in
 * fullscreen, held upright, where the browser would not rotate for us.
 */
const suggestRotate = computed(
  () => isFullscreen.value && isPortrait.value && !lockedLandscape.value && isTouchPrimary()
)

function syncOrientation() {
  isPortrait.value = window.innerHeight > window.innerWidth
}

/**
 * iOS Safari only allows fullscreen on <video>, so the button is hidden rather
 * than offered and then failing.
 */
const fullscreenSupported =
  typeof document !== 'undefined' &&
  Boolean(document.fullscreenEnabled || document.webkitFullscreenEnabled)

/** Which level the Start button will launch. */
const selected = ref(0)
/** Highest level unlocked so far, so the picker can show progress. */
const unlocked = ref(readProgress())

const levels = LEVELS.map((level, index) => ({ ...level, index }))

const state = reactive({
  status: 'playing',
  score: 0,
  lives: 3,
  fish: 0,
  fishTotal: 0,
  coins: 0,
  coinTotal: 0,
  best: readBestScore(LEVELS[0].id),
  levelIndex: 0,
  levelId: LEVELS[0].id,
  levelName: LEVELS[0].name,
  levelDifficulty: LEVELS[0].difficulty,
  levelCount: LEVELS.length,
  isLastLevel: false
})

/** Floating "+10" marks, keyed so each animates independently. */
const pops = ref([])
let popId = 0

let offState = null
let offFx = null

function onState(next) {
  Object.assign(state, next)
  // Keep the picker in step with whatever the scene actually loaded.
  selected.value = next.levelIndex
  unlocked.value = Math.max(unlocked.value, readProgress())
}

function onFx(fx) {
  if (fx.kind !== 'fish' && fx.kind !== 'coin') return

  const id = ++popId
  // Stagger overlapping pops so a fast pickup streak stays readable.
  const offset = ((id % 5) - 2) * 18
  pops.value = [...pops.value, { id, offset, points: fx.points, kind: fx.kind }]
  setTimeout(() => {
    pops.value = pops.value.filter((pop) => pop.id !== id)
  }, 700)
}

async function start() {
  if (game.value || booting.value) return

  booting.value = true
  try {
    // Dynamic import: Phaser is ~1MB and should not be fetched by anyone who
    // opens /play without pressing Start.
    const { createGame } = await import('@/game/config.js')

    offState = bus.on(EVENTS.STATE, onState)
    offFx = bus.on(EVENTS.FX, onFx)

    /*
     * Flip to the started layout and let the DOM settle *before* booting
     * Phaser. The playfield is a flex child that collapses to zero height
     * while the start gate still occupies the card, and Phaser measures its
     * parent once at boot — handing it a zero-height element produces a
     * zero-sized canvas that never recovers.
     */
    started.value = true
    await nextTick()

    game.value = createGame(mountPoint.value, selected.value)
  } catch (error) {
    console.error('[game] failed to start', error)
    started.value = false
  } finally {
    booting.value = false
  }
}

function destroy() {
  offState?.()
  offFx?.()
  offState = null
  offFx = null

  resetTouchState()

  if (game.value) {
    // `true` also removes the canvas from the DOM.
    game.value.destroy(true)
    game.value = null
  }

  started.value = false
  paused.value = false
}

function restart() {
  bus.emit(EVENTS.RESTART)
  paused.value = false
}

function nextLevel() {
  bus.emit(EVENTS.LOAD_LEVEL, Math.min(state.levelIndex + 1, LEVELS.length - 1))
  paused.value = false
}

/** Before Start this only arms the picker; mid-game it swaps level live. */
function chooseLevel(index) {
  selected.value = index
  if (started.value) {
    bus.emit(EVENTS.LOAD_LEVEL, index)
    paused.value = false
  }
}

function togglePause() {
  paused.value = !paused.value
  bus.emit(paused.value ? EVENTS.PAUSE : EVENTS.RESUME)
}

function toggleSound() {
  // Creates the AudioContext on this click — never before (PRD §10).
  soundOn.value = setAudioEnabled(!soundOn.value)
}

/**
 * Fullscreen takes the whole shell, not just the canvas — otherwise the HUD,
 * the touch buttons and the result overlay would all be left behind on the
 * page, which is the opposite of helpful on a phone.
 */
async function toggleFullscreen() {
  if (!fullscreenSupported || !shell.value) return

  try {
    if (document.fullscreenElement || document.webkitFullscreenElement) {
      await (document.exitFullscreen?.() ?? document.webkitExitFullscreen?.())
      return
    }

    const el = shell.value
    await (el.requestFullscreen?.() ?? el.webkitRequestFullscreen?.())

    // Landscape is the right shape for a 2:1 playfield, and rotating roughly
    // doubles the canvas on a phone. Android honours this; iOS and desktop
    // reject it, which is expected — hence the on-screen hint below rather
    // than an error.
    try {
      await screen.orientation?.lock?.('landscape')
      lockedLandscape.value = true
    } catch {
      lockedLandscape.value = false
    }
  } catch (error) {
    console.warn('[game] fullscreen request refused', error)
  }
}

function onFullscreenChange() {
  isFullscreen.value = Boolean(document.fullscreenElement || document.webkitFullscreenElement)
  syncOrientation()

  // Show the on-screen buttons in fullscreen on a touch device even if they
  // were hidden before — there is no keyboard to fall back on.
  if (isFullscreen.value && isTouchPrimary()) showTouch.value = true

  if (!isFullscreen.value) {
    lockedLandscape.value = false
    try {
      screen.orientation?.unlock?.()
    } catch {
      /* nothing to unlock */
    }
  }

  // The shell changed size; Phaser's FIT scaler needs to re-measure.
  nextTick(() => game.value?.scale?.refresh())
}

onMounted(() => {
  document.addEventListener('fullscreenchange', onFullscreenChange)
  document.addEventListener('webkitfullscreenchange', onFullscreenChange)
  window.addEventListener('resize', syncOrientation, { passive: true })
  syncOrientation()
})

onBeforeUnmount(() => {
  document.removeEventListener('fullscreenchange', onFullscreenChange)
  document.removeEventListener('webkitfullscreenchange', onFullscreenChange)
  window.removeEventListener('resize', syncOrientation)
  // Leaving the route while fullscreen would strand the browser in it.
  if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {})
  destroy()
})

defineExpose({ restart })
</script>

<template>
  <div
    ref="shell"
    class="flex flex-col gap-4"
    :class="isFullscreen && 'h-screen w-screen justify-center gap-2 bg-ink p-2'"
  >
    <!-- 2/1 matches VIEW_WIDTH x VIEW_HEIGHT (320x160), so Scale.FIT has no
         letterboxing to add once the game starts. In fullscreen the aspect
         ratio is dropped so the card can take whatever height is left after
         the touch controls. -->
    <!--
      A column, so the HUD can sit *above* the playfield on a phone instead of
      on top of it. At 360px the canvas is only ~164px tall, and an overlaid
      HUD covered most of it. From `sm` up there is room to spare, so the HUD
      goes back to being an overlay and the card keeps its exact 2:1 ratio.
    -->
    <div
      class="cozy-card relative flex w-full flex-col overflow-hidden"
      :class="
        isFullscreen
          ? 'min-h-0 flex-1 rounded-none! border-0! bg-transparent! shadow-none!'
          : [started ? 'min-h-72 sm:aspect-2/1 sm:min-h-0' : 'min-h-80', 'bg-ice!']
      "
    >

      <!--
        Start gate.

        In normal flow, not `absolute inset-0`: pinned inside a fixed-aspect
        card its content had nowhere to go, and on a narrow phone the cat and
        the buttons were clipped straight off the top and bottom. Letting the
        card grow to fit means the gate is never cut off at any width.
      -->
      <div
        v-if="!started"
        class="relative z-20 flex min-h-80 flex-col items-center justify-center gap-3 bg-ice px-4 py-8 text-center sm:gap-4 sm:px-6"
      >
        <PixelSprite name="catIdle" :scale="4" class="sm:hidden" />
        <PixelSprite name="catIdle" :scale="5" class="hidden sm:block" />
        <h2 class="font-display text-xs sm:text-sm">{{ gameInfo.title }}</h2>
        <p class="max-w-xs text-xs leading-relaxed text-ink-soft">{{ gameInfo.tagline }}</p>

        <!-- Level picker. All five are selectable from the start: this is a
             cat website, not a progression grind, and locking the hard one
             away would mean most visitors never see it. -->
        <div class="flex flex-wrap justify-center gap-1.5" role="group" aria-label="Pilih level">
          <button
            v-for="level in levels"
            :key="level.id"
            type="button"
            :class="['chip px-2.5! py-1!', selected === level.index && 'chip-active']"
            :aria-pressed="selected === level.index"
            :title="`${level.name} — ${level.difficulty}`"
            @click="chooseLevel(level.index)"
          >
            {{ level.index + 1 }}
            <span v-if="level.index <= unlocked" class="opacity-70">✓</span>
          </button>
        </div>
        <p class="text-[0.7rem] font-bold">
          {{ levels[selected].name }}
          <span class="text-ink-soft/70">— {{ levels[selected].difficulty }}</span>
        </p>

        <div class="flex flex-wrap justify-center gap-2">
          <button type="button" class="btn-mocha" :disabled="booting" @click="start">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5.5v13l11-6.5L8 5.5z" />
            </svg>
            {{ booting ? 'Memuat…' : 'Mulai main' }}
          </button>

          <!-- Offered up front too: on a phone you want fullscreen before you
               start, not after fumbling with a 9px HUD button. -->
          <button
            v-if="fullscreenSupported"
            type="button"
            class="btn-ghost"
            @click="toggleFullscreen"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
              <path d="M3 9V3h6M21 9V3h-6M3 15v6h6M21 15v6h-6" />
            </svg>
            Layar penuh
          </button>
        </div>

        <p class="text-[0.65rem] text-ink-soft/60">
          Tombol panah dan spasi akan dipakai game setelah dimulai.
        </p>
      </div>

      <!--
        HUD. In normal flow below `sm` so it sits above the playfield rather
        than covering it; an overlay from `sm` up where there is room.
      -->
      <div
        v-if="started"
        class="pointer-events-none relative z-10 flex shrink-0 flex-wrap items-start justify-between gap-1.5 p-2 sm:absolute sm:inset-x-0 sm:top-0 sm:flex-nowrap sm:gap-2 sm:p-3"
      >
        <div class="flex flex-wrap items-center gap-1.5 sm:flex-col sm:items-start">
          <div class="flex items-center gap-1.5 rounded-xl border-2 border-cream-deep bg-paper/92 px-2.5 py-1.5">
            <span class="text-[0.6rem] font-bold tracking-widest text-ink-soft/60 uppercase">Skor</span>
            <span class="font-display text-[0.7rem]">{{ state.score }}</span>
          </div>

          <div class="flex items-center gap-1.5 rounded-xl border-2 border-cream-deep bg-paper/92 px-2.5 py-1.5">
            <span class="text-[0.6rem] font-bold tracking-widest text-ink-soft/60 uppercase">
              Lv {{ state.levelIndex + 1 }}
            </span>
            <!-- The name is what makes this pill wrap on a 320px phone, and
                 the number already identifies the level. -->
            <span class="hidden text-[0.65rem] font-bold sm:inline">{{ state.levelName }}</span>
          </div>

          <div class="flex items-center gap-2 rounded-xl border-2 border-cream-deep bg-paper/92 px-2.5 py-1.5">
            <span class="flex items-center gap-1 text-[0.65rem] font-bold">
              <PixelSprite name="itemFish" :scale="1" />
              {{ state.fish }}/{{ state.fishTotal }}
            </span>
            <span class="flex items-center gap-1 text-[0.65rem] font-bold">
              <PixelSprite name="itemCoin" :scale="1" />
              {{ state.coins }}/{{ state.coinTotal }}
            </span>
          </div>
        </div>

        <!-- Hearts beside the buttons on a phone so the HUD stays two short
             rows; stacked from `sm` up where it is a corner overlay. -->
        <div class="flex items-center gap-1.5 sm:flex-col sm:items-end">
          <!-- Lives as hearts: filled while they last, hollow once spent. -->
          <div
            class="flex items-center gap-1 rounded-xl border-2 border-cream-deep bg-paper/92 px-2.5 py-2"
            role="status"
            :aria-label="`${state.lives} nyawa tersisa`"
          >
            <PixelSprite
              v-for="n in 3"
              :key="n"
              :name="n <= state.lives ? 'decorHeart' : 'decorHeartEmpty'"
              :scale="2"
            />
          </div>

          <div class="pointer-events-auto flex gap-1.5">
            <button
              type="button"
              class="flex h-8 w-8 items-center justify-center rounded-xl border-2 border-cream-deep bg-paper/92 text-ink-soft transition-colors hover:bg-cream sm:h-9 sm:w-9"
              :aria-label="soundOn ? 'Matikan suara' : 'Nyalakan suara'"
              :aria-pressed="soundOn"
              @click="toggleSound"
            >
              <svg v-if="soundOn" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M4 9v6h4l5 4V5L8 9H4zm12.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4z" />
              </svg>
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M4 9v6h4l5 4V5L8 9H4zm15.1.3-1.4-1.4-2.1 2.1-2.1-2.1-1.4 1.4 2.1 2.1-2.1 2.1 1.4 1.4 2.1-2.1 2.1 2.1 1.4-1.4-2.1-2.1 2.1-2.1z" />
              </svg>
            </button>

            <button
              type="button"
              class="flex h-8 w-8 items-center justify-center rounded-xl border-2 border-cream-deep bg-paper/92 text-ink-soft transition-colors hover:bg-cream sm:h-9 sm:w-9"
              :aria-label="paused ? 'Lanjutkan' : 'Jeda'"
              :aria-pressed="paused"
              @click="togglePause"
            >
              <svg v-if="paused" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5.5v13l11-6.5L8 5.5z" />
              </svg>
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />
              </svg>
            </button>

            <button
              type="button"
              class="flex h-8 w-8 items-center justify-center rounded-xl border-2 border-cream-deep bg-paper/92 text-ink-soft transition-colors hover:bg-cream sm:h-9 sm:w-9"
              aria-label="Mulai ulang"
              @click="restart"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                <path d="M20 12a8 8 0 1 1-2.3-5.6" />
                <path d="M20 4v5h-5" />
              </svg>
            </button>

            <button
              v-if="fullscreenSupported"
              type="button"
              class="flex h-8 w-8 items-center justify-center rounded-xl border-2 border-cream-deep bg-paper/92 text-ink-soft transition-colors hover:bg-cream sm:h-9 sm:w-9"
              :aria-label="isFullscreen ? 'Keluar layar penuh' : 'Layar penuh'"
              :aria-pressed="isFullscreen"
              @click="toggleFullscreen"
            >
              <svg v-if="isFullscreen" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                <path d="M9 3v6H3M15 3v6h6M9 21v-6H3M15 21v-6h6" />
              </svg>
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                <path d="M3 9V3h6M21 9V3h-6M3 15v6h6M21 15v6h-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!--
        The playfield. Takes whatever height is left after the HUD on a phone,
        and the whole card from `sm` up where the HUD is an overlay. Phaser
        measures this element, so Scale.FIT always fits the space the game
        actually has.
      -->
      <div class="relative min-h-0 w-full flex-1">
        <div ref="mountPoint" class="absolute inset-0" />

        <!-- Score pops -->
        <div class="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <span
            v-for="pop in pops"
            :key="pop.id"
            class="animate-score-pop font-display absolute text-[0.7rem]"
            :class="pop.kind === 'fish' ? 'text-rose-deep' : 'text-gold-deep'"
            :style="{ marginLeft: `${pop.offset}px` }"
          >
            +{{ pop.points }}
          </span>
        </div>
      </div>

      <!--
        Rotate hint. Only where it helps: the browser would not rotate for us,
        the phone is upright, and landscape would roughly double the canvas.
      -->
      <p
        v-if="suggestRotate"
        class="pointer-events-none absolute inset-x-0 bottom-2 z-10 text-center text-[0.7rem] font-bold text-cream drop-shadow"
      >
        Putar HP ke samping untuk layar lebih lebar
      </p>

      <!-- Paused -->
      <div
        v-if="started && paused && state.status === 'playing'"
        class="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-ink/60 backdrop-blur-sm"
      >
        <p class="font-display text-xs text-cream">Jeda</p>
        <button type="button" class="btn-mocha" @click="togglePause">Lanjutkan</button>
      </div>

      <GameOverlay
        :status="state.status"
        :state="state"
        @restart="restart"
        @next="nextLevel"
      />
    </div>

    <!-- Level strip: switching mid-run without going back to the start gate.
         Hidden in fullscreen, where vertical space belongs to the playfield. -->
    <div
      v-if="started && !isFullscreen"
      class="flex flex-wrap items-center justify-center gap-1.5"
      role="group"
      aria-label="Pilih level"
    >
      <span class="mr-1 text-[0.65rem] font-bold tracking-widest text-ink-soft/60 uppercase">
        Level
      </span>
      <button
        v-for="level in levels"
        :key="level.id"
        type="button"
        :class="['chip px-2.5! py-1!', state.levelIndex === level.index && 'chip-active']"
        :aria-pressed="state.levelIndex === level.index"
        :title="`${level.name} — ${level.difficulty}`"
        @click="chooseLevel(level.index)"
      >
        {{ level.index + 1 }}
      </button>
      <span class="ml-1 text-[0.7rem] text-ink-soft/70">
        {{ levels[state.levelIndex].difficulty }}
      </span>
    </div>

    <!-- Mobile controls -->
    <div v-if="started" class="flex shrink-0 flex-col gap-3">
      <TouchControls
        v-if="showTouch"
        :disabled="state.status !== 'playing' || paused"
        class="sm:px-4"
      />

      <!-- Stays available in fullscreen on purpose: it is the only way to turn
           the buttons back on, and hiding it would strand a player who had
           switched them off beforehand. -->
      <button
        type="button"
        class="self-center text-[0.7rem] font-bold underline"
        :class="isFullscreen ? 'text-cream/70' : 'text-ink-soft/60'"
        @click="showTouch = !showTouch"
      >
        {{ showTouch ? 'Sembunyikan tombol layar' : 'Tampilkan tombol layar' }}
      </button>
    </div>
  </div>
</template>
