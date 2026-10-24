/**
 * Site-wide identity and navigation.
 * Edit here — no component hardcodes the brand name or the menu.
 */
export default {
  brand: 'Hey Mochi',
  tagline: 'A tiny cat with a big personality.',
  description:
    'Rumah kecil di internet untuk Mochi — profil, kenangan, media sosial, dan satu petualangan pixel yang bisa kamu mainkan sendiri.',
  nav: [
    { label: 'Home', to: '/' },
    { label: 'Mochi', to: '/cat' },
    { label: 'Socials', to: '/socials' },
    { label: 'Memories', to: '/memories' },
    { label: 'Play', to: '/play' }
  ],
  footerNote: 'Dibuat dengan ikan kering dan terlalu banyak foto kucing.',

  embeds: {
    /**
     * Load video embeds as they scroll into view instead of waiting for a tap.
     *
     * Trade-off, stated plainly: with this on, Instagram and TikTok receive
     * every visitor's IP, referrer and cookies without the visitor choosing to
     * play anything. Set it to false to go back to click-to-load, where
     * /socials makes zero third-party requests until someone presses play.
     *
     * Even when on, loading is deferred until a card is near the viewport —
     * eight embeds firing at once on page load would be slow for everyone.
     */
    autoLoad: true
  },

  /** Open-collaboration contact, shown on /socials and in the footer. */
  collaboration: {
    title: 'Open collaboration',
    blurb:
      'Terbuka untuk endorse, paid promote, kolaborasi konten, atau sekadar mengobrol soal kucing. Pesan paling cepat dibalas lewat WhatsApp.',
    cta: 'Chat via WhatsApp',
    phoneLabel: '0858-6304-6869',
    /* wa.me wants full international form: no +, no spaces, no leading zero. */
    url: 'https://wa.me/6285863046869'
  }
}
