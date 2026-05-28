// src/components/presupuesto/DetalleItems.jsx

import { fmt } from "@/utils/fmt";

export function DetalleItems({ items, descuento, descuentoMax, bruto, ahorro, neto, obs, onEditarPrecio, onQuitarItem, onDescuento, onObs }) {
  return (
    <div className="mb-5 flex flex-col gap-4">
      {/* ── Lista de ítems ── */}
      <div>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-widest uppercase text-ant3 mb-2">
          <i className="ti ti-receipt" /> Detalle — precios editables
        </div>

        {items.length === 0 ? (
          <div className="flex items-center justify-center gap-2 text-[13px] text-ant3 bg-white border border-border rounded-xl px-4 py-6">👆 Elegí una pieza y los trabajos a realizar</div>
        ) : (
          <div className="bg-white border border-border rounded-xl overflow-hidden divide-y divide-border">
            {items.map((it, i) => (
              <div key={it.key} className="flex items-center gap-3 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] text-ant3 truncate">{it.piezaNombre}</div>
                  <div className="text-[13px] font-medium text-ant truncate">{it.trabajoNombre}</div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[13px] text-ant3">$</span>
                  <input
                    type="number"
                    value={Math.round(it.precio)}
                    min={0}
                    step={100}
                    onChange={(e) => onEditarPrecio(i, e.target.value)}
                    className="w-24 text-right border border-border rounded-md px-2 py-1 text-[13px] font-mono text-ant outline-none focus:border-ant"
                  />
                  <button
                    onClick={() => onQuitarItem(it.piezaId, it.trabajoId)}
                    title="Quitar"
                    className="text-ant3 hover:text-[#791f1f] hover:bg-[#fcebeb] p-1 rounded cursor-pointer transition-colors"
                  >
                    <i className="ti ti-x text-[13px]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Descuento ── */}
      <div className="bg-white border border-border rounded-xl px-4 py-3 flex items-center gap-3">
        <span className="text-[13px] text-ant shrink-0">🏷️ Descuento</span>
        <input type="range" min={0} max={descuentoMax} step={1} value={descuento} onChange={(e) => onDescuento(e.target.value)} className="flex-1 accent-yel" />
        <span className="text-[13px] font-mono text-ant w-8 text-right shrink-0">{descuento}%</span>
        {ahorro > 0 && <span className="text-[12px] text-ant3 shrink-0">-{fmt(ahorro)}</span>}
      </div>

      {/* ── Total ── */}
      <div className="bg-ant rounded-xl px-4 py-3 flex items-center justify-between">
        <div>
          <div className="text-[12px] text-antm">Total estimado</div>
          <div className="text-[11px] text-antm mt-0.5">
            {items.length} ítem{items.length !== 1 ? "s" : ""}
          </div>
        </div>
        <div className="text-right">
          {descuento > 0 && <div className="text-[12px] text-antm line-through">{fmt(bruto)}</div>}
          <div className="text-[22px] font-bold text-yel font-mono">{fmt(neto)}</div>
        </div>
      </div>

      {/* ── Observaciones ── */}
      <div>
        <label className="flex items-center gap-1.5 text-[11px] font-semibold tracking-widest uppercase text-ant3 mb-2">📝 Observaciones</label>
        <textarea
          value={obs}
          onChange={(e) => onObs(e.target.value)}
          placeholder="Plazos, condiciones, notas para el cliente..."
          rows={3}
          className="w-full border border-border rounded-xl px-4 py-3 text-[13px] text-ant bg-white outline-none focus:border-ant resize-none"
        />
      </div>
    </div>
  );
}
