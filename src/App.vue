<script setup>
import AppNavbar from './components/AppNavbar.vue'
import AppFooter from './components/AppFooter.vue'
import GroundBand from './components/GroundBand.vue'
</script>

<template>
  <a
    href="#main"
    class="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-full focus:border-2 focus:border-mocha-shadow focus:bg-paper focus:px-4 focus:py-2 focus:text-sm focus:font-bold"
  >
    Lewati ke konten
  </a>

  <AppNavbar />

  <!-- pt-16 clears the fixed navbar. -->
  <main id="main" class="min-h-[70vh] pt-16">
    <RouterView v-slot="{ Component, route }">
      <Transition
        mode="out-in"
        enter-active-class="transition-opacity duration-200 ease-out"
        enter-from-class="opacity-0"
        leave-active-class="transition-opacity duration-150 ease-in"
        leave-to-class="opacity-0"
      >
        <component :is="Component" :key="route.path" />
      </Transition>
    </RouterView>
  </main>

  <!-- Every page lands on the garden floor before the footer. -->
  <GroundBand />

  <AppFooter />
</template>
