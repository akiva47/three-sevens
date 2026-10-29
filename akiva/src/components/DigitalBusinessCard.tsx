import { useRef, type PointerEvent } from 'react'
import { m, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'
import { site } from '../config/site'
import { getSiteUrl, prettyUrl } from '../lib/siteUrl'
import { plainText } from '../lib/plainText'
import { easeOutExpo, intro, introDelay } from '../lib/intro'
import { useFinePointer } from '../hooks/useMediaQuery'
import { isConfigured } from '../utils/links'
import { ProfileAvatar } from './ProfileAvatar'
import { SectionHeading } from './SectionHeading'
import { SaveContactButton } from './SaveContactButton'
import { ShareButton } from './ShareButton'
import { QrButton } from './QrButton'

const MAX_TILT = 7 // degrees — restrained on purpose

export function DigitalBusinessCard({ onShowQr }: { onShowQr: () => void }) {
  return (
    <section aria-labelledby="card-title">
      <SectionHeading index="02" label="Identity card" title="Take me with you" id="card-title" />

      <m.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={{
          hidden: { opacity: 0, y: 36, rotateX: 14 },
          show: () => ({
            opacity: 1,
            y: 0,
            rotateX: 0,
            transition: { duration: 1.2, ease: easeOutExpo, delay: introDelay(intro.card) },
          }),
        }}
        style={{ transformPerspective: 1200 }}
      >
        <TiltCard />
      </m.div>

      <m.div
        className="mt-5 grid gap-3"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: easeOutExpo, delay: introDelay(intro.card + 0.25) }}
      >
        <SaveContactButton />
        <div className="grid gap-3 min-[380px]:grid-cols-2">
          <QrButton onClick={onShowQr} />
          <ShareButton />
        </div>
        <p className="px-2 pt-1 text-center text-xs leading-relaxed text-mute/80">
          Saves a standard contact file (.vcf). Open it to add me to Contacts.
        </p>
      </m.div>
    </section>
  )
}

