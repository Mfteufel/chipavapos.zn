# CLAUDE.md — chipavapos.zn

Contexto permanente del proyecto. Leer esto primero en cada sesión nueva.

---

## 1. Qué es esto

Tienda online de vapes (**ELFBAR KING 40K Puffs**) para Zona Norte del GBA.
Cliente: **Simon Galimberti**. Desarrollador: **Marco Federico Teufel**.

El modelo de negocio es simple: el catálogo se muestra en la web, el cliente arma el
carrito, y **el pedido se cierra por WhatsApp**. No hay cobro online, no hay base de
pedidos, no hay cuentas de usuario del lado del comprador.

El trabajo contratado está definido en el presupuesto
`../Presupuesto-panel-simple-Simon-Galimberti.pdf` (Opción 1, 9/10/2026, validez 15 días):
**tienda web (USD 550) + panel simple de stock y precios (USD 250) = USD 800.**

---

## 2. Stack y comandos

Vite, React 19, TypeScript, Tailwind 3, Zustand 5, React Router 7, React Hook Form, Zod y
Framer Motion. Backend: **Supabase** (Postgres + Auth). Tests con Vitest.

```bash
npm run dev      # http://localhost:5173
npm run build    # tsc && vite build -> dist/
npm run preview  # probar el build
npm test         # Vitest (52 tests, en verde)
npm run lint     # ESLint (limpio)
npm run format   # Prettier
```

Antes de dar algo por terminado: `npm test && npm run lint && npm run build`.

**Sin variables de entorno de Supabase, `npm run dev` igual funciona**: usa los datos de
ejemplo de `src/data/`. En un build de producción, en cambio, falta de config = error
visible. Es a propósito: mostrar precios y stock de ejemplo como si fueran reales es peor
que mostrar un error.

---

## 3. Estado actual

### Hecho

- **Tienda completa.** Páginas: Home (`/`), producto (`/producto/:slug`), carrito
  (`/carrito`), FAQ (`/faq`), 404. Todo lazy salvo Home. Carrito persistido en
  localStorage, drawer, progreso de escalón, checkout validado con Zod que abre `wa.me`
  con el pedido armado, verificación de edad (30 días en localStorage), horario de envíos
  en vivo.
- **Panel `/admin`.** Login con usuario y contraseña (Supabase Auth), y tres secciones:
  sabores (stock, precio, promo), escala de precios (escalones + mínimo mayorista), envíos
  (horario, zonas, modelo). Guardado por sección, con validación y aviso de cambios sin
  guardar.
- **Backend en Supabase.** Schema, RLS y datos iniciales en
  [`supabase/schema.sql`](supabase/schema.sql).
- **Tests** de lógica pura: precios, horario, mensaje de WhatsApp, mappers de la base y
  validaciones del panel.

### Falta

1. **Crear el proyecto de Supabase y cargarlo** — ver sección 6. Es el próximo paso y lo
   tiene que hacer una persona (crear cuentas y usuarios no se automatiza desde acá).
2. **Datos reales del cliente**: todo lo marcado `// TODO` sigue siendo de ejemplo
   (WhatsApp, Instagram, alias/CBU, puntos de retiro, y los precios/stock/zonas iniciales).
3. **Fotos reales** de los productos (hoy hay SVG placeholder en `public/products/`).
4. **Publicación**: dominio + hosting a nombre del cliente.
5. **Guía corta de uso** (PDF o video de 5 min) y capacitación.
6. **15 días de soporte** post-entrega.

---

## 4. Arquitectura

```
src/
  config.ts           # config FIJA (se cambia editando código y republicando)
  data/               # tipos + valores por defecto de lo que vive en la base
  services/
    catalogService.ts # lectura: ÚNICO punto de acceso a datos de la tienda
    adminService.ts   # escritura y sesión: solo lo usa el panel
  lib/                # lógica pura y testeada + cliente de Supabase
  store/              # cartStore (persistido), catalogStore, uiStore
  hooks/              # useCatalog, useCartSummary, useAgeGate, useShippingStatus, useSession
  components/         # home/ cart/ checkout/ product/ layout/ ui/ age/ admin/
  pages/              # HomePage, ProductPage, CartPage, FaqPage, NotFoundPage, AdminPage
supabase/schema.sql   # tablas, RLS, función RPC y datos iniciales
```

**La regla más importante del proyecto**: ningún componente importa de `src/data/`
directamente (salvo los tipos). Toda lectura pasa por `catalogService.getCatalog()` y toda
escritura por `adminService`. Esa costura es lo que permitió meter el panel sin reescribir
la tienda — no romperla.

**Qué va dónde:**

- `src/config.ts` → lo que NO se edita desde el panel: nombre del negocio, WhatsApp,
  Instagram, zona horaria, puntos de retiro, métodos de pago, datos de transferencia.
- `src/data/` → **tipos** de lo que vive en la base + los valores por defecto que usa el
  modo desarrollo. Cambiar estos archivos no cambia la tienda publicada.
- Supabase → productos, escala de precios y settings (modelo, mínimo mayorista, horario,
  zonas). Esto es lo que el dueño edita.

`catalogStore.load()` es idempotente; `reload()` fuerza la recarga y es lo que llama el
panel después de guardar.

**Nota de bundle**: `@supabase/supabase-js` entra en el bundle principal porque la tienda
necesita leer el catálogo al entrar (~376 kB sin comprimir / ~122 kB gzip en total). Si
alguna vez molesta, se puede usar `@supabase/postgrest-js` en la tienda y dejar
`supabase-js` completo solo en el panel. Hoy no vale la complejidad.

---

## 5. Reglas de negocio

- El **precio unitario depende de la cantidad TOTAL del carrito**, mezclando sabores. Se
  aplica el escalón más alto cuyo `min` sea ≤ cantidad.
