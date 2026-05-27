// src/components/presupuesto/TrabajosPanel.jsx

import { fmt } from "@/utils/fmt";

export function TrabajosPanel({ pieza, trabajos, onToggle, onCerrar, trabajoSeleccionado }) {
  if (!pieza) return null;

  return (
    <div className="mb-5">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-widest uppercase text-ant3 mb-2">
        <i className="ti ti-tool" /> Paso 2 — tipo de trabajo
      </div>

      <div className="bg-white border border-border rounded-xl px-4 py-3.5">
        {/* Header del panel */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-[14px] font-semibold text-ant">
            <span>{pieza.icono}</span>
            <span>{pieza.nombre}</span>
          </div>
          <button onClick={onCerrar} className="border border-border text-ant text-[12px] px-3 h-7 rounded-md flex items-center gap-1 hover:bg-antl cursor-pointer">
            ✕ Cerrar
          </button>
        </div>

        {/* Grilla de trabajos */}
        <div className="grid grid-cols-2 gap-2">
          {trabajos.map((t) => {
            const isSel = trabajoSeleccionado(pieza.id, t.id);
            return (
              <button
                key={t.id}
                onClick={() => onToggle(pieza.id, t.id)}
                className={`
                  flex items-center gap-2.5 px-3 py-2.5 rounded-md border text-left
                  cursor-pointer transition-colors duration-150 font-sans
                  ${isSel ? "border-2 border-ant bg-antl" : "border border-border bg-white hover:border-antm hover:bg-antl"}
                `}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium text-ant">{t.nombre}</div>
                  <div className="text-[12px] text-ant3 mt-0.5">{fmt(t.precio)}</div>
                </div>
                {isSel && <span className="text-[13px] text-ant shrink-0">✓</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
