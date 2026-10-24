/**
 * Cat Memories — rendered on /memories (filterable) and previewed on the homepage.
 *
 * `category` must be one of MEMORY_CATEGORIES below; the filter chips are built
 * from that list, so adding a category here adds the chip automatically.
 * Dates are ISO strings and the list is sorted newest-first at render time.
 */
export const MEMORY_CATEGORIES = ['Daily Life', 'Funny Moments', 'Special Days']

export default [
  {
    id: 'mem-01',
    title: 'Hari pertama di rumah',
    caption:
      'Masih muat di satu telapak tangan dan sudah berani mengeluh soal kualitas tempat tidurnya.',
    date: '2022-06-04',
    category: 'Special Days',
    src: '/images/memory-01.jpg',
    alt: 'Mochi kecil meringkuk di handuk'
  },
  {
    id: 'mem-02',
    title: 'Menemukan kotak matahari',
    caption: 'Butuh tiga hari untuk sadar bahwa lantai ruang tamu punya area premium.',
    date: '2022-07-19',
    category: 'Daily Life',
    src: '/images/memory-02.jpg',
    alt: 'Mochi berbaring di bawah sinar matahari'
  },
  {
    id: 'mem-03',
    title: 'Insiden mentimun',
    caption: 'Kami hanya meletakkannya di lantai. Mochi menganggapnya sebagai serangan pribadi.',
    date: '2022-11-02',
    category: 'Funny Moments',
    src: '/images/memory-03.jpg',
    alt: 'Mochi melompat mundur dari sebuah mentimun'
  },
  {
    id: 'mem-04',
    title: 'Ulang tahun pertama',
    caption: 'Ada kue ikan. Dia makan hiasannya saja lalu pergi.',
    date: '2023-04-17',
    category: 'Special Days',
    src: '/images/memory-04.jpg',
    alt: 'Mochi di depan kue berbentuk ikan'
  },
  {
    id: 'mem-05',
    title: 'Rapat pagi',
    caption: 'Hadir di setiap panggilan video, tidak pernah diundang, selalu bicara.',
    date: '2023-09-12',
    category: 'Daily Life',
    src: '/images/memory-05.jpg',
    alt: 'Mochi duduk di depan laptop'
  },
  {
    id: 'mem-06',
    title: 'Kardus terlalu kecil',
    caption: 'Ukuran bukan halangan. Bentuk akhirnya bisa dinegosiasikan.',
    date: '2024-01-28',
    category: 'Funny Moments',
    src: '/images/memory-06.jpg',
    alt: 'Mochi memaksa masuk ke kardus kecil'
  },
  {
    id: 'mem-07',
    title: 'Teman jendela',
    caption: 'Burung yang sama, jam yang sama, setiap hari. Belum ada yang menang.',
    date: '2024-05-06',
    category: 'Daily Life',
    src: '/images/memory-07.jpg',
    alt: 'Mochi menatap keluar jendela'
  },
  {
    id: 'mem-08',
    title: 'Tidur dengan gaya bebas',
    caption: 'Tidak ada penjelasan untuk posisi ini dan dia tidak merasa perlu memberi satu.',
    date: '2024-10-15',
    category: 'Funny Moments',
    src: '/images/memory-08.jpg',
    alt: 'Mochi tidur terlentang di sofa'
  },
  {
    id: 'mem-09',
    title: 'Pindahan rumah',
    caption: 'Dia memeriksa seluruh rumah baru dalam sebelas menit lalu memilih lemari.',
    date: '2025-02-21',
    category: 'Special Days',
    src: '/images/memory-09.jpg',
    alt: 'Mochi di antara kardus pindahan'
  }
]
