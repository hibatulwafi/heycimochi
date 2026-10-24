import { createRouter, createWebHistory } from 'vue-router'
import siteConfig from '@/data/siteConfig.js'

/**
 * History mode, so URLs stay clean. Every static host therefore needs a
 * catch-all rewrite to index.html or a hard refresh on /play 404s —
 * see vercel.json, public/_redirects, and the README deploy notes.
 */
const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/HomePage.vue'),
    meta: { title: siteConfig.tagline }
  },
  {
    path: '/cat',
    name: 'cat',
    component: () => import('@/pages/CatPage.vue'),
    meta: { title: 'Profil Mochi' }
  },
  {
    path: '/socials',
    name: 'socials',
    component: () => import('@/pages/SocialsPage.vue'),
    meta: { title: 'Media Sosial' }
  },
  {
    path: '/memories',
    name: 'memories',
    component: () => import('@/pages/MemoriesPage.vue'),
    meta: { title: 'Cat Memories' }
  },
  {
    // Lazy on purpose: Phaser is the heaviest dependency in the project and
    // only this route needs it.
    path: '/play',
    name: 'play',
    component: () => import('@/pages/PlayPage.vue'),
    meta: { title: "Mochi's Little Adventure" }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/NotFoundPage.vue'),
    meta: { title: 'Halaman tidak ditemukan' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  }
})

router.afterEach((to) => {
  document.title = to.meta?.title
    ? `${siteConfig.brand} — ${to.meta.title}`
    : siteConfig.brand
})

export default router
