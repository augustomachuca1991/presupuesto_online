// src/components/presupuesto/TrabajosPanel.jsx — DEBUG TEMPORAL

import { fmt } from "@/utils/fmt";

export function TrabajosPanel({ pieza, trabajos, onToggle, onCerrar, trabajoSeleccionado }) {
  if (!pieza) return null;

  return (
    <div className="mb-5">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-widest uppercase text-ant3 mb-2">
        <i className="ti ti-tool" /> Paso 2 — tipo de trabajo
      </div>
      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-antl">
          <div className="flex items-center gap-2 text-[13px] font-medium text-ant">
            <span className="text-[18px]">{pieza.icono}</span>
            <span>{pieza.nombre}</span>
          </div>
          <button onClick={onCerrar} className="text-ant3 hover:text-ant text-[12px] flex items-center gap-1 cursor-pointer">
            <i className="ti ti-x text-[13px]" /> Cerrar
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border">
          {trabajos.map((t) => {
            const precio = t.precio_base ?? t.precio ?? 0;
            const isSel = trabajoSeleccionado(pieza.id, t.id);
            return (
              <button
                key={t.id}
                onClick={() => onToggle(pieza.id, t.id)}
                className={`flex items-center justify-between gap-3 px-4 py-3 text-left cursor-pointer transition-colors ${isSel ? "bg-yell" : "bg-white hover:bg-antl"}`}
              >
                <div className="min-w-0">
                  <div className="text-[13px] font-medium truncate text-ant">{t.nombre}</div>
                  <div className="text-[12px] text-ant3 font-mono mt-0.5">{fmt(precio)}</div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${isSel ? "bg-yel border-yel text-yeld" : "border-border"}`}>
                  {isSel && <i className="ti ti-check text-[11px]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
