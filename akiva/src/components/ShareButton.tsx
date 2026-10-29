import { Share2 } from 'lucide-react'
import { useShareProfile } from '../hooks/useShareProfile'
import { GlassButton } from './ActionButton'

export function ShareButton() {
  const share = useShareProfile()
  return (
    <GlassButton icon={<Share2 className="size-[1.05rem]" strokeWidth={1.9} aria-hidden="true" />} onClick={share}>
      Share My Profile
    </GlassButton>
  )
}
