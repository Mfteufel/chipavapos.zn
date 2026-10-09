import { Link } from 'react-router-dom'
import { BUSINESS_NAME } from '../../config'
import { useCartSummary } from '../../hooks/useCartSummary'
import { CartIcon } from '../ui/Icons'
import { useUiStore } from '../../store/uiStore'

const LINKS = [
  { to: '/#catalogo', label: 'Sabores' },
  { to: '/#precios', label: 'Precios' },
  { to: '/#envios', label: 'Envíos' },
  { to: '/faq', label: 'Preguntas' },
]

export function Header() {
  const openCart = useUiStore((s) => s.openCart)
  const { summary } = useCartSummary()
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link to="/" className="font-display text-lg font-bold tracking-tight sm:text-xl">
          {BUSINESS_NAME}
        </Link>
        <nav aria-label="Principal" className="hidden gap-6 md:flex">
          {LINKS.map((l) => (
            <Link key={l.to} to={l.to} className="text-muted hover:text-white">
              {l.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          onClick={openCart}
          aria-label={`Abrir carrito, ${summary.totalUnits} productos`}
          className="relative inline-flex min-h-11 items-center gap-2 rounded-xl border border-line bg-surface2 px-4 font-semibold hover:border-brand"
        >
          <CartIcon className="size-5" />
          <span className="hidden sm:inline">Carrito</span>
          {summary.totalUnits > 0 && (
            <span className="rounded-full bg-brand-strong px-2 py-0.5 text-xs font-bold">
              {summary.totalUnits}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}
