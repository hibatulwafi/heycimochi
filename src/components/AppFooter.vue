<script setup>
import { computed } from 'vue'
import PixelSprite from './PixelSprite.vue'
import SocialIcon from './SocialIcon.vue'
import siteConfig from '@/data/siteConfig.js'
import { activeSocials, handleOf } from '@/utils/socials.js'

const socials = computed(() => activeSocials())
const year = new Date().getFullYear()
</script>

<template>
  <!-- GroundBand sits directly above and supplies the grass, so the footer no
       longer draws its own strip or reserves top margin. -->
  <footer class="border-t-2 border-cream-deep bg-paper">
    <div class="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div class="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div class="max-w-sm">
          <div class="flex items-center gap-2.5">
            <PixelSprite name="decorPaw" :scale="2" />
            <span class="font-display text-sm">{{ siteConfig.brand }}</span>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-ink-soft">{{ siteConfig.tagline }}</p>

          <a
            v-if="siteConfig.collaboration?.url"
            :href="siteConfig.collaboration.url"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-rose mt-4 w-fit px-4! py-2! text-xs!"
          >
            <SocialIcon name="whatsapp" :size="14" />
            {{ siteConfig.collaboration.cta }}
          </a>

          <p class="mt-4 text-xs text-ink-soft/70">{{ siteConfig.footerNote }}</p>
        </div>

        <div class="flex flex-col gap-8 sm:flex-row sm:gap-16">
          <nav aria-label="Footer">
            <h2 class="text-xs font-bold tracking-widest text-ink-soft/60 uppercase">Jelajahi</h2>
            <ul class="mt-3 flex flex-col gap-2">
              <li v-for="item in siteConfig.nav" :key="item.to">
                <RouterLink
                  :to="item.to"
                  class="text-sm font-bold text-ink-soft transition-colors hover:text-mocha-shadow"
                >
                  {{ item.label }}
                </RouterLink>
              </li>
            </ul>
          </nav>

          <div>
            <h2 class="text-xs font-bold tracking-widest text-ink-soft/60 uppercase">Ikuti Mochi</h2>

            <ul v-if="socials.length" class="mt-3 flex flex-col gap-2">
              <li v-for="account in socials" :key="account.key">
                <a
                  :href="account.profileUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 text-sm font-bold text-ink-soft transition-colors hover:text-rose-deep"
                >
                  <SocialIcon :name="account.key" :size="16" />
                  {{ handleOf(account) }}
                </a>
              </li>
            </ul>

            <!-- Nothing configured yet. Say so plainly instead of rendering
                 dead buttons — see src/data/socialLinks.js. -->
            <p v-else class="mt-3 max-w-56 text-sm leading-relaxed text-ink-soft/70">
              Tautan media sosial belum dipasang.
            </p>
          </div>
        </div>
      </div>

      <p class="mt-10 border-t-2 border-cream-deep pt-6 text-xs text-ink-soft/60">
        &copy; {{ year }} {{ siteConfig.brand }}.
      </p>
    </div>
  </footer>
</template>
