// src/components/presupuesto/PiezasGrid.jsx — DEBUG TEMPORAL

export function PiezasGrid({ piezas, piezaSelId, onSeleccionar, cantPorPieza, isLoading }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-widest uppercase text-ant3 mb-2">
        <i className="ti ti-components" /> Paso 1 — seleccioná la pieza
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {isLoading
          ? Array.from({ length: 12 }).map((_, i) => <div key={i} className="h-16 rounded-lg bg-antl animate-pulse" />)
          : piezas.map((p) => {
              const cnt = cantPorPieza(p.id);
              const isSel = p.id === piezaSelId;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    onSeleccionar(p.id);
                  }}
                  className={`relative flex flex-col items-center justify-center gap-1 rounded-lg border px-2 py-2.5 text-center cursor-pointer transition-all
                    ${isSel ? "border-yel bg-yell text-ant shadow-sm" : "border-border bg-white text-ant hover:border-ant3 hover:bg-antl"}
                    ${cnt > 0 && !isSel ? "border-ant3 bg-antl" : ""}`}
                >
                  <span className="text-[20px] leading-none">{p.icono ?? "🔧"}</span>
                  <span className="text-[11px] font-medium leading-tight">{p.nombre}</span>
                  {cnt > 0 && <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-yel text-yeld text-[10px] font-bold flex items-center justify-center">{cnt}</span>}
                </button>
              );
            })}
      </div>
    </div>
  );
}
