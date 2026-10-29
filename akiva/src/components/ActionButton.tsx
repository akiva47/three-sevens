import type { ComponentProps, ReactNode } from 'react'
import { m } from 'motion/react'
import { trackSpotlight } from '../lib/pointer'

type ButtonProps = Omit<ComponentProps<typeof m.button>, 'children'> & {
  icon: ReactNode
  children: ReactNode
}

/** Secondary glass button used for QR / Share / Copy / Download. */
export function GlassButton({ icon, children, className = '', ...props }: ButtonProps) {
  return (
    <m.button
      type="button"
      onPointerMove={trackSpotlight}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={`spotlight group focus-ring inline-flex min-h-[3.25rem] items-center justify-center gap-2 overflow-hidden rounded-2xl border border-line bg-white/[0.04] px-3 text-[0.9rem] font-medium tracking-[-0.01em] text-ivory transition-[background-color,border-color] duration-300 hover:border-white/[0.16] hover:bg-white/[0.07] active:bg-white/[0.09] disabled:opacity-60 ${className}`}
      {...props}
    >
      <span className="text-champagne transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-110">
        {icon}
      </span>
      <span className="whitespace-nowrap">{children}</span>
    </m.button>
  )
}
