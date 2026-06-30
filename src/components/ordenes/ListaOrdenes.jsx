// src/components/ordenes/ListaOrdenes.jsx

import { ICONS } from "@/constants/icons";
import { useState, useEffect, memo } from "react";
import { useNavigate } from "react-router-dom";
import { useOrdenes } from "@/hooks/useOrdenes";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import OrdenEstadoBadge from "@/components/ordenes/OrdenEstadoBadge";
import { supabase } from "@/lib/supabase";

// ─── Cache módulo — persiste mientras la app esté montada ─────────────────
// Clave: ordenId  |  Valor: url (string) | null (sin foto) | undefined (no cargado)
const _fotosCache = new Map();

async function fetchPrimerFotoPorOrden(ordenIds) {
  // Separar los que ya están en cache de los que hay que consultar
  const sinCache = ordenIds.filter((id) => !_fotosCache.has(id));

  if (sinCache.length > 0) {
    const { data } = await supabase.from("orden_adjuntos").select("orden_id, url").in("orden_id", sinCache).order("created_at", { ascending: true });

    // Primero marcamos todos como null (sin foto) — los que tengan foto lo pisarán
    sinCache.forEach((id) => _fotosCache.set(id, null));

    // Guardar solo la primera foto de cada orden
    for (const row of data ?? []) {
      if (_fotosCache.get(row.orden_id) === null) {
        _fotosCache.set(row.orden_id, row.url);
      }
    }
  }

  // Devolver mapa completo para todos los ids pedidos
  return Object.fromEntries(ordenIds.map((id) => [id, _fotosCache.get(id) ?? null]));
}

/**
 * Llamar esto desde OrdenFotos (o donde subas fotos) para que la próxima
 * vez que se liste la orden aparezca la foto nueva.
 * Ejemplo: import { invalidarFotoOrden } from "@/components/ordenes/ListaOrdenes"
 *          invalidarFotoOrden(ordenId)
 */
export function invalidarFotoOrden(ordenId) {
  _fotosCache.delete(ordenId);
}

// ─── Thumbnail ─────────────────────────────────────────────────────────────
const Thumbnail = memo(function Thumbnail({ url, estado }) {
  return (
    <div className="relative w-full overflow-hidden" style={{ background: "#1e1e1c", aspectRatio: "4/3" }}>
      {url ? (
        <img
          src={url}
          alt="Foto de la orden"
          className="w-full h-full object-cover opacity-90
                     group-hover:opacity-100 group-hover:scale-105
                     transition-all duration-300"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-1.5">
          <i className={`${ICONS.PHOTO_OFF} text-[24px] text-[#555]`} />
          <span className="text-[10px] text-[#555] font-medium tracking-wide">Sin imágenes</span>
        </div>
      )}

      {/* Gradiente inferior para el dominio */}
      {url && (
        <div
          className="absolute inset-x-0 bottom-0 h-12
                        bg-linear-to-t from-black/70 to-transparent
                        pointer-events-none"
        />
      )}

      {/* Badge estado */}
      <div className="absolute top-2 right-2">
        <OrdenEstadoBadge estado={estado} />
      </div>
    </div>
  );
});

// ─── Tarjeta ───────────────────────────────────────────────────────────────
const OrdenCard = memo(function OrdenCard({ orden, fotoUrl, onClick }) {
  const p = orden.presupuestos;
  const v = p?.vehiculos;
  const cl = p?.clientes;

  const marca = v?.marcas?.nombre ?? "";
  const modelo = v?.modelos?.nombre ?? "";
  const anio = v?.anio ?? "";
  const dominio = v?.dominio ?? "—";
  const cliente = cl ? `${cl.nombre} ${cl.apellido}` : null;

  const fmtFecha = (f) => {
    if (!f) return "—";
    const [, m, d] = f.split("-");
    return `${d}/${m}`;
  };

  return (
    <div
      onClick={onClick}
      className="bg-ant2 border border-border rounded-xl overflow-hidden shadow-sm
                 cursor-pointer hover:border-yel hover:shadow-md
                 transition-all duration-150 group"
    >
      <Thumbnail url={fotoUrl} estado={orden.estado} />

      {/* Dominio sobre el gradiente */}
      {fotoUrl && (
        <div className="relative -mt-7 px-3 pb-0 pointer-events-none">
          <span
            className="text-[11px] font-bold font-mono tracking-widest
                           text-white drop-shadow"
          >
            {dominio}
          </span>
        </div>
      )}

      <div className="px-3.5 pt-2.5 pb-3">
        {!fotoUrl && <div className="text-[11px] font-bold font-mono tracking-widest text-antm mb-0.5">{dominio}</div>}

        <div className="text-[10px] font-semibold text-ant3 font-mono tracking-wide mb-0.5">Orden · #{String(p?.nro ?? 0).padStart(4, "0")}</div>

        <div className="text-[14px] font-bold text-antl leading-tight truncate">
          {marca} {modelo} {anio}
        </div>

        {cliente && <div className="text-[11px] font-semibold text-antm uppercase tracking-wide mt-0.5 truncate">{cliente}</div>}

        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-border">
          <span className="flex items-center gap-1 text-[11px] text-ant3">
            <i className={`${ICONS.CALENDAR} text-[10px]`} />
            {fmtFecha(orden.fecha_inicio)}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-ant3">
            <i className={`${ICONS.FLAG} text-[10px]`} />
            {fmtFecha(orden.fecha_fin_est)}
          </span>
        </div>
      </div>
    </div>
  );
});

