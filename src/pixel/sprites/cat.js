import { C } from '../palette.js'

/**
 * Mochi, 16x16 — a Himalayan (Siamese x Persian), seal point.
 *
 * Front-facing chibi build — it reads clearly at 16px and stays cute at 2x,
 * which a 16px side profile would not. Direction comes from the tail: the game
 * flips the sprite horizontally, which swings the tail to the trailing side.
 *
 * The breed is carried entirely by where the colour goes and how wide the
 * silhouette is. Four choices make or break it at this size:
 *
 *  - The body outline is a soft taupe (3), never the point colour. Outlining
 *    the whole cat in seal brown turns it into a dark cat with a pale belly.
 *  - The mask is a compact diamond around the nose. Spread any wider and it
 *    reads as a bandit stripe, not a muzzle.
 *  - Ears are short and set wide — that is the Persian half. Tall upright ears
 *    would read as a pure Siamese.
 *  - The cheeks flare below the eyes and the tail is three pixels thick: the
 *    Persian coat is what separates a Himalayan from the shorthair Siamese.
 *
 * Palette index legend (shared by every pose below):
 *   1 pale coat      2 cream coat     3 soft outline
 *   4 deep point (ears, mask core, paws, tail)      5 mid point (mask blend)
 *   6 pink (inner ear, nose)   7 blue eye   8 white (eye highlight)
 * '.' is transparent.
 */
const COAT = [
  null,
  C.furLight,
  C.fur,
  C.coatOutline,
  C.furDeepPoint,
  C.furPoint,
  C.rose,
  C.eyeBlue,
  C.white
]

/** Head, face and cheek ruff. Identical across every pose. */
const HEAD = [
  '...44......44...',
  '..44644..44644..',
  '..342211112243..',
  '..322211112223..',
  '..324721127423..',
  '..327811118723..',
  '.32114566541123.',
  '.32111444411123.'
]

/** Torso with the bushy tail curled up to the right. */
const BODY = [
  '..321111111123..',
  '..32211111122344',
  '..32111111112444',
  '..3211111111244.',
  '..322111111224..',
  '...3222112223...'
]

export const catIdle = {
  palette: COAT,
  /*
   * Idle cadence lives with the art so every consumer animates it the same.
   *
   * Straight 0-1-0-1 at 2fps made the tail snap up and down twice a second,
   * which reads as the cat vibrating rather than resting. Holding the settled
   * pose for seven beats and flicking the tail on the eighth gives one quiet
   * tail twitch every two seconds — alive, but still.
   */
  cycle: [0, 0, 0, 0, 0, 0, 0, 1],
  fps: 4,
  frames: [
    [...HEAD, ...BODY, '...4454..4544...', '...444....444...'],
    // Same cat, tail dropped one step — enough motion to read as breathing.
    [
      ...HEAD,
      '..321111111123..',
      '..322111111223..',
      '..32111111112344',
      '..32111111112444',
      '..322111111224..',
      '...3222112223...',
      '...4454..4544...',
      '...444....444...'
    ]
  ]
}

/**
 * Run cycle. Body and tail are fixed; the legs carry the motion through
 * stride-out → mid → tuck → mid. Four frames at 12fps is plenty at this size.
 */
export const catRun = {
  palette: COAT,
  frames: [
    [...HEAD, ...BODY, '...44......44...', '...44......44...'],
    [...HEAD, ...BODY, '...4454..4544...', '...444....444...'],
    [...HEAD, ...BODY, '.....44..44.....', '.....4....4.....'],
    [...HEAD, ...BODY, '...4454..4544...', '...444....444...']
  ]
}

/** Airborne, rising: legs tucked, tail flicked up behind the head. */
export const catJump = {
  palette: COAT,
  frames: [
    [
      ...HEAD,
      '..32111111112344',
      '..32211111122444',
      '..3211111111244.',
      '..321111111123..',
      '..322111111223..',
      '...3222112223...',
      '....44....44....',
      '................'
    ]
  ]
}

/** Airborne, falling: legs splayed, tail down. */
export const catFall = {
  palette: COAT,
  frames: [
    [
      ...HEAD,
      '..321111111123..',
      '..322111111223..',
      '..321111111123..',
      '..32111111112344',
      '..3221111112244.',
      '...3222112223...',
      '...44......44...',
      '...4........4...'
    ]
  ]
}

export default { catIdle, catRun, catJump, catFall }
