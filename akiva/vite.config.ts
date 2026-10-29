import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { site } from './src/config/site.ts'
import { plainText } from './src/lib/plainText.ts'

/**
 * Base path the site is served from.
 * - User site (USERNAME.github.io)       → '/'
 * - Project site (USERNAME.github.io/x)  → '/x/'
 * The GitHub Actions workflow passes BASE_PATH from actions/configure-pages,
 * so both cases work without editing this file.
 */
function resolveBase(): string {
  const raw = (process.env.BASE_PATH ?? '').trim().replace(/^\/+|\/+$/g, '')
  return raw ? `/${raw}/` : '/'
}

/** Public URL: site.ts wins, then the URL detected by the deploy workflow. */
function resolveSiteUrl(): string {
  const configured = site.url.trim()
  const detected = (process.env.SITE_URL ?? '').trim()
  const url = configured || detected
  if (!url) return ''
  return url.endsWith('/') ? url : `${url}/`
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

/** Fills the SEO / Open Graph placeholders in index.html from site.ts. */
function siteMeta(siteUrl: string, base: string): Plugin {
  const absolute = (path: string) => (siteUrl ? new URL(path, siteUrl).href : `${base}${path}`)
  const values: Record<string, string> = {
    TITLE: site.seoTitle,
    DESCRIPTION: site.seoDescription,
    AUTHOR: [site.firstName, site.lastName].filter(Boolean).join(' '),
    THEME_COLOR: site.themeColor,
    URL: siteUrl || base,
    OG_IMAGE: absolute(site.ogImage),
    OG_IMAGE_ALT: `${site.displayName} — ${plainText(site.tagline)}`,
  }
  return {
    name: 'akiva-site-meta',
    transformIndexHtml(html) {
      let out = html.replace(/__SITE_(\w+)__/g, (match, key: string) =>
        key in values ? escapeHtml(values[key]) : match,
      )
      // Without a known public URL, drop the canonical link rather than ship a wrong one.
      if (!siteUrl) out = out.replace(/\s*<link rel="canonical"[^>]*>/, '')
      return out
    },
  }
}

export default defineConfig(() => {
  const base = resolveBase()
  const siteUrl = resolveSiteUrl()
  return {
    base,
    define: {
      __SITE_URL__: JSON.stringify(siteUrl),
    },
    plugins: [react(), tailwindcss(), siteMeta(siteUrl, base)],
    build: {
      target: 'es2020',
      cssMinify: true,
    },
  }
})
