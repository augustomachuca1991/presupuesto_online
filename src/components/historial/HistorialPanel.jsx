// src/components/historial/HistorialPanel.jsx
import { useState } from "react";
import { fmt } from "@/utils/fmt";
import { imprimirPresupuesto } from "@/components/presupuesto/PDFPreview";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TRANSICIONES } from "@/utils/estadoPresupuesto";
import { Toasts } from "@/components/ui/Toasts";
import { IconCalendar, IconCar } from "@/components/ui/Icons";
import { useToast } from "@/hooks/useToast";

// Reutiliza la misma lógica que PDFPreview para resolver el titular
function resolverTitular(cliente, vehiculo) {
  if (cliente?.nombre) {
    const capitalizar = (s) => s.replace(/\b\w/g, (c) => c.toUpperCase());
    return capitalizar(`${cliente.nombre} ${cliente.apellido ?? ""}`.trim());
  }
  if (vehiculo?.ultimo_titular) return vehiculo.ultimo_titular;
  if (vehiculo?.titular) return vehiculo.titular;
  return "Sin propietario";
}

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
        historialFiltrado.map((h, i) => <HistorialCard key={h.id ?? i} registro={h} cambiarEstado={cambiarEstado} generarOrden={generarOrden} />)
      )}
    </div>
  );
}

function HistorialCard({ registro: h, cambiarEstado, generarOrden }) {
  const transicion = TRANSICIONES[h.estado];
  const [cargando, setCargando] = useState(false);
  const { toast, toasts } = useToast();

  const titular = resolverTitular(h.cliente, h.vehiculo);

  const veh = h.vehiculo ? `${h.vehiculo.dominio} · ${h.vehiculo.marca} ${h.vehiculo.modelo} ${h.vehiculo.anio}` : "Sin vehículo";

  const resumenItems =
    h.items
      .slice(0, 3)
      .map((x) => `${x.piezaNombre} — ${x.trabajoNombre}`)
      .join(", ") + (h.items.length > 3 ? ` +${h.items.length - 3} más` : "");

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
    if (orden) toast.success(`Orden de trabajo #${h.nro} generada correctamente.`);
    else toast.error("No se pudo generar la orden.");
  };

  const handleReimprimir = () => {
    // Construye el texto del vehículo con el titular resuelto correctamente
    const vehTexto = h.vehiculo ? `${h.vehiculo.dominio} · ${h.vehiculo.marca} ${h.vehiculo.modelo} ${h.vehiculo.anio} · ${h.vehiculo.color ?? ""} · ${titular}` : "Sin vehículo asignado";

    const fmtARS = (n) => n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

    const filas = h.items.map((it) => `<tr><td>${it.piezaNombre}</td><td>${it.trabajoNombre}</td><td style="text-align:right">${fmtARS(it.precio)}</td></tr>`).join("");

    const descuentoFila = h.descuento > 0 ? `<div class="pdf-tot-row"><span>Descuento (${h.descuento}%)</span><span>-${fmtARS(h.ahorro)}</span></div>` : "";

    const obsFila = h.obs ? `<div class="pdf-obs"><strong>Observaciones:</strong> ${h.obs}</div>` : "";

    // Línea de propietario/teléfono
    const telTexto = h.cliente?.telefono ? ` · ${h.cliente.telefono}` : "";
    const propietarioFila = `<div style="font-size:12px;color:#5F5E5A;margin-top:4px"><strong>Propietario:</strong> ${titular}${telTexto}</div>`;

    const html = `
      <div class="pdf-hdr">
        <div class="pdf-logo">Taller Chapa &amp; Pintura<span>Sistema de presupuestos</span></div>
        <div class="pdf-nro"><span>Fecha: ${h.fechaDisplay ?? h.fecha ?? ""}</span><strong>#${h.nro}</strong></div>
      </div>
      <div class="pdf-veh">
        <strong>Vehículo:</strong> ${vehTexto}
        ${propietarioFila}
      </div>
      <table>
        <thead><tr><th>Pieza</th><th>Trabajo</th><th style="text-align:right">Precio</th></tr></thead>
        <tbody>${filas}</tbody>
      </table>
      <div class="pdf-totals">
        <div class="pdf-tot-box">
          <div class="pdf-tot-row"><span>Subtotal</span><span>${fmtARS(h.bruto)}</span></div>
          ${descuentoFila}
          <div class="pdf-tot-row final"><span>Total</span><span>${fmtARS(h.neto)}</span></div>
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

      {/* Encabezado */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="text-[13px] font-semibold text-ant flex items-center gap-1.5 font-mono">
          <IconCalendar /> Presupuesto #{h.nro}
        </div>
        <div className="flex items-center gap-2">
          <div className="text-[12px] text-ant3">{h.fechaDisplay ?? h.fecha ?? ""}</div>
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

      {/* Vehículo */}
      <div className="text-[13px] text-ant mb-0.5 flex items-start gap-1.5">
        <IconCar />
        <span>{veh}</span>
      </div>

      {/* Propietario */}
      <div className="text-[12px] text-ant3 mb-1">
        👤 {titular}
        {h.cliente?.telefono && <span className="ml-1.5">· {h.cliente.telefono}</span>}
      </div>

      <div className="text-[12px] text-ant3">{resumenItems}</div>
      <div className="text-[12px] text-ant3 font-mono font-bold min-h-[18px]">{h.descuento > 0 && `Descuento ${h.descuento}% aplicado`}</div>

      {/* Footer de la card */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
        <div className="flex items-center gap-1.5">
          {h.estado === "emitido" ? (
            <>
              <button
                onClick={() => handleCambiarEstado("aprobado")}
                disabled={cargando}
                className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 h-6 rounded-md border border-green-200 text-green-600 bg-green-50/30 hover:bg-green-50 transition-colors cursor-pointer disabled:opacity-50"
              >
                {cargando ? <i className="ti ti-loader-2 animate-spin text-[12px]" /> : <i className="ti ti-check text-[12px]" />}
                Aprobar
              </button>
              <button
                onClick={() => handleCambiarEstado("rechazado")}
                disabled={cargando}
                className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 h-6 rounded-md border border-red-200 text-red-500 bg-red-50/30 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
              >
                {cargando ? <i className="ti ti-loader-2 animate-spin text-[12px]" /> : <i className="ti ti-x text-[12px]" />}
                Rechazar
              </button>
            </>
          ) : h.estado === "aprobado" ? (
            <button
              onClick={handleGenerarOrden}
              disabled={cargando}
              className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 h-6 rounded-md border border-ant text-white bg-ant2 hover:bg-ant transition-colors cursor-pointer disabled:opacity-50 shadow-sm"
            >
              {cargando ? <i className="ti ti-loader-2 animate-spin text-[12px] text-yel" /> : <i className="ti ti-bolt text-[12px] text-yel" />}
              Generar orden
            </button>
          ) : transicion ? (
            <button
              onClick={() => handleCambiarEstado(transicion.siguiente)}
              disabled={cargando}
              className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 h-6 rounded-md border border-border text-ant3 hover:text-ant hover:bg-antl transition-colors cursor-pointer disabled:opacity-50"
            >
              {cargando ? <i className="ti ti-loader-2 animate-spin text-[12px]" /> : <i className="ti ti-arrow-right text-[12px]" />}
              {transicion.accion}
            </button>
          ) : null}
        </div>

        <div className="text-[15px] font-semibold text-ant font-mono">{fmt(h.neto)}</div>
      </div>
    </div>
  );
}
