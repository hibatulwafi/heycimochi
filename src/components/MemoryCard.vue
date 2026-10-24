<script setup>
import { computed } from 'vue'
import PhotoFrame from './PhotoFrame.vue'
import { formatDate } from '@/utils/date.js'

const props = defineProps({
  memory: { type: Object, required: true },
  eager: { type: Boolean, default: false }
})

const CATEGORY_STYLES = {
  'Daily Life': 'bg-mocha-light text-mocha-shadow border-mocha',
  'Funny Moments': 'bg-gold-light text-gold-deep border-gold',
  'Special Days': 'bg-rose-light text-rose-deep border-rose'
}

const categoryClass = computed(
  () => CATEGORY_STYLES[props.memory.category] ?? 'bg-cream-deep text-ink-soft border-cream-deep'
)
</script>

<template>
  <article class="cozy-card cozy-card-hover flex flex-col overflow-hidden">
    <PhotoFrame
      :src="memory.src"
      :alt="memory.alt || memory.title"
      ratio="aspect-[4/3]"
      rounded="rounded-none"
      class="border-0! border-b-2!"
      :eager="eager"
      :placeholder-note="memory.title"
    />

    <div class="flex flex-1 flex-col gap-2 p-4">
      <div class="flex flex-wrap items-center gap-2">
        <span
          :class="['rounded-full border-2 px-2.5 py-1 text-[0.65rem] font-bold', categoryClass]"
        >
          {{ memory.category }}
        </span>
        <time v-if="memory.date" :datetime="memory.date" class="text-[0.7rem] text-ink-soft/70">
          {{ formatDate(memory.date) }}
        </time>
      </div>

      <h3 class="text-sm leading-snug font-bold">{{ memory.title }}</h3>
      <p v-if="memory.caption" class="text-xs leading-relaxed text-ink-soft">
        {{ memory.caption }}
      </p>
    </div>
  </article>
</template>
