/**
 * Configuración editable desde el panel (vive en la tabla `settings` de Supabase).
 * Lo de acá es solo el valor por defecto que se usa en desarrollo sin base.
 * Lo que NO se edita desde el panel está en src/config.ts.
 */

export interface Settings {
  /** Nombre del modelo que se muestra en títulos y en el mensaje de WhatsApp. */
  modelo: string
  /** A partir de esta cantidad no se vende online: se consulta por WhatsApp. */
  mayoristaDesde: number
  /** Horario de envíos (hora de Argentina, formato 24 hs "HH:MM"). */
  horario: { desde: string; hasta: string }
  /** Localidades a las que se envía. Aparecen en el formulario y en la home. */
  zonas: string[]
}

export const defaultSettings: Settings = {
  modelo: 'ELFBAR KING 40K Puffs',
  mayoristaDesde: 50, // TODO: confirmar
  horario: { desde: '15:00', hasta: '22:00' }, // TODO: confirmar
  zonas: ['Vicente López', 'San Isidro', 'Tigre', 'San Fernando', 'Pilar'], // TODO: confirmar
}
