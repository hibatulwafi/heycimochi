/**
 * Static video list for /socials.
 *
 * PRD §4.3: without a backend there is no automatic sync — this list is curated
 * by hand. Each card renders from `title` + `thumbnail` and always links out to
 * `videoUrl`, so a missing or broken `embedUrl` degrades to a plain link instead
 * of an empty box.
 *
 * Getting embedUrl:
 *   Instagram  https://www.instagram.com/p/<SHORTCODE>/embed
 *              (works for /p/ and /reel/ alike — use whichever the URL says)
 *   TikTok     https://www.tiktok.com/player/v1/<VIDEO_ID>
 *              This is the form TikTok's own oEmbed endpoint returns today;
 *              the older /embed/v2/ path is superseded. `autoplay=1&muted=1`
 *              means the clip starts the moment the visitor presses play on
 *              our card, silently — no second click, and no sound without
 *              being asked (PRD §10).
 *   YouTube    https://www.youtube-nocookie.com/embed/<VIDEO_ID>
 *
 * Leave `embedUrl: ''` when a platform refuses embedding — the card still works.
 *
 * TITLES: these are placeholders. Neither platform exposes the caption without
 * an API key, so rather than invent descriptions of clips nobody here has
 * watched, each card is numbered. Replace `title` and `caption` with the real
 * ones — nothing else needs touching.
 */
export default [
  {
    id: 'ig-01',
    platform: 'instagram',
    title: 'Reel Mochi #1',
    caption: '',
    videoUrl: 'https://www.instagram.com/p/DenPzV-zZ4r/',
    embedUrl: 'https://www.instagram.com/p/DenPzV-zZ4r/embed',
    thumbnail: '/images/video-01.jpg',
    /** Drives the placeholder art + card aspect ratio. 'vertical' | 'square' */
    orientation: 'vertical'
  },
  {
    id: 'ig-02',
    platform: 'instagram',
    title: 'Reel Mochi #2',
    caption: '',
    videoUrl: 'https://www.instagram.com/p/DenuVeETFFt/',
    embedUrl: 'https://www.instagram.com/p/DenuVeETFFt/embed',
    thumbnail: '/images/video-02.jpg',
    orientation: 'vertical'
  },
  {
    id: 'ig-03',
    platform: 'instagram',
    title: 'Reel Mochi #3',
    caption: '',
    videoUrl: 'https://www.instagram.com/p/Dep7PnJTeKb/',
    embedUrl: 'https://www.instagram.com/p/Dep7PnJTeKb/embed',
    thumbnail: '/images/video-03.jpg',
    orientation: 'vertical'
  },
  {
    id: 'ig-04',
    platform: 'instagram',
    title: 'Reel Mochi #4',
    caption: '',
    videoUrl: 'https://www.instagram.com/p/De2vVr4zpYx/',
    embedUrl: 'https://www.instagram.com/p/De2vVr4zpYx/embed',
    thumbnail: '/images/video-04.jpg',
    orientation: 'vertical'
  },
  {
    id: 'tiktok-01',
    platform: 'tiktok',
    title: 'TikTok Mochi #1',
    caption: '',
    videoUrl: 'https://www.tiktok.com/@mochihimalayancat0/video/7699706993514237191',
    embedUrl: 'https://www.tiktok.com/player/v1/7699706993514237191?autoplay=1&muted=1',
    thumbnail: '/images/video-05.jpg',
    orientation: 'vertical'
  },
  {
    id: 'tiktok-02',
    platform: 'tiktok',
    title: 'TikTok Mochi #2',
    caption: '',
    videoUrl: 'https://www.tiktok.com/@mochihimalayancat0/video/7698920535299951880',
    embedUrl: 'https://www.tiktok.com/player/v1/7698920535299951880?autoplay=1&muted=1',
    thumbnail: '/images/video-06.jpg',
    orientation: 'vertical'
  },
  {
    id: 'tiktok-03',
    platform: 'tiktok',
    title: 'TikTok Mochi #3',
    caption: '',
    videoUrl: 'https://www.tiktok.com/@mochihimalayancat0/video/7682038897446063367',
    embedUrl: 'https://www.tiktok.com/player/v1/7682038897446063367?autoplay=1&muted=1',
    thumbnail: '/images/video-07.jpg',
    orientation: 'vertical'
  },
  {
    id: 'tiktok-04',
    platform: 'tiktok',
    title: 'TikTok Mochi #4',
    caption: '',
    videoUrl: 'https://www.tiktok.com/@mochihimalayancat0/video/7679758356126453010',
    embedUrl: 'https://www.tiktok.com/player/v1/7679758356126453010?autoplay=1&muted=1',
    thumbnail: '/images/video-08.jpg',
    orientation: 'vertical'
  }
]
