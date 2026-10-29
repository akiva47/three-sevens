import { QrCode } from 'lucide-react'
import { GlassButton } from './ActionButton'

export function QrButton({ onClick }: { onClick: () => void }) {
  return (
    <GlassButton
      icon={<QrCode className="size-[1.05rem]" strokeWidth={1.9} aria-hidden="true" />}
      onClick={onClick}
      aria-haspopup="dialog"
    >
      Show QR Code
    </GlassButton>
  )
}
