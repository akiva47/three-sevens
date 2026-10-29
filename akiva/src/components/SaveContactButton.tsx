import { useState } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { Check, LoaderCircle, UserPlus } from 'lucide-react'
import { site } from '../config/site'
import { asset } from '../lib/siteUrl'
import { downloadContact } from '../utils/contact'
import { useToast } from './Toast'

type State = 'idle' | 'working' | 'done'

export function SaveContactButton() {
  const [state, setState] = useState<State>('idle')
  const notify = useToast()

  const save = async () => {
    if (state === 'working') return
    setState('working')
    try {
      await downloadContact(asset(site.avatar))
      setState('done')
      notify({ title: 'Contact file ready!', description: 'Open it to add me to your contacts.' })
      window.setTimeout(() => setState('idle'), 2400)
    } catch {
      setState('idle')
      notify({ title: 'Couldn’t create the contact file', description: 'Please try again.', tone: 'error' })
    }
  }

  const Icon = state === 'working' ? LoaderCircle : state === 'done' ? Check : UserPlus

  return (
    <m.button
      type="button"
      onClick={save}
      aria-busy={state === 'working'}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className="btn-primary focus-ring relative flex min-h-[3.75rem] w-full items-center justify-center gap-3 overflow-hidden rounded-2xl px-6 text-[1.02rem] font-semibold tracking-[-0.01em] text-ink"
    >
      <span className="btn-shine" aria-hidden="true" />
      <AnimatePresence mode="popLayout" initial={false}>
        <m.span
          key={state}
          initial={{ opacity: 0, scale: 0.5, rotate: -30 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.5, rotate: 30 }}
          transition={{ type: 'spring', stiffness: 520, damping: 26 }}
          className="grid size-7 place-items-center rounded-full bg-ink/10"
          aria-hidden="true"
        >
          <Icon className={`size-[1.05rem] ${state === 'working' ? 'animate-spin' : ''}`} strokeWidth={2.3} />
        </m.span>
      </AnimatePresence>
      <span>{state === 'done' ? 'Contact file ready' : 'Save My Contact'}</span>
    </m.button>
  )
}
