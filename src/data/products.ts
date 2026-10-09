/**
 * Catálogo. Para cambiar stock, precio o agregar sabores, editá este archivo.
 * Los componentes NO leen esto directo: pasan por src/services/productService.ts.
 */

export interface Product {
  id: string
  slug: string
  nombre: string
  emoji: string
  descripcion: string
  /** Unidades disponibles. 0 = sin stock. */
  stock: number
  /** Precio de lista (1 unidad). Los descuentos por cantidad están en pricing.ts */
  precio: number
  esPromo: boolean
  /** Ruta de la imagen. Si no existe el archivo, se muestra un placeholder. */
  imagen: string
  /** Color de acento (clave de Tailwind: frutilla | sandia | cereza). */
  acento: 'frutilla' | 'sandia' | 'cereza'
}

export const MODELO = 'ELFBAR KING 40K Puffs'

export const products: Product[] = [
  {
    id: 'elfbar-king-frutilla',
    slug: 'frutilla',
    nombre: 'Frutilla',
    emoji: '🍓',
    descripcion: 'Dulce y jugosa, con un toque fresco.',
    stock: 10, // TODO: confirmar
    precio: 27000, // TODO: confirmar
    esPromo: false,
    imagen: '/products/frutilla.svg',
    acento: 'frutilla',
  },
  {
    id: 'elfbar-king-sandia',
    slug: 'sandia',
    nombre: 'Sandía',
    emoji: '🍉',
    descripcion: 'Refrescante, ideal para el calor.',
    stock: 10, // TODO: confirmar
    precio: 27000, // TODO: confirmar
    esPromo: false,
    imagen: '/products/sandia.svg',
    acento: 'sandia',
  },
  {
    id: 'elfbar-king-cereza',
    slug: 'cereza',
    nombre: 'Cereza',
    emoji: '🍒',
    descripcion: 'Intensa y dulce, sabor profundo.',
    stock: 10, // TODO: confirmar
    precio: 27000, // TODO: confirmar
    esPromo: false,
    imagen: '/products/cereza.svg',
    acento: 'cereza',
  },
]
