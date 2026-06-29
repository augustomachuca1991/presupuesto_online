import HistorialCard from "./HistorialCard";

export function HistorialPanel({ historialFiltrado, totalGuardados, busqueda, onBusqueda, cargando, cambiarEstado, generarOrden }) {
  const sinResultados = historialFiltrado.length === 0;
  const mensajeVacio = totalGuardados ? "Sin resultados para esa búsqueda." : 'Todavía no hay presupuestos guardados.\nGenerá uno desde "Nuevo presupuesto".';

  if (cargando) return <div className="text-[13px] text-ant3 text-center py-8">Cargando historial...</div>;

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={busqueda}
          onChange={(e) => onBusqueda(e.target.value)}
          placeholder="Buscar por dominio, marca o número..."
          className="flex-1 border border-border rounded-md px-2.5 py-1.5 text-[13px] bg-ant2 text-antl outline-none focus:border-ant"
        />
        {busqueda && (
          <button onClick={() => onBusqueda("")} className="border border-white/20 text-antm text-[13px] px-3.5 h-9 rounded-md flex items-center hover:bg-ant hover:text-antl cursor-pointer">
            ✕
          </button>
        )}
      </div>

      {sinResultados ? (
        <div className="text-[13px] text-ant3 text-center py-8 px-4 border border-dashed border-border rounded-md whitespace-pre-line">{mensajeVacio}</div>
      ) : (
        historialFiltrado.map((h, i) => <HistorialCard key={h.id ?? i} registro={h} cambiarEstado={cambiarEstado} generarOrden={generarOrden} />)
      )}
    </div>
  );
}
