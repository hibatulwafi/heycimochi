<script setup>
import PixelSprite from '@/components/PixelSprite.vue'
import siteConfig from '@/data/siteConfig.js'
</script>

<template>
  <div class="mx-auto flex max-w-xl flex-col items-center gap-6 px-4 py-20 text-center sm:px-6">
    <PixelSprite name="catFall" :scale="7" alt="Mochi terjatuh" />

    <h1 class="font-display text-lg sm:text-xl">404</h1>
    <p class="text-sm leading-relaxed text-ink-soft sm:text-base">
      Mochi sudah mencari ke seluruh rumah, tapi halaman ini tidak ada di sini.
    </p>

    <div class="flex flex-wrap justify-center gap-3">
      <RouterLink to="/" class="btn-mocha">Kembali ke beranda</RouterLink>
      <RouterLink to="/play" class="btn-ghost">Main game saja</RouterLink>
    </div>

    <p class="pt-4 text-xs text-ink-soft/60">{{ siteConfig.brand }}</p>
  </div>
</template>
