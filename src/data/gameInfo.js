/**
 * Copy for the game promo section and the /play header.
 * Shared so the homepage teaser and the game page never disagree.
 */
export default {
  title: "Mochi's Little Adventure",
  tagline: 'Satu kucing, banyak ikan, dan beberapa duri yang sebaiknya dihindari.',
  blurb:
    'Platformer pixel 2D yang berjalan langsung di browser. Lima level, dari halaman belakang yang santai sampai maraton pulau sempit di atas jurang.',
  features: [
    'Lima level dengan tingkat kesulitan menanjak',
    'Kumpulkan ikan dan koin untuk menaikkan skor',
    'Tiga nyawa tiap level — duri dan jurang tidak memaafkan',
    'Tekan Shift untuk berlari; lompatan jauh butuh ancang-ancang',
    'Skor terbaik tiap level tersimpan di perangkat kamu sendiri'
  ],
  controls: {
    desktop: [
      { keys: ['A', 'D'], alt: ['←', '→'], action: 'Bergerak kiri / kanan' },
      { keys: ['Shift'], alt: [], action: 'Berlari' },
      { keys: ['Space'], alt: ['↑', 'W'], action: 'Melompat' },
      { keys: ['R'], alt: [], action: 'Mulai ulang' }
    ],
    mobile: [
      { keys: ['◀', '▶'], alt: [], action: 'Bergerak' },
      { keys: ['⤴'], alt: [], action: 'Melompat' }
    ]
  },
  scoring: [
    { label: 'Ikan', points: 10 },
    { label: 'Koin', points: 5 },
    { label: 'Bonus selesai', points: 50 }
  ]
}
