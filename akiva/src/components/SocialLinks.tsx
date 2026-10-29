import { m } from 'motion/react'
import { Sparkles } from 'lucide-react'
import { introDelay, intro } from '../lib/intro'
import type { ResolvedLink } from '../utils/links'
import { PlaceholderLinkCard, SocialLinkCard } from './SocialLinkCard'
import { SectionHeading } from './SectionHeading'

export function SocialLinks({ links }: { links: ResolvedLink[] }) {
  const live = links.filter((l): l is ResolvedLink & { href: string } => l.href !== null)
  const pending = import.meta.env.DEV ? links.filter((l) => l.href === null) : []

  return (
    <section aria-labelledby="connect-title">
      <SectionHeading index="01" label="Connect" title="Find me here" id="connect-title" />

      {live.length === 0 && pending.length === 0 ? (
        <EmptyLinks />
      ) : (
        <m.ul
          className="grid gap-3"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: () => ({ transition: { staggerChildren: 0.07, delayChildren: introDelay(intro.links) } }),
          }}
        >
          {live.map((link, i) => (
            <SocialLinkCard key={link.id} link={link} index={i} />
          ))}
          {pending.map((link) => (
            <PlaceholderLinkCard key={link.id} link={link} />
          ))}
        </m.ul>
      )}
    </section>
  )
}

function EmptyLinks() {
  return (
    <m.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: introDelay(intro.links) }}
      className="relative overflow-hidden rounded-[1.35rem] border border-line bg-white/[0.025] px-6 py-9 text-center"
    >
      <span className="mx-auto grid size-12 place-items-center rounded-full border border-champagne/25 bg-champagne/10 text-champagne">
        <Sparkles className="size-5" strokeWidth={1.6} aria-hidden="true" />
      </span>
      <p className="mt-4 font-serif text-2xl text-ivory">Links are on their way.</p>
      <p className="mx-auto mt-2 max-w-[28ch] text-sm leading-relaxed text-mute">
        In the meantime, save my contact card below — it’s always up to date.
      </p>
    </m.div>
  )
}
