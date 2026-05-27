// src/components/presupuesto/DetalleItems.jsx

import { fmt } from "@/utils/fmt";

export function DetalleItems({ items, descuento, descuentoMax, bruto, ahorro, neto, obs, onEditarPrecio, onQuitarItem, onDescuento, onObs }) {
  return (
    <>
      {/* Lista de ítems */}
      <div className="mb-5">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-widest uppercase text-ant3 mb-2">
          <i className="ti ti-receipt" /> Detalle — precios editables
        </div>

        {items.length === 0 ? (
          <div className="text-[13px] text-ant3 text-center py-5 px-4 border border-dashed border-border rounded-md bg-white">👆 Elegí una pieza y los trabajos a realizar</div>
        ) : (
          <div className="border border-border rounded-md overflow-hidden bg-white">
            {items.map((it, i) => (
              <div key={it.key} className="flex items-center justify-between px-3 py-2.5 border-b border-border last:border-b-0">
                <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                  <div className="text-[11px] text-ant3">{it.piezaNombre}</div>
                  <div className="text-[13px] font-medium text-ant">{it.trabajoNombre}</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] text-ant3">$</span>
                    <input
                      type="number"
                      value={Math.round(it.precio)}
                      min={0}
                      step={100}
                      onChange={(e) => onEditarPrecio(i, e.target.value)}
                      className="w-[88px] h-7 text-[13px] text-right px-1.5 border border-border rounded-md font-mono bg-white text-ant outline-none focus:border-ant"
                    />
                  </div>
                  <button
                    onClick={() => onQuitarItem(it.piezaId, it.trabajoId)}
                    title="Quitar"
                    className="p-1 rounded hover:bg-[#fcebeb] hover:text-[#791f1f] text-ant3 cursor-pointer transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Descuento */}
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-antl rounded-md mt-2">
          <label className="text-[13px] font-medium text-ant2 whitespace-nowrap">🏷️ Descuento</label>
          <input type="range" min={0} max={descuentoMax} step={1} value={descuento} onChange={(e) => onDescuento(e.target.value)} className="flex-1 accent-yel" />
          <span className="text-[14px] font-semibold text-ant font-mono min-w-[36px] text-right">{descuento}%</span>
          <span className="text-[12px] text-ant3 min-w-[70px] text-right">{ahorro > 0 ? `-${fmt(ahorro)}` : ""}</span>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center px-4 py-3.5 bg-ant rounded-md mt-2.5">
          <div className="flex flex-col gap-0.5">
            <div className="text-[13px] font-medium text-antm">Total estimado</div>
            <div className="text-[12px] text-ant3">
              {items.length} ítem{items.length !== 1 ? "s" : ""}
            </div>
          </div>
          <div className="text-right">
            {descuento > 0 && <div className="text-[12px] text-ant3 line-through font-mono">{fmt(bruto)}</div>}
            <div className="text-[26px] font-semibold text-yel font-mono">{fmt(neto)}</div>
          </div>
        </div>
      </div>

      {/* Observaciones */}
      <div className="mb-5">
        <label className="text-[12px] text-ant3 block mb-1.5">📝 Observaciones</label>
        <textarea
          value={obs}
          onChange={(e) => onObs(e.target.value)}
          placeholder="Plazos, condiciones, notas para el cliente..."
          className="w-full border border-border rounded-md px-2.5 py-2 text-[13px] bg-white text-ant outline-none focus:border-ant resize-y min-h-[56px] font-sans"
        />
      </div>
    </>
  );
}
