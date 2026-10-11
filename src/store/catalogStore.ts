import { create } from 'zustand'
import type { PriceTier } from '../data/pricing'
import type { Product } from '../data/products'
import { defaultSettings, type Settings } from '../data/settings'
import { getCatalog } from '../services/catalogService'

interface CatalogState {
  status: 'idle' | 'loading' | 'ready' | 'error'
  products: Product[]
  tiers: PriceTier[]
  settings: Settings
  /** Carga una sola vez; las llamadas siguientes no hacen nada. */
  load: () => Promise<void>
  /** Vuelve a pedir todo. Lo usa el panel después de guardar. */
  reload: () => Promise<void>
}

export const useCatalogStore = create<CatalogState>((set, get) => {
  const fetchAll = async () => {
    set({ status: 'loading' })
    try {
      const { products, tiers, settings } = await getCatalog()
      set({ status: 'ready', products, tiers, settings })
    } catch (e) {
      console.error('No se pudo cargar el catálogo', e)
      set({ status: 'error' })
    }
  }

  return {
    status: 'idle',
    products: [],
    tiers: [],
    settings: defaultSettings,
    load: async () => {
      if (get().status === 'loading' || get().status === 'ready') return
      await fetchAll()
    },
    reload: fetchAll,
  }
})
