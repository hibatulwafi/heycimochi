<script setup>
import { computed, ref } from 'vue'
import MemoryCard from '@/components/MemoryCard.vue'
import PhotoLightbox from '@/components/PhotoLightbox.vue'
import PixelSprite from '@/components/PixelSprite.vue'
import SectionHeading from '@/components/SectionHeading.vue'
import memories, { MEMORY_CATEGORIES } from '@/data/memories.js'
import { sortByDateDesc } from '@/utils/date.js'

const activeCategory = ref('Semua')
const lightboxIndex = ref(null)

const categories = computed(() => ['Semua', ...MEMORY_CATEGORIES])

const visible = computed(() => {
  const sorted = sortByDateDesc(memories)
  return activeCategory.value === 'Semua'
    ? sorted
    : sorted.filter((memory) => memory.category === activeCategory.value)
})

/** The lightbox indexes into the *filtered* list, so they must stay paired. */
const lightboxItems = computed(() =>
  visible.value.map((memory) => ({ src: memory.src, alt: memory.alt, title: memory.title }))
)

function countOf(category) {
  if (category === 'Semua') return memories.length
  return memories.filter((memory) => memory.category === category).length
}

function select(category) {
  activeCategory.value = category
  lightboxIndex.value = null
}
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
    <SectionHeading
      as="h1"
      eyebrow="Cat memories"
      title="Kenangan Mochi"
      subtitle="Momen-momen yang sayang untuk dilupakan, dikelompokkan supaya gampang dicari."
      sprite="decorHeart"
    />

    <div class="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter kategori">
      <button
        v-for="category in categories"
        :key="category"
        type="button"
        :class="['chip', activeCategory === category && 'chip-active']"
        :aria-pressed="activeCategory === category"
        @click="select(category)"
      >
        {{ category }}
        <span class="opacity-60">{{ countOf(category) }}</span>
      </button>
    </div>

    <ul v-if="visible.length" class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <li v-for="(memory, index) in visible" :key="memory.id">
        <button
          type="button"
          class="block h-full w-full cursor-pointer text-left"
          :aria-label="`Buka ${memory.title}`"
          @click="lightboxIndex = index"
        >
          <MemoryCard :memory="memory" :eager="index < 3" class="h-full" />
        </button>
      </li>
    </ul>

    <div v-else class="cozy-card mt-8 flex flex-col items-center gap-3 p-10 text-center">
      <PixelSprite name="catIdle" :scale="6" class="opacity-70" />
      <p class="text-sm text-ink-soft">Belum ada kenangan di kategori ini.</p>
    </div>

    <PhotoLightbox v-model="lightboxIndex" :items="lightboxItems" />
  </div>
</template>
