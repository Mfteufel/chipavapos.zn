import { Link } from 'react-router-dom'
import { BUSINESS_NAME, INSTAGRAM_URL, WHATSAPP_NUMBER } from '../../config'
import { buildWhatsAppUrl } from '../../lib/whatsapp'

const col = 'space-y-2 text-sm text-muted'
const link = 'hover:text-white'

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface px-4 pb-28 pt-12 md:pb-10">
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-3">
        <div>
          <p className="font-display text-xl font-bold">{BUSINESS_NAME}</p>
          <p className="mt-2 max-w-xs text-sm text-muted">
            ELFBAR KING 40K Puffs con envío en Zona Norte, Gran Buenos Aires.
          </p>
        </div>
        <nav aria-label="Secciones">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-white">Tienda</p>
          <ul className={col}>
            <li>
              <Link className={link} to="/#catalogo">
                Sabores
              </Link>
            </li>
            <li>
              <Link className={link} to="/#precios">
                Precios
              </Link>
            </li>
            <li>
              <Link className={link} to="/#envios">
                Envíos
              </Link>
            </li>
            <li>
              <Link className={link} to="/faq">
                Preguntas frecuentes
              </Link>
            </li>
          </ul>
        </nav>
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-white">Contacto</p>
          <ul className={col}>
            <li>
              <a
                className={link}
                href={buildWhatsAppUrl(WHATSAPP_NUMBER, 'Hola!')}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            </li>
            {INSTAGRAM_URL && (
              <li>
                <a className={link} href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-6xl border-t border-line pt-6 text-center text-sm text-muted">
        <p className="font-semibold text-white">Venta exclusiva para mayores de 18 años</p>
        <p className="mt-1">El consumo de nicotina genera dependencia.</p>
        <p className="mt-3">
          © {new Date().getFullYear()} {BUSINESS_NAME}
        </p>
      </div>
    </footer>
  )
}
