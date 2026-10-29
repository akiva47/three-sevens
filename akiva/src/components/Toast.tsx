import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { Check, CircleAlert } from 'lucide-react'

interface ToastMessage {
  id: number
  title: string
  description?: string
  tone?: 'success' | 'error'
}

type Notify = (toast: Omit<ToastMessage, 'id'>) => void

const ToastContext = createContext<Notify | null>(null)

export function useToast(): Notify {
  const notify = useContext(ToastContext)
  if (!notify) throw new Error('useToast must be used inside <ToastProvider>')
  return notify
}

const DURATION = 3600

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastMessage | null>(null)
  const timer = useRef<number | undefined>(undefined)
  const nextId = useRef(0)

  const notify = useCallback<Notify>((message) => {
    window.clearTimeout(timer.current)
    nextId.current += 1
    setToast({ ...message, id: nextId.current })
    timer.current = window.setTimeout(() => setToast(null), DURATION)
  }, [])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const value = useMemo(() => notify, [notify])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex justify-center px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <AnimatePresence mode="wait">
          {toast && (
            <m.div
              key={toast.id}
              initial={{ opacity: 0, y: 24, scale: 0.96, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: 12, scale: 0.98, filter: 'blur(4px)' }}
              transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              className="flex max-w-[min(26rem,100%)] items-center gap-3 rounded-[1.75rem] border border-line-strong bg-ink-2/85 py-2.5 pr-5 pl-2.5 shadow-[0_20px_50px_-15px_rgb(0_0_0/0.8)] backdrop-blur-xl"
            >
              <m.span
                initial={{ scale: 0.4, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 22, delay: 0.06 }}
                className={`grid size-8 shrink-0 place-items-center rounded-full ${
                  toast.tone === 'error' ? 'bg-ivory/10 text-ivory' : 'bg-champagne text-ink'
                }`}
                aria-hidden="true"
              >
                {toast.tone === 'error' ? (
                  <CircleAlert className="size-4" strokeWidth={2.2} />
                ) : (
                  <Check className="size-4" strokeWidth={2.6} />
                )}
              </m.span>
              <span className="min-w-0">
                <span className="block text-sm font-medium text-ivory">{toast.title}</span>
                {toast.description && (
                  <span className="block text-xs leading-snug text-mute">{toast.description}</span>
                )}
              </span>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
