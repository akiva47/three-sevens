import type { PointerEvent } from 'react'

/** Writes the pointer position into --x / --y for the .spotlight CSS. */
export function trackSpotlight(event: PointerEvent<HTMLElement>) {
  if (event.pointerType !== 'mouse') return
  const el = event.currentTarget
  const rect = el.getBoundingClientRect()
  el.style.setProperty('--x', `${event.clientX - rect.left}px`)
  el.style.setProperty('--y', `${event.clientY - rect.top}px`)
}
