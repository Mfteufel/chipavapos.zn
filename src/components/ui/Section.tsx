import type { ReactNode } from 'react'

export function Section({
  id,
  eyebrow,
  title,
  subtitle,
  children,
}: {
  id?: string
  eyebrow?: string
  title: string
  subtitle?: string
  children: ReactNode
}) {
  return (
    <section id={id} className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 py-14 sm:py-20">
      {eyebrow && (
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-brand">{eyebrow}</p>
      )}
      <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 max-w-2xl text-muted">{subtitle}</p>}
      <div className="mt-8 sm:mt-10">{children}</div>
    </section>
  )
}
