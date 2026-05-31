// src/components/historial/HistorialPanel.jsx
import { useState } from "react";
import { fmt } from "@/utils/fmt";
import { imprimirPresupuesto } from "@/components/presupuesto/PDFPreview";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TRANSICIONES } from "@/utils/estadoPresupuesto";
import { Toasts } from "@/components/ui/Toasts";
import { IconCalendar, IconCar, IconFile, IconUser, IconWrench, IconPrint, IconShare } from "@/components/ui/Icons";
import { useToast } from "@/hooks/useToast";
import html2pdf from "html2pdf.js";

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
  const [cargandoPdf, setCargandoPdf] = useState(false);

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

  const handleDescargar = () => {
    // Ponemos el estado en true al arrancar
    setCargandoPdf(true);

    const vehTexto = h.vehiculo ? `${h.vehiculo.marca} ${h.vehiculo.modelo} (${h.vehiculo.anio}) · ${h.vehiculo.color ?? ""}` : "Sin vehículo asignado";
    const dominioTexto = h.vehiculo?.dominio ?? "-";

    const fmtARS = (n) => n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

    // Mapeamos las filas manteniendo las divisiones verticales
    const filas = h.items
      .map(
        (it) => `
      <tr>
        <td style="width: 30%; border-right: 1px solid #000; padding: 7px 8px;">${it.piezaNombre}</td>
        <td style="width: 50%; border-right: 1px solid #000; padding: 7px 8px;">${it.trabajoNombre}</td>
        <td style="width: 20%; text-align: right; font-variant-numeric: tabular-nums; padding: 7px 8px;">${fmtARS(it.precio)}</td>
      </tr>
    `
      )
      .join("");

    // Rellenar filas vacías para mantener el formato de la grilla estable
    const filasFaltantes = Math.max(0, 10 - h.items.length);
    const filasVacias = Array(filasFaltantes).fill('<tr><td style="border-right: 1px solid #000; height: 32px;"></td><td style="border-right: 1px solid #000;"></td><td></td></tr>').join("");

    const obsBloque = h.obs ? `<div style="margin-top: 12px; font-size: 11px; color: #000; border-top: 1px dashed #000; padding-top: 8px;"><strong>Observaciones:</strong> ${h.obs}</div>` : "";

    // El contenedor principal lleva un ancho fijo ideal para el renderizado del PDF (A4 estándar)
    const htmlCompleto = `
<div style="font-family: Arial, sans-serif; color: #000; background: #fff; padding: 10px; width: 700px; margin: 0 auto;">
 
  <!-- HEADER -->
  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 2px solid #000;">
    <div>
      <div style="font-size: 28px; font-weight: 900; font-style: italic; letter-spacing: -0.5px; line-height: 1;">Victor Machuca</div>
      <div style="font-size: 10px; font-weight: bold; letter-spacing: 3px; color: #555; margin-top: 4px; text-transform: uppercase;">Chapa · Pintura</div>
      <div style="font-size: 11px; color: #555; margin-top: 10px; line-height: 1.6;">
        Tel: 3794-323250 &nbsp;·&nbsp; CUIT: 20-12025804-5<br>
        Taller SDR S.R.L. &nbsp;·&nbsp; Av. Castelli 2290, Corrientes
      </div>
    </div>
    <div style="text-align: right;">
      <div style="font-size: 10px; font-weight: bold; letter-spacing: 2px; color: #555; text-transform: uppercase;">Presupuesto</div>
      <div style="font-size: 30px; font-weight: 900; font-family: monospace; line-height: 1.1;">#${h.nro.toString().padStart(5, "0")}</div>
      <div style="margin-top: 8px; font-size: 11px; color: #555; line-height: 1.7;">
        Fecha: ${h.fechaDisplay ?? h.fecha ?? ""}<br>
        Válido: 15 días
      </div>
    </div>
  </div>
 
  <!-- DATOS DEL CLIENTE / VEHÍCULO -->
  <div style="display: flex; width: 100%; margin-bottom: 20px; border: 1px solid #ccc; border-radius: 4px; overflow: hidden;">
    <div style="flex: 1; padding: 10px 14px; border-right: 1px solid #ccc;">
      <div style="font-size: 9px; font-weight: bold; letter-spacing: 2px; color: #777; text-transform: uppercase; margin-bottom: 4px;">Cliente</div>
      <div style="font-size: 13px; font-weight: bold;">${titular}</div>
      ${h.cliente?.telefono ? `<div style="font-size: 11px; color: #555; margin-top: 2px;">${h.cliente.telefono}</div>` : ""}
    </div>
    <div style="flex: 1; padding: 10px 14px; border-right: 1px solid #ccc;">
      <div style="font-size: 9px; font-weight: bold; letter-spacing: 2px; color: #777; text-transform: uppercase; margin-bottom: 4px;">Vehículo</div>
      <div style="font-size: 13px; font-weight: bold;">${vehTexto}</div>
      ${h.vehiculo?.color ? `<div style="font-size: 11px; color: #555; margin-top: 2px;">Color: ${h.vehiculo.color}</div>` : ""}
    </div>
    <div style="padding: 10px 14px; min-width: 110px;">
      <div style="font-size: 9px; font-weight: bold; letter-spacing: 2px; color: #777; text-transform: uppercase; margin-bottom: 4px;">Dominio</div>
      <div style="font-size: 16px; font-weight: 900; font-family: monospace; letter-spacing: 1px;">${dominioTexto}</div>
    </div>
  </div>
 
  <!-- TABLA DE TRABAJOS -->
  <div style="font-size: 9px; font-weight: bold; letter-spacing: 2px; color: #fff; background: #000; padding: 5px 10px; text-transform: uppercase; border-radius: 4px 4px 0 0;">Descripción de trabajos</div>
  <table style="width: 100%; border-collapse: collapse; border: 1px solid #000; border-top: none; margin-bottom: 20px; table-layout: fixed;">
    <thead>
      <tr style="background: #f2f2f2;">
        <th style="width: 30%; padding: 8px 10px; text-align: left; font-size: 11px; border-right: 1px solid #ccc; font-weight: bold;">Pieza</th>
        <th style="width: 52%; padding: 8px 10px; text-align: left; font-size: 11px; border-right: 1px solid #ccc; font-weight: bold;">Trabajo</th>
        <th style="width: 18%; padding: 8px 10px; text-align: right; font-size: 11px; font-weight: bold;">Total</th>
      </tr>
    </thead>
    <tbody>
      ${h.items
        .map(
          (it, idx) => `
        <tr style="background: ${idx % 2 === 0 ? "#fff" : "#f9f9f9"}; border-top: 1px solid #e8e8e8;">
          <td style="padding: 8px 10px; font-size: 12px; color: #555; border-right: 1px solid #e8e8e8;">${it.piezaNombre}</td>
          <td style="padding: 8px 10px; font-size: 12px; border-right: 1px solid #e8e8e8;">${it.trabajoNombre}</td>
          <td style="padding: 8px 10px; font-size: 12px; text-align: right; font-family: monospace;">${fmtARS(it.precio)}</td>
        </tr>
      `
        )
        .join("")}
      ${Array(Math.max(0, 8 - h.items.length))
        .fill(
          `
        <tr style="border-top: 1px solid #e8e8e8;">
          <td style="padding: 8px 10px; height: 30px; border-right: 1px solid #e8e8e8;"></td>
          <td style="border-right: 1px solid #e8e8e8;"></td>
          <td></td>
        </tr>
      `
        )
        .join("")}
    </tbody>
  </table>
 
  <!-- OBSERVACIONES (solo si hay) -->
  ${
    h.obs
      ? `
  <div style="margin-bottom: 16px; border: 1px solid #ccc; border-radius: 4px; padding: 10px 14px;">
    <div style="font-size: 9px; font-weight: bold; letter-spacing: 2px; color: #777; text-transform: uppercase; margin-bottom: 6px;">Observaciones</div>
    <div style="font-size: 11.5px; color: #333; line-height: 1.6;">${h.obs}</div>
  </div>`
      : ""
  }
 
  <!-- TOTALES + TÉRMINOS -->
  <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 24px;">
 
    <!-- Términos -->
    <div style="flex: 1; border: 1px solid #ccc; border-radius: 4px; padding: 12px 14px;">
      <div style="font-size: 9px; font-weight: bold; letter-spacing: 2px; color: #777; text-transform: uppercase; margin-bottom: 8px;">Términos y condiciones</div>
      <ol style="padding-left: 16px; font-size: 10.5px; color: #444; line-height: 1.7; margin: 0;">
        <li>Validez del presupuesto: 15 días corridos.</li>
        <li>Repuestos reemplazados abonados por adelantado.</li>
        <li>Garantía técnica extendida en mano de obra de pintura.</li>
      </ol>
      <div style="margin-top: 28px; padding-top: 8px; border-top: 1px solid #000; font-size: 10px; color: #555;">
        Acepto &nbsp; x ___________________________________
        <div style="font-size: 9px; margin-top: 2px; color: #888;">Firma y aclaración del cliente</div>
      </div>
    </div>
 
    <!-- Totales -->
    <div style="min-width: 200px;">
      <div style="display: flex; justify-content: space-between; padding: 7px 0; font-size: 12px; color: #555; border-bottom: 1px solid #e8e8e8;">
        <span>Subtotal</span>
        <span style="font-family: monospace;">${fmtARS(h.bruto)}</span>
      </div>
      ${
        h.descuento > 0
          ? `
      <div style="display: flex; justify-content: space-between; padding: 7px 0; font-size: 12px; color: #555; border-bottom: 1px solid #e8e8e8;">
        <span>Descuento (${h.descuento}%)</span>
        <span style="font-family: monospace;">-${fmtARS(h.ahorro)}</span>
      </div>`
          : ""
      }
      <div style="display: flex; justify-content: space-between; padding: 7px 0; font-size: 12px; color: #555; border-bottom: 1px solid #e8e8e8;">
        <span>Impuesto (0%)</span>
        <span style="font-family: monospace;">$ 0</span>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; margin-top: 4px; border-top: 2px solid #000;">
        <span style="font-size: 14px; font-weight: bold;">Total</span>
        <span style="font-size: 20px; font-weight: 900; font-family: monospace;">${fmtARS(h.neto)}</span>
      </div>
      <div style="font-size: 9px; color: #888; text-align: right; margin-top: 4px;">CLI-${h.cliente?.id ? h.cliente.id.toString().slice(-4).toUpperCase() : "GEN"}</div>
    </div>
 
  </div>
 
</div>
`;

    const elementoTemporal = document.createElement("div");
    elementoTemporal.innerHTML = htmlCompleto;

    const opciones = {
      margin: 12,
      filename: `Presupuesto_VM_${h.nro}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    // ⚡ USAMOS PROMESAS: .save() devuelve una promesa cuando el PDF se termina de descargar
    html2pdf()
      .set(opciones)
      .from(elementoTemporal)
      .save()
      .then(() => {
        // Cuando termina de descargarse con éxito, quitamos el loading
        setCargandoPdf(false);
      })
      .catch((err) => {
        console.error("Error al generar PDF:", err);
        setCargandoPdf(false);
      });
  };

  const handleCompartir = () => {
    const vehTexto = h.vehiculo ? `${h.vehiculo.dominio} · ${h.vehiculo.marca} ${h.vehiculo.modelo} ${h.vehiculo.anio}` : "Sin vehículo";

    const itemsTexto = h.items.map((it) => `• ${it.piezaNombre} — ${it.trabajoNombre}: ${fmt(it.precio)}`).join("\n");

    const descTexto = h.descuento > 0 ? `\nDescuento ${h.descuento}%: -${fmt(h.ahorro)}` : "";

    const texto = `
*Presupuesto #${h.nro}* — Taller Chapa & Pintura
📅 ${h.fechaDisplay ?? h.fecha}
🚗 ${vehTexto}

${itemsTexto}
${descTexto}
*Total: ${fmt(h.neto)}*

_Válido por 15 días_
  `.trim();

    if (navigator.share) {
      navigator.share({
        title: `Presupuesto #${h.nro}`,
        text: texto,
      });
    } else {
      // Fallback: abre WhatsApp Web
      const url = `https://wa.me/?text=${encodeURIComponent(texto)}`;
      window.open(url, "_blank");
    }
  };

  return (
    <div className="bg-white border border-border rounded-xl px-4 py-3.5 mb-2.5 shadow-sm">
      <Toasts toasts={toasts} />

      {/* Fila 1: número + badge */}
      <div className="flex items-center gap-2 mb-2.5">
        <span className="text-ant3">
          <IconFile />
        </span>
        <span className="text-[14px] font-medium text-ant font-mono tracking-tight">Presupuesto #{h.nro}</span>
        <StatusBadge estado={h.estado} />
      </div>

      {/* Fila 2: vehículo + fecha */}
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-ant3 shrink-0">
            <IconCar />
          </span>
          <span className="text-[13px] text-ant truncate">{veh}</span>
        </div>
        <span className="text-[12px] text-ant3 shrink-0">{h.fechaDisplay ?? h.fecha}</span>
      </div>

      {/* Fila 3: propietario */}
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-ant3 shrink-0">
          <IconUser />
        </span>
        <span className="text-[12px] text-ant2">
          {titular}
          {h.cliente?.telefono && ` · ${h.cliente.telefono}`}
        </span>
      </div>

      {/* Trabajos */}
      <div className="flex items-start gap-1.5 mb-3">
        <span className="text-ant3 shrink-0 mt-0.5">
          <IconWrench />
        </span>
        <p className="text-[12px] text-ant3 leading-relaxed line-clamp-2">{resumenItems}</p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between py-2.5 border-t border-border gap-2 flex-wrap">
        <div className="flex items-center gap-1.5">
          {h.descuento > 0 && <span className="text-[11px] font-medium text-green-700 bg-green-50 border border-green-200 rounded-full px-2 py-0.5">Desc. {h.descuento}%</span>}
        </div>
        <span className="text-[15px] font-medium text-ant font-mono tracking-tight">{fmt(h.neto)}</span>
      </div>

      <div className="flex items-center justify-between pt-2.5 border-t border-border gap-2 flex-wrap">
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
          {h.estado !== "borrador" && (
            <>
              <button
                onClick={handleDescargar}
                disabled={cargandoPdf}
                className="inline-flex items-center gap-1.5 text-[12px] text-ant3 border border-border rounded-md px-2.5 h-6 hover:bg-antl hover:text-ant transition-colors cursor-pointer"
              >
                {cargandoPdf ? (
                  <>
                    {/* Podés cambiar "ti-loader-2" por el ícono de carga de tu librería */}
                    <i className="ti ti-loader-2 animate-spin text-[14px]" />
                    Generando...
                  </>
                ) : (
                  <>
                    <i className="ti ti-download text-[14px]" />
                    Descargar
                  </>
                )}
              </button>

              <button onClick={handleCompartir} className="inline-flex items-center gap-1.5 text-[11px] font-medium text-ant3 hover:text-ant transition-colors cursor-pointer">
                <IconShare />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
