import type { Platform, SocialLink } from '../config/site'

/** Empty strings and 'YOUR_…' tokens count as "not configured yet". */
export function isConfigured(value: string | undefined | null): value is string {
  if (!value) return false
  const trimmed = value.trim()
  return trimmed !== '' && !/^YOUR_/i.test(trimmed)
}

/** Keeps a leading '+' and digits only: '+972 (50) 123-4567' → '+972501234567'. */
export function normalizePhone(raw: string): string | null {
  const trimmed = raw.trim()
  const digits = trimmed.replace(/\D/g, '')
  if (digits.length < 6 || digits.length > 15) return null
  const international = trimmed.startsWith('+') || trimmed.startsWith('00')
  const national = trimmed.startsWith('00') ? digits.slice(2) : digits
  return international ? `+${national}` : national
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim())
}

function safeUrl(value: string): string | null {
  try {
    const url = new URL(value.trim())
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null
  } catch {
    return null
  }
}

const usernameProfiles: Partial<Record<Platform, (user: string) => string>> = {
  instagram: (u) => `https://www.instagram.com/${u}/`,
  telegram: (u) => `https://t.me/${u}`,
  tiktok: (u) => `https://www.tiktok.com/@${u}`,
  github: (u) => `https://github.com/${u}`,
  x: (u) => `https://x.com/${u}`,
  threads: (u) => `https://www.threads.net/@${u}`,
  youtube: (u) => `https://www.youtube.com/@${u}`,
  snapchat: (u) => `https://www.snapchat.com/add/${u}`,
  facebook: (u) => `https://www.facebook.com/${u}`,
  spotify: (u) => `https://open.spotify.com/user/${u}`,
}

const USERNAME_PATTERN = /^[\w.-]{1,64}$/

/**
 * Turns a configured link into a safe href, or null when it is missing or
 * invalid — callers never render a button for null.
 */
export function buildHref(link: Pick<SocialLink, 'platform' | 'value'>): string | null {
  const value = link.value?.trim()
  if (!isConfigured(value)) return null

  if (/^https?:\/\//i.test(value)) return safeUrl(value)

  switch (link.platform) {
    case 'email':
      return isValidEmail(value) ? `mailto:${value.replace(/^mailto:/i, '')}` : null
    case 'phone': {
      const phone = normalizePhone(value)
      return phone ? `tel:${phone}` : null
    }
    case 'whatsapp': {
      const phone = normalizePhone(value)
      // wa.me expects the full international number, digits only.
      return phone ? `https://wa.me/${phone.replace(/\D/g, '')}` : null
    }
    case 'website':
    case 'discord':
      return safeUrl(value.includes('://') ? value : `https://${value}`)
    default: {
      const user = value.replace(/^@/, '')
      const build = usernameProfiles[link.platform]
      return build && USERNAME_PATTERN.test(user) ? build(user) : null
    }
  }
}

/** True when the link opens in a new tab (web profiles), false for mailto:/tel:. */
export function isExternalHref(href: string): boolean {
  return /^https?:/i.test(href)
}

export interface ResolvedLink extends SocialLink {
  href: string | null
}

export function resolveLinks(links: SocialLink[]): ResolvedLink[] {
  return links.filter((l) => l.visible).map((l) => ({ ...l, href: buildHref(l) }))
}
