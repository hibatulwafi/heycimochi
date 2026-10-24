<script setup>
import { computed } from 'vue'
import CatProfileCard from '@/components/CatProfileCard.vue'
import DriftingClouds from '@/components/DriftingClouds.vue'
import MemoryCard from '@/components/MemoryCard.vue'
import PixelSprite from '@/components/PixelSprite.vue'
import PixelStrip from '@/components/PixelStrip.vue'
import SectionHeading from '@/components/SectionHeading.vue'
import SocialIcon from '@/components/SocialIcon.vue'
import SocialVideoCard from '@/components/SocialVideoCard.vue'
import catProfile from '@/data/catProfile.js'
import gameInfo from '@/data/gameInfo.js'
import memories from '@/data/memories.js'
import siteConfig from '@/data/siteConfig.js'
import socialVideos from '@/data/socialVideos.js'
import { sortByDateDesc } from '@/utils/date.js'
import { activeSocials, handleOf } from '@/utils/socials.js'

const latestMemories = computed(() => sortByDateDesc(memories).slice(0, 3))
const featuredVideos = computed(() => socialVideos.slice(0, 3))
const socials = computed(() => activeSocials())
</script>

<template>
  <!-- 2. Hero -->
  <section class="relative overflow-hidden">
    <div
      class="absolute inset-0 -z-10"
      :style="{
        background:
          'linear-gradient(to bottom, var(--color-rose-light) 0%, var(--color-cream) 70%, var(--color-cream) 100%)'
      }"
      aria-hidden="true"
    />

    <div class="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:py-20">
      <div class="flex flex-col gap-6">
        <span class="chip w-fit border-rose! bg-rose-light! text-rose-deep!">
          <PixelSprite name="decorHeart" :scale="1" />
          Website personal
        </span>

        <h1 class="font-display text-xl leading-relaxed sm:text-2xl lg:text-[2rem]">
          {{ siteConfig.brand }}
        </h1>

        <p class="max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
          {{ siteConfig.description }}
        </p>

        <!-- 3. CTAs -->
        <div class="flex flex-wrap gap-3">
          <RouterLink to="/play" class="btn-mocha">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5.5v13l11-6.5L8 5.5z" />
            </svg>
            Play Adventure
          </RouterLink>
          <RouterLink to="/cat" class="btn-rose">Meet My Cat</RouterLink>
          <RouterLink to="/memories" class="btn-ghost">Lihat Kenangan</RouterLink>
        </div>

        <div v-if="socials.length" class="flex items-center gap-3 pt-2">
          <span class="text-xs font-bold text-ink-soft/60">Ikuti:</span>
          <a
            v-for="account in socials"
            :key="account.key"
            :href="account.profileUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-cream-deep bg-paper text-ink-soft transition-all duration-150 hover:-translate-y-0.5 hover:text-rose-deep"
            :aria-label="`${account.label} ${handleOf(account)}`"
          >
            <SocialIcon :name="account.key" :size="18" />
          </a>
        </div>
      </div>

      <!-- Pixel scene, composed from the same sprites the game uses. -->
      <div class="relative mx-auto w-full max-w-md lg:max-w-none">
        <div class="cozy-card relative overflow-hidden bg-ice!">
          <div class="relative h-56 overflow-hidden sm:h-72 lg:h-80">
            <DriftingClouds />

            <PixelSprite name="decorSparkle" :scale="3" class="absolute top-8 right-1/3 opacity-80" />
            <PixelSprite
              name="decorButterfly"
              :scale="3"
              :fps="5"
              class="animate-flutter absolute top-1/3 left-10 opacity-90"
            />

            <!-- Fence line, one repeating background instead of 14 canvases. -->
            <PixelStrip
              name="decorFence"
              :scale="3"
              :height="26"
              anchor="bottom"
              class="absolute inset-x-0 bottom-5 opacity-85"
            />

            <!-- Mochi stands on the grass line, in front of the fence. -->
            <div class="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-end gap-3">
              <PixelSprite name="decorBush" :scale="3" class="hidden sm:block" />
              <PixelSprite
                name="catIdle"
                :scale="7"
                class="animate-float"
                :alt="`Avatar pixel art ${catProfile.name}`"
              />
              <PixelSprite name="itemFish" :scale="3" class="mb-2" />
            </div>

            <!-- Flowers and grass along the front edge. -->
            <div
              class="pointer-events-none absolute inset-x-0 bottom-5 flex items-end justify-between px-4"
              aria-hidden="true"
            >
              <PixelSprite name="decorFlowerRose" :scale="3" class="animate-sway" />
              <PixelSprite name="decorGrassTuft" :scale="3" class="animate-sway" style="animation-delay: -1.4s" />
              <PixelSprite name="decorFlowerGold" :scale="3" class="animate-sway hidden sm:block" style="animation-delay: -2.1s" />
              <PixelSprite name="decorGrassTuft" :scale="3" class="animate-sway" style="animation-delay: -0.7s" />
              <PixelSprite name="decorFlowerRose" :scale="3" class="animate-sway" style="animation-delay: -3s" />
            </div>

            <PixelStrip
              name="tileGrass"
              :scale="3"
              :height="24"
              class="absolute inset-x-0 bottom-0"
            />
          </div>
        </div>

        <p class="mt-3 text-center text-xs text-ink-soft/60">
          {{ catProfile.name }} siap jalan-jalan. Tekan Play untuk mulai.
        </p>
      </div>
    </div>
  </section>

  <!-- 4. Profile preview -->
  <section v-reveal class="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
    <SectionHeading
      eyebrow="Kenalan dulu"
      :title="`Siapa itu ${catProfile.name}?`"
      :subtitle="catProfile.personality"
      sprite="catIdle"
    />

    <div class="mt-8">
      <CatProfileCard :profile="catProfile" compact>
        <template #actions>
          <RouterLink to="/cat" class="btn-ghost w-fit px-4! py-2! text-xs!">
            Profil lengkap
          </RouterLink>
        </template>
      </CatProfileCard>
    </div>
  </section>

  <!-- 5. Social highlights -->
  <section v-reveal class="bg-paper/70 py-12 lg:py-16">
    <div class="mx-auto max-w-6xl px-4 sm:px-6">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          eyebrow="Social media"
          title="Video pilihan"
          subtitle="Kumpulan momen terbaik Mochi dari Instagram dan TikTok."
          sprite="decorSparkle"
        />
        <RouterLink to="/socials" class="btn-ghost px-4! py-2! text-xs!">
          Semua video
        </RouterLink>
      </div>

      <!-- Two columns even on the narrowest screens: these cards are 9:16, so
           a single full-width column is ~660px tall apiece on a phone. -->
      <!--
        Teaser cards stay click-to-load even when /socials auto-loads. Three
        live embeds measurably slowed the landing page on arrival and while
        scrolling, and this section only links through to the full gallery.
      -->
      <div class="mt-8 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
        <SocialVideoCard
          v-for="video in featuredVideos"
          :key="video.id"
          :video="video"
          :auto-load="false"
        />
      </div>
    </div>
  </section>

  <!-- 6. Memories preview -->
  <section v-reveal class="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <SectionHeading
        eyebrow="Cat memories"
        title="Kenangan terbaru"
        subtitle="Momen kecil yang sayang kalau cuma mengendap di galeri ponsel."
        sprite="decorHeart"
      />
      <RouterLink to="/memories" class="btn-ghost px-4! py-2! text-xs!">
        Semua kenangan
      </RouterLink>
    </div>

    <div class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <MemoryCard v-for="memory in latestMemories" :key="memory.id" :memory="memory" />
    </div>
  </section>

  <!-- 7. Game promotion -->
  <section v-reveal class="mx-auto max-w-6xl px-4 pb-4 sm:px-6">
    <!-- Ice-tinted rather than mocha: the card frames a blue-sky game preview,
         and a tan panel on a cream page had almost no separation. -->
    <div class="cozy-card relative overflow-hidden border-ice-deep! bg-ice-light!">
      <div class="grid items-center gap-8 p-6 sm:p-10 lg:grid-cols-[1.1fr_1fr]">
        <div class="flex flex-col gap-5">
          <SectionHeading
            eyebrow="Pixel platformer"
            :title="gameInfo.title"
            :subtitle="gameInfo.blurb"
          />

          <ul class="flex flex-col gap-2">
            <li
              v-for="feature in gameInfo.features"
              :key="feature"
              class="flex items-start gap-2.5 text-sm text-ink-soft"
            >
              <PixelSprite name="itemCoin" :scale="1" class="mt-1 shrink-0" />
              {{ feature }}
            </li>
          </ul>

          <RouterLink to="/play" class="btn-mocha w-fit">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5.5v13l11-6.5L8 5.5z" />
            </svg>
            Mainkan sekarang
          </RouterLink>
        </div>

        <!-- Mock level strip teasing the real tiles. -->
        <div class="cozy-card overflow-hidden bg-ice!">
          <div class="relative h-48 sm:h-56">
            <PixelSprite name="decorCloud" :scale="2" class="absolute top-4 left-5 opacity-85" />
            <PixelSprite name="itemCoin" :scale="3" :fps="8" :frame-order="[0, 1, 2, 1]" class="absolute top-12 left-1/3" />
            <PixelSprite name="itemFish" :scale="3" class="absolute top-20 right-10" />
            <PixelSprite name="catRun" :scale="5" :fps="10" class="absolute bottom-14 left-8" />
            <PixelSprite name="tilePlatform" :scale="3" class="absolute right-8 bottom-16" />

            <PixelStrip
              name="decorFence"
              :scale="3"
              :height="24"
              anchor="bottom"
              class="absolute inset-x-0 bottom-11 opacity-85"
            />
            <div
              class="pointer-events-none absolute inset-x-0 bottom-11 flex items-end justify-around"
              aria-hidden="true"
            >
              <PixelSprite name="decorGrassTuft" :scale="3" class="animate-sway" />
              <PixelSprite name="decorFlowerRose" :scale="3" class="animate-sway" style="animation-delay: -1.8s" />
              <PixelSprite name="decorGrassTuft" :scale="3" class="animate-sway" style="animation-delay: -2.6s" />
              <PixelSprite name="decorFlowerGold" :scale="3" class="animate-sway" style="animation-delay: -0.9s" />
            </div>

            <PixelStrip
              name="tileGrass"
              :scale="3"
              :height="44"
              class="absolute inset-x-0 bottom-0"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