// ─── Filtros ──────────────────────────────────────────────────────────────
const ESTADOS_FILTRO = [
  { value: "todos", label: "Todos" },
  { value: "pendiente", label: "Pendiente" },
  { value: "en_progreso", label: "En progreso" },
  { value: "pausada", label: "Pausada" },
  { value: "completada", label: "Completada" },
  { value: "cancelada", label: "Cancelada" },
];

// ─── Página ───────────────────────────────────────────────────────────────
export default function ListaOrdenes() {
  const { ordenesFiltradas, cargando, cargandoMas, puedeCargarMas, busqueda, setBusqueda, filtroEstado, setFiltroEstado, cargarMasOrdenes, totalCount, ordenes } = useOrdenes();
  const navigate = useNavigate();

  const [fotosMap, setFotosMap] = useState({});
  const [cargandoFotos, setCargandoFotos] = useState(false);

  useEffect(() => {
    if (!ordenesFiltradas.length) return;

    const ids = ordenesFiltradas.map((o) => o.id);

    // Si todos ya están en cache, actualizar el mapa sin llamada a Supabase
    const todosCacheados = ids.every((id) => _fotosCache.has(id));
    if (todosCacheados) {
      setFotosMap(Object.fromEntries(ids.map((id) => [id, _fotosCache.get(id) ?? null])));
      return;
    }

    // Al menos uno nuevo — fetch solo los faltantes
    setCargandoFotos(true);
    fetchPrimerFotoPorOrden(ids).then((mapa) => {
      setFotosMap(mapa);
      setCargandoFotos(false);
    });
  }, [ordenesFiltradas]);

  return (
    <div className="max-w-190 mx-auto px-3 sm:px-4 pt-4 pb-12">
      <Breadcrumbs />

      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-ant rounded-xl mb-5 shadow-md">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-bg border border-border shrink-0">
          <i className={`${ICONS.CLIPBOARD_LIST} text-[19px] text-yel`} />
        </div>
        <div className="min-w-0">
          <div className="text-[15px] font-semibold text-antl tracking-tight">Órdenes de trabajo</div>
          <div className="text-[11px] text-antm">Gestión de reparaciones activas</div>
        </div>
        {!cargando && (
          <span
            className="ml-auto shrink-0 bg-yel text-yeld text-[12px] font-semibold
                           px-3 h-7 rounded-full flex items-center"
          >
            {ordenesFiltradas.length} orden{ordenesFiltradas.length !== 1 ? "es" : ""}
          </span>
        )}
      </div>

      {/* Buscador + filtro */}
      <div className="flex gap-2 mb-5">
        <div className="relative flex-1">
          <i
            className={`${ICONS.SEARCH} absolute left-2.5 top-1/2 -translate-y-1/2
                        text-[14px] text-ant3 pointer-events-none`}
          />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por dominio o nº de presupuesto..."
            className="w-full pl-8 pr-8 h-9 rounded-md border border-white/20 bg-ant2
                        text-[13px] text-antl placeholder:text-ant3 outline-none
                        focus:border-yel focus:ring-1 focus:ring-yel/20 transition shadow-sm"
          />
          {busqueda && (
            <button
              onClick={() => setBusqueda("")}
              aria-label="Cerrar"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ant3
                         hover:text-antl transition-colors cursor-pointer"
            >
              <i className={`${ICONS.CLOSE} text-[13px]`} />
            </button>
          )}
        </div>
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="h-9 px-3 rounded-md border border-white/20 bg-ant2 text-[13px]
                       text-antl outline-none focus:border-yel transition shadow-sm cursor-pointer"
        >
          {ESTADOS_FILTRO.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Skeleton */}
      {cargando && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-xl overflow-hidden border border-border shadow-sm">
              <div className="bg-[#1e1e1c] animate-pulse" style={{ aspectRatio: "4/3" }} />
              <div className="p-3 space-y-2">
                <div className="h-3 bg-ant rounded animate-pulse w-1/2" />
                <div className="h-4 bg-ant rounded animate-pulse" />
                <div className="h-3 bg-ant rounded animate-pulse w-3/4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!cargando && ordenesFiltradas.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <div
            className="w-14 h-14 rounded-2xl bg-ant2 border border-border
                          flex items-center justify-center shadow-sm"
          >
            <i className={`${ICONS.CLIPBOARD_OFF} text-[26px] text-ant3`} />
          </div>
          <p className="text-[14px] font-medium text-antl">{busqueda || filtroEstado !== "todos" ? "Sin resultados" : "No hay órdenes"}</p>
          <p className="text-[12px] text-ant3">{busqueda || filtroEstado !== "todos" ? "Probá con otro filtro o búsqueda." : "Las órdenes se generan desde los presupuestos."}</p>
        </div>
      )}

      {/* Grid */}
      {!cargando && ordenesFiltradas.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {ordenesFiltradas.map((o) => (
            <OrdenCard key={o.id} orden={o} fotoUrl={fotosMap[o.id] ?? null} onClick={() => navigate(`/ordenes/${o.id}`)} />
          ))}
        </div>
      )}

      {puedeCargarMas && (
        <button
          onClick={cargarMasOrdenes}
          disabled={cargandoMas}
          className="mt-4 w-full h-10 rounded-xl border border-dashed border-white/20 text-[13px] text-antm hover:text-antl hover:border-white/40 transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {cargandoMas ? (
            <><i className={`${ICONS.LOADER} animate-spin text-[14px]`} /> Cargando…</>
          ) : (
            <><i className={ICONS.PLUS} /> Cargar más ({ordenes.length} de {totalCount})</>
          )}
        </button>
      )}
    </div>
  );
}
