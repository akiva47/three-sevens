import { useState } from 'react'
import { m } from 'motion/react'
import { site } from '../config/site'
import { asset } from '../lib/siteUrl'
import { easeOutExpo, intro } from '../lib/intro'

interface ProfileAvatarProps {
  /** Size utilities, e.g. 'size-20 lg:size-28'. */
  /** Play the hero entrance animation. */
  animateIn?: boolean
  className?: string
  /** Loads eagerly with high priority (the hero avatar). */
  priority?: boolean
}

/**
 * Circular portrait with a champagne ring and soft glow. Falls back to an
 * elegant monogram if the image in site.ts can't be loaded.
 */
export function ProfileAvatar({ animateIn = false, className = 'size-20', priority = false }: ProfileAvatarProps) {
  const [failed, setFailed] = useState(false)
  const initial = site.firstName.trim().charAt(0) || site.displayName.charAt(0) || 'A'
  const alt = `Portrait of ${site.firstName || site.displayName}`

  return (
    <m.div
      className={`group/avatar relative shrink-0 rounded-full [container-type:inline-size] ${className}`}
      initial={animateIn ? { opacity: 0, scale: 0.86 } : false}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.1, ease: easeOutExpo, delay: animateIn ? intro.avatar : 0 }}
      whileHover={{ scale: 1.035 }}
    >
      {/* Outer glow */}
      <span
        aria-hidden="true"
        className="absolute -inset-3 rounded-full bg-[radial-gradient(closest-side,rgb(217_191_163/0.28),transparent)] opacity-70 transition-opacity duration-700 group-hover/avatar:opacity-100"
      />
      {/* Ring */}
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-[conic-gradient(from_210deg,#f1e2d1,#b89a7c_25%,#5b4b3d_45%,#d9bfa3_65%,#f5f0e8_85%,#f1e2d1)] p-px"
      />
      <span className="absolute inset-[1.5px] overflow-hidden rounded-full bg-ink-2 ring-[3px] ring-ink">
        {failed ? (
          <span
            role="img"
            aria-label={alt}
            className="grid size-full place-items-center bg-[radial-gradient(120%_120%_at_30%_20%,#3a322b,#151416_70%)] font-serif text-champagne italic"
            style={{ fontSize: '52cqw' }}
          >
            {initial}
          </span>
        ) : (
          <img
            src={asset(site.avatar)}
            alt={alt}
            width={512}
            height={512}
            decoding="async"
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            onError={() => setFailed(true)}
            className="size-full object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover/avatar:scale-[1.06]"
          />
        )}
      </span>
    </m.div>
  )
}
