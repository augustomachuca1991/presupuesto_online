-- =============================================================================
-- Migration 006: Audit log
-- =============================================================================
-- Registro de eventos para trazabilidad: login/logout, cambios de estado,
-- CRUD de clientes/vehículos, subida/borrado de fotos.
--
-- Ejecutar en el SQL Editor de Supabase.
-- Las filas se insertan desde el frontend via `src/lib/audit.js`.
-- =============================================================================

create table if not exists audit_log (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete set null,
  accion      text not null,
  entidad     text not null,
  entidad_id  uuid,
  detalle     jsonb,
  created_at  timestamptz not null default now()
);

-- RLS
alter table audit_log enable row level security;

create policy "Insert audit_log — propios registros"
on audit_log for insert to authenticated
with check (auth.uid() = user_id);

create policy "Select audit_log — usuarios autenticados"
on audit_log for select to authenticated
using (true);

-- Índices
create index if not exists idx_audit_log_created_at on audit_log(created_at desc);
create index if not exists idx_audit_log_entidad  on audit_log(entidad, entidad_id);
create index if not exists idx_audit_log_user_id   on audit_log(user_id);
