// src/components/presupuesto/PDFPreview.jsx

import { memo } from "react";
import { ICONS } from "@/constants/icons";
import { fmt, esc, resolverTitular } from "@/utils/fmt";

const PDF_STYLES = `
  *{box-sizing:border-box;margin:0;padding:0;font-family:Arial,sans-serif;}
  body{padding:32px;color:#2C2C2A;}
  .pdf-hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;padding-bottom:16px;border-bottom:2px solid #2C2C2A;}
  .pdf-logo{font-size:18px;font-weight:bold;}
  .pdf-logo span{display:block;font-size:12px;font-weight:400;color:#5F5E5A;margin-top:2px;}
  .pdf-nro{text-align:right;font-size:13px;color:#5F5E5A;}
  .pdf-nro strong{display:block;font-size:16px;color:#2C2C2A;font-weight:bold;}
  .pdf-veh{background:#F1EFE8;border-radius:6px;padding:10px 14px;margin-bottom:16px;font-size:13px;}
  .pdf-veh-grid{display:grid;grid-template-columns:1fr 1fr;gap:4px 16px;margin-top:6px;}
  .pdf-veh-item{font-size:12px;color:#5F5E5A;}
  .pdf-veh-item strong{color:#2C2C2A;}
  table{width:100%;border-collapse:collapse;font-size:13px;margin-bottom:16px;}
  th{text-align:left;padding:6px 8px;background:#2C2C2A;color:#F1EFE8;}
  td{padding:7px 8px;border-bottom:1px solid #D3D1C7;}
  .pdf-totals{display:flex;justify-content:flex-end;}
  .pdf-tot-box{width:220px;}
  .pdf-tot-row{display:flex;justify-content:space-between;font-size:13px;padding:4px 0;}
  .pdf-tot-row.final{font-size:16px;font-weight:bold;border-top:2px solid #2C2C2A;padding-top:8px;margin-top:4px;}
  .pdf-obs{margin-top:16px;font-size:12px;color:#5F5E5A;border-top:1px solid #D3D1C7;padding-top:12px;}
  .pdf-footer{margin-top:20px;text-align:center;font-size:11px;color:#888780;}
  @media print{body{padding:16px;}}
`;

export function imprimirPresupuesto({ nroStr, html }) {
  const w = window.open("", "_blank", "width=800,height=600");
  w.document.write(`<html><head><title>Presupuesto #${esc(nroStr)}</title><style>${PDF_STYLES}</style></head><body>${html}</body></html>`);
  w.document.close();
  setTimeout(() => w.print(), 400);
}

/**
 * Props:
 *   nro        number
 *   vehiculo   object | null  — de useVehiculos
 *   cliente    object | null  — de useClientes (propietarioActual)
 *   items      Item[]
 *   descuento  number
 *   obs        string
 *   onClose    () => void
 *   onGuardar  () => void
 */
