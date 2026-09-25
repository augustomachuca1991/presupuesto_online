// src/components/presupuesto/PDFPreview.jsx

import { memo } from "react";
import { ICONS } from "@/constants/icons";
import { TALLER } from "@/constants/taller";
import { fmt, esc, resolverTitular } from "@/utils/fmt";
import logoVM from "@/assets/logoPDF.png";
import DOMPurify from "dompurify";

const PDF_STYLES = `
  *{box-sizing:border-box;margin:0;padding:0;font-family:Arial,sans-serif;}
  body{padding:32px;color:#2C2C2A;}
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
  w.document.write(DOMPurify.sanitize(`<html><head><title>Presupuesto #${esc(nroStr)}</title><style>${PDF_STYLES}</style></head><body>${html}</body></html>`));
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
      <div className="bg-ant rounded-xl border border-border w-[680px] max-w-full max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="text-[13px] font-semibold text-antl">Vista previa — Presupuesto #{nroStr}</div>
          <button onClick={onClose} aria-label="Cerrar" className="text-ant3 hover:text-antl cursor-pointer p-1 rounded hover:bg-ant transition-colors">
            <i className={`${ICONS.CLOSE} text-[16px]`} />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6">
          <div id="pdf-content-inner">
            {/* Encabezado */}
            <div className="flex justify-between items-start mb-5 pb-4 border-b-2 border-ant">
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-[76px] h-[76px] shrink-0 flex items-center justify-center overflow-hidden" style={{ background: "#000", borderRadius: "20%" }}>
                    <img src={logoVM} alt="" className="w-full h-full object-contain block" />
                  </div>
                  <div>
                    <div className="text-[13px] font-black uppercase leading-tight text-antl">Taller de</div>
                    <div className="text-[18px] font-black uppercase leading-tight" style={{ color: "#D6281E" }}>
                      Chapa y Pintura
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-antm mt-2.5 leading-none">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#000" className="block shrink-0">
                    <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C9.4 21 2 13.6 2 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2z" />
                  </svg>
                  <span>Tel: {TALLER.telefono}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-antm mt-1.5 leading-none">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#000" className="block shrink-0">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
                  </svg>
                  <span>
                    {TALLER.razonSocial} · {TALLER.direccion}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-antm mt-1.5 leading-none">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#000" className="block shrink-0">
                    <path d="M22 3H2c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM8 6.5A2.5 2.5 0 1 1 8 11.5 2.5 2.5 0 0 1 8 6.5zM13 17H3v-.75C3 14.68 5.69 14 8 14s5 .68 5 2.25V17zm7-2h-5v-1.5h5V15zm0-3h-5v-1.5h5V12z" />
                  </svg>
                  <span>CUIL: {TALLER.cuit}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-bold tracking-widest text-ant3 uppercase">Presupuesto</div>
                <div className="text-[22px] font-black text-antl font-mono">#{nroStr}</div>
                <div className="text-[11px] text-ant3 mt-1 leading-relaxed">
                  Fecha: {fecha}
                  <br />
                  Válido: {TALLER.vigenciaDias} días
                </div>
              </div>
            </div>

            {/* Vehículo y propietario */}
            <div className="bg-ant rounded-md px-3.5 py-2.5 mb-4 text-[13px]">
              <div className="font-semibold text-antl mb-1.5">Datos del vehículo</div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[12px] text-antm">
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
                    <td className="px-2 py-1.5 border-b border-antm text-antl">{it.piezaNombre}</td>
                    <td className="px-2 py-1.5 border-b border-antm text-antl">{it.trabajoNombre}</td>
                    <td className="px-2 py-1.5 border-b border-antm text-antl text-right font-mono">{fmt(it.precio)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totales */}
            <div className="flex justify-end">
              <div className="w-[220px]">
                <div className="flex justify-between text-[13px] py-1 text-antm">
                  <span>Subtotal</span>
                  <span>{fmt(bruto)}</span>
                </div>
                {descuento > 0 && (
                  <div className="flex justify-between text-[13px] py-1 text-antm">
                    <span>Descuento ({descuento}%)</span>
                    <span>-{fmt(ahorro)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[13px] py-1 text-antm">
                  <span>Neto</span>
                  <span>{fmt(neto)}</span>
                </div>
                <div className="flex justify-between text-[13px] py-1 text-antm">
                  <span>IVA 21%</span>
                  <span>{fmt(iva)}</span>
                </div>
                <div className="flex justify-between text-[16px] font-bold py-2 mt-1 border-t-2 border-ant text-antl">
                  <span>Total</span>
                  <span className="font-mono">{fmt(total)}</span>
                </div>
              </div>
            </div>

            {obs && (
              <div className="mt-4 pt-3 border-t border-antm text-[12px] text-ant3">
                <strong className="text-antm">Observaciones:</strong> {obs}
              </div>
            )}

            <div className="mt-5 text-center text-[11px] text-[#888780]">Presupuesto válido por {TALLER.vigenciaDias} días · {TALLER.nombre}</div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-6 py-4 border-t border-border flex-wrap">
          <button onClick={handleGuardarYExportar} className="bg-yel text-yeld font-semibold text-[13px] px-4 h-9 rounded-md flex items-center gap-1.5 hover:bg-yelm cursor-pointer">
            <i className={ICONS.SAVE} /> Guardar y exportar PDF
          </button>
          <button onClick={handleGuardar} className="border border-border text-antl text-[13px] px-3.5 h-9 rounded-md flex items-center gap-1.5 hover:bg-ant cursor-pointer">
            <i className={ICONS.SAVE} /> Solo guardar
          </button>
          <button onClick={onClose} className="border border-border text-antl text-[13px] px-3.5 h-9 rounded-md flex items-center gap-1.5 hover:bg-ant cursor-pointer">
            ✕ Cerrar sin guardar
          </button>
        </div>
      </div>
    </div>
  );
});

export { PDFPreview };