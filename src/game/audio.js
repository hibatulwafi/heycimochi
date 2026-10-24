/**
 * Tiny WebAudio blips — no audio files, no autoplay.
 *
 * PRD §10: the game must not start audio on its own. Nothing here creates an
 * AudioContext until `setEnabled(true)` runs, and that only happens from the
 * sound toggle — i.e. from a real user gesture, which is also what browsers
 * require before audio will play at all.
 */
let ctx = null
let master = null
let enabled = false

const TONES = {
  coin: { freq: 880, to: 1320, duration: 0.09, type: 'square', gain: 0.1 },
  fish: { freq: 660, to: 1180, duration: 0.16, type: 'triangle', gain: 0.14 },
  jump: { freq: 420, to: 700, duration: 0.1, type: 'square', gain: 0.07 },
  hurt: { freq: 320, to: 110, duration: 0.22, type: 'sawtooth', gain: 0.1 },
  complete: { freq: 520, to: 1560, duration: 0.45, type: 'triangle', gain: 0.14 },
  gameover: { freq: 300, to: 90, duration: 0.6, type: 'triangle', gain: 0.12 }
}

export function isEnabled() {
  return enabled
}

export function setEnabled(value) {
  enabled = Boolean(value)

  if (!enabled) {
    // Keep the context around but silent — recreating it on every toggle risks
    // hitting the per-page context limit.
    if (master) master.gain.value = 0
    return enabled
  }

  try {
    const AudioCtx = window.AudioContext ?? window.webkitAudioContext
    if (!AudioCtx) {
      enabled = false
      return enabled
    }
    if (!ctx) {
      ctx = new AudioCtx()
      master = ctx.createGain()
      master.connect(ctx.destination)
    }
    master.gain.value = 1
    // Browsers may hand back a suspended context even after a gesture.
    if (ctx.state === 'suspended') ctx.resume()
  } catch {
    enabled = false
  }

  return enabled
}

export function play(name) {
  if (!enabled || !ctx || !master) return

  const tone = TONES[name]
  if (!tone) return

  const now = ctx.currentTime
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = tone.type
  osc.frequency.setValueAtTime(tone.freq, now)
  osc.frequency.exponentialRampToValueAtTime(tone.to, now + tone.duration)

  // Exponential ramps cannot reach 0, hence the small floor.
  gain.gain.setValueAtTime(tone.gain, now)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + tone.duration)

  osc.connect(gain)
  gain.connect(master)
  osc.start(now)
  osc.stop(now + tone.duration + 0.02)
}

export default { play, setEnabled, isEnabled }
