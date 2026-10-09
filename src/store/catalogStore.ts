import { create } from 'zustand'
import type { PriceTier } from '../data/pricing'
import type { Product } from '../data/products'
import { getModelName, getPricing, getProducts } from '../services/productService'

interface CatalogState {
  status: 'idle' | 'loading' | 'ready' | 'error'
  products: Product[]
  tiers: PriceTier[]
  mayoristaDesde: number
  modelo: string
  load: () => Promise<void>
}

export const useCatalogStore = create<CatalogState>((set, get) => ({
  status: 'idle',
  products: [],
  tiers: [],
  mayoristaDesde: Infinity,
  modelo: '',
  load: async () => {
    if (get().status === 'loading' || get().status === 'ready') return
    set({ status: 'loading' })
    try {
      const [products, pricing, modelo] = await Promise.all([
        getProducts(),
        getPricing(),
        getModelName(),
      ])
      set({
        status: 'ready',
        products,
        tiers: pricing.tiers,
        mayoristaDesde: pricing.mayoristaDesde,
        modelo,
      })
    } catch {
      set({ status: 'error' })
    }
  },
}))
