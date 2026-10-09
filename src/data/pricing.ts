/**
 * Escala de precios por cantidad TOTAL de unidades (se pueden combinar sabores).
 * Se aplica el escalón más alto cuyo `min` sea <= cantidad. Mantené el array ordenado por `min`.
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

/** A partir de esta cantidad no se vende online: se consulta por WhatsApp. */
export const MAYORISTA_DESDE = 50 // TODO: confirmar
