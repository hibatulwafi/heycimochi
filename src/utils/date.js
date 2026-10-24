const ID_LONG = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
})

const ID_SHORT = new Intl.DateTimeFormat('id-ID', { month: 'short', year: 'numeric' })

function parse(iso) {
  if (!iso) return null
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? null : date
}

/** '17 April 2022' — returns '' for null/invalid so templates can v-if on it. */
export function formatDate(iso) {
  const date = parse(iso)
  return date ? ID_LONG.format(date) : ''
}

export function formatMonthYear(iso) {
  const date = parse(iso)
  return date ? ID_SHORT.format(date) : ''
}

/**
 * Human age from a birthday, e.g. '3 tahun 6 bulan'.
 * Under a year reports months only; under a month reports days.
 */
export function formatAge(iso, now = new Date()) {
  const birth = parse(iso)
  if (!birth || birth > now) return ''

  let months =
    (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth())
  if (now.getDate() < birth.getDate()) months -= 1

  if (months < 1) {
    const days = Math.max(0, Math.floor((now - birth) / 86_400_000))
    return `${days} hari`
  }
  if (months < 12) return `${months} bulan`

  const years = Math.floor(months / 12)
  const rest = months % 12
  return rest === 0 ? `${years} tahun` : `${years} tahun ${rest} bulan`
}

/** Newest first. Copies rather than sorting the imported array in place. */
export function sortByDateDesc(items, key = 'date') {
  return [...items].sort((a, b) => {
    const left = parse(a[key])?.getTime() ?? 0
    const right = parse(b[key])?.getTime() ?? 0
    return right - left
  })
}
