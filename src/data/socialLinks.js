/**
 * Mochi's social accounts.
 *
 * `enabled: false` hides the button everywhere — no dead links, no '#' hrefs.
 * To go live: paste the real profileUrl + username and flip `enabled` to true.
 */
export default {
  instagram: {
    label: 'Instagram',
    username: 'heycimochi',
    profileUrl: 'https://www.instagram.com/heycimochi/',
    enabled: true,
    cta: 'Follow'
  },
  tiktok: {
    label: 'TikTok',
    username: 'mochihimalayancat0',
    profileUrl: 'https://www.tiktok.com/@mochihimalayancat0',
    enabled: true,
    cta: 'Follow'
  },
  youtube: {
    label: 'YouTube',
    username: '',
    profileUrl: '',
    enabled: false,
    cta: 'Subscribe'
  },
  /*
   * Collaboration contact. wa.me needs the number in full international form
   * with no +, spaces or leading zero — the local 0858… becomes 62858…, and
   * getting that wrong is the usual reason a WhatsApp link opens an empty chat.
   */
  whatsapp: {
    label: 'WhatsApp',
    username: '0858-6304-6869',
    profileUrl: 'https://wa.me/6285863046869',
    enabled: true,
    cta: 'Chat'
  },
  email: {
    label: 'Email',
    username: '',
    profileUrl: '',
    enabled: false,
    cta: 'Say hi'
  }
}
