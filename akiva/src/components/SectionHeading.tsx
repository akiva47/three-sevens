import { m } from 'motion/react'
import { easeOutExpo } from '../lib/intro'

/** Editorial section label: '01 — Connect' with a serif headline. */
export function SectionHeading({ index, label, title, id }: { index: string; label: string; title: string; id: string }) {
  return (
    <m.header
      className="mb-5 flex items-end justify-between gap-4"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.8, ease: easeOutExpo }}
    >
      <div>
        <p className="flex items-center gap-2 text-[0.68rem] font-medium tracking-[0.28em] text-mute uppercase">
          <span className="text-champagne tabular-nums">{index}</span>
          <span aria-hidden="true" className="h-px w-5 bg-white/15" />
          {label}
        </p>
        <h2 id={id} className="mt-2 font-serif text-[1.9rem] leading-none text-ivory">
          {title}
        </h2>
      </div>
    </m.header>
  )
}
