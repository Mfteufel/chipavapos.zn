import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { clampQuantity, type CartLine } from '../lib/pricing'

interface CartState {
  lines: CartLine[]
  /** Agrega unidades respetando el stock. Devuelve cuántas se agregaron realmente. */
  add: (productId: string, quantity: number, stock: number) => number
  setQuantity: (productId: string, quantity: number, stock: number) => void
  remove: (productId: string) => void
  clear: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      add: (productId, quantity, stock) => {
        const current = get().lines.find((l) => l.productId === productId)?.quantity ?? 0
        const toAdd = clampQuantity(quantity, stock, current)
        if (toAdd === 0) return 0
        set((s) => ({
          lines: current
            ? s.lines.map((l) =>
                l.productId === productId ? { ...l, quantity: l.quantity + toAdd } : l,
              )
            : [...s.lines, { productId, quantity: toAdd }],
        }))
        return toAdd
      },
      setQuantity: (productId, quantity, stock) => {
        const q = clampQuantity(quantity, stock)
        set((s) => ({
          lines:
            q === 0
              ? s.lines.filter((l) => l.productId !== productId)
              : s.lines.map((l) => (l.productId === productId ? { ...l, quantity: q } : l)),
        }))
      },
      remove: (productId) =>
        set((s) => ({ lines: s.lines.filter((l) => l.productId !== productId) })),
      clear: () => set({ lines: [] }),
    }),
    { name: 'chipavapos-cart', version: 1 },
  ),
)
