<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import PhotoFrame from './PhotoFrame.vue'
import PixelSprite from './PixelSprite.vue'
import SocialIcon from './SocialIcon.vue'
import siteConfig from '@/data/siteConfig.js'

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
  video: { type: Object, required: true },
  /**
   * Load the embed on scroll instead of waiting for a tap.
   * Defaults to `siteConfig.embeds.autoLoad`; the homepage overrides it to
   * false so its three-card teaser does not put live third-party players on
   * the landing page.
   */
  autoLoad: { type: Boolean, default: () => Boolean(siteConfig.embeds?.autoLoad) }
})

const PLATFORMS = {
  instagram: { label: 'Instagram', badge: 'bg-rose-deep text-white border-rose-shadow' },
  tiktok: { label: 'TikTok', badge: 'bg-ink text-cream border-ink' },
  youtube: { label: 'YouTube', badge: 'bg-[#d64541] text-white border-[#a83733]' }
}

/**
 * How long to wait before deciding an embed is broken.
 *
 * Was 8s, which TikTok's player regularly overran on a cold cache — the card
 * then showed its "can't display" fallback for a video that was merely slow.
 * 15s still catches genuinely blocked or deleted posts without punishing a
 * slow connection.
 */
const EMBED_TIMEOUT_MS = 15000

/**
 * Chrome each platform wraps around the video, in CSS pixels.
 *
 * Instagram stacks a header, a "View more" link, the action row and the like
 * count around a 9:16 clip, so a plain 9:16 box leaves the embed scrolling
 * inside itself. That is a fixed pixel amount, not a ratio, which is why the
 * height is `calc(aspect% + chrome)` rather than an aspect-ratio class — the
 * extra must stay constant as the card gets wider.
 *
 * TikTok's player (325x578) already ships at 9:16 with its UI overlaid, so it
 * needs nothing extra.
 */
const EMBED_CHROME_PX = { instagram: 196, tiktok: 0, youtube: 0 }

/** 'thumb' | 'loading' | 'playing' | 'failed' */
const state = ref('thumb')
const root = ref(null)
const frame = ref(null)
/** Exact embed height once the platform reports it; 0 until then. */
const measuredHeight = ref(0)
let watchdog = null
let observer = null

const platform = computed(() => PLATFORMS[props.video.platform] ?? {
  label: props.video.platform || 'Video',
  badge: 'bg-cream-deep text-ink border-cream-deep'
})

const hasEmbed = computed(() => Boolean(props.video.embedUrl?.trim()))
const hasSource = computed(() => Boolean(props.video.videoUrl?.trim()))
const ratio = computed(() =>
  props.video.orientation === 'square' ? 'aspect-square' : 'aspect-[9/16]'
)

const showingEmbed = computed(() => state.value === 'loading' || state.value === 'playing')

/**
 * While an embed is up, size the box to the embed.
 *
 * Preferred source is the platform's own reported height (see `onMessage`) —
 * exact, and it adapts to caption length. The `calc()` below is only the
 * opening estimate shown for the fraction of a second before that message
 * arrives, and it is deliberately a little short: guessing low clips a row,
 * guessing high leaves a slab of empty white under "Add a comment".
 */
const mediaStyle = computed(() => {
  if (!showingEmbed.value) return {}
  if (measuredHeight.value) return { height: `${measuredHeight.value}px` }

  const chrome = EMBED_CHROME_PX[props.video.platform] ?? 0
  if (!chrome) return {}
  const pct = props.video.orientation === 'square' ? 100 : 125
  return { height: '0', paddingBottom: `calc(${pct}% + ${chrome}px)` }
})

/** The aspect class and the padding trick are mutually exclusive. */
const useAspectClass = computed(() => !mediaStyle.value.paddingBottom)

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
  measuredHeight.value = 0
}

/**
 * Instagram's embed posts its rendered height to the parent — the same signal
 * Instagram's own embed.js uses to resize. Listening for it removes the guess
 * entirely: no leftover white space under the comment row, no clipping, and it
 * adapts when a caption makes the embed taller.
 *
 * Checked against this card's own contentWindow so eight cards on a page each
 * take only their own measurement.
 */
function onMessage(event) {
  if (typeof event.origin !== 'string' || !event.origin.includes('instagram.com')) return
  if (!frame.value || event.source !== frame.value.contentWindow) return

  let data = event.data
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch {
      return
    }
  }

  const height = Number(data?.details?.height)
  if (Number.isFinite(height) && height > 100) measuredHeight.value = Math.ceil(height)
}

/*
 * Auto-load, deferred until the card is near the viewport.
 *
 * Firing all eight embeds on page load would be slow and would hand every
 * visitor's details to both platforms before anything is even on screen.
 * Observing instead means a card loads just before it is seen, and cards
 * nobody scrolls to are never requested at all.
 */
onMounted(() => {
  window.addEventListener('message', onMessage)

  if (!props.autoLoad || !hasEmbed.value) return

  if (typeof IntersectionObserver === 'undefined') {
    play()
    return
  }

  observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return
      observer?.disconnect()
      observer = null
      play()
    },
    { rootMargin: '300px 0px' }
  )
  if (root.value) observer.observe(root.value)
})

onBeforeUnmount(() => {
  clearWatchdog()
  observer?.disconnect()
  window.removeEventListener('message', onMessage)
})
</script>

<template>
  <!--
    A playing card takes the full row on a phone.

    In the two-column mobile grid a card is only ~167px wide, and Instagram's
    embed degrades badly below its ~326px minimum: the username disappears and
    its own links truncate. Spanning both columns while playing roughly doubles
    the width and the embed renders properly. From `sm` up there is already
    room, so it stays a normal grid item.
  -->
  <article
    ref="root"
    class="cozy-card cozy-card-hover flex flex-col overflow-hidden"
    :class="showingEmbed && 'col-span-2 sm:col-span-1'"
  >
    <div
      :class="[useAspectClass && ratio, 'relative w-full bg-cream-deep/50']"
      :style="mediaStyle"
    >
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
          ref="frame"
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
