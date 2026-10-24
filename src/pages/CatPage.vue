<script setup>
import { computed, ref } from 'vue'
import CatProfileCard from '@/components/CatProfileCard.vue'
import PhotoFrame from '@/components/PhotoFrame.vue'
import PhotoLightbox from '@/components/PhotoLightbox.vue'
import PixelSprite from '@/components/PixelSprite.vue'
import SectionHeading from '@/components/SectionHeading.vue'
import catProfile from '@/data/catProfile.js'

const lightboxIndex = ref(null)
const gallery = computed(() => catProfile.gallery ?? [])
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
    <SectionHeading
      as="h1"
      eyebrow="Cat profile"
      :title="`Halo, aku ${catProfile.name}`"
      :subtitle="catProfile.tagline"
      sprite="catIdle"
    />

    <div class="mt-8">
      <CatProfileCard :profile="catProfile" />
    </div>

    <!-- Likes / dislikes -->
    <div class="mt-10 grid gap-5 md:grid-cols-2">
      <section class="cozy-card p-6">
        <h2 class="flex items-center gap-2 font-display text-sm">
          <PixelSprite name="decorHeart" :scale="2" />
          Yang disukai
        </h2>
        <ul class="mt-4 flex flex-col gap-2.5">
          <li
            v-for="like in catProfile.likes"
            :key="like"
            class="flex items-start gap-2.5 text-sm text-ink-soft"
          >
            <PixelSprite name="itemFish" :scale="1" class="mt-1 shrink-0" />
            {{ like }}
          </li>
        </ul>
      </section>

      <section class="cozy-card p-6">
        <h2 class="flex items-center gap-2 font-display text-sm">
          <PixelSprite name="decorHeartEmpty" :scale="2" />
          Yang tidak disukai
        </h2>
        <ul class="mt-4 flex flex-col gap-2.5">
          <li
            v-for="dislike in catProfile.dislikes"
            :key="dislike"
            class="flex items-start gap-2.5 text-sm text-ink-soft"
          >
            <span class="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-rose" aria-hidden="true" />
            {{ dislike }}
          </li>
        </ul>
      </section>
    </div>

    <!-- Gallery -->
    <section v-if="gallery.length" class="mt-14">
      <SectionHeading
        eyebrow="Galeri"
        title="Album foto"
        subtitle="Klik foto untuk melihat ukuran penuh."
        sprite="decorSparkle"
      />

      <ul class="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <li v-for="(photo, index) in gallery" :key="photo.src">
          <button
            type="button"
            class="block w-full cursor-pointer transition-transform duration-200 hover:-translate-y-1"
            :aria-label="`Buka ${photo.alt}`"
            @click="lightboxIndex = index"
          >
            <PhotoFrame :src="photo.src" :alt="photo.alt" ratio="aspect-square" />
          </button>
        </li>
      </ul>
    </section>

    <!-- Story -->
    <section v-if="catProfile.story?.length" class="mt-14">
      <SectionHeading eyebrow="Cerita" :title="`Bagaimana ${catProfile.name} sampai di sini`" />

      <div class="cozy-card mt-8 flex flex-col gap-4 p-6 sm:p-8">
        <p
          v-for="(paragraph, index) in catProfile.story"
          :key="index"
          class="text-sm leading-relaxed text-ink-soft sm:text-base"
        >
          {{ paragraph }}
        </p>

        <div class="flex items-center gap-3 border-t-2 border-cream-deep pt-5">
          <PixelSprite name="catIdle" :scale="4" />
          <p class="text-xs text-ink-soft/70">— {{ catProfile.name }}</p>
        </div>
      </div>
    </section>

    <div class="mt-12 flex flex-wrap gap-3">
      <RouterLink to="/memories" class="btn-rose">Lihat semua kenangan</RouterLink>
      <RouterLink to="/play" class="btn-mocha">Mainkan game Mochi</RouterLink>
    </div>

    <PhotoLightbox v-model="lightboxIndex" :items="gallery" />
  </div>
</template>
