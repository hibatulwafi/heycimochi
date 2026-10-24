/**
 * Mochi's profile. Everything on /cat and the homepage preview reads from here.
 *
 * Photos: drop real files into `public/images/` using these exact filenames and
 * they appear automatically. Until then, PhotoFrame renders a pixel placeholder
 * instead of a broken image — see public/images/README.md.
 */
export default {
  name: 'Mochi',
  nickname: 'Mochi',
  tagline: 'A tiny cat with a big personality.',

  /** ISO date, or null if unknown. Age is derived from this. */
  birthday: '2024-09-07',

  /** Shown when `birthday` is null. */
  ageFallback: null,

  breed: 'Himalaya (Siamese × Persia)',
  colorway: 'Seal point, bulu panjang, mata biru',

  bio: 'Mochi datang ke rumah sebagai bola bulu seukuran telapak tangan dan langsung memutuskan bahwa seluruh rumah adalah miliknya. Sekarang dia membagi harinya antara mengejar bayangan, mengawasi burung dari jendela, dan tidur di tempat paling tidak masuk akal yang bisa dia temukan.',

  personality:
    'Himalaya itu hasil silang Siamese dan Persia, dan Mochi mewarisi keduanya dengan porsi yang aneh. Dari Persia: tenang, suka diam di satu tempat berjam-jam, dan ekspresi wajah yang seolah sedang menilai keputusan hidupmu. Dari Siamese: mulut yang tidak pernah berhenti. Hasilnya adalah kucing yang jarang bergerak tapi selalu punya pendapat.',

  likes: [
    'Boncengan motor — angin di muka, telinga ke belakang',
    'Kardus kosong apa pun ukurannya',
    'Ikan tuna rebus',
    'Kotak sinar matahari di lantai ruang tamu',
    'Suara bungkus snack dibuka',
    'Mengawasi burung dari jendela dapur'
  ],

  dislikes: [
    'Pintu yang tertutup',
    'Mandi',
    'Mentimun',
    'Mangkuk makan yang terisi di bawah 80%',
    'Dibandingkan dengan kucing tetangga'
  ],

  stats: [
    { label: 'Tidur', value: 'Level 99' },
    { label: 'Cakaran', value: 'Maksimal' },
    { label: 'Hobi', value: 'Naik motor' },
    { label: 'Jadwal sisir', value: 'Tiap hari' }
  ],

  /** Real photo. Swap the file, keep the path. */
  avatar: '/images/cat-profile.jpg',

  /**
   * Pixel avatar. A sprite key from src/game/sprites/cat.js — rendered from code,
   * so this one needs no image file at all.
   */
  pixelAvatar: 'catIdle',

  gallery: [
    { src: '/images/gallery-01.jpg', alt: 'Mochi duduk loaf dengan latar pink' },
    { src: '/images/gallery-02.jpg', alt: 'Mochi menguap lebar di atas sofa' },
    { src: '/images/gallery-03.jpg', alt: 'Mochi duduk di ambang jendela' },
    { src: '/images/gallery-04.jpg', alt: 'Mochi bermain dengan bola benang' },
    { src: '/images/gallery-05.jpg', alt: 'Mochi tidur dengan perut menghadap atas' },
    { src: '/images/gallery-06.jpg', alt: 'Mochi menatap kamera dengan curiga' }
  ],

  story: [
    'Kami menemukan Mochi di belakang warung dekat rumah, basah kuyup dan berteriak jauh lebih keras daripada yang seharusnya mungkin untuk kucing sekecil itu. Niatnya hanya memberi makan sekali. Dia mengikuti kami pulang dan tidak pernah membahas rencana lain.',
    'Waktu itu bulunya hampir putih polos, jadi kami tidak langsung sadar dia Himalaya — hasil silang Siamese dan Persia. Warna gelap di telinga, wajah, kaki, dan ekornya baru muncul pelan-pelan selama beberapa bulan pertama, seperti foto yang dicuci perlahan. Bulunya ikut memanjang belakangan, warisan sisi Persia. Matanya biru sejak hari pertama dan tidak pernah berubah.',
    'Minggu pertama dia tidur di dalam sepatu. Minggu kedua dia sudah menguasai kasur. Sekarang kami resmi tinggal di rumahnya dan membayar sewa dalam bentuk ikan.',
    'Hal paling tidak terduga: Mochi suka naik motor. Kucing lain protes keras begitu melihat tas gendongan — Mochi justru masuk sendiri, lalu duduk tenang menghadap depan sepanjang jalan. Telinganya rebah kena angin dan dia tidak mengeluh sedikit pun, yang untuk kucing seceriwis dia termasuk pujian tertinggi.',
    'Website ini pada dasarnya adalah album foto yang kelewat niat. Terima kasih sudah mampir.'
  ]
}
