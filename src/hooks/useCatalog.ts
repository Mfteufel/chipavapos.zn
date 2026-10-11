import { useEffect } from 'react'
import { useCatalogStore } from '../store/catalogStore'

/** Carga el catálogo una sola vez y lo comparte entre componentes. */
export function useCatalog() {
  const state = useCatalogStore()
  const load = useCatalogStore((s) => s.load)
  useEffect(() => {
    void load()
  }, [load])

  return {
    ...state,
    ready: state.status === 'ready',
    // Atajos a los settings más usados.
    modelo: state.settings.modelo,
    mayoristaDesde: state.settings.mayoristaDesde,
  }
}
