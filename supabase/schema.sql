-- ============================================================
--  chipavapos.zn — Schema
--  Pegar y ejecutar en Supabase > SQL Editor.
--  Es idempotente: se puede volver a correr sin romper nada.
-- ============================================================

-- ------------------------------------------------------------
--  Tablas
-- ------------------------------------------------------------

create table if not exists public.products (
  id          text primary key,
  slug        text not null unique,
  nombre      text not null,
  emoji       text not null default '',
  descripcion text not null default '',
  -- 0 = sin stock. El dueño lo actualiza a mano desde el panel.
  stock       integer not null default 0 check (stock >= 0),
  -- Precio de lista en pesos, sin centavos. Los descuentos van en price_tiers.
  precio      integer not null check (precio >= 0),
  es_promo    boolean not null default false,
  imagen      text not null default '',
  acento      text not null check (acento in ('frutilla', 'sandia', 'cereza')),
  -- Orden en que se muestran en el catálogo.
  orden       integer not null default 0
);

-- Escala de precios por cantidad TOTAL del carrito (se mezclan sabores).
create table if not exists public.price_tiers (
  min             integer primary key check (min >= 1),
  precio_unitario integer not null check (precio_unitario >= 0)
);

-- Fila única (id = 1) con la configuración editable del negocio.
create table if not exists public.settings (
  id              smallint primary key default 1 check (id = 1),
  modelo          text not null,
  mayorista_desde integer not null check (mayorista_desde >= 1),
  horario_desde   text not null check (horario_desde ~ '^[0-2][0-9]:[0-5][0-9]$'),
  horario_hasta   text not null check (horario_hasta ~ '^[0-2][0-9]:[0-5][0-9]$'),
  zonas           text[] not null default '{}'
);

-- ------------------------------------------------------------
--  RLS: cualquiera lee, solo un usuario logueado escribe.
--  Sin esto la anon key dejaría editar precios a cualquiera.
-- ------------------------------------------------------------

alter table public.products    enable row level security;
alter table public.price_tiers enable row level security;
alter table public.settings    enable row level security;

-- Permisos de tabla explícitos. Supabase ya los da por defecto, pero dejarlos
-- escritos evita sorpresas si el proyecto se recrea con otra configuración.
grant select on public.products, public.price_tiers, public.settings to anon, authenticated;
grant insert, update, delete
  on public.products, public.price_tiers, public.settings to authenticated;

do $$
declare
  t text;
begin
  foreach t in array array['products', 'price_tiers', 'settings'] loop
    execute format('drop policy if exists "lectura publica" on public.%I', t);
    execute format('drop policy if exists "escritura admin" on public.%I', t);

    execute format(
      'create policy "lectura publica" on public.%I for select to anon, authenticated using (true)', t);

    -- for all + with check cubre insert, update y delete.
    execute format(
      'create policy "escritura admin" on public.%I for all to authenticated using (true) with check (true)', t);
  end loop;
end $$;

-- ------------------------------------------------------------
--  Reemplazo atómico de la escala de precios.
--  Desde el panel se edita la tabla entera (se agregan y borran escalones),
--  y supabase-js no tiene transacciones: un borrado sin su insert dejaría
--  precios mal. El cuerpo de la función corre en una sola transacción.
--  security invoker = sigue aplicando el RLS, así que solo un admin puede.
-- ------------------------------------------------------------

create or replace function public.replace_price_tiers(tiers jsonb)
returns void
language plpgsql
security invoker
as $$
begin
  if jsonb_array_length(tiers) < 1 then
    raise exception 'Tiene que haber al menos un escalón de precio';
  end if;

  delete from public.price_tiers;

  insert into public.price_tiers (min, precio_unitario)
  select (t ->> 'min')::integer, (t ->> 'precio_unitario')::integer
  from jsonb_array_elements(tiers) as t;
end $$;

-- El RLS ya frenaría a un anónimo, pero mejor que no pueda ni invocarla.
revoke execute on function public.replace_price_tiers(jsonb) from public, anon;
grant execute on function public.replace_price_tiers(jsonb) to authenticated;

-- ------------------------------------------------------------
--  Datos iniciales (los valores de ejemplo de src/data).
--  OJO: reemplazar por los datos reales del cliente antes de publicar.
--  on conflict do nothing = no pisa lo que ya cargaste desde el panel.
-- ------------------------------------------------------------

insert into public.products (id, slug, nombre, emoji, descripcion, stock, precio, es_promo, imagen, acento, orden)
values
  ('elfbar-king-frutilla', 'frutilla', 'Frutilla', '🍓', 'Dulce y jugosa, con un toque fresco.', 10, 27000, false, '/products/frutilla.svg', 'frutilla', 1),
  ('elfbar-king-sandia',   'sandia',   'Sandía',   '🍉', 'Refrescante, ideal para el calor.',   10, 27000, false, '/products/sandia.svg',   'sandia',   2),
  ('elfbar-king-cereza',   'cereza',   'Cereza',   '🍒', 'Intensa y dulce, sabor profundo.',    10, 27000, false, '/products/cereza.svg',   'cereza',   3)
on conflict (id) do nothing;

insert into public.price_tiers (min, precio_unitario)
values (1, 27000), (3, 25000), (5, 24000)
on conflict (min) do nothing;

insert into public.settings (id, modelo, mayorista_desde, horario_desde, horario_hasta, zonas)
values (
  1,
  'ELFBAR KING 40K Puffs',
  50,
  '15:00',
  '22:00',
  array['Vicente López', 'San Isidro', 'Tigre', 'San Fernando', 'Pilar']
)
on conflict (id) do nothing;
