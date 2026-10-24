/**
 * `v-reveal` — fade-and-rise an element the first time it scrolls into view.
 *
 * One IntersectionObserver is shared by every element on the page, and each
 * element is unobserved as soon as it fires. That keeps the cost flat no
 * matter how many sections use it: no scroll listener, no per-frame work, and
 * the animation itself is pure CSS (see `.reveal` in assets/main.css).
 *
 * Falls back to showing content immediately where IntersectionObserver is
 * missing — content must never be stuck invisible because an effect failed.
 */
const REVEALED = 'is-revealed'

let observer = null

function getObserver() {
  if (observer || typeof IntersectionObserver === 'undefined') return observer

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add(REVEALED)
        observer.unobserve(entry.target)
      }
    },
    // Trigger slightly before the element reaches the viewport edge so the
    // motion finishes about when it is fully visible.
    { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
  )

  return observer
}

export default {
  mounted(el, binding) {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    const io = getObserver()
    if (prefersReduced || !io) {
      el.classList.add('reveal', REVEALED)
      return
    }

    el.classList.add('reveal')
    if (binding.value?.delay) el.style.transitionDelay = `${binding.value.delay}ms`

    // Anything already on screen at mount should not wait for a scroll.
    io.observe(el)
  },

  unmounted(el) {
    observer?.unobserve(el)
  }
}
