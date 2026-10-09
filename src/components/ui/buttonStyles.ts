export const VARIANTS = {
  primary: 'bg-brand-strong text-white hover:bg-violet-600',
  secondary: 'border border-line bg-surface2 text-white hover:border-brand',
  whatsapp: 'bg-[#25D366] text-neutral-950 hover:bg-[#1fb957]',
  ghost: 'text-muted hover:text-white',
} as const

export const buttonBase =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-base font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50'

export function buttonClass(variant: keyof typeof VARIANTS = 'primary', extra = '') {
  return `${buttonBase} ${VARIANTS[variant]} ${extra}`
}
