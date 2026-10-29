export type ShareResult = 'shared' | 'copied' | 'cancelled' | 'failed'

/** Copies text with the Clipboard API, falling back to a hidden textarea. */
export async function copyText(text: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // Permission denied or unfocused document — try the legacy path.
    }
  }
  try {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', '')
    textarea.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none'
    document.body.appendChild(textarea)
    textarea.select()
    textarea.setSelectionRange(0, text.length)
    const ok = document.execCommand('copy')
    textarea.remove()
    return ok
  } catch {
    return false
  }
}

/**
 * Opens the native share sheet where available (most phones), otherwise
 * copies the URL to the clipboard.
 */
export async function shareProfile(data: { url: string; title: string; text: string }): Promise<ShareResult> {
  const prefersNativeShare = window.matchMedia('(pointer: coarse)').matches
  if (prefersNativeShare && typeof navigator.share === 'function') {
    const payload: ShareData = { title: data.title, text: data.text, url: data.url }
    if (!navigator.canShare || navigator.canShare(payload)) {
      try {
        await navigator.share(payload)
        return 'shared'
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return 'cancelled'
        // NotAllowedError etc. — fall through to copying.
      }
    }
  }
  return (await copyText(data.url)) ? 'copied' : 'failed'
}
