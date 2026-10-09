# chipavapos.zn — Tienda online

Frontend de la tienda de ELFBAR KING 40K Puffs (Zona Norte, GBA). Vite + React + TypeScript + Tailwind + Zustand.
Los pedidos se confirman por WhatsApp. **No hay backend**: todo vive en archivos locales.

## Cómo correrlo

```bash
npm install
npm run dev        # desarrollo en http://localhost:5173
npm run build      # build de producción en dist/
npm run preview    # probar el build
npm test           # tests (Vitest)
npm run lint       # ESLint
npm run format     # Prettier
```

## Dónde cambiar cada cosa

| Qué                                                | Dónde                                                         |
| -------------------------------------------------- | ------------------------------------------------------------- |
| Número de WhatsApp                                 | `src/config.ts` → `WHATSAPP_NUMBER` (formato `5491155551234`) |
| Instagram (si queda vacío se oculta el botón)      | `src/config.ts` → `INSTAGRAM_URL`                             |
| Zonas de envío                                     | `src/config.ts` → `ZONAS_ENVIO`                               |
| Horario de envíos                                  | `src/config.ts` → `HORARIO_ENVIOS`                            |
| Puntos de retiro (vacío = no hay opción de retiro) | `src/config.ts` → `PUNTOS_RETIRO`                             |
| Alias / CBU / titular                              | `src/config.ts` → `DATOS_TRANSFERENCIA`                       |
| Stock, precio de lista, sabores, promo             | `src/data/products.ts`                                        |
| Escala de precios por cantidad y tope mayorista    | `src/data/pricing.ts` → `PRICE_TIERS`, `MAYORISTA_DESDE`      |
| Preguntas frecuentes                               | `src/data/faq.ts`                                             |
| Fotos de productos                                 | `public/products/<sabor>.svg` (o cambiá `imagen` en products) |

Los valores marcados con `// TODO` son de ejemplo y hay que confirmarlos.

Para agregar un sabor: sumá un objeto en `src/data/products.ts` y, si querés un color propio, agregalo en `tailwind.config.ts` y `src/lib/accent.ts`.

## Estructura

- `src/lib/` — lógica pura y testeada (precios, horario, mensaje de WhatsApp, validación).
- `src/services/productService.ts` — acceso a datos. **Para conectar una API, reemplazá el cuerpo de estas funciones por `fetch`**; el resto de la app no cambia.
- `src/store/` — Zustand: carrito (persistido en localStorage), UI y catálogo.
- `src/components/`, `src/pages/`, `src/hooks/`, `src/data/`.

## Reglas de negocio

- El precio unitario depende de la cantidad **total** del carrito (se pueden mezclar sabores).
- No se puede agregar más que el stock.
- Desde `MAYORISTA_DESDE` unidades se bloquea el checkout y se ofrece pedido mayorista por WhatsApp.
- Verificación de edad: la respuesta se guarda 30 días en localStorage.
