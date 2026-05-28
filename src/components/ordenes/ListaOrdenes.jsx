// src/components/ordenes/ListaOrdenes.jsx

import { useNavigate } from "react-router-dom";
import { useOrdenes } from "@/hooks/useOrdenes";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { IconCalendar, IconCar, IconWrench, IconUser, IconChevronRight } from "@/components/ui/Icons";
import OrdenEstadoBadge from "@/components/ordenes/OrdenEstadoBadge";

const ESTADOS_FILTRO = [
  { value: "todos", label: "Todos" },
  { value: "pendiente", label: "Pendiente" },
  { value: "en_proceso", label: "En proceso" },
  { value: "finalizado", label: "Finalizado" },
  { value: "entregado", label: "Entregado" },
];

export default function ListaOrdenes() {
  const { ordenesFiltradas, cargando, busqueda, setBusqueda, filtroEstado, setFiltroEstado } = useOrdenes();
  const navigate = useNavigate();

  if (cargando) return <div className="p-6 text-[13px] text-ant3">Cargando órdenes...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Breadcrumbs />
      <h1 className="text-[18px] font-semibold text-ant mb-4">Órdenes de trabajo</h1>

      {/* Buscador + filtro */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por dominio o nº de presupuesto..."
          className="flex-1 border border-border rounded-md px-2.5 py-1.5 text-[13px] bg-white text-ant outline-none focus:border-ant"
        />
        {busqueda && (
          <button onClick={() => setBusqueda("")} className="border border-border text-ant text-[13px] px-3.5 h-9 rounded-md flex items-center hover:bg-antl cursor-pointer">
            ✕
          </button>
        )}
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="border border-border rounded-md px-2.5 py-1.5 text-[13px] bg-white text-ant outline-none focus:border-ant cursor-pointer"
        >
          {ESTADOS_FILTRO.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Lista */}
      {ordenesFiltradas.length === 0 ? (
        <div className="text-[13px] text-ant3 text-center py-8 border border-dashed border-border rounded-md">
          {busqueda || filtroEstado !== "todos" ? "Sin resultados para esa búsqueda." : "No hay órdenes generadas todavía."}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {ordenesFiltradas.map((o) => {
            const p = o.presupuestos;
            const v = p?.vehiculos;
            const veh = v ? `${v.dominio} · ${v.marcas?.nombre} ${v.modelos?.nombre} ${v.anio}` : "Sin vehículo";
            const cliente = p?.clientes ? `${p.clientes.nombre} ${p.clientes.apellido}` : null;

            return (
              <div
                key={o.id}
                onClick={() => navigate(`/ordenes/${o.id}`)}
                className="bg-white border border-border rounded-xl px-4 py-3 shadow-sm cursor-pointer hover:border-ant transition-colors group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-[13px] font-semibold text-ant font-mono">
                    <span className="text-ant3">
                      <IconWrench />
                    </span>
                    Orden · Presupuesto #{p?.nro}
                  </div>
                  <div className="flex items-center gap-2">
                    <OrdenEstadoBadge estado={o.estado} />
                    <span className="text-ant3 group-hover:text-ant transition-colors">
                      <IconChevronRight />
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[13px] text-ant mb-0.5">
                  <span className="text-ant3">
                    <IconCar />
                  </span>
                  {veh}
                </div>

                {cliente && (
                  <div className="flex items-center gap-1.5 text-[12px] text-ant3">
                    <IconUser />
                    {cliente}
                  </div>
                )}

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
                  <div className="flex items-center gap-1.5 text-[12px] text-ant3">
                    <IconCalendar />
                    {o.fecha_inicio ? `Inicio: ${o.fecha_inicio}` : "Sin fecha de inicio"}
                  </div>
                  <div className="flex items-center gap-1.5 text-[12px] text-ant3">
                    <IconCalendar />
                    {o.fecha_fin_est ? `Est. fin: ${o.fecha_fin_est}` : "Sin fecha estimada"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
