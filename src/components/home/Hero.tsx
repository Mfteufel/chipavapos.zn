import { m } from 'framer-motion'
import { useCatalog } from '../../hooks/useCatalog'
import { useShippingStatus } from '../../hooks/useShippingStatus'
import { formatPrice } from '../../lib/format'
import { buttonClass } from '../ui/buttonStyles'
import { ShieldIcon, TruckIcon } from '../ui/Icons'

const ART = [
  {
    src: '/products/frutilla.svg',
    alt: 'ELFBAR KING 40K sabor frutilla',
    cls: '-rotate-12 -translate-x-4 translate-y-6 z-10',
    x: -40,
  },
  { src: '/products/sandia.svg', alt: 'ELFBAR KING 40K sabor sandía', cls: 'z-20 scale-110', x: 0 },
  {
    src: '/products/cereza.svg',
    alt: 'ELFBAR KING 40K sabor cereza',
    cls: 'rotate-12 translate-x-4 translate-y-6 z-10',
    x: 40,
  },
]

export function Hero() {
  const { tiers } = useCatalog()
  const { open, label, ready: horarioListo } = useShippingStatus()
  const best = tiers.length ? Math.min(...tiers.map((t) => t.precioUnitario)) : null
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-28 sm:pt-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(124,58,237,0.30),transparent_55%),radial-gradient(ellipse_at_85%_60%,rgba(225,29,72,0.18),transparent_50%)]"
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
        <m.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p
            role="status"
            className={`inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-4 py-1.5 text-sm font-medium transition-opacity ${
              horarioListo ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <span
              aria-hidden
              className={`size-2.5 rounded-full ${open ? 'animate-pulse bg-green-400' : 'bg-amber-400'}`}
            />
            {horarioListo ? label : '…'}
          </p>
          <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            ELFBAR KING
            <span className="block bg-gradient-to-r from-violet-300 via-brand to-rose-300 bg-clip-text text-transparent">
              40K Puffs
            </span>
          </h1>
          <p className="mt-5 max-w-md text-lg text-muted">
            Tres sabores, hasta 40.000 caladas y envío a domicilio en Zona Norte.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <a href="#catalogo" className={buttonClass('primary', 'px-8 text-lg')}>
              Elegí tu sabor
            </a>
            {best && (
              <p className="text-muted">
                Desde{' '}
                <strong className="font-display text-2xl text-white">{formatPrice(best)}</strong>{' '}
                c/u
              </p>
            )}
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
            <li className="flex items-center gap-2">
              <TruckIcon className="size-5 text-brand" /> Envíos en Zona Norte
            </li>
            <li className="flex items-center gap-2">
              <ShieldIcon className="size-5 text-brand" /> Solo mayores de 18
            </li>
          </ul>
        </m.div>

        <div
          aria-hidden={false}
          className="relative mx-auto flex w-full max-w-sm items-end justify-center md:max-w-none"
        >
          {ART.map((a, i) => (
            <m.img
              key={a.src}
              src={a.src}
              alt={a.alt}
              width={400}
              height={480}
              fetchPriority={i === 1 ? 'high' : undefined}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.1 }}
              className={`w-[38%] drop-shadow-2xl ${a.cls} ${i > 0 ? '-ml-[8%]' : ''}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
