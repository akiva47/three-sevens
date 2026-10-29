import qrcode from 'qrcode-generator'

export interface QrMatrix {
  /** Modules per side, including the quiet zone. */
  size: number
  /** Quiet-zone width in modules (4 per ISO/IEC 18004). */
  margin: number
  dark: (x: number, y: number) => boolean
  /** Centre square (in modules, including margin offset) kept clear for the emblem. */
  emblem: { start: number; length: number }
}

const QUIET_ZONE = 4

/**
 * Encodes text at error-correction level H (30% recovery), which leaves
 * ample headroom for the small centre emblem drawn on top of the code.
 */
export function createQrMatrix(text: string): QrMatrix {
  const qr = qrcode(0, 'H')
  qr.addData(text, 'Byte')
  qr.make()
  const count = qr.getModuleCount()

  // Emblem covers roughly 18% of the width (~3% of the area) and stays on the module grid.
  let length = Math.round(count * 0.18)
  if (length % 2 !== count % 2) length += 1
  const emblemStart = (count - length) / 2

  const inEmblem = (x: number, y: number) =>
    x >= emblemStart && x < emblemStart + length && y >= emblemStart && y < emblemStart + length

  return {
    size: count + QUIET_ZONE * 2,
    margin: QUIET_ZONE,
    dark: (x, y) => {
      const cx = x - QUIET_ZONE
      const cy = y - QUIET_ZONE
      if (cx < 0 || cy < 0 || cx >= count || cy >= count) return false
      if (inEmblem(cx, cy)) return false
      return qr.isDark(cy, cx)
    },
    emblem: { start: emblemStart + QUIET_ZONE, length },
  }
}

/** One SVG path for all dark modules (horizontal runs merged) — crisp at any size. */
export function qrPath(matrix: QrMatrix): string {
  let d = ''
  for (let y = 0; y < matrix.size; y++) {
    let x = 0
    while (x < matrix.size) {
      if (!matrix.dark(x, y)) {
        x++
        continue
      }
      const start = x
      while (x < matrix.size && matrix.dark(x, y)) x++
      d += `M${start} ${y}h${x - start}v1h${start - x}z`
    }
  }
  return d
}

interface PngOptions {
  text: string
  title: string
  caption: string
  ink: string
  paper: string
  accent: string
}

/** Renders a print-quality PNG: the code on an ivory card with a caption. */
export async function renderQrPng({ text, title, caption, ink, paper, accent }: PngOptions): Promise<Blob> {
  const matrix = createQrMatrix(text)
  const width = 1200
  const height = 1440
  // Whole-pixel modules keep edges razor sharp with no seams between them.
  const module = Math.floor(1000 / matrix.size)
  const qrSize = module * matrix.size
  const offsetX = Math.round((width - qrSize) / 2)
  const offsetY = 100

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas unavailable')

  ctx.fillStyle = paper
  ctx.fillRect(0, 0, width, height)

  ctx.fillStyle = ink
  for (let y = 0; y < matrix.size; y++) {
    for (let x = 0; x < matrix.size; x++) {
      if (matrix.dark(x, y)) {
        ctx.fillRect(offsetX + x * module, offsetY + y * module, module, module)
      }
    }
  }

  drawEmblem(ctx, {
    x: offsetX + matrix.emblem.start * module,
    y: offsetY + matrix.emblem.start * module,
    size: matrix.emblem.length * module,
    ink,
    paper,
    accent,
  })

  await document.fonts?.ready
  ctx.textAlign = 'center'
  ctx.fillStyle = ink
  ctx.font = '600 72px "Geist Variable", system-ui, sans-serif'
  ctx.fillText(title, width / 2, offsetY + qrSize + 118)
  ctx.fillStyle = '#6f6a64'
  ctx.font = '400 36px "Geist Variable", system-ui, sans-serif'
  ctx.fillText(caption, width / 2, offsetY + qrSize + 178)

  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('PNG export failed'))), 'image/png'),
  )
}

function drawEmblem(
  ctx: CanvasRenderingContext2D,
  { x, y, size, ink, paper, accent }: { x: number; y: number; size: number; ink: string; paper: string; accent: string },
) {
  const inset = size * 0.1
  const r = (size - inset * 2) / 2
  const cx = x + size / 2
  const cy = y + size / 2
  ctx.fillStyle = paper
  ctx.fillRect(x, y, size, size)
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.fillStyle = ink
  ctx.fill()
  ctx.fillStyle = accent
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = `italic 400 ${Math.round(r * 1.5)}px "Instrument Serif", Georgia, serif`
  ctx.fillText('A', cx, cy + r * 0.08)
  ctx.textBaseline = 'alphabetic'
}
