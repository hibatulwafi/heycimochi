<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import PixelSprite from './PixelSprite.vue'
import siteConfig from '@/data/siteConfig.js'

const route = useRoute()
const open = ref(false)
const scrolled = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 8
}

function onKeydown(event) {
  if (event.key === 'Escape') open.value = false
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})

// Navigating closes the sheet; an open sheet locks the page behind it.
watch(() => route.fullPath, () => { open.value = false })
watch(open, (isOpen) => {
  document.body.style.overflow = isOpen ? 'hidden' : ''
})
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 transition-all duration-200"
    :class="scrolled ? 'bg-cream/92 border-b-2 border-cream-deep backdrop-blur-sm' : 'bg-transparent'"
  >
    <nav class="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
      <RouterLink
        to="/"
        class="group flex items-center gap-2.5"
        :aria-label="`${siteConfig.brand} — beranda`"
      >
        <span
          class="rounded-xl border-2 border-cream-deep bg-paper p-1.5 transition-transform duration-200 group-hover:-rotate-12"
        >
          <PixelSprite name="decorPaw" :scale="2" />
        </span>
        <span class="font-display text-[0.78rem] sm:text-sm">{{ siteConfig.brand }}</span>
      </RouterLink>

      <!-- Desktop -->
      <ul class="hidden items-center gap-1 md:flex">
        <li v-for="item in siteConfig.nav" :key="item.to">
          <RouterLink
            :to="item.to"
            class="relative rounded-full px-4 py-2 text-sm font-bold transition-colors duration-150 hover:bg-paper"
            :class="route.path === item.to ? 'text-mocha-shadow' : 'text-ink-soft'"
          >
            {{ item.label }}
            <span
              v-if="route.path === item.to"
              class="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-mocha"
            />
          </RouterLink>
        </li>
        <li class="ml-2">
          <RouterLink to="/play" class="btn-mocha px-4! py-2! text-xs!">
            Play Adventure
          </RouterLink>
        </li>
      </ul>

      <!-- Mobile trigger -->
      <button
        type="button"
        class="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-cream-deep bg-paper md:hidden"
        :aria-expanded="open"
        aria-controls="mobile-nav"
        :aria-label="open ? 'Tutup menu' : 'Buka menu'"
        @click="open = !open"
      >
        <span class="relative block h-4 w-5">
          <span
            class="absolute left-0 h-0.5 w-5 rounded bg-ink transition-all duration-200"
            :class="open ? 'top-1/2 rotate-45' : 'top-0'"
          />
          <span
            class="absolute top-1/2 left-0 h-0.5 w-5 -translate-y-1/2 rounded bg-ink transition-opacity duration-200"
            :class="open ? 'opacity-0' : 'opacity-100'"
          />
          <span
            class="absolute left-0 h-0.5 w-5 rounded bg-ink transition-all duration-200"
            :class="open ? 'top-1/2 -rotate-45' : 'bottom-0'"
          />
        </span>
      </button>
    </nav>

    <!-- Mobile sheet -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      leave-active-class="transition duration-150 ease-in"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="open"
        id="mobile-nav"
        class="border-t-2 border-cream-deep bg-cream px-4 pt-3 pb-6 md:hidden"
      >
        <ul class="flex flex-col gap-1.5">
          <li v-for="item in siteConfig.nav" :key="item.to">
            <RouterLink
              :to="item.to"
              class="block rounded-2xl border-2 px-4 py-3.5 text-sm font-bold transition-colors"
              :class="
                route.path === item.to
                  ? 'border-mocha-shadow bg-mocha-deep text-white'
                  : 'border-cream-deep bg-paper text-ink'
              "
            >
              {{ item.label }}
            </RouterLink>
          </li>
        </ul>
      </div>
    </Transition>
  </header>
</template>
