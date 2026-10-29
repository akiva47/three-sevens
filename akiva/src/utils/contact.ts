import { site } from '../config/site'
import { getSiteUrl } from '../lib/siteUrl'
import { buildHref, isConfigured, isValidEmail, normalizePhone } from './links'
import { generateVCard, vCardFileName, type VCardInput } from './generateVCard'
import { downloadBlob } from './download'

const optional = (v: string) => (isConfigured(v) ? v.trim() : undefined)

/** Collects everything configured in site.ts into vCard fields. */
export function buildContactInput(photo?: VCardInput['photo']): VCardInput {
  const phone = isConfigured(site.phone) ? normalizePhone(site.phone) ?? undefined : undefined
  const email = isConfigured(site.email) && isValidEmail(site.email) ? site.email.trim() : undefined

  const urls = site.links
    .filter((l) => l.visible && l.includeInContact !== false)
    // Email and phone already have their own fields.
    .filter((l) => l.platform !== 'email' && l.platform !== 'phone')
    .map((l) => ({ label: l.label, url: buildHref(l) }))
    .filter((l): l is { label: string; url: string } => l.url !== null)

  return {
    firstName: optional(site.firstName),
    lastName: optional(site.lastName),
    displayName: [optional(site.firstName), optional(site.lastName)].filter(Boolean).join(' ') || site.displayName,
    nickname: optional(site.alternateName),
    phone,
    email,
    website: getSiteUrl(),
    organization: optional(site.organization),
    title: optional(site.role),
    city: optional(site.location),
    note: optional(site.contactNote),
    urls,
    photo,
  }
}

/** Loads the avatar and returns a small square JPEG for the contact photo. */
async function loadContactPhoto(src: string): Promise<VCardInput['photo']> {
  try {
    const image = new Image()
    image.decoding = 'async'
    image.src = src
    await image.decode()
    const size = 360
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined
    const side = Math.min(image.naturalWidth, image.naturalHeight)
    const sx = (image.naturalWidth - side) / 2
    const sy = (image.naturalHeight - side) / 2
    ctx.fillStyle = '#0D0D0F'
    ctx.fillRect(0, 0, size, size)
    ctx.drawImage(image, sx, sy, side, side, 0, 0, size, size)
    const base64 = canvas.toDataURL('image/jpeg', 0.82).split(',')[1]
    return base64 ? { base64, type: 'JPEG' } : undefined
  } catch {
    return undefined // A contact without a photo is still a valid contact.
  }
}

/** Builds the .vcf in the browser and hands it to the browser as a download. */
export async function downloadContact(avatarSrc: string): Promise<void> {
  const photo = await loadContactPhoto(avatarSrc)
  const input = buildContactInput(photo)
  const vcard = generateVCard(input)
  const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' })
  downloadBlob(blob, vCardFileName(input.displayName ?? site.displayName))
}
