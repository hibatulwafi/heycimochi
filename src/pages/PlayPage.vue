<script setup>
import GameCanvas from '@/components/GameCanvas.vue'
import PixelSprite from '@/components/PixelSprite.vue'
import SectionHeading from '@/components/SectionHeading.vue'
import gameInfo from '@/data/gameInfo.js'
</script>

<template>
  <div class="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:py-14">
    <SectionHeading
      as="h1"
      eyebrow="Pixel platformer"
      :title="gameInfo.title"
      :subtitle="gameInfo.blurb"
      sprite="catRun"
    />

    <!-- GameCanvas owns the Phaser lifecycle, including destroying it when
         this route unmounts. -->
    <div class="mt-8">
      <GameCanvas />
    </div>

    <!-- Controls -->
    <section class="mt-10 grid gap-5 md:grid-cols-2">
      <div class="cozy-card p-5 sm:p-6">
        <h2 class="font-display text-sm">Kontrol komputer</h2>
        <ul class="mt-4 flex flex-col gap-3">
          <li
            v-for="control in gameInfo.controls.desktop"
            :key="control.action"
            class="flex flex-wrap items-center gap-2 text-sm text-ink-soft"
          >
            <kbd
              v-for="key in control.keys"
              :key="key"
              class="rounded-lg border-2 border-cream-deep bg-cream px-2 py-1 text-xs font-bold text-ink"
            >
              {{ key }}
            </kbd>
            <span v-if="control.alt.length" class="text-xs text-ink-soft/50">atau</span>
            <kbd
              v-for="key in control.alt"
              :key="key"
              class="rounded-lg border-2 border-cream-deep bg-cream px-2 py-1 text-xs font-bold text-ink"
            >
              {{ key }}
            </kbd>
            <span class="ml-auto text-xs">{{ control.action }}</span>
          </li>
        </ul>
      </div>

      <div class="cozy-card p-5 sm:p-6">
        <h2 class="font-display text-sm">Kontrol layar sentuh</h2>
        <ul class="mt-4 flex flex-col gap-3">
          <li
            v-for="control in gameInfo.controls.mobile"
            :key="control.action"
            class="flex items-center gap-2 text-sm text-ink-soft"
          >
            <kbd
              v-for="key in control.keys"
              :key="key"
              class="rounded-lg border-2 border-cream-deep bg-cream px-2.5 py-1 text-xs font-bold text-ink"
            >
              {{ key }}
            </kbd>
            <span class="ml-auto text-xs">{{ control.action }}</span>
          </li>
        </ul>

        <h3 class="mt-6 text-xs font-bold tracking-widest text-ink-soft/60 uppercase">Nilai</h3>
        <ul class="mt-3 flex flex-wrap gap-2">
          <li v-for="item in gameInfo.scoring" :key="item.label" class="chip">
            <PixelSprite
              v-if="item.label === 'Ikan'"
              name="itemFish"
              :scale="1"
            />
            <PixelSprite v-else-if="item.label === 'Koin'" name="itemCoin" :scale="1" />
            <PixelSprite v-else name="decorSparkle" :scale="1" />
            {{ item.label }}
            <span class="text-ink-soft/70">+{{ item.points }}</span>
          </li>
        </ul>
      </div>
    </section>

    <aside class="cozy-card mt-6 flex items-start gap-4 p-5 border-gold! bg-gold-light/50!">
      <PixelSprite name="decorSparkle" :scale="3" class="mt-0.5 shrink-0" />
      <p class="text-xs leading-relaxed text-ink-soft">
        Skor terbaik disimpan di perangkat ini saja — tidak ada akun, tidak ada papan peringkat
        online, dan tidak ada data yang dikirim ke mana pun. Suara dimatikan secara bawaan; nyalakan
        lewat tombol speaker di pojok kanan atas game.
      </p>
    </aside>

    <div class="mt-10 flex flex-wrap gap-3">
      <RouterLink to="/cat" class="btn-rose">Kenalan dengan Mochi</RouterLink>
      <RouterLink to="/socials" class="btn-ghost">Lihat media sosialnya</RouterLink>
    </div>
  </div>
</template>
