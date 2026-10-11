/**
 * ============================================================
 *  CONFIGURACIÓN FIJA DEL NEGOCIO
 *  Esto se cambia editando el código y volviendo a publicar.
 *
 *  Lo que el dueño edita solo desde el panel (/admin) NO está acá:
 *  productos, stock, precios, escala por cantidad, horario y zonas
 *  viven en Supabase. Ver src/data/ para los valores por defecto.
 * ============================================================
 */

/** Nombre que se muestra en el header, footer y mensajes. */
export const BUSINESS_NAME = 'chipavapos.zn'

/** WhatsApp que recibe los pedidos. Formato internacional, solo números, sin "+". */
export const WHATSAPP_NUMBER = '5491100000000' // TODO: reemplazar

/** Link al perfil de Instagram. Si queda vacío, se oculta el botón. */
export const INSTAGRAM_URL = '' // TODO

/** Zona horaria usada para calcular si los envíos están abiertos. */
export const TIMEZONE = 'America/Argentina/Buenos_Aires'

/**
 * Puntos de retiro. Si está vacío, NO se muestra la opción de retiro.
 * Ejemplo: { nombre: 'Olivos', direccion: 'Av. Maipú 1234', horario: 'Lun a Vie 17 a 20 hs' }
 */
export interface PuntoRetiro {
  nombre: string
  direccion: string
  horario: string
}
export const PUNTOS_RETIRO: PuntoRetiro[] = [] // TODO: si está vacío, no mostrar opción de retiro

/** Métodos de pago aceptados. */
export const METODOS_PAGO = ['Efectivo', 'Transferencia'] as const
export type MetodoPago = (typeof METODOS_PAGO)[number]

/** Datos que se muestran cuando el cliente elige Transferencia. */
export const DATOS_TRANSFERENCIA = { alias: '', cbu: '', titular: '' } // TODO
