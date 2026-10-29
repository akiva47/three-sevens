import { Fragment } from 'react'

/** Renders 'One place. *Every* connection.' with the starred part emphasised. */
export function Emphasis({ text, className = '' }: { text: string; className?: string }) {
  const parts = text.split(/(\*.+?\*)/g)
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('*') && part.endsWith('*') && part.length > 2 ? (
          <em key={i} className={className}>
            {part.slice(1, -1)}
          </em>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  )
}
