/**
 * Choreography for the opening sequence (seconds after first paint).
 * Elements that enter later on scroll skip the wait automatically.
 */
export const intro = {
  avatar: 0.15,
  name: 0.3,
  tagline: 0.62,
  description: 0.72,
  meta: 0.85,
  links: 0.8,
  card: 1.05,
}

const start = typeof performance !== 'undefined' ? performance.now() : 0

/** Remaining delay for a step, so late (scrolled-to) reveals don't lag. */
export function introDelay(at: number): number {
  const elapsed = (performance.now() - start) / 1000
  return Math.max(0, at - elapsed)
}

export const easeOutExpo = [0.16, 1, 0.3, 1] as const
