import { z } from 'zod'
import { METODOS_PAGO } from '../config'

export const ENTREGAS = ['envio', 'retiro'] as const

/** Esquema del formulario. `hayRetiro` activa la opción de retiro. */
export function makeCheckoutSchema(zonas: readonly string[], hayRetiro: boolean) {
  return z
    .object({
      nombre: z.string().trim().min(2, 'Ingresá tu nombre'),
      entrega: z.enum(ENTREGAS),
      localidad: z.string(),
      direccion: z.string().trim(),
      puntoRetiro: z.string(),
      metodoPago: z.enum(METODOS_PAGO, { error: 'Elegí un método de pago' }),
      efectivoCon: z
        .string()
        .trim()
        .regex(/^\d*$/, 'Ingresá solo números')
        .max(9, 'Monto demasiado grande'),
      observaciones: z.string().trim().max(300, 'Máximo 300 caracteres'),
    })
    .superRefine((v, ctx) => {
      if (v.entrega === 'retiro') {
        if (!hayRetiro || !v.puntoRetiro) {
          ctx.addIssue({
            code: 'custom',
            path: ['puntoRetiro'],
            message: 'Elegí un punto de retiro',
          })
        }
        return
      }
      if (!zonas.includes(v.localidad)) {
        ctx.addIssue({ code: 'custom', path: ['localidad'], message: 'Elegí tu localidad' })
      }
      if (v.direccion.length < 4) {
        ctx.addIssue({ code: 'custom', path: ['direccion'], message: 'Ingresá tu dirección' })
      }
    })
}

export type CheckoutValues = z.infer<ReturnType<typeof makeCheckoutSchema>>
