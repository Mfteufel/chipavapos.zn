import { useState, type FormEvent } from 'react'
import { signIn } from '../../services/adminService'
import { buttonClass } from '../ui/buttonStyles'
import { adminInput, Errores } from './AdminUi'

/** Supabase devuelve los errores en inglés; los más comunes los traducimos. */
function mensajeDeError(e: unknown): string {
  const raw = e instanceof Error ? e.message : ''
  if (/invalid login credentials/i.test(raw)) return 'Usuario o contraseña incorrectos.'
  if (/email not confirmed/i.test(raw)) return 'Falta confirmar el mail de esta cuenta.'
  if (/rate limit|too many/i.test(raw)) return 'Demasiados intentos. Esperá un momento.'
  return raw || 'No se pudo entrar. Probá de nuevo.'
}

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setEnviando(true)
    setError(null)
    try {
      await signIn(email.trim(), password)
    } catch (err) {
      setError(mensajeDeError(err))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-24">
      <h1 className="font-display text-2xl font-bold">Panel</h1>
      <p className="mt-1 text-muted">Entrá para editar stock y precios.</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <label className="block space-y-1.5 text-sm font-semibold">
          <span className="block">Usuario</span>
          <input
            type="email"
            autoComplete="username"
            required
            className={adminInput}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="block space-y-1.5 text-sm font-semibold">
          <span className="block">Contraseña</span>
          <input
            type="password"
            autoComplete="current-password"
            required
            className={adminInput}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {error && <Errores items={[error]} />}

        <button type="submit" disabled={enviando} className={buttonClass('primary', 'w-full')}>
          {enviando ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
