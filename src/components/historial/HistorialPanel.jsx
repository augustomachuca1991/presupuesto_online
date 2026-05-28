// src/components/historial/HistorialPanel.jsx
import { useState } from "react";
import { fmt } from "@/utils/fmt";
import { imprimirPresupuesto } from "@/components/presupuesto/PDFPreview";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TRANSICIONES } from "@/utils/estadoPresupuesto";
import { Toasts } from "@/components/ui/Toasts";
import { IconCalendar, IconCar, IconWrench, IconUser, IconChevronRight } from "@/components/ui/Icons";

import { useToast } from "@/hooks/useToast";

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
        historialFiltrado.map((h, i) => <HistorialCard key={i} registro={h} cambiarEstado={cambiarEstado} generarOrden={generarOrden} />)
      )}
    </div>
  );
}

function HistorialCard({ registro: h, cambiarEstado, generarOrden }) {
  const transicion = TRANSICIONES[h.estado];
  const [cargando, setCargando] = useState(false);

  const { toast, toasts } = useToast();

  const handleCambiarEstado = async (nuevoEstado) => {
    setCargando(true);
    const ok = await cambiarEstado(h.id, nuevoEstado);
    setCargando(false);

    if (ok) {
      const mensajes = {
        emitido: "Presupuesto emitido correctamente.",
        aprobado: "Presupuesto aprobado ✓",
        rechazado: "Presupuesto marcado como rechazado.",
        vencido: "Presupuesto marcado como vencido.",
      };
      toast.success(mensajes[nuevoEstado] ?? "Estado actualizado.");
    } else {
      toast.error("No se pudo actualizar el estado.");
    }
  };

  const handleGenerarOrden = async () => {
    setCargando(true);
    const orden = await generarOrden(h.id);
    setCargando(false);

    if (orden) {
      toast.success(`Orden de trabajo #${h.nro} generada correctamente.`);
    } else {
      toast.error("No se pudo generar la orden.");
    }
  };

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
      <Toasts toasts={toasts} />
      <div className="flex items-center justify-between mb-1.5">
        <div className="text-[13px] font-semibold text-ant flex items-center gap-1.5 font-mono">
          <IconCalendar /> Presupuesto #{h.nro}
        </div>
        <div className="flex items-center gap-2">
          <div className="text-[12px] text-ant3">{h.fecha}</div>
          <StatusBadge estado={h.estado} />
          <button
            onClick={handleReimprimir}
            title="Reimprimir"
            className="border border-border text-ant3 hover:text-ant hover:bg-antl text-[12px] px-2.5 h-7 rounded-md flex items-center gap-1 cursor-pointer transition-colors"
          >
            <i className="ti ti-printer text-[13px]" /> Imprimir
          </button>
        </div>
      </div>

      <div className="text-[13px] text-ant mb-1 flex">
        <div className="pr-3 pt-1">
          <IconCar />
        </div>
        {veh}
      </div>

      <div className="text-[12px] text-ant3">{resumenItems}</div>
      {/* Texto de Descuento */}
      <div className="text-[12px] text-ant3 font-mono font-bold min-h-[18px]">{h.descuento > 0 && `Descuento ${h.descuento}% aplicado`}</div>
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
        {/* Bloque de Acciones Centrales */}
        <div className="flex items-center gap-1.5">
          {h.estado === "emitido" ? (
            <>
              <button
                onClick={() => handleCambiarEstado("aprobado")}
                disabled={cargando}
                className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 h-6 rounded-md border border-green-200 text-green-600 bg-green-50/30 hover:bg-green-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cargando ? <i className="ti ti-loader-2 animate-spin text-[12px]" /> : <i className="ti ti-check text-[12px]" />}
                Aprobar
              </button>

              <button
                onClick={() => handleCambiarEstado("rechazado")}
                disabled={cargando}
                className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 h-6 rounded-md border border-red-200 text-red-500 bg-red-50/30 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cargando ? <i className="ti ti-loader-2 animate-spin text-[12px]" /> : <i className="ti ti-x text-[12px]" />}
                Rechazar
              </button>
            </>
          ) : h.estado === "aprobado" ? (
            <button
              onClick={handleGenerarOrden}
              disabled={cargando}
              className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 h-6 rounded-md border border-ant text-white bg-ant2 hover:bg-ant transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {cargando ? <i className="ti ti-loader-2 animate-spin text-[12px] text-yel" /> : <i className="ti ti-bolt text-[12px] text-yel" />}
              Generar orden
            </button>
          ) : transicion ? (
            <button
              onClick={() => handleCambiarEstado(transicion.siguiente)}
              disabled={cargando}
              className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 h-6 rounded-md border border-border text-ant3 hover:text-ant hover:bg-antl transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cargando ? <i className="ti ti-loader-2 animate-spin text-[12px]" /> : <i className="ti ti-arrow-right text-[12px]" />}
              {transicion.accion}
            </button>
          ) : null}
        </div>

        {/* Precio Total */}
        <div className="text-[15px] font-semibold text-ant font-mono">{fmt(h.neto)}</div>
      </div>
    </div>
  );
}
