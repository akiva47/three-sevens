import { useEffect, useId, useMemo, useRef } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { Copy, Download, X } from 'lucide-react'
import { site } from '../config/site'
import { getSiteUrl, prettyUrl } from '../lib/siteUrl'
import { createQrMatrix, qrPath, renderQrPng } from '../utils/qr'
import { copyText } from '../utils/shareProfile'
import { downloadBlob } from '../utils/download'
import { GlassButton } from './ActionButton'
import { useToast } from './Toast'

const INK = '#0D0D0F'
const PAPER = '#F5F0E8'
const ACCENT = '#D9BFA3'

interface QRCodeModalProps {
  open: boolean
  onClose: () => void
}

export default function QRCodeModal({ open, onClose }: QRCodeModalProps) {
  return <AnimatePresence>{open && <Dialog onClose={onClose} />}</AnimatePresence>
}

function Dialog({ onClose }: { onClose: () => void }) {
  const titleId = useId()
  const descId = useId()
  const panel = useRef<HTMLDivElement>(null)
  const notify = useToast()
  const url = getSiteUrl()
  const matrix = useMemo(() => createQrMatrix(url), [url])
  const path = useMemo(() => qrPath(matrix), [matrix])
  const closeRef = useRef(onClose)
  closeRef.current = onClose

  // Focus management: move focus in, trap Tab, restore on close, lock scroll.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
    const root = document.documentElement
    const previousOverflow = root.style.overflow
    root.style.overflow = 'hidden'
    panel.current?.focus()

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeRef.current()
        return
      }
      if (event.key !== 'Tab' || !panel.current) return
      const focusable = panel.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement
      if (event.shiftKey && (active === first || active === panel.current)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      root.style.overflow = previousOverflow
      previouslyFocused?.focus?.()
    }
  }, [])

  const copy = async () => {
    const ok = await copyText(url)
    notify(ok ? { title: 'Link copied', description: prettyUrl(url) } : { title: 'Copy failed', description: url, tone: 'error' })
  }

  const download = async () => {
    try {
      const blob = await renderQrPng({
        text: url,
        title: `${site.displayName}.`,
        caption: prettyUrl(url),
        ink: INK,
        paper: PAPER,
        accent: ACCENT,
      })
      downloadBlob(blob, `${site.displayName.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'profile'}-qr.png`)
      notify({ title: 'QR code saved', description: 'PNG image downloaded' })
    } catch {
      notify({ title: 'Couldn’t create the image', tone: 'error' })
    }
  }

  const emblemCenter = matrix.emblem.start + matrix.emblem.length / 2
  const emblemRadius = matrix.emblem.length * 0.4

  return (
    <m.div
      className="fixed inset-0 z-50 flex items-end justify-center p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.25, delay: 0.05 } }}
      transition={{ duration: 0.3 }}
    >
      {/* Overlay — clicking it closes the dialog */}
      <div aria-hidden="true" className="absolute inset-0 bg-[#050506]/70 backdrop-blur-md" onClick={onClose} />

      <m.div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        tabIndex={-1}
        initial={{ opacity: 0, y: 48, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 32, scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 340, damping: 30 }}
        className="relative w-full max-w-[24rem] overflow-hidden rounded-[2rem] border border-white/[0.12] bg-gradient-to-b from-[#1d1b1d]/95 to-[#121113]/95 p-5 shadow-[0_40px_100px_-30px_rgb(0_0_0/0.9),inset_0_1px_0_rgb(255_255_255/0.08)] outline-none sm:p-6"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/2 h-48 w-72 -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(217_191_163/0.22),transparent)]"
        />

        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="text-[0.68rem] font-medium tracking-[0.28em] text-champagne uppercase">Scan to connect</p>
            <h2 id={titleId} className="mt-1.5 font-serif text-[2rem] leading-none text-ivory">
              My personal code
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close QR code"
            className="focus-ring -mt-1 -mr-1 grid size-11 shrink-0 place-items-center rounded-full border border-line bg-white/[0.04] text-ivory transition-colors hover:bg-white/[0.09]"
          >
            <X className="size-[1.1rem]" strokeWidth={2} aria-hidden="true" />
          </button>
        </div>

        <p id={descId} className="relative mt-3 text-sm leading-relaxed text-mute">
          Point any phone camera at the code to open my page instantly.
        </p>

        <m.div
          className="relative mx-auto mt-5 aspect-square w-full max-w-[18.5rem] rounded-[1.4rem] bg-ivory p-2 shadow-[0_20px_50px_-20px_rgb(217_191_163/0.45)]"
          initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22, delay: 0.08 }}
        >
          <svg
            viewBox={`0 0 ${matrix.size} ${matrix.size}`}
            className="size-full"
            shapeRendering="crispEdges"
            role="img"
            aria-label={`QR code linking to ${prettyUrl(url)}`}
          >
            <rect width={matrix.size} height={matrix.size} fill={PAPER} />
            <path d={path} fill={INK} />
            <circle cx={emblemCenter} cy={emblemCenter} r={emblemRadius} fill={INK} shapeRendering="geometricPrecision" />
            <text
              x={emblemCenter}
              y={emblemCenter + emblemRadius * 0.08}
              textAnchor="middle"
              dominantBaseline="central"
              fill={ACCENT}
              fontFamily="'Instrument Serif', Georgia, serif"
              fontStyle="italic"
              fontSize={emblemRadius * 1.5}
            >
              {site.displayName.charAt(0)}
            </text>
          </svg>
        </m.div>

        <p className="relative mt-4 text-center text-sm font-medium tracking-[0.04em] text-ivory/85">
          {prettyUrl(url)}
        </p>

        <div className="relative mt-5 grid grid-cols-2 gap-3">
          <GlassButton icon={<Copy className="size-4" strokeWidth={1.9} aria-hidden="true" />} onClick={copy}>
            Copy Link
          </GlassButton>
          <GlassButton icon={<Download className="size-4" strokeWidth={1.9} aria-hidden="true" />} onClick={download} aria-label="Download PNG of the QR code">
            Download PNG
          </GlassButton>
        </div>
      </m.div>
    </m.div>
  )
}
