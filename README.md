# chipavapos.zn — Tienda online

Frontend de la tienda de ELFBAR KING 40K Puffs (Zona Norte, GBA).
Vite + React + TypeScript + Tailwind + Zustand, con **Supabase** para los datos y el panel.
Los pedidos se confirman por WhatsApp.

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

Sin variables de entorno, `npm run dev` funciona igual con los datos de ejemplo de
`src/data/`. Un build de producción sin configurar, en cambio, muestra un error a propósito.

## Conectar Supabase

1. Crear un proyecto en [supabase.com](https://supabase.com).
2. SQL Editor → pegar y ejecutar `supabase/schema.sql` entero (crea tablas, permisos y
   datos iniciales; se puede volver a correr sin romper nada).
3. Authentication → Users → **Add user** con el mail y la contraseña del dueño, y
   **desactivar el registro público** para que nadie más pueda crearse una cuenta.
4. `cp .env.example .env.local` y completar las dos variables.
5. Entrar a `/admin` y cargar los datos reales.

La `anon key` es pública y viaja al navegador: no es un secreto. Lo que protege la base es
el RLS del schema. Nunca uses la `service_role` key acá.

## El panel (`/admin`)

El dueño entra con usuario y contraseña y edita:

- **Sabores**: stock, precio de lista y promo. Stock en 0 = sin stock.
- **Escala de precios**: escalones por cantidad y a partir de cuántas unidades se pasa a
  mayorista.
- **Envíos**: horario, zonas y nombre del modelo.

Los cambios se ven en la tienda apenas se guardan.

## Dónde cambiar cada cosa

| Qué                                                | Dónde                                   |
| -------------------------------------------------- | --------------------------------------- |
| Stock, precios, escala, promo, horario, zonas      | **El panel en `/admin`**                |
| Número de WhatsApp                                 | `src/config.ts` → `WHATSAPP_NUMBER`     |
| Instagram (si queda vacío se oculta el botón)      | `src/config.ts` → `INSTAGRAM_URL`       |
| Puntos de retiro (vacío = no hay opción de retiro) | `src/config.ts` → `PUNTOS_RETIRO`       |
| Alias / CBU / titular                              | `src/config.ts` → `DATOS_TRANSFERENCIA` |
| Preguntas frecuentes                               | `src/data/faq.ts`                       |
| Fotos de productos                                 | `public/products/<sabor>.svg`           |
| Valores por defecto para desarrollo sin base       | `src/data/`                             |

Lo que está en `src/config.ts` y `src/data/` se cambia editando el código y **volviendo a
publicar**. Lo del panel se cambia en caliente.

Los valores marcados con `// TODO` son de ejemplo y hay que confirmarlos.

Para agregar un sabor: insertarlo en la tabla `products` y, si querés un color propio,
agregarlo en `tailwind.config.ts`, `src/lib/accent.ts` y el CHECK de `acento` del schema.

## Estructura

- `src/lib/` — lógica pura y testeada (precios, horario, mensaje de WhatsApp, validación,
  mappers) y el cliente de Supabase.
- `src/services/` — `catalogService.ts` (lectura, lo usa la tienda) y `adminService.ts`
  (escritura y sesión, lo usa el panel). **Ningún componente lee `src/data/` directo.**
- `src/store/` — Zustand: carrito (persistido en localStorage), UI y catálogo.
- `src/components/`, `src/pages/`, `src/hooks/`, `src/data/`.
- `supabase/schema.sql` — tablas, RLS y datos iniciales.

## Publicar

Es una SPA: el host tiene que reescribir todas las rutas a `index.html`, o entrar directo a
`/carrito` o `/admin` da 404. Para Netlify y Cloudflare Pages ya está `public/_redirects`;
en Vercel hace falta un `vercel.json` con el rewrite equivalente.

Las variables `VITE_*` se compilan dentro del bundle: cargalas en el host antes de buildear.

## Reglas de negocio

- El precio unitario depende de la cantidad **total** del carrito (se pueden mezclar sabores).
- No se puede agregar más que el stock. Si el stock baja, los carritos ya guardados en el
  navegador del cliente se corrigen solos.
- A partir del mínimo mayorista se bloquea el checkout y se ofrece pedido por WhatsApp.
- Verificación de edad: la respuesta se guarda 30 días en localStorage.
- El stock no se descuenta solo al vender: lo actualiza el dueño desde el panel.
