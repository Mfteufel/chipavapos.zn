import { LazyMotion, domAnimation } from 'framer-motion'
import { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
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

export default function App() {
  return (
    <LazyMotion features={domAnimation} strict>
      <AgeGate>
        <BrowserRouter>
          <ScrollManager />
          <Header />
          <main>
            <Suspense fallback={<p className="px-4 pt-28 text-muted">Cargando…</p>}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/producto/:slug" element={<ProductPage />} />
                <Route path="/carrito" element={<CartPage />} />
                <Route path="/faq" element={<FaqPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <CartDrawer />
          <FloatingCartButton />
          <ToastHost />
        </BrowserRouter>
      </AgeGate>
    </LazyMotion>
  )
}
