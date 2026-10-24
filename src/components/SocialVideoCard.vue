<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import PhotoFrame from './PhotoFrame.vue'
import PixelSprite from './PixelSprite.vue'
import SocialIcon from './SocialIcon.vue'

/**
 * A single social video.
 *
 * Carries AC #4 and #5: the card renders from local data alone, the embed is
 * strictly optional, and a failed embed must not break the layout or strand the
 * visitor. Three deliberate behaviours:
 *
 * 1. Click-to-load. The iframe is only created once the visitor asks for it, so
 *    opening /socials makes zero third-party requests (PRD §10).
 * 2. A load watchdog. A cross-origin iframe fires `load` even for an error page,
 *    so `load` can't prove success — but a timeout does catch the cases that
 *    matter (blocked embed, offline, deleted post) and flips to the fallback.
 * 3. The source link is always present, in every state.
 */
const props = defineProps({
  video: { type: Object, required: true }
})

const PLATFORMS = {
  instagram: { label: 'Instagram', badge: 'bg-rose-deep text-white border-rose-shadow' },
  tiktok: { label: 'TikTok', badge: 'bg-ink text-cream border-ink' },
  youtube: { label: 'YouTube', badge: 'bg-[#d64541] text-white border-[#a83733]' }
}

const EMBED_TIMEOUT_MS = 8000

/** 'thumb' | 'loading' | 'playing' | 'failed' */
const state = ref('thumb')
let watchdog = null

const platform = computed(() => PLATFORMS[props.video.platform] ?? {
  label: props.video.platform || 'Video',
  badge: 'bg-cream-deep text-ink border-cream-deep'
})

const hasEmbed = computed(() => Boolean(props.video.embedUrl?.trim()))
const hasSource = computed(() => Boolean(props.video.videoUrl?.trim()))
const ratio = computed(() =>
  props.video.orientation === 'square' ? 'aspect-square' : 'aspect-[9/16]'
)

function clearWatchdog() {
  if (watchdog !== null) {
    clearTimeout(watchdog)
    watchdog = null
  }
}

function play() {
  if (!hasEmbed.value) return
  state.value = 'loading'
  clearWatchdog()
  watchdog = setTimeout(() => {
    if (state.value === 'loading') state.value = 'failed'
  }, EMBED_TIMEOUT_MS)
}

function onLoaded() {
  clearWatchdog()
  state.value = 'playing'
}

function onError() {
  clearWatchdog()
  state.value = 'failed'
}

function retry() {
  state.value = 'thumb'
}

onBeforeUnmount(clearWatchdog)
</script>

<template>
  <article class="cozy-card cozy-card-hover flex flex-col overflow-hidden">
    <div :class="[ratio, 'relative w-full bg-cream-deep/50']">
      <!-- Thumbnail -->
      <template v-if="state === 'thumb'">
        <PhotoFrame
          :src="video.thumbnail"
          :alt="video.title"
          :ratio="ratio"
          rounded="rounded-none"
          class="border-0!"
          :placeholder-scale="5"
          placeholder-note="Thumbnail menyusul"
        />

        <button
          v-if="hasEmbed"
          type="button"
          class="group absolute inset-0 flex items-center justify-center bg-ink/0 transition-colors duration-200 hover:bg-ink/25"
          :aria-label="`Putar ${video.title}`"
          @click="play"
        >
          <span
            class="flex h-14 w-14 items-center justify-center rounded-full border-2 border-ink/15 bg-paper/95 shadow-cozy transition-transform duration-200 group-hover:scale-110"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5.5v13l11-6.5L8 5.5z" />
            </svg>
          </span>
        </button>

        <!-- No embed available: the card is still a working link out. -->
        <a
          v-else-if="hasSource"
          :href="video.videoUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="group absolute inset-0 flex items-end justify-center p-4 transition-colors duration-200 hover:bg-ink/20"
          :aria-label="`Buka ${video.title} di ${platform.label}`"
        >
          <span class="btn-ghost px-4! py-2! text-xs!">
            Tonton di {{ platform.label }}
          </span>
        </a>
      </template>

      <!-- Embed -->
      <template v-else-if="state === 'loading' || state === 'playing'">
        <iframe
          :src="video.embedUrl"
          :title="video.title"
          class="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
          @load="onLoaded"
          @error="onError"
        />
        <div
          v-if="state === 'loading'"
          class="absolute inset-0 flex items-center justify-center bg-cream"
        >
          <PixelSprite name="catIdle" :scale="4" />
        </div>
      </template>

      <!-- Fallback. The layout is intact and the real video is one tap away. -->
      <div
        v-else
        class="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-cream px-5 text-center"
      >
        <PixelSprite name="catIdle" :scale="4" class="opacity-70" />
        <p class="text-xs leading-relaxed font-bold text-ink-soft">
          Video tidak bisa ditampilkan di sini.
        </p>
        <div class="flex flex-col items-center gap-2">
          <a
            v-if="hasSource"
            :href="video.videoUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-rose px-4! py-2! text-xs!"
          >
            Buka di {{ platform.label }}
          </a>
          <button type="button" class="text-[0.7rem] font-bold text-ink-soft/70 underline" @click="retry">
            Coba lagi
          </button>
        </div>
      </div>
    </div>

    <div class="flex flex-1 flex-col gap-2 p-4">
      <span
        :class="[
          'inline-flex w-fit items-center gap-1.5 rounded-full border-2 px-2.5 py-1 text-[0.65rem] font-bold',
          platform.badge
        ]"
      >
        <SocialIcon :name="video.platform" :size="12" />
        {{ platform.label }}
      </span>

      <h3 class="text-sm leading-snug font-bold">{{ video.title }}</h3>
      <p v-if="video.caption" class="text-xs leading-relaxed text-ink-soft">
        {{ video.caption }}
      </p>

      <a
        v-if="hasSource"
        :href="video.videoUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="mt-auto inline-flex items-center gap-1 pt-2 text-xs font-bold text-mocha-shadow hover:underline"
      >
        Lihat sumber asli
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true">
          <path d="M7 17 17 7M9 7h8v8" />
        </svg>
      </a>
      <p v-else class="mt-auto pt-2 text-xs text-ink-soft/60">Tautan menyusul.</p>
    </div>
  </article>
</template>
