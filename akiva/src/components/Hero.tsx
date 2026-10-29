import { m } from 'motion/react'
import { MapPin } from 'lucide-react'
import { site } from '../config/site'
import { Emphasis } from '../lib/Emphasis'
import { easeOutExpo, intro } from '../lib/intro'
import { isConfigured } from '../utils/links'
import { ProfileAvatar } from './ProfileAvatar'

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, ease: easeOutExpo, delay },
})

export function Hero({ linkCount }: { linkCount: number }) {
  const letters = Array.from(site.displayName)
  const location = isConfigured(site.location) ? site.location.trim() : ''
  const role = isConfigured(site.role) ? site.role.trim() : ''

  return (
    <section aria-labelledby="hero-name" className="relative pt-8 sm:pt-12 lg:pt-0">
      <div className="flex items-center gap-4">
        <ProfileAvatar animateIn priority className="size-[76px] sm:size-24 lg:size-28" />

        <m.dl {...rise(intro.meta)} className="grid gap-1 text-[0.8rem] leading-tight">
          <dt className="sr-only">Status</dt>
          <dd className="flex items-center gap-2 text-ivory/90">
            <span className="relative flex size-2" aria-hidden="true">
              <span className="absolute inset-0 animate-ping rounded-full bg-champagne/60 motion-reduce:animate-none" />
              <span className="relative size-2 rounded-full bg-champagne" />
            </span>
            {role || 'Personal profile'}
          </dd>
          {location ? (
            <>
              <dt className="sr-only">Location</dt>
              <dd className="flex items-center gap-1.5 text-mute">
                <MapPin className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
                {location}
              </dd>
            </>
          ) : (
            linkCount > 0 && (
              <>
                <dt className="sr-only">Channels</dt>
                <dd className="text-mute">
                  {linkCount} {linkCount === 1 ? 'way' : 'ways'} to connect
                </dd>
              </>
            )
          )}
        </m.dl>
      </div>

      <h1
        id="hero-name"
        className="mt-9 text-[clamp(4.75rem,28.5vw,8.5rem)] leading-[0.82] font-semibold tracking-[-0.06em] text-ivory sm:mt-12 lg:mt-14 lg:text-[clamp(7.5rem,11.5vw,11.5rem)]"
      >
        <span className="sr-only">{site.displayName}</span>
        <span aria-hidden="true" className="-mb-[0.1em] flex overflow-hidden pb-[0.1em]">
          {letters.map((letter, i) => (
            <m.span
              key={`${letter}-${i}`}
              className="inline-block bg-gradient-to-b from-ivory via-ivory to-[#cfc6b8] bg-clip-text text-transparent"
              initial={{ y: '105%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              transition={{ duration: 1.05, ease: easeOutExpo, delay: intro.name + i * 0.055 }}
            >
              {letter === ' ' ? ' ' : letter}
            </m.span>
          ))}
          <m.span
            className="inline-block text-champagne"
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 380, damping: 18, delay: intro.name + letters.length * 0.055 + 0.15 }}
          >
            .
          </m.span>
        </span>
      </h1>

      <m.p
        {...rise(intro.tagline)}
        className="mt-6 font-serif text-[clamp(1.85rem,8.4vw,2.6rem)] leading-[1.05] tracking-[-0.01em] text-ivory lg:mt-8 lg:text-[3.1rem]"
      >
        <Emphasis text={site.tagline} className="text-champagne" />
      </m.p>

      <m.p
        {...rise(intro.description)}
        className="mt-4 max-w-[34ch] text-[1.02rem] text-pretty leading-relaxed text-mute lg:mt-5 lg:text-lg"
      >
        {site.description}
      </m.p>

      {/* Editorial rule */}
      <m.div
        aria-hidden="true"
        className="mt-10 flex items-center gap-3 text-[0.68rem] font-medium tracking-[0.28em] text-mute/80 uppercase lg:mt-14"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: intro.meta + 0.1 }}
      >
        <m.span
          className="h-px flex-1 origin-left bg-gradient-to-r from-champagne/50 via-white/10 to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.4, ease: easeOutExpo, delay: intro.meta }}
        />
        <span>Digital identity</span>
      </m.div>
    </section>
  )
}
