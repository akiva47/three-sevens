import { Globe, Mail, Phone } from 'lucide-react'
import type { Platform } from '../../config/site'
import { brandIconPaths, type BrandIconName } from './brandIconPaths'

const isBrand = (p: Platform): p is BrandIconName => p in brandIconPaths

/** Monochrome platform glyph; inherits colour from `currentColor`. */
export function PlatformIcon({ platform, className = 'size-5' }: { platform: Platform; className?: string }) {
  if (isBrand(platform)) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true" focusable="false">
        <path d={brandIconPaths[platform]} />
      </svg>
    )
  }
  const Icon = platform === 'email' ? Mail : platform === 'phone' ? Phone : Globe
  return <Icon className={className} strokeWidth={1.75} aria-hidden="true" />
}
