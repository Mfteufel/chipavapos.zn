/**
 * Escala de precios por cantidad TOTAL de unidades (se pueden combinar sabores).
 * Se aplica el escalón más alto cuyo `min` sea <= cantidad.
 *
 * En producción vive en la tabla `price_tiers` y se edita desde el panel.
 * Esto es el valor por defecto para desarrollo sin base.
 */
export interface PriceTier {
  min: number
  precioUnitario: number
}

export const PRICE_TIERS: PriceTier[] = [
  { min: 1, precioUnitario: 27000 }, // TODO: confirmar
  { min: 3, precioUnitario: 25000 }, // TODO: confirmar
  { min: 5, precioUnitario: 24000 }, // TODO: confirmar
]
