/**
 * vCard 3.0 (RFC 2426) generator — runs entirely in the browser.
 *
 * Output rules implemented here:
 *  • CRLF line endings, UTF-8 text
 *  • TEXT values escape backslash, comma, semicolon and newlines (RFC 2426 §4)
 *  • Lines longer than 75 octets are folded with CRLF + one space (RFC 2425 §5.8.1),
 *    never splitting a multi-byte UTF-8 character
 *  • Empty or missing fields are left out entirely
 *
 * This module has no imports so it can be tested on its own.
 */

export interface VCardUrl {
  /** Label shown by Apple Contacts, e.g. 'Instagram'. */
  label: string
  url: string
}

export interface VCardInput {
  firstName?: string
  lastName?: string
  /** Formatted name (FN). Falls back to first + last. */
  displayName?: string
  nickname?: string
  /** International format, e.g. '+972501234567'. */
  phone?: string
  email?: string
  website?: string
  organization?: string
  title?: string
  city?: string
  note?: string
  /** Social and other profile links, stored as labelled URL fields. */
  urls?: VCardUrl[]
  /** Base64 JPEG/PNG without the data: prefix. */
  photo?: { base64: string; type: 'JPEG' | 'PNG' }
  /** Used for REV; defaults to now. */
  revision?: Date
}

const CRLF = '\r\n'
const MAX_LINE_OCTETS = 75

/** Escapes a TEXT value: \ , ; and newlines. */
export function escapeText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\r\n|\r|\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
}

/** URIs are not TEXT; only strip characters that would break the line structure. */
function cleanUri(value: string): string {
  return value.replace(/[\r\n]/g, '').trim()
}

const encoder = new TextEncoder()

/** Folds a content line to ≤75 octets per physical line, UTF-8 safe. */
export function foldLine(line: string): string {
  if (encoder.encode(line).length <= MAX_LINE_OCTETS) return line

  const parts: string[] = []
  let current = ''
  let currentOctets = 0
  // Continuation lines start with a space, which counts toward the limit.
  let limit = MAX_LINE_OCTETS

  for (const char of line) {
    const octets = encoder.encode(char).length
    if (currentOctets + octets > limit) {
      parts.push(current)
      current = ''
      currentOctets = 0
      limit = MAX_LINE_OCTETS - 1
    }
    current += char
    currentOctets += octets
  }
  parts.push(current)
  return parts.join(`${CRLF} `)
}

const has = (v: string | undefined): v is string => typeof v === 'string' && v.trim() !== ''

function formatRevision(date: Date): string {
  return date.toISOString().replace(/\.\d{3}Z$/, 'Z')
}

export function generateVCard(input: VCardInput): string {
  const first = input.firstName?.trim() ?? ''
  const last = input.lastName?.trim() ?? ''
  const formatted =
    input.displayName?.trim() || [first, last].filter(Boolean).join(' ') || 'Contact'

  const lines: string[] = ['BEGIN:VCARD', 'VERSION:3.0']

  // N is required in 3.0: Family;Given;Additional;Prefix;Suffix
  lines.push(`N:${escapeText(last)};${escapeText(first)};;;`)
  lines.push(`FN:${escapeText(formatted)}`)

  if (has(input.nickname)) lines.push(`NICKNAME:${escapeText(input.nickname.trim())}`)
  if (has(input.organization)) lines.push(`ORG:${escapeText(input.organization.trim())}`)
  if (has(input.title)) lines.push(`TITLE:${escapeText(input.title.trim())}`)
  if (has(input.phone)) lines.push(`TEL;TYPE=CELL,VOICE:${cleanUri(input.phone)}`)
  if (has(input.email)) lines.push(`EMAIL;TYPE=INTERNET,PREF:${cleanUri(input.email)}`)
  if (has(input.city)) {
    // ADR: PO Box;Extended;Street;City;Region;Postal code;Country
    lines.push(`ADR;TYPE=HOME:;;;${escapeText(input.city.trim())};;;`)
  }

  let item = 0
  if (has(input.website)) {
    item += 1
    lines.push(`item${item}.URL:${cleanUri(input.website)}`)
    lines.push(`item${item}.X-ABLabel:Website`)
  }
  for (const { label, url } of input.urls ?? []) {
    if (!has(url)) continue
    item += 1
    // Grouped "itemN" lines let Apple Contacts show a label next to each link;
    // other apps simply read the plain URL.
    lines.push(`item${item}.URL:${cleanUri(url)}`)
    lines.push(`item${item}.X-ABLabel:${escapeText(label)}`)
  }

  if (has(input.note)) lines.push(`NOTE:${escapeText(input.note.trim())}`)
  if (input.photo && has(input.photo.base64)) {
    lines.push(`PHOTO;ENCODING=b;TYPE=${input.photo.type}:${input.photo.base64.replace(/\s/g, '')}`)
  }

  lines.push(`REV:${formatRevision(input.revision ?? new Date())}`)
  lines.push('END:VCARD')

  return lines.map(foldLine).join(CRLF) + CRLF
}

/** 'Akiva Cohen' → 'akiva-cohen.vcf'; falls back to 'contact.vcf' for non-Latin names. */
export function vCardFileName(name: string): string {
  const slug = name
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return `${slug || 'contact'}.vcf`
}
