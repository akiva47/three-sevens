import { m, type Variants } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { trackSpotlight } from '../lib/pointer'
import { isExternalHref, type ResolvedLink } from '../utils/links'
import { PlatformIcon } from './icons/PlatformIcon'

export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 22, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 260, damping: 26 } },
}

interface SocialLinkCardProps {
  link: ResolvedLink & { href: string }
  index: number
}

export function SocialLinkCard({ link, index }: SocialLinkCardProps) {
  const external = isExternalHref(link.href)
  const number = String(index + 1).padStart(2, '0')

  return (
    <m.li variants={cardVariants} className="list-none">
      <m.a
        href={link.href}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        onPointerMove={trackSpotlight}
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.975 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        className="spotlight group focus-ring flex min-h-[4.75rem] items-center gap-4 overflow-hidden rounded-[1.35rem] border border-line bg-gradient-to-b from-white/[0.045] to-white/[0.018] px-4 py-3.5 transition-[background-color,border-color,box-shadow] duration-500 active:border-champagne/30 active:bg-white/[0.07] sm:px-5 hover:border-white/[0.14] hover:bg-white/[0.05] hover:shadow-[0_18px_40px_-20px_rgb(0_0_0/0.9)]"
      >
        <span className="relative grid size-12 shrink-0 place-items-center rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.08] to-white/[0.02] text-ivory shadow-[inset_0_1px_0_rgb(255_255_255/0.08)] transition-[color,border-color] duration-500 group-hover:border-champagne/25 group-hover:text-champagne group-active:text-champagne">
          <PlatformIcon
            platform={link.platform}
            className="size-[1.3rem] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-110 group-hover:-rotate-6"
          />
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex items-baseline gap-2">
            <span className="truncate text-[1.02rem] font-medium tracking-[-0.01em] text-ivory">{link.label}</span>
            <span aria-hidden="true" className="text-[0.65rem] font-medium text-mute/60 tabular-nums">
              {number}
            </span>
          </span>
          <span className="mt-0.5 block truncate text-sm text-mute transition-colors duration-500 group-hover:text-ivory/75">
            {link.description}
          </span>
          {external && <span className="sr-only"> (opens in a new tab)</span>}
        </span>

        <span
          aria-hidden="true"
          className="arrow-swap grid size-10 shrink-0 place-items-center rounded-full border border-white/[0.08] text-mute transition-[background-color,color,border-color] duration-500 group-hover:border-champagne/30 group-hover:bg-champagne group-hover:text-ink group-active:bg-champagne group-active:text-ink"
        >
          <ArrowUpRight className="size-4" strokeWidth={2} />
          <ArrowUpRight className="size-4" strokeWidth={2} />
        </span>
      </m.a>
    </m.li>
  )
}

/** Shown only during `npm run dev` for links that still hold a placeholder. */
export function PlaceholderLinkCard({ link }: { link: ResolvedLink }) {
  return (
    <m.li variants={cardVariants} className="list-none">
      <div
        aria-disabled="true"
        className="flex min-h-[4.75rem] items-center gap-4 rounded-[1.35rem] border border-dashed border-white/15 px-4 py-3.5 opacity-70 sm:px-5"
      >
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-dashed border-white/15 text-mute">
          <PlatformIcon platform={link.platform} className="size-[1.3rem]" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[1.02rem] font-medium text-ivory/80">{link.label}</span>
          <span className="mt-0.5 block text-xs text-mute">
            Not configured — set <code className="text-champagne">value</code> in src/config/site.ts
          </span>
        </span>
        <span className="rounded-full border border-white/10 px-2 py-1 text-[0.6rem] tracking-[0.18em] text-mute uppercase">
          Dev only
        </span>
      </div>
    </m.li>
  )
}
