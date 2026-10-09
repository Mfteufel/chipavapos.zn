import type { Product } from '../data/products'

/** Clases por sabor (completas, para que Tailwind las detecte). Contraste AA verificado. */
export const ACCENT: Record<
  Product['acento'],
  { text: string; border: string; button: string; glow: string; ring: string }
> = {
  frutilla: {
    text: 'text-frutilla-soft',
    border: 'border-frutilla/50',
    button: 'bg-frutilla text-white hover:bg-rose-700',
    glow: 'from-frutilla/30',
    ring: 'hover:border-frutilla',
  },
  sandia: {
    text: 'text-sandia-soft',
    border: 'border-sandia/50',
    button: 'bg-sandia text-neutral-950 hover:bg-green-400',
    glow: 'from-sandia/25',
    ring: 'hover:border-sandia',
  },
  cereza: {
    text: 'text-cereza-soft',
    border: 'border-cereza-soft/50',
    button: 'bg-cereza text-white border border-cereza-soft/60 hover:bg-rose-900',
    glow: 'from-cereza/50',
    ring: 'hover:border-cereza-soft',
  },
}
