/**
 * ============================================================
 *  CONFIGURACIÓN DEL NEGOCIO
 *  Todo lo que el dueño va a querer cambiar está en este archivo.
 *  Productos, stock y precios: ver src/data/products.ts y src/data/pricing.ts
 * ============================================================
 */

/** Nombre que se muestra en el header, footer y mensajes. */
export const BUSINESS_NAME = 'chipavapos.zn'

/** WhatsApp que recibe los pedidos. Formato internacional, solo números, sin "+". */
export const WHATSAPP_NUMBER = '5491100000000' // TODO: reemplazar

/** Link al perfil de Instagram. Si queda vacío, se oculta el botón. */
export const INSTAGRAM_URL = '' // TODO

/** Localidades a las que se envía. Aparecen en el formulario y en la sección de zonas. */
export const ZONAS_ENVIO = ['Vicente López', 'San Isidro', 'Tigre', 'San Fernando', 'Pilar'] // TODO: confirmar

/** Horario de envíos (hora de Argentina, formato 24 hs "HH:MM"). */
export const HORARIO_ENVIOS = { desde: '15:00', hasta: '22:00' } // TODO: confirmar

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
