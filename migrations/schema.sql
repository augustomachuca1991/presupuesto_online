-- ============================================================================
-- schema.sql  —  Taller Chapa & Pintura · Presupuestos Online
--
-- Migración completa para recrear la base de datos desde cero en Supabase.
-- Ejecutar en el SQL Editor de Supabase (o con psql).
-- ============================================================================

-- 0. Extensiones necesarias
-- ============================================================================
create extension if not exists "pgcrypto";   -- gen_random_uuid()


-- 1. Secuencias
-- ============================================================================
create sequence if not exists seq_presupuesto_nro as integer start 1 increment 1 no cycle;


-- 2. Tablas
-- ============================================================================

-- 2.1 Marcas de vehículos
create table if not exists marcas (
  id          uuid        primary key default gen_random_uuid(),
  nombre      text        not null unique,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 2.2 Modelos de vehículos
create table if not exists modelos (
  id          uuid        primary key default gen_random_uuid(),
  marca_id    uuid        not null references marcas(id) on delete cascade,
  nombre      text        not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 2.3 Clientes / propietarios
create table if not exists clientes (
  id          uuid        primary key default gen_random_uuid(),
  nombre      text        not null,
  apellido    text        not null,
  email       text        not null unique,
  telefono    text        not null unique,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 2.4 Vehículos
create table if not exists vehiculos (
  id              uuid        primary key default gen_random_uuid(),
  dominio         text        not null unique,
  marca_id        uuid        not null references marcas(id),
  modelo_id       uuid        not null references modelos(id),
  anio            integer     not null,
  color           text,
  codigo_pintura  text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- 2.5 Piezas (partes del vehículo)
create table if not exists piezas (
  id          uuid        primary key default gen_random_uuid(),
  nombre      text        not null unique,
  categoria   text        not null check (categoria in ('carrocería', 'vidrios', 'accesorios', 'rodado')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 2.6 Catálogo de trabajos (asociados a una pieza)
create table if not exists trabajos_catalogo (
  id          uuid        primary key default gen_random_uuid(),
  pieza_id    uuid        not null references piezas(id) on delete cascade,
  nombre      text        not null,
  precio_base integer     not null,
  activo      boolean     not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 2.7 Presupuestos
create table if not exists presupuestos (
  id                uuid        primary key default gen_random_uuid(),
  nro               integer     not null unique default nextval('seq_presupuesto_nro'),
  vehiculo_id       uuid        references vehiculos(id) on delete set null,
  cliente_id        uuid        references clientes(id) on delete set null,
  estado            text        not null default 'borrador'
                    check (estado in ('borrador','emitido','aprobado','rechazado','vencido','orden')),
  descuento_pct     integer     not null default 0 check (descuento_pct between 0 and 50),
  total_bruto       integer     not null default 0,
  total_neto        integer     not null default 0,
  aplica_iva        boolean     not null default false,
  iva_porcentaje    integer     not null default 21,
  total_iva         integer     not null default 0,
  observaciones     text,
  fecha_emision     date,
  fecha_vencimiento date,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- 2.8 Items del presupuesto (líneas detalle)
create table if not exists presupuesto_items (
  id              uuid        primary key default gen_random_uuid(),
  presupuesto_id  uuid        not null references presupuestos(id) on delete cascade,
  pieza_id        uuid        references piezas(id) on delete set null,
  trabajo_id      uuid        references trabajos_catalogo(id) on delete set null,
  pieza_nombre    text        not null,
  trabajo_nombre  text        not null,
  precio_unitario integer     not null,
  sort_order      integer     not null default 0,
  created_at      timestamptz not null default now()
);

-- 2.9 Órdenes de trabajo
create table if not exists ordenes_trabajo (
  id              uuid        primary key default gen_random_uuid(),
  presupuesto_id  uuid        not null references presupuestos(id) on delete cascade,
  estado          text        not null default 'pendiente'
                  check (estado in ('pendiente','en_progreso','pausada','completada','cancelada')),
  fecha_inicio    date,
  fecha_fin_est   date,
  fecha_fin_real  date,
  notas_tecnico   text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- 2.10 Adjuntos / fotos de órdenes
create table if not exists orden_adjuntos (
  id          uuid        primary key default gen_random_uuid(),
  orden_id    uuid        not null references ordenes_trabajo(id) on delete cascade,
  url         text        not null,
  path        text        not null,
  nombre      text        not null,
  created_at  timestamptz not null default now()
);

-- 2.11 Turnos / agenda
create table if not exists turnos (
  id                uuid        primary key default gen_random_uuid(),
  fecha             date        not null,
  hora              time,
  cliente_nombre    text        not null,
  cliente_telefono  text,
  vehiculo_dominio  text,
  vehiculo_info     text,
  descripcion       text,
  estado            text        not null default 'pendiente'
                    check (estado in ('pendiente','confirmado','en_progreso','completado','cancelado')),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- RLS: permitir todo a usuarios autenticados

-- 2.1 marcas
alter table marcas enable row level security;
create policy "Acceso total a usuarios autenticados" on marcas
  for all to authenticated using (true) with check (true);

-- 2.2 modelos
alter table modelos enable row level security;
create policy "Acceso total a usuarios autenticados" on modelos
  for all to authenticated using (true) with check (true);

-- 2.3 clientes
alter table clientes enable row level security;
create policy "Acceso total a usuarios autenticados" on clientes
  for all to authenticated using (true) with check (true);

-- 2.4 vehiculos
alter table vehiculos enable row level security;
create policy "Acceso total a usuarios autenticados" on vehiculos
  for all to authenticated using (true) with check (true);

-- 2.5 piezas
alter table piezas enable row level security;
create policy "Acceso total a usuarios autenticados" on piezas
  for all to authenticated using (true) with check (true);

-- 2.6 trabajos_catalogo
alter table trabajos_catalogo enable row level security;
create policy "Acceso total a usuarios autenticados" on trabajos_catalogo
  for all to authenticated using (true) with check (true);

-- 2.7 presupuestos
alter table presupuestos enable row level security;
create policy "Acceso total a usuarios autenticados" on presupuestos
  for all to authenticated using (true) with check (true);

-- 2.8 presupuesto_items
alter table presupuesto_items enable row level security;
create policy "Acceso total a usuarios autenticados" on presupuesto_items
  for all to authenticated using (true) with check (true);

-- 2.9 ordenes_trabajo
alter table ordenes_trabajo enable row level security;
create policy "Acceso total a usuarios autenticados" on ordenes_trabajo
  for all to authenticated using (true) with check (true);

-- 2.10 orden_adjuntos
alter table orden_adjuntos enable row level security;
create policy "Acceso total a usuarios autenticados" on orden_adjuntos
  for all to authenticated using (true) with check (true);

-- 2.11 turnos
alter table turnos enable row level security;
create policy "Acceso total a usuarios autenticados" on turnos
  for all to authenticated using (true) with check (true);


-- 3. Índices
-- ============================================================================
create index if not exists idx_presupuestos_created_at  on presupuestos(created_at desc);
create index if not exists idx_presupuestos_vehiculo_id on presupuestos(vehiculo_id);
create index if not exists idx_ordenes_presupuesto_id   on ordenes_trabajo(presupuesto_id);
create index if not exists idx_adjuntos_orden_id        on orden_adjuntos(orden_id, created_at);
create index if not exists idx_trabajos_pieza_id        on trabajos_catalogo(pieza_id);
create index if not exists idx_trabajos_activo          on trabajos_catalogo(activo);
create index if not exists idx_items_presupuesto_id     on presupuesto_items(presupuesto_id);


-- 4. Vista auxiliar: vehículos con nombres de marca/modelo y último titular
-- ============================================================================
create or replace view v_vehiculos as
select
  v.id,
  v.dominio,
  ma.nombre  as marca,
  mo.nombre  as modelo,
  v.anio,
  v.color,
  v.codigo_pintura,
  v.marca_id,
  v.modelo_id,
  v.created_at,
  (
    select (c.nombre || ' ' || c.apellido)
    from presupuestos p
    join clientes c on c.id = p.cliente_id
    where p.vehiculo_id = v.id
    order by p.created_at desc
    limit 1
  ) as ultimo_titular
from vehiculos v
left join marcas ma on ma.id = v.marca_id
left join modelos mo on mo.id = v.modelo_id;


-- 5. RPC: insertar vehículo y cliente en una transacción atómica
-- ============================================================================
create or replace function insertar_vehiculo_y_cliente(
  p_nombre              text,
  p_apellido            text,
  p_email               text default null,
  p_telefono            text default null,
  p_dominio             text,
  p_marca_id            uuid,
  p_modelo_id           uuid,
  p_anio                integer,
  p_color               text default null,
  p_codigo_pintura      text default null
)
returns json
language plpgsql
security definer
as $$
declare
  v_cliente_id  uuid;
  v_vehiculo_id uuid;
  v_marca       text;
  v_modelo      text;
begin
  -- 1. Insertar o ignorar cliente (si ya existe por email/telefono, lo reusa)
  insert into clientes (nombre, apellido, email, telefono)
  values (p_nombre, p_apellido, p_email, p_telefono)
  on conflict (email) do update set
    nombre   = excluded.nombre,
    apellido = excluded.apellido,
    telefono = excluded.telefono
  returning id into v_cliente_id;

  -- 2. Insertar vehículo
  insert into vehiculos (dominio, marca_id, modelo_id, anio, color, codigo_pintura)
  values (upper(p_dominio), p_marca_id, p_modelo_id, p_anio, p_color, upper(p_codigo_pintura))
  returning id into v_vehiculo_id;

  -- 3. Resolver nombres de marca / modelo
  select ma.nombre, mo.nombre into v_marca, v_modelo
  from marcas ma, modelos mo
  where ma.id = p_marca_id and mo.id = p_modelo_id;

  -- 4. Retornar JSON
  return json_build_object(
    'vehiculo_id',      v_vehiculo_id,
    'cliente_id',       v_cliente_id,
    'dominio',          upper(p_dominio),
    'marca',            v_marca,
    'modelo',           v_modelo,
    'anio',             p_anio,
    'color',            p_color,
    'codigo_pintura',   upper(p_codigo_pintura),
    'cliente_nombre',   p_nombre,
    'cliente_apellido', p_apellido,
    'cliente_telefono', p_telefono,
    'cliente_email',    p_email
  );
end;
$$;


-- 6. Storage bucket para fotos de órdenes
-- ============================================================================
-- Nota: ejecutar SOLO si se quiere crear desde SQL directo.
-- Normalmente se crea desde el dashboard de Supabase > Storage.
/*
insert into storage.buckets (id, name, public)
values ('orden-fotos', 'orden-fotos', true)
on conflict (id) do nothing;
*/
