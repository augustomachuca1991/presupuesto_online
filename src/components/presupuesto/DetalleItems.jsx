// src/components/presupuesto/DetalleItems.jsx

import { memo } from "react";
import { ICONS } from "@/constants/icons";
import { fmt } from "@/utils/fmt";

export const DetalleItems = memo(function DetalleItems({ items, descuento, descuentoMax, bruto, ahorro, neto, iva, total, aplicaIva, onAplicaIva, obs, onEditarPrecio, onQuitarItem, onDescuento, onObs }) {
  return (
    <div className="mb-5 flex flex-col gap-4">
      {/* ── Lista de ítems ── */}
      <div>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-widest uppercase text-ant3 mb-2">
          <i className={ICONS.RECEIPT} /> Detalle — precios editables
        </div>

        {items.length === 0 ? (
          <div className="flex items-center justify-center gap-2 text-[13px] text-ant3 bg-ant2 border border-border rounded-xl px-4 py-6">Elegí una pieza y los trabajos a realizar</div>
        ) : (
          <div className="bg-ant2 border border-border rounded-xl overflow-hidden divide-y divide-border">
            {items.map((it, i) => (
              <div key={it.key} className="flex items-center gap-3 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] text-ant3 truncate">{it.piezaNombre}</div>
                  <div className="text-[13px] font-medium text-antl truncate">{it.trabajoNombre}</div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[13px] text-ant3">$</span>
                  <input
                    type="number"
                    value={Math.round(it.precio)}
                    min={0}
                    step={100}
                    onChange={(e) => onEditarPrecio(i, e.target.value)}
                    className="w-full max-w-[96px] text-right border border-border rounded-md px-2 py-1 text-[13px] font-mono text-antl bg-ant2 outline-none focus:border-ant"
                  />
                  <button
                    onClick={() => onQuitarItem(it.piezaId, it.trabajoId)}
                    aria-label="Quitar"
                    title="Quitar"
                    className="text-antm hover:text-red-400 hover:bg-red-900/20 p-1 rounded cursor-pointer transition-colors"
                  >
                    <i className={`${ICONS.CLOSE} text-[13px]`} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Descuento ── */}
      <div className="bg-ant2 border border-border rounded-xl px-4 py-3 flex items-center gap-3">
        <span className="text-[13px] text-antl shrink-0">Descuento</span>
        <input type="range" min={0} max={descuentoMax} step={1} value={descuento} onChange={(e) => onDescuento(e.target.value)} className="flex-1 accent-yel" />
        <span className="text-[13px] font-mono text-antl w-8 text-right shrink-0">{descuento}%</span>
        {ahorro > 0 && <span className="text-[12px] text-ant3 shrink-0">-{fmt(ahorro)}</span>}
      </div>

      {/* ── Totales ── */}
      <div className="bg-ant rounded-xl px-4 py-3 space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="text-[12px] text-antm">Subtotal</div>
          <div className="text-[12px] text-antm font-mono">{fmt(neto)}</div>
        </div>
        {descuento > 0 && (
          <div className="flex items-center justify-between">
            <div className="text-[12px] text-antm">Descuento ({descuento}%)</div>
            <div className="text-[12px] text-antm font-mono">-{fmt(ahorro)}</div>
          </div>
        )}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-[12px] text-antm cursor-pointer select-none">
            <input type="checkbox" checked={aplicaIva} onChange={(e) => onAplicaIva(e.target.checked)} className="accent-yel w-4 h-4 rounded cursor-pointer" />
            IVA 21%
          </label>
          <div className="text-[12px] text-antm font-mono">{aplicaIva ? fmt(iva) : "$0"}</div>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-antm/30">
          <div>
            <div className="text-[12px] text-antl font-semibold">Total</div>
            <div className="text-[11px] text-antm mt-0.5">
              {items.length} ítem{items.length !== 1 ? "s" : ""}
            </div>
          </div>
          <div className="text-right">
            {descuento > 0 && <div className="text-[11px] text-antm line-through">{fmt(bruto)}</div>}
            <div className="text-[22px] font-bold text-yel font-mono">{fmt(total)}</div>
          </div>
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
          className="w-full border border-border rounded-xl px-4 py-3 text-[13px] text-antl bg-ant2 outline-none focus:border-ant resize-none"
        />
      </div>
    </div>
  );
});
