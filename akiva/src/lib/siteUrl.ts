import { site } from '../config/site'

declare const __SITE_URL__: string

/**
 * The public address of the site, always ending in '/'.
 * Order: site.url → URL detected at build time by the deploy workflow →
 * the address the page is currently served from.
 */
export function getSiteUrl(): string {
  if (site.url.trim()) return withSlash(site.url.trim())
  if (__SITE_URL__) return __SITE_URL__
  if (typeof window !== 'undefined') {
    return withSlash(new URL(import.meta.env.BASE_URL, window.location.origin).href)
  }
  return '/'
}

/** 'https://name.github.io/' → 'name.github.io' — for display. */
export function prettyUrl(url: string): string {
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '')
}

/** Resolves a file in public/ against the deployed base path. */
export function asset(path: string): string {
  if (/^(https?:|data:|blob:)/.test(path)) return path
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`
}

function withSlash(url: string): string {
  return url.endsWith('/') ? url : `${url}/`
}
