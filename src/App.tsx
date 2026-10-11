import { LazyMotion, domAnimation } from 'framer-motion'
import { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { AgeGate } from './components/age/AgeGate'
import { CartDrawer } from './components/cart/CartDrawer'
import { Footer } from './components/layout/Footer'
import { FloatingCartButton } from './components/layout/FloatingCartButton'
import { Header } from './components/layout/Header'
import { ToastHost } from './components/ui/Toast'
import HomePage from './pages/HomePage'

const ProductPage = lazy(() => import('./pages/ProductPage'))
const CartPage = lazy(() => import('./pages/CartPage'))
const FaqPage = lazy(() => import('./pages/FaqPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))
// El panel no entra en el bundle de la tienda: lo abre solo el dueño.
const AdminPage = lazy(() => import('./pages/AdminPage'))

const Cargando = () => <p className="px-4 pt-28 text-muted">Cargando…</p>

function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      // Esperamos al render de la ruta antes de buscar el ancla
      requestAnimationFrame(() => document.querySelector(hash)?.scrollIntoView())
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])
  return null
}

/** La tienda: verificación de edad, header, footer y carrito. El panel queda afuera. */
function StorefrontLayout() {
  return (
    <AgeGate>
      <Header />
      <main>
        <Suspense fallback={<Cargando />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <CartDrawer />
      <FloatingCartButton />
    </AgeGate>
  )
}

export default function App() {
  return (
    <LazyMotion features={domAnimation} strict>
      <BrowserRouter>
        <ScrollManager />
        <Routes>
          <Route
            path="/admin"
            element={
              <Suspense fallback={<Cargando />}>
                <AdminPage />
              </Suspense>
            }
          />
          <Route element={<StorefrontLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/producto/:slug" element={<ProductPage />} />
            <Route path="/carrito" element={<CartPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
        <ToastHost />
      </BrowserRouter>
    </LazyMotion>
  )
}
