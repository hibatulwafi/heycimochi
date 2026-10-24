const BEST_PREFIX = 'hey-mochi:best:'
/** Written by the pre-5-level build, when there was only one level. */
const LEGACY_KEY = 'hey-mochi:best-score'

/**
 * Best score, per level, on this device only.
 *
 * PRD §4.4 permits local storage when it is added explicitly; PRD §13 rules out
 * a cross-device leaderboard. This is the former: one integer per level, no
 * identifiers, nothing sent anywhere. Every access is guarded because Safari
 * private mode throws on localStorage access rather than returning null.
 */
function read(key) {
  try {
    const value = Number.parseInt(window.localStorage.getItem(key) ?? '', 10)
    return Number.isFinite(value) && value >= 0 ? value : 0
  } catch {
    return 0
  }
}

export function readBestScore(levelId) {
  if (!levelId) return 0
  const best = read(BEST_PREFIX + levelId)
  // The old single-level score belonged to what is now level 1; fold it in so
  // nobody's existing record silently disappears.
  return levelId === 'backyard' ? Math.max(best, read(LEGACY_KEY)) : best
}

/** Writes only on improvement. Returns the best score after the attempt. */
export function writeBestScore(levelId, score) {
  const best = readBestScore(levelId)
  if (!levelId || score <= best) return best

  try {
    window.localStorage.setItem(BEST_PREFIX + levelId, String(score))
    return score
  } catch {
    return best
  }
}

/** Highest level index reached, so the picker can show progress. */
const PROGRESS_KEY = 'hey-mochi:progress'

export function readProgress() {
  return read(PROGRESS_KEY)
}

export function writeProgress(levelIndex) {
  if (levelIndex <= readProgress()) return readProgress()
  try {
    window.localStorage.setItem(PROGRESS_KEY, String(levelIndex))
    return levelIndex
  } catch {
    return readProgress()
  }
}

export function clearProgress() {
  try {
    window.localStorage.removeItem(PROGRESS_KEY)
  } catch {
    /* nothing to do — storage is unavailable */
  }
}