const PDFPreview = memo(function PDFPreview({ nro, vehiculo, cliente, items, descuento, iva, total, obs, onClose, onGuardar }) {
  const bruto = items.reduce((s, x) => s + x.precio, 0);
  const ahorro = Math.round((bruto * descuento) / 100);
  const neto = bruto - ahorro;
  const fecha = new Date().toLocaleDateString("es-AR");
  const nroStr = String(nro).padStart(4, "0");

  const titular = resolverTitular(cliente, vehiculo);

  const handleGuardarYExportar = () => {
    const html = document.getElementById("pdf-content-inner").innerHTML;
    onGuardar();
    imprimirPresupuesto({ nroStr, html });
    onClose();
  };

  const handleGuardar = () => {
    onGuardar();
    onClose(); // Cierra el modal de forma limpia
  };

  return (
    <div className="fixed inset-0 bg-ant/55 flex items-center justify-center z-[100] p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-xl border border-border w-[680px] max-w-full max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="text-[13px] font-semibold text-ant flex items-center gap-2">📄 Vista previa — Presupuesto #{nroStr}</div>
          <button onClick={onClose} aria-label="Cerrar" className="text-ant3 hover:text-ant cursor-pointer p-1 rounded hover:bg-antl transition-colors">
            <i className={`${ICONS.CLOSE} text-[16px]`} />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6">
          <div id="pdf-content-inner">
            {/* Encabezado */}
            <div className="flex justify-between items-start mb-5 pb-4 border-b-2 border-ant">
              <div>
                <div className="text-[18px] font-bold text-ant">Taller Chapa &amp; Pintura</div>
                <div className="text-[12px] text-ant3 mt-0.5">Sistema de presupuestos</div>
              </div>
              <div className="text-right">
                <div className="text-[13px] text-ant3">Fecha: {fecha}</div>
                <div className="text-[16px] font-bold text-ant font-mono">#{nroStr}</div>
              </div>
            </div>

            {/* Vehículo y propietario */}
            <div className="bg-antl rounded-md px-3.5 py-2.5 mb-4 text-[13px]">
              <div className="font-semibold text-ant mb-1.5">Datos del vehículo</div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[12px] text-ant2">
                {vehiculo && (
                  <>
                    <span>
                      <strong>Dominio:</strong> {vehiculo.dominio}
                    </span>
                    <span>
                      <strong>Vehículo:</strong> {vehiculo.marca} {vehiculo.modelo} {vehiculo.anio}
                    </span>
                    {vehiculo.color && (
                      <span>
                        <strong>Color:</strong> {vehiculo.color}
                      </span>
                    )}
                    {vehiculo.codigo_pintura && (
                      <span>
                        <strong>Código pintura:</strong> {vehiculo.codigo_pintura}
                      </span>
                    )}
                  </>
                )}
                <span className="col-span-2">
                  <strong>Propietario:</strong> {titular}
                  {cliente?.telefono && <span className="text-ant3 ml-2">· {cliente.telefono}</span>}
                </span>
              </div>
            </div>

            {/* Tabla de ítems */}
            <table className="w-full border-collapse text-[13px] mb-4">
              <thead>
                <tr>
                  <th className="text-left px-2 py-1.5 bg-ant text-antl font-medium">Pieza</th>
                  <th className="text-left px-2 py-1.5 bg-ant text-antl font-medium">Trabajo</th>
                  <th className="text-right px-2 py-1.5 bg-ant text-antl font-medium">Precio</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, i) => (
                  <tr key={i}>
                    <td className="px-2 py-1.5 border-b border-antm text-ant">{it.piezaNombre}</td>
                    <td className="px-2 py-1.5 border-b border-antm text-ant">{it.trabajoNombre}</td>
                    <td className="px-2 py-1.5 border-b border-antm text-ant text-right font-mono">{fmt(it.precio)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totales */}
            <div className="flex justify-end">
              <div className="w-[220px]">
                <div className="flex justify-between text-[13px] py-1 text-ant2">
                  <span>Subtotal</span>
                  <span>{fmt(bruto)}</span>
                </div>
                {descuento > 0 && (
                  <div className="flex justify-between text-[13px] py-1 text-ant2">
                    <span>Descuento ({descuento}%)</span>
                    <span>-{fmt(ahorro)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[13px] py-1 text-ant2">
                  <span>Neto</span>
                  <span>{fmt(neto)}</span>
                </div>
                <div className="flex justify-between text-[13px] py-1 text-ant2">
                  <span>IVA 21%</span>
                  <span>{fmt(iva)}</span>
                </div>
                <div className="flex justify-between text-[16px] font-bold py-2 mt-1 border-t-2 border-ant text-ant">
                  <span>Total</span>
                  <span className="font-mono">{fmt(total)}</span>
                </div>
              </div>
            </div>

            {obs && (
              <div className="mt-4 pt-3 border-t border-antm text-[12px] text-ant3">
                <strong className="text-ant2">Observaciones:</strong> {obs}
              </div>
            )}

            <div className="mt-5 text-center text-[11px] text-[#888780]">Presupuesto válido por 15 días · Taller Chapa &amp; Pintura</div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-6 py-4 border-t border-border flex-wrap">
          <button onClick={handleGuardarYExportar} className="bg-yel text-yeld font-semibold text-[13px] px-4 h-9 rounded-md flex items-center gap-1.5 hover:bg-yelm cursor-pointer">
            <i className={ICONS.SAVE} /> Guardar y exportar PDF
          </button>
          <button onClick={handleGuardar} className="border border-border text-ant text-[13px] px-3.5 h-9 rounded-md flex items-center gap-1.5 hover:bg-antl cursor-pointer">
            <i className={ICONS.SAVE} /> Solo guardar
          </button>
          <button onClick={onClose} className="border border-border text-ant text-[13px] px-3.5 h-9 rounded-md flex items-center gap-1.5 hover:bg-antl cursor-pointer">
            ✕ Cerrar sin guardar
          </button>
        </div>
      </div>
    </div>
  );
});

export { PDFPreview };
