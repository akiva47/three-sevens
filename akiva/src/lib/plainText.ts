/** Removes the *emphasis* markers used in site.ts copy. */
export function plainText(text: string): string {
  return text.replace(/\*(.+?)\*/g, '$1')
}
