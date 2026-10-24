/**
 * Static video list for /socials.
 *
 * PRD §4.3: without a backend there is no automatic sync — this list is curated
 * by hand. Each card renders from `title` + `thumbnail` and always links out to
 * `videoUrl`, so a missing or broken `embedUrl` degrades to a plain link instead
 * of an empty box.
 *
 * Getting embedUrl:
 *   Instagram  https://www.instagram.com/reel/<SHORTCODE>/embed
 *   TikTok     https://www.tiktok.com/embed/v2/<VIDEO_ID>
 *   YouTube    https://www.youtube-nocookie.com/embed/<VIDEO_ID>
 *
 * Leave `embedUrl: ''` when a platform refuses embedding — the card still works.
 */
export default [
  {
    id: 'reel-01',
    platform: 'instagram',
    title: 'Daily Cat Moments',
    caption: 'Rutinitas pagi Mochi: bangun, mengeluh, tidur lagi.',
    videoUrl: '',
    embedUrl: '',
    thumbnail: '/images/video-01.jpg',
    /** Drives the placeholder art + card aspect ratio. 'vertical' | 'square' */
    orientation: 'vertical'
  },
  {
    id: 'reel-02',
    platform: 'instagram',
    title: 'Box Inspection',
    caption: 'Setiap kardus wajib diperiksa. Tidak ada pengecualian.',
    videoUrl: '',
    embedUrl: '',
    thumbnail: '/images/video-02.jpg',
    orientation: 'vertical'
  },
  {
    id: 'tiktok-01',
    platform: 'tiktok',
    title: 'Funny Cat Moments',
    caption: 'Mochi versus mentimun. Mentimun menang.',
    videoUrl: '',
    embedUrl: '',
    thumbnail: '/images/video-03.jpg',
    orientation: 'vertical'
  },
  {
    id: 'tiktok-02',
    platform: 'tiktok',
    title: 'The 6AM Alarm',
    caption: 'Tidak ada yang meminta, tapi tetap datang setiap hari.',
    videoUrl: '',
    embedUrl: '',
    thumbnail: '/images/video-04.jpg',
    orientation: 'vertical'
  }
]
