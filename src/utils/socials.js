import socialLinks from '@/data/socialLinks.js'

/**
 * Accounts that are safe to render as links.
 *
 * Requires BOTH `enabled` and a non-empty `profileUrl` — `enabled: true` with a
 * blank URL would otherwise ship a button that goes nowhere, which AC #3 is
 * specifically about. Keeping the guard here means no component has to repeat it.
 */
export function activeSocials() {
  return Object.entries(socialLinks)
    .filter(([, account]) => account.enabled && account.profileUrl?.trim())
    .map(([key, account]) => ({ key, ...account }))
}

export function hasActiveSocials() {
  return activeSocials().length > 0
}

/** Look up one account, or null if it isn't ready to be linked. */
export function getSocial(key) {
  const account = socialLinks[key]
  if (!account?.enabled || !account.profileUrl?.trim()) return null
  return { key, ...account }
}

/**
 * '@mochi' — falls back to the platform label when no handle is configured.
 *
 * Phone numbers are returned untouched: WhatsApp is addressed by number, and
 * "@0858-6304-6869" reads as a mistake.
 */
export function handleOf(account) {
  if (!account?.username) return account?.label ?? ''
  if (/^[\d\s+()-]+$/.test(account.username)) return account.username
  return account.username.startsWith('@') ? account.username : `@${account.username}`
}
