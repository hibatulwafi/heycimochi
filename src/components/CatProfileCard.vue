<script setup>
import { computed } from 'vue'
import PhotoFrame from './PhotoFrame.vue'
import PixelSprite from './PixelSprite.vue'
import { formatAge, formatDate } from '@/utils/date.js'

/**
 * The profile summary — reused by /cat and the homepage preview.
 * `compact` drops the story/stats so the homepage teaser stays short.
 */
const props = defineProps({
  profile: { type: Object, required: true },
  compact: { type: Boolean, default: false }
})

const age = computed(() => formatAge(props.profile.birthday) || props.profile.ageFallback || '')
const birthday = computed(() => formatDate(props.profile.birthday))

const facts = computed(() =>
  [
    age.value && { label: 'Umur', value: age.value },
    birthday.value && { label: 'Lahir', value: birthday.value },
    props.profile.breed && { label: 'Jenis', value: props.profile.breed },
    props.profile.colorway && { label: 'Warna', value: props.profile.colorway }
  ].filter(Boolean)
)
</script>

<template>
  <div class="cozy-card overflow-hidden">
    <div class="grid gap-0 sm:grid-cols-[minmax(0,13rem)_1fr]">
      <!-- Photo column, with the pixel avatar overlapping the corner.
           Centred because this grid cell stretches to the text column's
           height, and a top-aligned square leaves a dead gap beneath it. -->
      <div class="relative flex flex-col justify-center bg-cream-deep/40 p-4 sm:p-5">
        <PhotoFrame
          :src="profile.avatar"
          :alt="`Foto ${profile.name}`"
          ratio="aspect-square"
          :eager="true"
          :placeholder-scale="7"
          :placeholder-note="profile.name"
        />
        <span
          class="absolute right-2 bottom-2 rounded-2xl border-2 border-cream-deep bg-paper p-1.5 shadow-cozy sm:right-3 sm:bottom-3"
        >
          <PixelSprite :name="profile.pixelAvatar" :scale="3" :fps="2" />
        </span>
      </div>

      <div class="flex flex-col gap-4 p-5 sm:p-6">
        <div>
          <h3 class="font-display text-base sm:text-lg">{{ profile.name }}</h3>
          <p class="mt-2 text-sm text-rose-deep italic">{{ profile.tagline }}</p>
        </div>

        <dl v-if="facts.length" class="grid grid-cols-2 gap-x-4 gap-y-3">
          <div v-for="fact in facts" :key="fact.label">
            <dt class="text-[0.65rem] font-bold tracking-widest text-ink-soft/60 uppercase">
              {{ fact.label }}
            </dt>
            <dd class="mt-0.5 text-sm font-bold">{{ fact.value }}</dd>
          </div>
        </dl>

        <p class="text-sm leading-relaxed text-ink-soft" :class="compact && 'line-clamp-4'">
          {{ profile.bio }}
        </p>

        <div v-if="!compact && profile.stats?.length" class="flex flex-wrap gap-2">
          <span v-for="stat in profile.stats" :key="stat.label" class="chip">
            <span class="text-ink-soft/70">{{ stat.label }}:</span>
            {{ stat.value }}
          </span>
        </div>

        <slot name="actions" />
      </div>
    </div>
  </div>
</template>
