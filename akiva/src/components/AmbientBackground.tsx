import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import { useFinePointer } from '../hooks/useMediaQuery'

/**
 * Fixed atmosphere behind the page: drifting champagne light, a cursor-
 * following glow on desktop, grain and a vignette. Animations are pure CSS
 * transforms/opacity; the cursor light is throttled to animation frames.
 */
export function AmbientBackground() {
  const light = useRef<HTMLDivElement>(null)
  const finePointer = useFinePointer()
  const reduceMotion = useReducedMotion()
  const followCursor = finePointer && !reduceMotion

  useEffect(() => {
    if (!followCursor) return
    const el = light.current
    if (!el) return

    let frame = 0
    let targetX = window.innerWidth * 0.7
    let targetY = window.innerHeight * 0.3
    let x = targetX
    let y = targetY

    const tick = () => {
      // Ease toward the pointer for a soft, weighted trail.
      x += (targetX - x) * 0.08
      y += (targetY - y) * 0.08
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
      frame = Math.abs(targetX - x) + Math.abs(targetY - y) > 0.5 ? requestAnimationFrame(tick) : 0
    }
    const onMove = (event: PointerEvent) => {
      targetX = event.clientX
      targetY = event.clientY
      if (!frame) frame = requestAnimationFrame(tick)
    }

    el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(frame)
    }
  }, [followCursor])

  return (
    <div aria-hidden="true" className="atmosphere pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink">
      {/* Warm key light, top */}
      <div className="orb orb-a top-[-28vh] left-[-20vw] h-[80vh] w-[95vw] bg-[radial-gradient(closest-side,rgb(217_191_163/0.16),rgb(217_191_163/0.05)_45%,transparent)] lg:left-[-8vw] lg:w-[60vw]" />
      {/* Deep amber fill, lower right */}
      <div className="orb orb-b right-[-30vw] bottom-[-25vh] h-[75vh] w-[95vw] bg-[radial-gradient(closest-side,rgb(184_140_100/0.12),rgb(120_90_70/0.05)_50%,transparent)] lg:right-[-10vw] lg:w-[55vw]" />
      {/* Ivory accent, behind the content */}
      <div className="orb orb-c top-[30vh] left-[35vw] h-[45vh] w-[60vw] bg-[radial-gradient(closest-side,rgb(245_240_232/0.05),transparent)]" />

      {followCursor && (
        <div
          ref={light}
          className="absolute top-0 left-0 size-[42rem] rounded-full bg-[radial-gradient(closest-side,rgb(217_191_163/0.075),transparent)] will-change-transform"
        />
      )}

      {/* Horizon line */}
      <div className="absolute inset-x-0 top-[38vh] h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      <div className="grain absolute inset-0 opacity-[0.07]" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_30%,transparent_55%,rgb(5_5_6/0.75))]" />
    </div>
  )
}
