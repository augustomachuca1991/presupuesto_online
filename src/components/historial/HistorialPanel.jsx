// src/components/historial/HistorialPanel.jsx

import { fmt } from "@/utils/fmt";
import { imprimirPresupuesto } from "@/components/presupuesto/PDFPreview";

export function HistorialPanel({ historialFiltrado, totalGuardados, busqueda, onBusqueda }) {
  const sinResultados = historialFiltrado.length === 0;
  const mensajeVacio = totalGuardados ? "Sin resultados para esa búsqueda." : 'Todavía no hay presupuestos guardados.\nGenerá uno desde "Nuevo presupuesto".';

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={busqueda}
          onChange={(e) => onBusqueda(e.target.value)}
          placeholder="Buscar por dominio, marca o número..."
          className="flex-1 border border-border rounded-md px-2.5 py-1.5 text-[13px] bg-white text-ant outline-none focus:border-ant"
        />
        {busqueda && (
          <button onClick={() => onBusqueda("")} className="border border-border text-ant text-[13px] px-3.5 h-9 rounded-md flex items-center hover:bg-antl cursor-pointer">
            ✕
          </button>
        )}
      </div>

      {sinResultados ? (
        <div className="text-[13px] text-ant3 text-center py-8 px-4 border border-dashed border-border rounded-md whitespace-pre-line">{mensajeVacio}</div>
      ) : (
        historialFiltrado.map((h, i) => <HistorialCard key={i} registro={h} />)
      )}
    </div>
  );
}

function HistorialCard({ registro: h }) {
  const veh = h.vehiculo ? `${h.vehiculo.dominio} · ${h.vehiculo.marca} ${h.vehiculo.modelo} ${h.vehiculo.anio}` : "Sin vehículo";

  const resumenItems =
    h.items
      .slice(0, 3)
      .map((x) => `${x.piezaNombre} — ${x.trabajoNombre}`)
      .join(", ") + (h.items.length > 3 ? ` +${h.items.length - 3} más` : "");

  const handleReimprimir = () => {
    const vehTexto = h.vehiculo ? `${h.vehiculo.dominio} · ${h.vehiculo.marca} ${h.vehiculo.modelo} ${h.vehiculo.anio} · ${h.vehiculo.color} · ${h.vehiculo.titular}` : "Sin vehículo asignado";

    const filas = h.items
      .map(
        (it) =>
          `<tr><td>${it.piezaNombre}</td><td>${it.trabajoNombre}</td><td style="text-align:right">${it.precio.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 })}</td></tr>`
      )
      .join("");

    const descuentoFila =
      h.descuento > 0
        ? `<div class="pdf-tot-row"><span>Descuento (${h.descuento}%)</span><span>-${h.ahorro.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 })}</span></div>`
        : "";

    const obsFila = h.obs ? `<div class="pdf-obs"><strong>Observaciones:</strong> ${h.obs}</div>` : "";

    const fmt = (n) => n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

    const html = `
      <div class="pdf-hdr">
        <div class="pdf-logo">Taller Chapa &amp; Pintura<span>Sistema de presupuestos</span></div>
        <div class="pdf-nro"><span>Fecha: ${h.fecha}</span><strong>#${h.nro}</strong></div>
      </div>
      <div class="pdf-veh"><strong>Vehículo:</strong> ${vehTexto}</div>
      <table>
        <thead><tr><th>Pieza</th><th>Trabajo</th><th style="text-align:right">Precio</th></tr></thead>
        <tbody>${filas}</tbody>
      </table>
      <div class="pdf-totals">
        <div class="pdf-tot-box">
          <div class="pdf-tot-row"><span>Subtotal</span><span>${fmt(h.bruto)}</span></div>
          ${descuentoFila}
          <div class="pdf-tot-row final"><span>Total</span><span>${fmt(h.neto)}</span></div>
        </div>
      </div>
      ${obsFila}
      <div class="pdf-footer">Presupuesto válido por 15 días · Taller Chapa &amp; Pintura</div>
    `;

    imprimirPresupuesto({ nroStr: h.nro, html });
  };

  return (
    <div className="bg-white border border-border rounded-xl px-4 py-3 mb-2 shadow-sm">
      <div className="flex items-center justify-between mb-1.5">
        <div className="text-[13px] font-semibold text-ant flex items-center gap-1.5 font-mono">📄 Presupuesto #{h.nro}</div>
        <div className="flex items-center gap-2">
          <div className="text-[12px] text-ant3">{h.fecha}</div>
          <button
            onClick={handleReimprimir}
            title="Reimprimir"
            className="border border-border text-ant3 hover:text-ant hover:bg-antl text-[12px] px-2.5 h-7 rounded-md flex items-center gap-1 cursor-pointer transition-colors"
          >
            <i className="ti ti-printer text-[13px]" /> Imprimir
          </button>
        </div>
      </div>

      <div className="text-[13px] text-ant mb-1">🚗 {veh}</div>
      <div className="text-[12px] text-ant3">{resumenItems}</div>

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
        <div className="text-[12px] text-ant3">{h.descuento > 0 ? `Descuento ${h.descuento}% aplicado` : ""}</div>
        <div className="text-[15px] font-semibold text-ant font-mono">{fmt(h.neto)}</div>
      </div>
    </div>
  );
}
