import { Link } from 'react-router-dom'
import { buttonClass } from '../components/ui/buttonStyles'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 pt-16 text-center">
      <h1 className="font-display text-4xl font-bold">No encontramos esa página</h1>
      <Link to="/" className={buttonClass('primary')}>
        Volver al inicio
      </Link>
    </div>
  )
}
