-- =============================================================================
-- Migration 007: View de búsqueda para historial
-- =============================================================================
-- Aplana presupuestos + vehículos + marcas + modelos + clientes
-- en una sola vista plana para poder filtrar con ilike desde el frontend.
-- =============================================================================

create or replace view v_presupuestos_busqueda as
select
  p.id,
  p.nro,
  p.estado,
  p.created_at,
  v.dominio,
  m.nombre  as marca,
  mo.nombre as modelo,
  concat(c.nombre, ' ', c.apellido) as cliente_nombre
from presupuestos p
left join vehiculos v  on v.id  = p.vehiculo_id
left join marcas    m  on m.id  = v.marca_id
left join modelos   mo on mo.id = v.modelo_id
left join clientes  c  on c.id  = p.cliente_id;
