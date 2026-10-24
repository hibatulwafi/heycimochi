/**
 * The Hey Mochi palette.
 *
 * Every colour is pulled from Mochi's own reference photos: the ivory body
 * coat, the taupe-brown points on her ears/mask/tail, her blue eyes, the gold
 * bell on her bow tie, and the rose backdrop she was shot against. Rose is the
 * accent — the cat's own colours carry the base, which is what keeps the site
 * looking like her rather than like a generic pastel theme.
 *
 * These are the source of truth for sprite colours. The site chrome mirrors the
 * same values in Tailwind's `@theme` in src/assets/main.css — keep the two in
 * step. Names are shared between the two files so a colour can be traced
 * across both.
 */
export const C = {
  // Base — her ivory body coat.
  cream: '#f7f0e4',
  creamDeep: '#e8dcc6',
  paper: '#fdfaf3',

  // Mocha — her points (ears, mask, paws, tail). The primary UI colour.
  mochaLight: '#ded0bf',
  mocha: '#a89078',
  mochaDeep: '#7a6252',
  mochaShadow: '#594a3e',

  // Rose — the photo backdrop. Accent only.
  roseLight: '#fadce2',
  rose: '#efa8b8',
  roseDeep: '#a8405f',
  roseShadow: '#7d2b45',

  // Gold — the bell on her bow tie.
  goldLight: '#fbeecd',
  gold: '#e8c06a',
  goldDeep: '#7a5a14',

  // Ink / outlines — a warm near-black taken from her deepest points, so text
  // never looks cold against the ivory.
  ink: '#43372f',
  inkSoft: '#6e5e52',

  // Mochi's coat — seal point Siamese: a pale body with dark "points" on the
  // ears, face mask, paws and tail, plus the breed's signature blue eyes.
  furLight: '#f7efe1',
  fur: '#e4d4b8',
  /**
   * Body outline. Deliberately a soft taupe, NOT the point colour: outlining
   * the whole cat in seal brown reads as a dark cat with a pale belly, which
   * is the opposite of a Siamese. The dark is reserved for actual points.
   */
  coatOutline: '#c4b298',
  /** Mid point — the edge where the mask blends into the pale coat. */
  furPoint: '#8d7363',
  /** Deep point — ears, muzzle mask, paws, tail. */
  furDeepPoint: '#54433a',
  eyeBlue: '#5fa8d8',

  // Foliage. Still green — it is a garden, not part of the cat — but muted
  // and warmed so it sits inside the ivory/mocha family instead of fighting it.
  sageLight: '#bccda8',
  sage: '#94ab82',
  sageDeep: '#6f8763',
  sageShadow: '#55684b',

  // Earth
  dirtLight: '#c9a87c',
  dirt: '#a8855e',
  dirtDeep: '#8a6a47',

  // Wood / wicker
  woodLight: '#e0b887',
  wood: '#c1945f',
  woodDeep: '#9a7243',

  // Stone
  stoneLight: '#d8d4cc',
  stone: '#a8a49c',
  stoneDeep: '#6b665e',

  // Ice — her eye blue, softened for backgrounds and the game sky.
  iceLight: '#eaf3f8',
  ice: '#d3e6f0',
  iceDeep: '#b2d2e3',

  white: '#ffffff'
}

export default C
