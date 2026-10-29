import { Suspense, lazy, useCallback, useEffect, useMemo, useState } from 'react'
import { LazyMotion, MotionConfig, domAnimation } from 'motion/react'
import { site } from './config/site'
import { resolveLinks } from './utils/links'
import { AmbientBackground } from './components/AmbientBackground'
import { SiteHeader } from './components/SiteHeader'
import { Hero } from './components/Hero'
import { SocialLinks } from './components/SocialLinks'
import { DigitalBusinessCard } from './components/DigitalBusinessCard'
import { Footer } from './components/Footer'
import { ToastProvider } from './components/Toast'

// The QR code library only loads when someone opens the modal.
const loadQrModal = () => import('./components/QRCodeModal')
const QRCodeModal = lazy(loadQrModal)

export default function App() {
  const [qrOpen, setQrOpen] = useState(false)
  const [qrRequested, setQrRequested] = useState(false)
  const openQr = useCallback(() => {
    setQrRequested(true)
    setQrOpen(true)
  }, [])
  const closeQr = useCallback(() => setQrOpen(false), [])
  const links = useMemo(() => resolveLinks(site.links), [])
  const liveCount = links.filter((l) => l.href).length

  // Warm the QR chunk once the page has settled so the modal opens instantly.
  useEffect(() => {
    const id = window.setTimeout(() => void loadQrModal(), 3000)
    return () => window.clearTimeout(id)
  }, [])

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <ToastProvider>
          <a
            href="#main"
            className="focus-ring sr-only z-[70] rounded-full bg-champagne px-4 py-2 text-sm font-medium text-ink focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
          >
            Skip to content
          </a>
          <AmbientBackground />

          <div id="top" className="relative flex min-h-dvh flex-col">
            <SiteHeader onShowQr={openQr} />

            <main
              id="main"
              className="mx-auto w-full max-w-md flex-1 px-5 sm:max-w-xl lg:grid lg:max-w-6xl lg:grid-cols-[minmax(0,1fr)_minmax(0,29rem)] lg:gap-x-20 lg:px-10 lg:pt-16 xl:gap-x-28"
            >
              <div className="lg:sticky lg:top-16 lg:self-start lg:pt-6">
                <Hero linkCount={liveCount} />
              </div>

              <div className="mt-14 grid gap-16 lg:mt-0 lg:gap-20 lg:pt-6">
                <SocialLinks links={links} />
                <DigitalBusinessCard onShowQr={openQr} />
              </div>
            </main>

            <Footer />
          </div>

          {qrRequested && (
            <Suspense fallback={null}>
              <QRCodeModal open={qrOpen} onClose={closeQr} />
            </Suspense>
          )}
        </ToastProvider>
      </MotionConfig>
    </LazyMotion>
  )
}
