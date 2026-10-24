<script setup>
import { computed, ref } from 'vue'
import PixelSprite from '@/components/PixelSprite.vue'
import SectionHeading from '@/components/SectionHeading.vue'
import SocialIcon from '@/components/SocialIcon.vue'
import SocialVideoCard from '@/components/SocialVideoCard.vue'
import siteConfig from '@/data/siteConfig.js'
import socialVideos from '@/data/socialVideos.js'
import { activeSocials, handleOf } from '@/utils/socials.js'

const collab = siteConfig.collaboration

const socials = computed(() => activeSocials())

const platformFilter = ref('all')

/** Chips are derived from the data, so a new platform needs no code change. */
const platforms = computed(() => {
  const present = [...new Set(socialVideos.map((video) => video.platform))]
  return ['all', ...present]
})

const visibleVideos = computed(() =>
  platformFilter.value === 'all'
    ? socialVideos
    : socialVideos.filter((video) => video.platform === platformFilter.value)
)

const PLATFORM_LABELS = { all: 'Semua', instagram: 'Instagram', tiktok: 'TikTok', youtube: 'YouTube' }
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
    <SectionHeading
      as="h1"
      eyebrow="Social media hub"
      title="Mochi di internet"
      subtitle="Semua akun dan video pilihan Mochi dalam satu tempat."
      sprite="decorSparkle"
    />

    <!-- Account buttons -->
    <section class="mt-8">
      <div v-if="socials.length" class="grid gap-4 sm:grid-cols-2">
        <a
          v-for="account in socials"
          :key="account.key"
          :href="account.profileUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="cozy-card cozy-card-hover flex min-w-0 items-center gap-3 p-4 sm:gap-4 sm:p-5"
        >
          <span
            class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-cream-deep bg-cream text-ink-soft"
          >
            <SocialIcon :name="account.key" :size="22" />
          </span>
          <span class="min-w-0 flex-1">
            <span class="block text-sm font-bold">{{ account.label }}</span>
            <span class="block truncate text-xs text-ink-soft/70">{{ handleOf(account) }}</span>
          </span>
          <span class="btn-mocha shrink-0 px-4! py-2! text-xs!">{{ account.cta }}</span>
        </a>
      </div>

      <!--
        Nothing configured. An honest empty state beats four buttons that go
        nowhere — AC #3 is about links resolving to the right account.
      -->
      <div v-else class="cozy-card flex flex-col items-center gap-4 p-8 text-center sm:p-10">
        <PixelSprite name="catIdle" :scale="6" class="opacity-80" />
        <h2 class="font-display text-sm">Akun belum terhubung</h2>
        <p class="max-w-md text-sm leading-relaxed text-ink-soft">
          Tautan Instagram dan TikTok Mochi belum dipasang. Isi
          <code class="rounded bg-cream px-1.5 py-0.5 text-xs">src/data/socialLinks.js</code>
          lalu ubah <code class="rounded bg-cream px-1.5 py-0.5 text-xs">enabled</code> menjadi
          <code class="rounded bg-cream px-1.5 py-0.5 text-xs">true</code>, dan tombolnya akan
          muncul di sini.
        </p>
      </div>
    </section>

    <!-- Videos -->
    <section class="mt-14">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          eyebrow="Video"
          title="Kartu video"
          subtitle="Daftar video dikurasi manual, dimuat langsung dari Instagram dan TikTok."
        />

        <div v-if="platforms.length > 2" class="flex flex-wrap gap-2" role="group" aria-label="Filter platform">
          <button
            v-for="platform in platforms"
            :key="platform"
            type="button"
            :class="['chip', platformFilter === platform && 'chip-active']"
            :aria-pressed="platformFilter === platform"
            @click="platformFilter = platform"
          >
            {{ PLATFORM_LABELS[platform] ?? platform }}
          </button>
        </div>
      </div>

      <div v-if="visibleVideos.length" class="mt-8 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
        <SocialVideoCard v-for="video in visibleVideos" :key="video.id" :video="video" />
      </div>

      <p v-else class="mt-8 text-sm text-ink-soft">Belum ada video untuk platform ini.</p>
    </section>

    <!-- Open collaboration -->
    <section v-if="collab?.url" class="mt-14">
      <div class="cozy-card grid items-center gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_auto]">
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-2">
            <PixelSprite name="decorHeart" :scale="2" />
            <span class="text-xs font-bold tracking-[0.18em] text-rose-deep uppercase">
              {{ collab.title }}
            </span>
          </div>
          <h2 class="font-display text-base sm:text-lg">Mau kerja bareng Mochi?</h2>
          <p class="max-w-xl text-sm leading-relaxed text-ink-soft">{{ collab.blurb }}</p>
          <p class="text-xs text-ink-soft/70">WhatsApp {{ collab.phoneLabel }}</p>
        </div>

        <a
          :href="collab.url"
          target="_blank"
          rel="noopener noreferrer"
          class="btn-rose w-fit shrink-0"
        >
          <SocialIcon name="whatsapp" :size="18" />
          {{ collab.cta }}
        </a>
      </div>
    </section>

    <!-- PRD §4.3 sync caveat, stated plainly for visitors. -->
    <aside class="cozy-card mt-12 flex items-start gap-4 p-5 border-gold! bg-gold-light/50!">
      <PixelSprite name="decorSparkle" :scale="3" class="mt-0.5 shrink-0" />
      <p class="text-xs leading-relaxed text-ink-soft">
        <strong class="font-bold text-ink">Catatan:</strong>
        daftar video di halaman ini diperbarui secara manual. Tanpa backend atau akses API resmi,
        konten terbaru dari Instagram dan TikTok tidak bisa tersinkron otomatis — selalu cek akun
        aslinya untuk unggahan paling baru.
      </p>
    </aside>
  </div>
</template>
