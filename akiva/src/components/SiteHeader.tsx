import { m } from 'motion/react'
import { QrCode, Share2 } from 'lucide-react'
import { site } from '../config/site'
import { useShareProfile } from '../hooks/useShareProfile'

const iconButton =
  'focus-ring grid size-11 place-items-center rounded-full border border-line bg-white/[0.035] text-ivory/90 backdrop-blur-md transition-colors duration-300 hover:border-white/20 hover:bg-white/[0.08] hover:text-ivory'

export function SiteHeader({ onShowQr }: { onShowQr: () => void }) {
  const share = useShareProfile()
  return (
    <m.header
      className="mx-auto flex w-full max-w-md items-center justify-between px-5 pt-[max(1.1rem,env(safe-area-inset-top))] sm:max-w-xl lg:max-w-6xl lg:px-10 lg:pt-8"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.1 }}
    >
      <a href="#top" className="focus-ring group flex items-center gap-2.5 rounded-full">
        <span aria-hidden="true" className="grid size-9 place-items-center rounded-full border border-champagne/30 bg-champagne/[0.08] font-serif text-lg leading-none text-champagne italic transition-transform duration-500 group-hover:rotate-[-8deg]">
          {site.displayName.charAt(0)}
        </span>
        <span className="text-[0.7rem] font-semibold tracking-[0.42em] text-ivory/80 uppercase">{site.displayName}</span>
        <span className="sr-only">, back to top</span>
      </a>
      <nav aria-label="Quick actions" className="flex items-center gap-2">
        <m.button type="button" whileTap={{ scale: 0.92 }} onClick={onShowQr} className={iconButton} aria-label="Show QR code" aria-haspopup="dialog">
          <QrCode className="size-[1.1rem]" strokeWidth={1.8} aria-hidden="true" />
        </m.button>
        <m.button type="button" whileTap={{ scale: 0.92 }} onClick={share} className={iconButton} aria-label="Share my profile">
          <Share2 className="size-[1.1rem]" strokeWidth={1.8} aria-hidden="true" />
        </m.button>
      </nav>
    </m.header>
  )
}
