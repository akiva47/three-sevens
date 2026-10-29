/** Triggers a browser download for a Blob. No network involved. */
export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  anchor.rel = 'noopener'
  anchor.style.display = 'none'
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  // Some mobile browsers read the blob after click() returns; revoke later.
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
}
