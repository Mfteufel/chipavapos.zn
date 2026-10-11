import { Link } from 'react-router-dom'
import { LoginForm } from '../components/admin/LoginForm'
import { ProductsPanel } from '../components/admin/ProductsPanel'
import { ShippingPanel } from '../components/admin/ShippingPanel'
import { TiersPanel } from '../components/admin/TiersPanel'
import { buttonClass } from '../components/ui/buttonStyles'
import { useCatalog } from '../hooks/useCatalog'
import { useSession } from '../hooks/useSession'
import { isSupabaseConfigured } from '../lib/supabase'
import { signOut } from '../services/adminService'
import { useCatalogStore } from '../store/catalogStore'

function Aviso({ titulo, children }: { titulo: string; children?: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="font-display text-2xl font-bold">{titulo}</h1>
      <div className="mt-2 text-muted">{children}</div>
    </div>
  )
}

export default function AdminPage() {
  const { session, loading } = useSession()
  const { products, tiers, settings, status } = useCatalog()
  const reload = useCatalogStore((s) => s.reload)

  if (!isSupabaseConfigured) {
    return (
      <Aviso titulo="Falta configurar Supabase">
        <p>
          Este build no tiene <code>VITE_SUPABASE_URL</code> ni <code>VITE_SUPABASE_ANON_KEY</code>.
          Ver <code>.env.example</code>.
        </p>
      </Aviso>
    )
  }

  if (loading) return <Aviso titulo="Cargando…" />
  if (!session) return <LoginForm />

  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 pt-10">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Panel</h1>
          <p className="text-sm text-muted">{session.user.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/" className={buttonClass('ghost')}>
            Ver la tienda
          </Link>
          <button type="button" onClick={() => void signOut()} className={buttonClass('secondary')}>
            Salir
          </button>
        </div>
      </header>

      {status === 'error' ? (
        <div className="mt-8">
          <Aviso titulo="No se pudieron cargar los datos">
            <button
              type="button"
              onClick={() => void reload()}
              className={buttonClass('primary', 'mt-4')}
            >
              Reintentar
            </button>
          </Aviso>
        </div>
      ) : status !== 'ready' ? (
        <p className="mt-8 text-muted" aria-busy>
          Cargando datos…
        </p>
      ) : (
        <div className="mt-8 space-y-5">
          <ProductsPanel products={products} onSaved={reload} />
          <TiersPanel tiers={tiers} settings={settings} onSaved={reload} />
          <ShippingPanel settings={settings} onSaved={reload} />
        </div>
      )}

      <p className="mt-10 text-center text-sm text-muted">
        Los cambios se ven en la tienda apenas guardás.
      </p>
    </div>
  )
}
