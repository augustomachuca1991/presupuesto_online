// src/components/presupuesto/PiezasGrid.jsx
//
// Paso 1: grilla de piezas del vehículo.
import { piezas } from "@/data/PiezasTrabajos";

/**
 * Props:
 *   piezaSelId      string | null  — id de la pieza seleccionada
 *   onSeleccionar   (piezaId) => void
 *   cantPorPieza    (piezaId) => number  — trabajos seleccionados por pieza
 */

export function PiezasGrid({ piezaSelId, onSeleccionar, cantPorPieza }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-widest uppercase text-ant3 mb-2">
        <i className="ti ti-components" /> Paso 1 — seleccioná la pieza
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))" }}>
        {piezas.map((p) => {
          const cnt = cantPorPieza(p.id);
          const isSel = p.id === piezaSelId;
          const hasWork = cnt > 0;

          return (
            <button
              key={p.id}
              onClick={() => onSeleccionar(p.id)}
              className={`
    flex flex-col items-center gap-1.5 px-2 py-3 rounded-md border cursor-pointer
    transition-colors duration-150 font-sans
    ${isSel ? "border-2 border-ant bg-antl" : hasWork ? "border-2 border-yel bg-yell" : "border border-border bg-white hover:border-antm hover:bg-antl"}
  `}
            >
              <span className="w-[22px] h-[22px] flex items-center justify-center text-ant">{p.icono}</span>
              <div className="text-[11px] font-medium text-ant text-center leading-snug">{p.nombre}</div>
              {hasWork && <span className="text-[10px] font-semibold bg-yel text-yeld px-1.5 py-0.5 rounded-full">{cnt}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