- Nunca se puede agregar más que el `stock` del producto (`clampQuantity`).
- Si el stock baja desde el panel, `useCartSummary` **corrige solo** los carritos ya
  guardados en el navegador de los clientes.
- Desde `mayoristaDesde` unidades **se bloquea el checkout online** y se ofrece consulta
  mayorista por WhatsApp.
- Métodos de pago: Efectivo y Transferencia. Con transferencia se muestran alias/CBU/titular.
- Retiro: si `PUNTOS_RETIRO` está vacío, la opción de retiro **no se muestra**.
- El stock **no se descuenta solo al vender**: lo actualiza el dueño desde el panel. Está
  así por contrato, no es un olvido.
- La escala de precios no puede subir al aumentar la cantidad: el panel lo rechaza
  (`validateTiers`).

---

## 6. Supabase

**Decisión tomada (10/10/2026):** backend en Supabase. Free tier alcanza de sobra para
este volumen, da Postgres + auth con usuario y contraseña, y no requiere servidor propio
ni mantenimiento del desarrollador.

### Puesta en marcha (una sola vez, la hace una persona)

1. Crear un proyecto en [supabase.com](https://supabase.com) (región: South America).
2. SQL Editor → pegar y ejecutar [`supabase/schema.sql`](supabase/schema.sql) entero.
3. Authentication → Users → **Add user** con el mail y la contraseña del cliente
   (marcar el mail como confirmado). Este es el único usuario del panel.
4. Authentication → Providers/Sign Ups → **desactivar el registro público**. Si queda
   abierto, cualquiera se crea una cuenta y el RLS lo deja escribir.
5. Copiar `.env.example` a `.env.local` y completar `VITE_SUPABASE_URL` y
   `VITE_SUPABASE_ANON_KEY` (Project Settings → Data API / API Keys).
6. Cargar los datos reales desde `/admin`.

La **anon key es pública** y viaja al navegador: no es un secreto. Lo que protege la base
es el RLS. **Nunca** poner la `service_role` key en el frontend.

### Modelo de datos

| Tabla         | Qué guarda                                                      |
| ------------- | --------------------------------------------------------------- |
| `products`    | un sabor por fila: stock, precio, promo, imagen, acento, orden  |
| `price_tiers` | escalones: `min` (unidades) → `precio_unitario`                 |
| `settings`    | fila única (`id = 1`): modelo, mínimo mayorista, horario, zonas |

RLS en las tres: **lectura pública, escritura solo con sesión**. El panel edita la escala
entera (agrega y borra escalones) y supabase-js no tiene transacciones, así que eso pasa
por la función `replace_price_tiers(jsonb)`, que corre en una sola transacción y respeta
el RLS (`security invoker`).

### Alcance del panel (está firmado así, no agregar de más por iniciativa propia)

Incluye: login, stock por sabor, precios y escala por cantidad, marcar sin stock o en
promo, horario y zonas de envío.

**Explícitamente fuera de alcance:**

- No guarda pedidos ni datos de compradores — el pedido vive en el WhatsApp del cliente.
- No cobra online ni integra medios de pago.
- No descuenta stock automáticamente al vender.
- No incluye historial ni reportes de ventas.

---

## 7. Publicación

La app es una SPA con rutas del lado del cliente: el host tiene que reescribir todo a
`index.html` o entrar directo a `/carrito` o `/admin` da 404.

- Netlify / Cloudflare Pages: ya está `public/_redirects`.
- Vercel: agregar `vercel.json` con un rewrite de `/(.*)` a `/index.html`.
- Apache/nginx: la regla equivalente.

Las variables `VITE_*` se compilan dentro del bundle: hay que cargarlas en el host **antes**
de buildear, y rebuildear si cambian.

`public/robots.txt` desindexa `/admin`.

---

## 8. Convenciones

- **Todo el código, comentarios, nombres de variables de dominio y UI en español.** Mantenerlo.
- Los comentarios explican el _porqué_, no el _qué_. Densidad baja. Seguir ese tono.
- Tailwind con colores de acento por sabor (`frutilla`, `sandia`, `cereza`) definidos en
  `tailwind.config.ts` y mapeados en `src/lib/accent.ts`. Un sabor nuevo necesita entrada
  en ambos, y el valor tiene que existir en el CHECK de `acento` en el schema.
- La lógica que se pueda testear sin React va a `src/lib/` **con su test**. Los archivos de
  `src/lib/` que se testean no deben importar el cliente de Supabase (el entorno de test es
  `node`, sin variables de entorno).
- En el panel, los campos numéricos se editan como texto y se parsean recién al guardar: es
  lo que evita que se borre el campo mientras se tipea.
- ESLint prohíbe escribir refs durante el render (`react-hooks/refs`). Para sincronizar
  estado con props se usa el patrón de ajuste en render, no un `useRef` + `useEffect`.
- Prettier con `prettier-plugin-tailwindcss` ordena las clases: no pelear con el orden a mano.
- Los valores de ejemplo se marcan con `// TODO: confirmar`. No borrar esas marcas hasta
  tener el dato real del cliente.

---

## 9. Condiciones comerciales (contexto, no código)

- Pago 50% al comenzar, 50% al entregar. **No se publica la tienda hasta cobrar el saldo.**
- Plazo: 1 a 2 semanas desde que el cliente entrega los datos y paga el anticipo.
- Los cambios fuera del alcance se cotizan aparte.
- Hosting y dominio van a nombre del cliente y los paga el cliente.
- La legalidad de los productos comercializados es responsabilidad del cliente; el
  desarrollador entrega software y no participa de la operación comercial.
- Mantenimiento opcional: USD 25/mes.