function TiltCard() {
  const ref = useRef<HTMLDivElement>(null)
  const finePointer = useFinePointer()
  const reduceMotion = useReducedMotion()
  const interactive = finePointer && !reduceMotion

  // Pointer position over the card, 0…1.
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const spring = { stiffness: 160, damping: 20, mass: 0.6 }
  const rotateY = useSpring(useTransform(px, [0, 1], [-MAX_TILT, MAX_TILT]), spring)
  const rotateX = useSpring(useTransform(py, [0, 1], [MAX_TILT * 0.8, -MAX_TILT * 0.8]), spring)
  const glareX = useSpring(useTransform(px, [0, 1], [10, 90]), spring)
  const glareY = useSpring(useTransform(py, [0, 1], [0, 100]), spring)
  const glare = useMotionTemplate`radial-gradient(55% 75% at ${glareX}% ${glareY}%, rgb(255 244 230 / 0.16), transparent 70%)`
  const glareOpacity = useSpring(0, { stiffness: 120, damping: 20 })

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!interactive || event.pointerType !== 'mouse' || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    px.set((event.clientX - rect.left) / rect.width)
    py.set((event.clientY - rect.top) / rect.height)
  }
  const onEnter = () => interactive && glareOpacity.set(1)
  const onLeave = () => {
    px.set(0.5)
    py.set(0.5)
    glareOpacity.set(0)
  }

  const name = [site.firstName, isConfigured(site.lastName) ? site.lastName : ''].filter(Boolean).join(' ')
  const alternate = isConfigured(site.alternateName) ? site.alternateName.trim() : ''
  const line =
    (isConfigured(site.cardTagline) && site.cardTagline.trim()) ||
    (isConfigured(site.role) && site.role.trim()) ||
    plainText(site.tagline)
  const url = prettyUrl(getSiteUrl())

  return (
    <div className="[perspective:1200px]">
      <m.div
        ref={ref}
        onPointerMove={onMove}
        onPointerEnter={onEnter}
        onPointerLeave={onLeave}
        style={interactive ? { rotateX, rotateY, transformStyle: 'preserve-3d' } : undefined}
        whileTap={interactive ? undefined : { scale: 0.975 }}
        transition={{ type: 'spring', stiffness: 380, damping: 26 }}
        role="img"
        aria-label={`Digital business card: ${name}, ${line}, ${url}`}
        className="card-surface card-sheen relative aspect-[1.586/1] w-full touch-manipulation overflow-hidden rounded-[1.6rem] select-none"
      >
        <Guilloche />
        <div className="grain absolute inset-0 opacity-[0.09] mix-blend-overlay" aria-hidden="true" />

        {/* Pointer-follow reflection (desktop) */}
        <m.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: glare, opacity: glareOpacity }}
        />

        <div aria-hidden="true" className="relative flex h-full flex-col justify-between p-[6.5%]">
          {/* Top row */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <Emblem />
              <span className="text-[clamp(0.6rem,2.6vw,0.72rem)] font-semibold tracking-[0.42em] text-ivory/90 uppercase">
                {site.displayName}
              </span>
            </div>
            <span className="text-right text-[clamp(0.5rem,2.1vw,0.6rem)] leading-[1.5] font-medium tracking-[0.28em] text-mute uppercase">
              Personal
              <br />
              Card
            </span>
          </div>

          {/* Bottom block */}
          <div>
            <div className="flex min-w-0 items-center gap-3">
              <ProfileAvatar className="size-[clamp(2.6rem,12vw,3.4rem)]" />
              <div className="min-w-0">
                <p className="flex items-baseline gap-2 truncate font-serif text-[clamp(1.5rem,7vw,2.05rem)] leading-none text-ivory">
                  {name}
                  {alternate && (
                    <span dir="auto" className="font-sans text-[0.45em] font-normal text-champagne/80">
                      {alternate}
                    </span>
                  )}
                </p>
                <p className="mt-1.5 truncate text-[clamp(0.62rem,2.7vw,0.75rem)] text-mute">{line}</p>
              </div>
            </div>
            <div className="mt-[4.5%] flex items-center justify-between gap-3 border-t border-white/[0.09] pt-[3.5%] text-[clamp(0.55rem,2.4vw,0.68rem)] tracking-[0.14em]">
              <span className="truncate text-champagne/90">{url}</span>
              <span className="shrink-0 text-mute tabular-nums">{new Date().getFullYear()}</span>
            </div>
          </div>
        </div>
      </m.div>
    </div>
  )
}

/** Monogram seal. */
function Emblem() {
  return (
    <span className="relative grid size-[clamp(1.9rem,8.5vw,2.4rem)] place-items-center rounded-full border border-champagne/40 bg-[radial-gradient(circle_at_30%_25%,rgb(217_191_163/0.35),rgb(217_191_163/0.05)_70%)]">
      <span className="font-serif text-[clamp(1.05rem,4.8vw,1.35rem)] leading-none text-champagne italic">
        {site.displayName.charAt(0)}
      </span>
      <span className="spin-slow absolute -inset-[3px] rounded-full border border-dashed border-champagne/20" />
    </span>
  )
}

/** Fine engraved wave lines, like security printing. */
function Guilloche() {
  const lines = Array.from({ length: 18 }, (_, i) => i)
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 size-full opacity-[0.5]"
      viewBox="0 0 400 252"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="guilloche-fade" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#d9bfa3" stopOpacity="0" />
          <stop offset="0.45" stopColor="#d9bfa3" stopOpacity="0.22" />
          <stop offset="1" stopColor="#d9bfa3" stopOpacity="0.04" />
        </linearGradient>
      </defs>
      {lines.map((i) => {
        const y = 70 + i * 6
        const amp = 16 + i * 0.9
        return (
          <path
            key={i}
            d={`M-10 ${y} C 70 ${y - amp}, 130 ${y + amp}, 200 ${y} S 330 ${y - amp}, 410 ${y}`}
            fill="none"
            stroke="url(#guilloche-fade)"
            strokeWidth="0.6"
          />
        )
      })}
      <circle cx="350" cy="40" r="90" fill="none" stroke="#d9bfa3" strokeOpacity="0.07" />
      <circle cx="350" cy="40" r="120" fill="none" stroke="#d9bfa3" strokeOpacity="0.05" />
    </svg>
  )
}
