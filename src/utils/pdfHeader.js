// src/utils/pdfHeader.js
import { esc } from "@/utils/fmt";
import { TALLER } from "@/constants/taller";
import logoVM from "@/assets/logoPDF.png";

const CUIL = "27-40048057-0";

const ICON_PHONE = `<svg width="12" height="12" viewBox="0 0 24 24" fill="#000" style="display:block"><path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C9.4 21 2 13.6 2 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2z"/></svg>`;

const ICON_PIN = `<svg width="12" height="12" viewBox="0 0 24 24" fill="#000" style="display:block"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>`;

const ICON_CUIL = `<svg width="12" height="12" viewBox="0 0 24 24" fill="#000" style="display:block"><path d="M22 3H2c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM8 6.5A2.5 2.5 0 1 1 8 11.5 2.5 2.5 0 0 1 8 6.5zM13 17H3v-.75C3 14.68 5.69 14 8 14s5 .68 5 2.25V17zm7-2h-5v-1.5h5V15zm0-3h-5v-1.5h5V12z"/></svg>`;

/**
 * Genera el HTML del header del presupuesto (logo, título, contacto, número y fecha).
 * Usado tanto en la reimpresión (imprimirPresupuesto) como en la descarga (html2pdf),
 * para que ambos formatos de salida se vean exactamente igual.
 *
 * @param {{ nro: string|number, fecha: string }} params
 */
export function construirHeaderPresupuestoHTML({ nro, fecha }) {
  return `
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 2px solid #000;">
      <div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 76px; height: 76px; background: #000; border-radius: 20%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden;">
            <img src="${logoVM}" alt="" style="width: 100%; height: 100%; object-fit: contain; display: block;" />
          </div>
          <div>
            <div style="font-size: 15px; font-weight: 900; text-transform: uppercase; line-height: 1.2; color: #111;">Taller de</div>
            <div style="font-size: 20px; font-weight: 900; text-transform: uppercase; line-height: 1.2; color: #D6281E;">Chapa y Pintura</div>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 7px; font-size: 11px; color: #444; margin-top: 10px; line-height: 1;">
          <span style="display: flex; align-items: center;">${ICON_PHONE}</span><span>Tel: ${esc(TALLER.telefono)}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 7px; font-size: 11px; color: #444; margin-top: 5px; line-height: 1;">
          <span style="display: flex; align-items: center;">${ICON_PIN}</span><span>${esc(TALLER.razonSocial)} · ${esc(TALLER.direccion)}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 7px; font-size: 11px; color: #444; margin-top: 5px; line-height: 1;">
          <span style="display: flex; align-items: center;">${ICON_CUIL}</span><span>CUIL: ${esc(CUIL)}</span>
        </div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 10px; font-weight: bold; letter-spacing: 2px; color: #555; text-transform: uppercase;">Presupuesto</div>
        <div style="font-size: 30px; font-weight: 900; font-family: monospace; line-height: 1.1;">#${nro}</div>
        <div style="margin-top: 8px; font-size: 11px; color: #555; line-height: 1.7;">
          Fecha: ${esc(fecha ?? "")}<br>
          Válido: ${TALLER.vigenciaDias} días
        </div>
      </div>
    </div>
  `;
}