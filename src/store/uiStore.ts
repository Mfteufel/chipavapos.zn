import { create } from 'zustand'

export interface Toast {
  id: number
  message: string
}

interface UiState {
  cartOpen: boolean
  toasts: Toast[]
  openCart: () => void
  closeCart: () => void
  toast: (message: string) => void
}

let nextId = 1

export const useUiStore = create<UiState>((set) => ({
  cartOpen: false,
  toasts: [],
  openCart: () => set({ cartOpen: true }),
  closeCart: () => set({ cartOpen: false }),
  toast: (message) => {
    const id = nextId++
    set((s) => ({ toasts: [...s.toasts.slice(-2), { id, message }] }))
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 2600)
  },
}))
