import { ArrowUp } from 'lucide-react'
import { site } from '../config/site'
import { Emphasis } from '../lib/Emphasis'

export function Footer() {
  const year = new Date().getFullYear()
  const owner = [site.firstName, site.lastName].filter((v) => v.trim() && !/^YOUR_/i.test(v)).join(' ') || site.displayName

  return (
    <footer className="mx-auto w-full max-w-md px-5 pt-20 pb-[max(2rem,env(safe-area-inset-bottom))] sm:max-w-xl lg:max-w-6xl lg:px-10 lg:pt-28">
      <div aria-hidden="true" className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <div className="mt-8 flex flex-col items-center gap-5 text-center lg:flex-row lg:justify-between lg:text-left">
        <div>
          <p className="font-serif text-xl text-ivory/90">
            <Emphasis text={site.tagline} className="text-champagne" />
          </p>
          <p className="mt-1.5 text-xs text-mute">
            © {year} {owner}. All rights reserved.
          </p>
        </div>
        <a
          href="#top"
          className="focus-ring group inline-flex items-center gap-2 rounded-full border border-line px-4 py-2.5 text-xs font-medium tracking-[0.18em] text-mute uppercase transition-colors hover:border-white/20 hover:text-ivory"
        >
          Back to top
          <ArrowUp className="size-3.5 transition-transform duration-500 group-hover:-translate-y-0.5" strokeWidth={2} aria-hidden="true" />
        </a>
      </div>
    </footer>
  )
}
