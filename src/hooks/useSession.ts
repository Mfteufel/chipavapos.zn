import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { isSupabaseConfigured } from '../lib/supabase'
import { getSession, onAuthChange } from '../services/adminService'

/** Sesión del admin. `loading` evita mostrar el login un instante antes de restaurarla. */
export function useSession() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    if (!isSupabaseConfigured) return

    let activo = true
    void getSession()
      .then((s) => activo && setSession(s))
      .catch((e) => console.error('No se pudo leer la sesión', e))
      .finally(() => activo && setLoading(false))

    const desuscribir = onAuthChange((s) => activo && setSession(s))
    return () => {
      activo = false
      desuscribir()
    }
  }, [])

  return { session, loading }
}
