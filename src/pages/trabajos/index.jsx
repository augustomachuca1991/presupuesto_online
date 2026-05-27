import { useState, useMemo, useCallback, useRef } from "react";

// ─── DATA ──────────────────────────────────────────────────────────────────
const modelosPM = {
  Volkswagen: ["Gol", "Polo", "Vento", "Amarok", "Tiguan", "T-Cross", "Taos"],
  Ford: ["Ka", "Focus", "Fiesta", "EcoSport", "Ranger", "Territory", "Bronco"],
  Chevrolet: ["Onix", "Cruze", "Tracker", "S10", "Spin", "Montana"],
  Renault: ["Kwid", "Sandero", "Logan", "Duster", "Kangoo", "Stepway", "Oroch"],
  Peugeot: ["208", "308", "2008", "3008", "Partner", "Landtrek"],
  Toyota: ["Corolla", "Hilux", "RAV4", "Etios", "Yaris", "SW4", "Fortuner"],
  Fiat: ["Cronos", "Argo", "Mobi", "Toro", "Pulse", "Fastback"],
  Honda: ["City", "Civic", "HR-V", "CR-V", "WR-V", "Fit"],
  Citroën: ["C3", "C4", "Berlingo", "Jumper", "C5"],
  Otro: ["Otro modelo"],
};

const vehiculosDB_inicial = [
  { dominio: "ABC123", marca: "Volkswagen", modelo: "Gol", anio: 2018, color: "Blanco", titular: "Juan Pérez" },
  { dominio: "DEF456", marca: "Ford", modelo: "Focus", anio: 2020, color: "Gris oscuro", titular: "María López" },
  { dominio: "GHI789", marca: "Chevrolet", modelo: "Cruze", anio: 2019, color: "Negro", titular: "Carlos Ruiz" },
  { dominio: "JKL012", marca: "Renault", modelo: "Kwid", anio: 2022, color: "Rojo", titular: "Sofía Gómez" },
  { dominio: "MNO345", marca: "Toyota", modelo: "Corolla", anio: 2021, color: "Blanco perla", titular: "Luis Martínez" },
];

const piezas = [
  { id: "capot", nombre: "Capot", icono: "⬛" },
  { id: "pg_del", nombre: "Paragolpes del.", icono: "⬜" },
  { id: "pg_tra", nombre: "Paragolpes tra.", icono: "⬜" },
  { id: "gb_di", nombre: "Guardab. del. izq.", icono: "◧" },
  { id: "gb_dd", nombre: "Guardab. del. der.", icono: "◨" },
  { id: "gb_ti", nombre: "Guardab. tra. izq.", icono: "◧" },
  { id: "gb_td", nombre: "Guardab. tra. der.", icono: "◨" },
  { id: "pu_di", nombre: "Puerta del. izq.", icono: "🚪" },
  { id: "pu_dd", nombre: "Puerta del. der.", icono: "🚪" },
  { id: "pu_ti", nombre: "Puerta tra. izq.", icono: "🚪" },
  { id: "pu_td", nombre: "Puerta tra. der.", icono: "🚪" },
  { id: "techo", nombre: "Techo", icono: "🏠" },
  { id: "baul", nombre: "Baúl / Compuerta", icono: "📦" },
  { id: "luneta", nombre: "Luneta", icono: "🪟" },
  { id: "parabrisas", nombre: "Parabrisas", icono: "🪟" },
  { id: "esp_i", nombre: "Espejo izq.", icono: "◁" },
  { id: "esp_d", nombre: "Espejo der.", icono: "▷" },
  { id: "llanta", nombre: "Llantas", icono: "⭕" },
];

const trabajosPP = {
  capot: [
    { id: "abo", nombre: "Reparación abolladura", precio: 28000 },
    { id: "chapa", nombre: "Chapa entera", precio: 85000 },
    { id: "pint", nombre: "Pintura 2 manos", precio: 42000 },
    { id: "cambio", nombre: "Cambio de pieza", precio: 120000 },
    { id: "masilla", nombre: "Masilla y aparejos", precio: 15000 },
    { id: "pulido", nombre: "Pulido y encerado", precio: 12000 },
  ],
  pg_del: [
    { id: "dest", nombre: "Destemplado", precio: 18000 },
    { id: "pint", nombre: "Pintura", precio: 25000 },
    { id: "cambio", nombre: "Cambio de pieza", precio: 65000 },
    { id: "abo", nombre: "Reparación abolladura", precio: 22000 },
    { id: "masilla", nombre: "Masilla y aparejos", precio: 10000 },
  ],
  pg_tra: [
    { id: "dest", nombre: "Destemplado", precio: 18000 },
    { id: "pint", nombre: "Pintura", precio: 25000 },
    { id: "cambio", nombre: "Cambio de pieza", precio: 60000 },
    { id: "abo", nombre: "Reparación abolladura", precio: 22000 },
    { id: "masilla", nombre: "Masilla y aparejos", precio: 10000 },
  ],
  techo: [
    { id: "pint", nombre: "Pintura completa", precio: 45000 },
    { id: "abo", nombre: "Reparación abolladura", precio: 35000 },
    { id: "pulido", nombre: "Pulido y encerado", precio: 12000 },
    { id: "masilla", nombre: "Masilla y aparejos", precio: 18000 },
  ],
  luneta: [
    { id: "cambio", nombre: "Cambio de luneta", precio: 55000 },
    { id: "sell", nombre: "Sellado / resina", precio: 18000 },
  ],
  parabrisas: [
    { id: "cambio", nombre: "Cambio de parabrisas", precio: 70000 },
    { id: "sell", nombre: "Sellado / resina", precio: 22000 },
  ],
  llanta: [
    { id: "pintx4", nombre: "Pintura x4", precio: 32000 },
    { id: "pintx1", nombre: "Pintura x1", precio: 9000 },
    { id: "cambio", nombre: "Cambio de llanta", precio: 28000 },
    { id: "rep", nombre: "Reparación", precio: 15000 },
  ],
  esp_i: [
    { id: "cambio", nombre: "Cambio de espejo", precio: 22000 },
    { id: "pint", nombre: "Pintura", precio: 8000 },
    { id: "rep", nombre: "Reparación carcasa", precio: 12000 },
  ],
  esp_d: [
    { id: "cambio", nombre: "Cambio de espejo", precio: 22000 },
    { id: "pint", nombre: "Pintura", precio: 8000 },
    { id: "rep", nombre: "Reparación carcasa", precio: 12000 },
  ],
  baul: [
    { id: "abo", nombre: "Reparación abolladura", precio: 30000 },
    { id: "chapa", nombre: "Chapa entera", precio: 80000 },
    { id: "pint", nombre: "Pintura 2 manos", precio: 40000 },
    { id: "cambio", nombre: "Cambio de pieza", precio: 110000 },
    { id: "masilla", nombre: "Masilla y aparejos", precio: 15000 },
  ],
};

const trabajosGen = [
  { id: "abo", nombre: "Reparación abolladura", precio: 28000 },
  { id: "chapa", nombre: "Chapa entera", precio: 85000 },
  { id: "pint", nombre: "Pintura 2 manos", precio: 40000 },
  { id: "cambio", nombre: "Cambio de pieza", precio: 90000 },
  { id: "masilla", nombre: "Masilla y aparejos", precio: 15000 },
  { id: "pulido", nombre: "Pulido y encerado", precio: 12000 },
];

const fmt = (n) => "$" + Math.round(n).toLocaleString("es-AR");

// ─── CSS ───────────────────────────────────────────────────────────────────
const css = `
@import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.7.0/dist/tabler-icons.min.css');
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');

*{box-sizing:border-box;margin:0;padding:0;}
:root{
  --ant:#2C2C2A;--ant2:#444441;--ant3:#5F5E5A;
  --antl:#F1EFE8;--antm:#D3D1C7;
  --yel:#EF9F27;--yell:#FAEEDA;--yeld:#633806;--yelm:#FAC775;
  --bg:#F7F6F1;
  --border:#E2E0D8;
  --radius-sm:6px;--radius-md:8px;--radius-lg:12px;
  --shadow:0 1px 3px rgba(44,44,42,.08);
}
body,#root{font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--ant);}

.app-wrap{max-width:680px;margin:0 auto;padding:1.25rem 1rem 3rem;}

/* HEADER */
.hdr{display:flex;align-items:center;gap:14px;padding:15px 20px;background:var(--ant);border-radius:var(--radius-lg);margin-bottom:1.25rem;box-shadow:0 2px 8px rgba(44,44,42,.18);}
.hdr-ic{font-size:26px;color:var(--yel);}
.htit{font-size:17px;font-weight:600;color:#F1EFE8;letter-spacing:-.01em;}
.hsub{font-size:12px;color:var(--antm);margin-top:2px;}
.hnr{margin-left:auto;text-align:right;}
.hnr span{font-size:11px;color:var(--antm);display:block;}
.hnr strong{font-size:15px;color:var(--yel);font-weight:600;font-family:'DM Mono',monospace;}

/* TABS */
.tabs{display:flex;gap:4px;margin-bottom:1.25rem;border-bottom:1px solid var(--border);padding-bottom:0;}
.tab{padding:8px 16px;font-size:13px;font-weight:500;color:var(--ant3);cursor:pointer;border:none;background:none;border-bottom:2px solid transparent;margin-bottom:-1px;font-family:'DM Sans',sans-serif;display:flex;align-items:center;gap:6px;transition:color .15s;}
.tab.act{color:var(--ant);border-bottom-color:var(--yel);}
.tab:hover:not(.act){color:var(--ant);}
.tab-badge{font-size:10px;background:var(--yel);color:var(--yeld);padding:1px 6px;border-radius:10px;font-weight:600;}

/* PANEL */
.pnl{display:none;}.pnl.act{display:block;}

/* SECTIONS */
.sec{margin-bottom:1.25rem;}
.slbl{font-size:11px;font-weight:600;letter-spacing:.07em;color:var(--ant3);text-transform:uppercase;margin-bottom:8px;display:flex;align-items:center;gap:6px;}

/* INPUTS */
input[type=text],input[type=number],select,textarea{
  border:1px solid var(--border);border-radius:var(--radius-md);
  padding:7px 10px;font-size:13px;font-family:'DM Sans',sans-serif;
  background:#fff;color:var(--ant);outline:none;transition:border-color .15s;
}
input[type=text]:focus,input[type=number]:focus,select:focus,textarea:focus{border-color:var(--ant);}

/* SEARCH ROW */
.sr{display:flex;gap:8px;}
.sr input{flex:1;}

/* BUTTONS */
.by{background:var(--yel);color:var(--yeld);border:none;border-radius:var(--radius-md);padding:0 16px;font-size:13px;cursor:pointer;height:36px;display:inline-flex;align-items:center;gap:6px;font-weight:600;font-family:'DM Sans',sans-serif;transition:background .15s;}
.by:hover{background:var(--yelm);}
.bd{background:var(--ant);color:#F1EFE8;border:none;border-radius:var(--radius-md);padding:0 14px;font-size:13px;cursor:pointer;height:36px;display:inline-flex;align-items:center;gap:6px;font-family:'DM Sans',sans-serif;transition:background .15s;}
.bd:hover{background:var(--ant2);}
.bo{background:none;border:1px solid var(--border);color:var(--ant);border-radius:var(--radius-md);padding:0 14px;font-size:13px;cursor:pointer;height:36px;display:inline-flex;align-items:center;gap:6px;font-family:'DM Sans',sans-serif;transition:background .15s,border-color .15s;}
.bo:hover{background:var(--antl);border-color:var(--antm);}
.btn-icon{background:none;border:none;cursor:pointer;padding:3px 5px;border-radius:4px;display:inline-flex;align-items:center;color:var(--ant3);transition:color .15s,background .15s;}
.btn-icon:hover{color:#791F1F;background:#FCEBEB;}

/* ALERT */
.alt{font-size:13px;padding:8px 12px;border-radius:var(--radius-md);margin-top:8px;display:none;}
.alt.show{display:block;}
.ai{background:var(--antl);color:var(--ant2);}
.ao{background:#EAF3DE;color:#27500A;}
.ae{background:#FCEBEB;color:#791F1F;}

/* VCARD */
.vc{display:none;align-items:center;gap:12px;background:#fff;border:1px solid var(--border);border-radius:var(--radius-lg);padding:12px 16px;margin-top:10px;}
.vc.show{display:flex;}
.vav{width:40px;height:40px;border-radius:50%;background:var(--antl);display:flex;align-items:center;justify-content:center;font-size:18px;color:var(--ant2);flex-shrink:0;}
.vpl{font-size:16px;font-weight:600;color:var(--ant);letter-spacing:.06em;font-family:'DM Mono',monospace;}
.vdt{font-size:12px;color:var(--ant3);margin-top:2px;}
.bdg{font-size:11px;padding:2px 8px;border-radius:var(--radius-md);font-weight:600;}
.bn{background:var(--yell);color:var(--yeld);}
.bk{background:#EAF3DE;color:#27500A;}

/* PIEZAS GRID */
.pg{display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:7px;}
.pb{background:#fff;border:1px solid var(--border);border-radius:var(--radius-md);padding:10px 8px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:5px;transition:border-color .15s,background .15s;font-family:'DM Sans',sans-serif;}
.pb:hover{border-color:var(--antm);background:var(--antl);}
.pb.sel{border:2px solid var(--ant);background:var(--antl);}
.pb.hw{border:2px solid var(--yel);background:var(--yell);}
.pb-ic{font-size:18px;line-height:1;}
.pnm{font-size:11px;font-weight:500;color:var(--ant);text-align:center;line-height:1.3;}
.pbdg{font-size:10px;background:var(--yel);color:var(--yeld);padding:1px 6px;border-radius:10px;font-weight:600;}

/* TRABAJOS PANEL */
.tpanel{background:#fff;border:1px solid var(--border);border-radius:var(--radius-lg);padding:.9rem 1.1rem;margin-bottom:1rem;}
.tph{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;}
.tpt{font-size:14px;font-weight:600;color:var(--ant);display:flex;align-items:center;gap:7px;}
.tgrid{display:grid;grid-template-columns:1fr 1fr;gap:7px;}
.tb{background:#fff;border:1px solid var(--border);border-radius:var(--radius-md);padding:9px 11px;cursor:pointer;display:flex;align-items:center;gap:9px;transition:border-color .15s,background .15s;text-align:left;font-family:'DM Sans',sans-serif;}
.tb:hover{border-color:var(--antm);background:var(--antl);}
.tb.sel{border:2px solid var(--ant);background:var(--antl);}
.tnm{font-size:13px;font-weight:500;color:var(--ant);}
.tpr{font-size:12px;color:var(--ant3);margin-top:1px;}
.tchk{color:var(--ant);font-size:13px;flex-shrink:0;}

/* DETALLE */
.dlist{border:1px solid var(--border);border-radius:var(--radius-md);overflow:hidden;background:#fff;}
.drow{display:flex;align-items:center;justify-content:space-between;padding:9px 12px;border-bottom:1px solid var(--border);}
.drow:last-child{border-bottom:none;}
.dlft{display:flex;flex-direction:column;gap:2px;flex:1;min-width:0;}
.dpz{font-size:11px;color:var(--ant3);}
.dtb{font-size:13px;font-weight:500;color:var(--ant);}
.drgt{display:flex;align-items:center;gap:6px;}
.dpr-wrap{display:flex;align-items:center;gap:3px;}
.dpr-lbl{font-size:11px;color:var(--ant3);}
.dpr-inp{width:88px;height:28px;font-size:13px;text-align:right;padding:0 6px;border-radius:var(--radius-sm);font-family:'DM Mono',monospace;}

/* DISCOUNT SLIDER */
.disc-row{display:flex;align-items:center;gap:10px;padding:10px 14px;background:var(--antl);border-radius:var(--radius-md);margin-top:8px;}
.disc-row label{font-size:13px;color:var(--ant2);font-weight:500;white-space:nowrap;}
.disc-row input[type=range]{flex:1;accent-color:var(--yel);}
.disc-val{font-size:14px;font-weight:600;color:var(--ant);min-width:36px;text-align:right;font-family:'DM Mono',monospace;}
.disc-amt{font-size:12px;color:var(--ant3);text-align:right;min-width:70px;}

/* TOTAL CARD */
.tot-card{display:flex;justify-content:space-between;align-items:center;padding:14px 18px;background:var(--ant);border-radius:var(--radius-md);margin-top:10px;}
.tot-l{display:flex;flex-direction:column;gap:2px;}
.tot-lbl{font-size:13px;color:var(--antm);font-weight:500;}
.tot-cnt{font-size:12px;color:var(--ant3);}
.tot-r{text-align:right;}
.tot-disc{font-size:12px;color:var(--ant3);text-decoration:line-through;font-family:'DM Mono',monospace;}
.tot-amt{font-size:26px;font-weight:600;color:var(--yel);font-family:'DM Mono',monospace;}

/* OBS */
.obs label{font-size:12px;color:var(--ant3);display:block;margin-bottom:6px;}
.obs textarea{width:100%;resize:vertical;min-height:56px;font-size:13px;}

/* ACTIONS */
.acts{display:flex;gap:8px;flex-wrap:wrap;}

/* EMPTY */
.empty{font-size:13px;color:var(--ant3);text-align:center;padding:20px;border:1px dashed var(--border);border-radius:var(--radius-md);background:#fff;}

/* PDF AREA */
.pdf-area{margin-top:1.25rem;}
.pdf-preview{background:#fff;border:1px solid var(--border);border-radius:var(--radius-lg);padding:24px;font-family:'DM Sans',sans-serif;}
.pdf-hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;padding-bottom:16px;border-bottom:2px solid var(--ant);}
.pdf-logo{font-size:18px;font-weight:600;color:var(--ant);}
.pdf-logo span{display:block;font-size:12px;font-weight:400;color:var(--ant3);margin-top:2px;}
.pdf-nro{text-align:right;font-size:13px;color:var(--ant3);}
.pdf-nro strong{display:block;font-size:16px;color:var(--ant);font-weight:600;font-family:'DM Mono',monospace;}
.pdf-veh{background:var(--antl);border-radius:6px;padding:10px 14px;margin-bottom:16px;font-size:13px;color:var(--ant2);}
.pdf-table{width:100%;border-collapse:collapse;font-size:13px;margin-bottom:16px;}
.pdf-table th{text-align:left;padding:6px 8px;background:var(--ant);color:#F1EFE8;font-weight:500;font-size:12px;}
.pdf-table td{padding:7px 8px;border-bottom:1px solid var(--antm);color:var(--ant);}
.pdf-table tr:last-child td{border-bottom:none;}
.pdf-totals{display:flex;justify-content:flex-end;}
.pdf-tot-box{width:220px;}
.pdf-tot-row{display:flex;justify-content:space-between;font-size:13px;padding:4px 0;color:var(--ant2);}
.pdf-tot-row.final{font-size:16px;font-weight:600;color:var(--ant);border-top:2px solid var(--ant);padding-top:8px;margin-top:4px;}
.pdf-obs{margin-top:16px;font-size:12px;color:var(--ant3);border-top:1px solid var(--antm);padding-top:12px;}
.pdf-footer{margin-top:20px;text-align:center;font-size:11px;color:#888780;}

/* HISTORIAL */
.hist-filter{display:flex;gap:8px;margin-bottom:1rem;}
.hist-filter input{flex:1;}
.hist-empty{font-size:13px;color:var(--ant3);text-align:center;padding:30px;border:1px dashed var(--border);border-radius:var(--radius-md);}
.hcard{background:#fff;border:1px solid var(--border);border-radius:var(--radius-lg);padding:12px 16px;margin-bottom:8px;box-shadow:var(--shadow);}
.hcard-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;}
.hcard-nro{font-size:13px;font-weight:600;color:var(--ant);display:flex;align-items:center;gap:6px;font-family:'DM Mono',monospace;}
.hcard-fecha{font-size:12px;color:var(--ant3);}
.hcard-veh{font-size:13px;color:var(--ant);margin-bottom:4px;}
.hcard-items{font-size:12px;color:var(--ant3);}
.hcard-foot{display:flex;align-items:center;justify-content:space-between;margin-top:8px;padding-top:8px;border-top:1px solid var(--border);}
.hcard-disc{font-size:12px;color:var(--ant3);}
.hcard-tot{font-size:15px;font-weight:600;color:var(--ant);font-family:'DM Mono',monospace;}

/* MODAL */
.modal-bg{position:fixed;inset:0;background:rgba(44,44,42,.55);display:flex;align-items:center;justify-content:center;z-index:100;}
.modal{background:#fff;border-radius:var(--radius-lg);border:1px solid var(--border);padding:1.5rem;width:340px;max-width:95%;box-shadow:0 8px 32px rgba(44,44,42,.22);}
.modal h3{font-size:15px;font-weight:600;color:var(--ant);margin-bottom:1rem;display:flex;align-items:center;gap:8px;}
.mf{margin-bottom:10px;}
.mf label{font-size:12px;color:var(--ant3);display:block;margin-bottom:4px;}
.mf input,.mf select{width:100%;font-size:13px;}
.mac{display:flex;gap:8px;margin-top:1rem;}
.merr{font-size:11px;color:#791F1F;margin-top:3px;}
`;

// ─── TOAST ─────────────────────────────────────────────────────────────────
function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((msg, type = "info") => {
    const id = Date.now();
    setToasts((p) => [...p, { id, msg, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3200);
  }, []);
  return { toasts, toast: { success: (m) => add(m, "ok"), error: (m) => add(m, "err"), info: (m) => add(m, "info"), warning: (m) => add(m, "warn") } };
}

function Toasts({ toasts }) {
  const colors = { ok: "#EAF3DE", err: "#FCEBEB", info: "#F1EFE8", warn: "#FAEEDA" };
  const textColors = { ok: "#27500A", err: "#791F1F", info: "#444441", warn: "#633806" };
  return (
    <div style={{ position: "fixed", top: 16, right: 16, zIndex: 200, display: "flex", flexDirection: "column", gap: 8 }}>
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{ background: colors[t.type], color: textColors[t.type], padding: "9px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, boxShadow: "0 2px 8px rgba(0,0,0,.12)", maxWidth: 280 }}
        >
          {t.msg}
        </div>
      ))}
    </div>
  );
}

// ─── MODAL VEHICULO ────────────────────────────────────────────────────────
function ModalVehiculo({ dominioInicial, onClose, onSave }) {
  const [form, setForm] = useState({ dominio: dominioInicial || "", marca: "", modelo: "", anio: "", color: "", titular: "" });
  const [errors, setErrors] = useState({});
  const modelos = form.marca ? modelosPM[form.marca] || [] : [];

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v, ...(k === "marca" ? { modelo: "" } : {}) }));

  const validate = () => {
    const e = {};
    if (!form.dominio || form.dominio.length < 6) e.dominio = "Mínimo 6 caracteres";
    if (!form.marca) e.marca = "Requerido";
    if (!form.modelo || form.modelo === "Elegí la marca primero") e.modelo = "Requerido";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    onSave({
      dominio: form.dominio.toUpperCase().trim(),
      marca: form.marca,
      modelo: form.modelo,
      anio: parseInt(form.anio) || new Date().getFullYear(),
      color: form.color.trim() || "Sin especificar",
      titular: form.titular.trim() || "Sin datos",
    });
  };

  return (
    <div className="modal-bg" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h3>🚗 Alta de vehículo</h3>
        <div className="mf">
          <label>Dominio *</label>
          <input value={form.dominio} onChange={(e) => set("dominio", e.target.value.toUpperCase())} maxLength={8} placeholder="ABC123" />
          {errors.dominio && <div className="merr">{errors.dominio}</div>}
        </div>
        <div className="mf">
          <label>Marca *</label>
          <select value={form.marca} onChange={(e) => set("marca", e.target.value)}>
            <option value="">Seleccionar...</option>
            {Object.keys(modelosPM).map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
          {errors.marca && <div className="merr">{errors.marca}</div>}
        </div>
        <div className="mf">
          <label>Modelo *</label>
          <select value={form.modelo} onChange={(e) => set("modelo", e.target.value)} disabled={!modelos.length}>
            <option value="">Elegí la marca primero</option>
            {modelos.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
          {errors.modelo && <div className="merr">{errors.modelo}</div>}
        </div>
        <div className="mf">
          <label>Año</label>
          <input type="number" value={form.anio} onChange={(e) => set("anio", e.target.value)} placeholder="2020" min={1970} max={2026} />
        </div>
        <div className="mf">
          <label>Color</label>
          <input value={form.color} onChange={(e) => set("color", e.target.value)} placeholder="Blanco, Rojo..." />
        </div>
        <div className="mf">
          <label>Titular</label>
          <input value={form.titular} onChange={(e) => set("titular", e.target.value)} placeholder="Nombre del propietario" />
        </div>
        <div className="mac">
          <button className="bo" onClick={onClose}>
            Cancelar
          </button>
          <button className="by" onClick={handleSave}>
            ✓ Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PDF PREVIEW ───────────────────────────────────────────────────────────
function PDFPreview({ nro, vehiculo, items, descuento, obs, onClose }) {
  const bruto = items.reduce((s, x) => s + x.precio, 0);
  const ahorro = Math.round((bruto * descuento) / 100);
  const neto = bruto - ahorro;
  const veh = vehiculo ? `${vehiculo.dominio} · ${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.anio} · ${vehiculo.color} · ${vehiculo.titular}` : "Sin vehículo asignado";
  const fecha = new Date().toLocaleDateString("es-AR");

  const handlePrint = () => {
    const html = document.getElementById("pdf-content-inner").innerHTML;
    const w = window.open("", "_blank", "width=800,height=600");
    w.document.write(`<html><head><title>Presupuesto #${String(nro).padStart(4, "0")}</title><style>
      *{box-sizing:border-box;margin:0;padding:0;font-family:Arial,sans-serif;}
      body{padding:32px;color:#2C2C2A;}
      .pdf-hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;padding-bottom:16px;border-bottom:2px solid #2C2C2A;}
      .pdf-logo{font-size:18px;font-weight:bold;} .pdf-logo span{display:block;font-size:12px;font-weight:400;color:#5F5E5A;margin-top:2px;}
      .pdf-nro{text-align:right;font-size:13px;color:#5F5E5A;} .pdf-nro strong{display:block;font-size:16px;color:#2C2C2A;font-weight:bold;}
      .pdf-veh{background:#F1EFE8;border-radius:6px;padding:10px 14px;margin-bottom:16px;font-size:13px;}
      table{width:100%;border-collapse:collapse;font-size:13px;margin-bottom:16px;}
      th{text-align:left;padding:6px 8px;background:#2C2C2A;color:#F1EFE8;}
      td{padding:7px 8px;border-bottom:1px solid #D3D1C7;}
      .pdf-totals{display:flex;justify-content:flex-end;} .pdf-tot-box{width:220px;}
      .pdf-tot-row{display:flex;justify-content:space-between;font-size:13px;padding:4px 0;}
      .pdf-tot-row.final{font-size:16px;font-weight:bold;border-top:2px solid #2C2C2A;padding-top:8px;margin-top:4px;}
      .pdf-obs{margin-top:16px;font-size:12px;color:#5F5E5A;border-top:1px solid #D3D1C7;padding-top:12px;}
      .pdf-footer{margin-top:20px;text-align:center;font-size:11px;color:#888780;}
      @media print{body{padding:16px;}}
    </style></head><body>${html}</body></html>`);
    w.document.close();
    setTimeout(() => w.print(), 400);
  };

  return (
    <div className="pdf-area">
      <div className="slbl">📄 Vista previa PDF — usá Ctrl+P para imprimir</div>
      <div className="pdf-preview">
        <div id="pdf-content-inner">
          <div className="pdf-hdr">
            <div className="pdf-logo">
              Taller Chapa &amp; Pintura<span>Sistema de presupuestos</span>
            </div>
            <div className="pdf-nro">
              <span>Fecha: {fecha}</span>
              <strong>#{String(nro).padStart(4, "0")}</strong>
            </div>
          </div>
          <div className="pdf-veh">
            <strong>Vehículo:</strong> {veh}
          </div>
          <table className="pdf-table">
            <thead>
              <tr>
                <th>Pieza</th>
                <th>Trabajo</th>
                <th style={{ textAlign: "right" }}>Precio</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, i) => (
                <tr key={i}>
                  <td>{it.piezaNombre}</td>
                  <td>{it.trabajoNombre}</td>
                  <td style={{ textAlign: "right" }}>{fmt(it.precio)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pdf-totals">
            <div className="pdf-tot-box">
              <div className="pdf-tot-row">
                <span>Subtotal</span>
                <span>{fmt(bruto)}</span>
              </div>
              {descuento > 0 && (
                <div className="pdf-tot-row">
                  <span>Descuento ({descuento}%)</span>
                  <span>-{fmt(ahorro)}</span>
                </div>
              )}
              <div className="pdf-tot-row final">
                <span>Total</span>
                <span>{fmt(neto)}</span>
              </div>
            </div>
          </div>
          {obs && (
            <div className="pdf-obs">
              <strong>Observaciones:</strong> {obs}
            </div>
          )}
          <div className="pdf-footer">Presupuesto válido por 15 días · Taller Chapa &amp; Pintura</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <button className="by" onClick={handlePrint}>
          🖨️ Imprimir / Guardar PDF
        </button>
        <button className="bo" onClick={onClose}>
          ✕ Cerrar
        </button>
      </div>
    </div>
  );
}

// ─── APP ───────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("nuevo");
  const [nro, setNro] = useState(1);
  const [dominio, setDominio] = useState("");
  const [vehiculosDB, setVehiculosDB] = useState(vehiculosDB_inicial);
  const [vActual, setVActual] = useState(null);
  const [piezaSel, setPiezaSel] = useState(null);
  const [items, setItems] = useState([]);
  const [descuento, setDescuento] = useState(0);
  const [obs, setObs] = useState("");
  const [historial, setHistorial] = useState([]);
  const [histSearch, setHistSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [pdfVisible, setPdfVisible] = useState(false);
  const [alertState, setAlertState] = useState({ msg: "", type: "" });
  const alertTimer = useRef(null);
  const { toasts, toast } = useToast();

  const alerta = (msg, type) => {
    setAlertState({ msg, type });
    clearTimeout(alertTimer.current);
    alertTimer.current = setTimeout(() => setAlertState({ msg: "", type: "" }), 3200);
  };

  // ── Cálculos ─────────────────────────────────────────────────────────────
  const bruto = useMemo(() => items.reduce((s, x) => s + x.precio, 0), [items]);
  const ahorro = useMemo(() => Math.round((bruto * descuento) / 100), [bruto, descuento]);
  const neto = bruto - ahorro;

  // ── Vehículo ──────────────────────────────────────────────────────────────
  const buscar = () => {
    const val = dominio.trim().toUpperCase();
    if (!val) {
      alerta("Ingresá un dominio para buscar.", "e");
      return;
    }
    const v = vehiculosDB.find((x) => x.dominio === val);
    if (v) {
      setVActual({ ...v, esNuevo: false });
      alerta("Vehículo cargado.", "o");
    } else {
      setVActual(null);
      alerta('No encontrado. Usá "Nuevo" para darlo de alta.', "i");
    }
  };

  const handleSaveVehiculo = (v) => {
    if (vehiculosDB.find((x) => x.dominio === v.dominio)) {
      toast.error("Ya existe ese dominio.");
      return;
    }
    setVehiculosDB((p) => [...p, v]);
    setDominio(v.dominio);
    setVActual({ ...v, esNuevo: true });
    setModalOpen(false);
    toast.success("Vehículo dado de alta correctamente.");
  };

  // ── Piezas / Trabajos ─────────────────────────────────────────────────────
  const toggleTrab = (piezaId, trabajoId) => {
    const key = piezaId + "|" + trabajoId;
    const idx = items.findIndex((x) => x.key === key);
    if (idx >= 0) {
      setItems((p) => p.filter((_, i) => i !== idx));
    } else {
      const pieza = piezas.find((x) => x.id === piezaId);
      const lista = trabajosPP[piezaId] || trabajosGen;
      const trab = lista.find((x) => x.id === trabajoId);
      setItems((p) => [...p, { key, piezaId, trabajoId, piezaNombre: pieza.nombre, trabajoNombre: trab.nombre, precio: trab.precio, precioBase: trab.precio }]);
    }
  };

  const editarPrecio = (idx, val) => {
    const v = Math.max(0, parseInt(val) || 0);
    setItems((p) => p.map((it, i) => (i === idx ? { ...it, precio: v } : it)));
  };

  // ── Guardar y PDF ──────────────────────────────────────────────────────────
  const guardarYPDF = () => {
    if (!items.length) {
      toast.error("Seleccioná al menos un trabajo.");
      return;
    }
    const reg = {
      nro: String(nro).padStart(4, "0"),
      fecha: new Date().toLocaleDateString("es-AR"),
      vehiculo: vActual ? { ...vActual } : null,
      items: items.map((x) => ({ ...x })),
      descuento,
      bruto,
      ahorro,
      neto,
      obs,
    };
    setHistorial((p) => [reg, ...p]);
    setPdfVisible(true);
    toast.success("Presupuesto guardado correctamente.");
    setTimeout(() => document.getElementById("pdf-scroll-anchor")?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  // ── Limpiar ───────────────────────────────────────────────────────────────
  const limpiar = () => {
    setItems([]);
    setPiezaSel(null);
    setVActual(null);
    setDominio("");
    setObs("");
    setDescuento(0);
    setPdfVisible(false);
    setNro((p) => p + 1);
    setAlertState({ msg: "", type: "" });
    toast.info("Formulario reiniciado.");
  };

  // ── Historial filtrado ─────────────────────────────────────────────────────
  const histFiltrado = useMemo(() => {
    const q = histSearch.toLowerCase();
    return historial.filter((h) => {
      const veh = h.vehiculo ? `${h.vehiculo.dominio} ${h.vehiculo.marca} ${h.vehiculo.modelo}`.toLowerCase() : "";
      return !q || veh.includes(q) || h.nro.includes(q);
    });
  }, [historial, histSearch]);

  // ── Trabajos de la pieza seleccionada ─────────────────────────────────────
  const listaTrab = piezaSel ? trabajosPP[piezaSel] || trabajosGen : [];

  return (
    <>
      <style>{css}</style>
      <Toasts toasts={toasts} />
      <div className="app-wrap">
        {/* HEADER */}
        <div className="hdr">
          <i className="ti ti-car-crash hdr-ic" />
          <div>
            <div className="htit">Taller Chapa &amp; Pintura</div>
            <div className="hsub">Sistema de presupuestos</div>
          </div>
          <div className="hnr">
            <span>Nro. presupuesto</span>
            <strong>#{String(nro).padStart(4, "0")}</strong>
          </div>
        </div>

        {/* TABS */}
        <div className="tabs">
          <button className={`tab${tab === "nuevo" ? " act" : ""}`} onClick={() => setTab("nuevo")}>
            <i className="ti ti-file-plus" /> Nuevo presupuesto
          </button>
          <button className={`tab${tab === "historial" ? " act" : ""}`} onClick={() => setTab("historial")}>
            <i className="ti ti-history" /> Historial
            {historial.length > 0 && <span className="tab-badge">{historial.length}</span>}
          </button>
        </div>

        {/* ── PANEL: NUEVO ── */}
        <div className={`pnl${tab === "nuevo" ? " act" : ""}`}>
          {/* Vehículo */}
          <div className="sec">
            <div className="slbl">
              <i className="ti ti-car" /> Vehículo
            </div>
            <div className="sr">
              <input
                type="text"
                value={dominio}
                onChange={(e) => setDominio(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && buscar()}
                placeholder="Dominio (ej: ABC123)"
                maxLength={8}
              />
              <button className="by" onClick={buscar}>
                <i className="ti ti-search" /> Buscar
              </button>
              <button className="bd" onClick={() => setModalOpen(true)}>
                <i className="ti ti-plus" /> Nuevo
              </button>
            </div>
            {alertState.msg && <div className={`alt show ${alertState.type === "o" ? "ao" : alertState.type === "e" ? "ae" : "ai"}`}>{alertState.msg}</div>}
            {vActual && (
              <div className="vc show">
                <div className="vav">🚗</div>
                <div style={{ flex: 1 }}>
                  <div className="vpl">{vActual.dominio}</div>
                  <div className="vdt">
                    {vActual.marca} {vActual.modelo} {vActual.anio} · {vActual.color} · {vActual.titular}
                  </div>
                </div>
                {vActual.esNuevo ? <span className="bdg bn">NUEVO</span> : <span className="bdg bk">✓ Encontrado</span>}
              </div>
            )}
          </div>

          {/* Paso 1 — Pieza */}
          <div className="sec">
            <div className="slbl">
              <i className="ti ti-components" /> Paso 1 — seleccioná la pieza
            </div>
            <div className="pg">
              {piezas.map((p) => {
                const cnt = items.filter((x) => x.piezaId === p.id).length;
                const isSel = p.id === piezaSel;
                return (
                  <button key={p.id} className={`pb${isSel ? " sel" : ""}${cnt > 0 ? " hw" : ""}`} onClick={() => setPiezaSel(isSel ? null : p.id)}>
                    <span className="pb-ic">{p.icono}</span>
                    <div className="pnm">{p.nombre}</div>
                    {cnt > 0 && <span className="pbdg">{cnt}</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Paso 2 — Trabajos */}
          {piezaSel && (
            <div>
              <div className="slbl">
                <i className="ti ti-tool" /> Paso 2 — tipo de trabajo
              </div>
              <div className="tpanel">
                <div className="tph">
                  <div className="tpt">
                    <span>{piezas.find((p) => p.id === piezaSel)?.icono}</span>
                    <span>{piezas.find((p) => p.id === piezaSel)?.nombre}</span>
                  </div>
                  <button className="bo" style={{ height: 28, fontSize: 12 }} onClick={() => setPiezaSel(null)}>
                    ✕ Cerrar
                  </button>
                </div>
                <div className="tgrid">
                  {listaTrab.map((t) => {
                    const key = piezaSel + "|" + t.id;
                    const isSel = items.some((x) => x.key === key);
                    return (
                      <button key={t.id} className={`tb${isSel ? " sel" : ""}`} onClick={() => toggleTrab(piezaSel, t.id)}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="tnm">{t.nombre}</div>
                          <div className="tpr">{fmt(t.precio)}</div>
                        </div>
                        {isSel && <span className="tchk">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Detalle */}
          <div className="sec">
            <div className="slbl">
              <i className="ti ti-receipt" /> Detalle — precios editables
            </div>
            {items.length === 0 ? (
              <div className="empty">👆 Elegí una pieza y los trabajos a realizar</div>
            ) : (
              <div className="dlist">
                {items.map((it, i) => (
                  <div key={it.key} className="drow">
                    <div className="dlft">
                      <div className="dpz">{it.piezaNombre}</div>
                      <div className="dtb">{it.trabajoNombre}</div>
                    </div>
                    <div className="drgt">
                      <div className="dpr-wrap">
                        <span className="dpr-lbl">$</span>
                        <input className="dpr-inp" type="number" value={Math.round(it.precio)} min={0} step={100} onChange={(e) => editarPrecio(i, e.target.value)} />
                      </div>
                      <button className="btn-icon" onClick={() => toggleTrab(it.piezaId, it.trabajoId)} title="Quitar">
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Descuento */}
            <div className="disc-row">
              <label>🏷️ Descuento</label>
              <input type="range" min={0} max={50} step={1} value={descuento} onChange={(e) => setDescuento(parseInt(e.target.value))} />
              <span className="disc-val">{descuento}%</span>
              <span className="disc-amt">{ahorro > 0 ? `-${fmt(ahorro)}` : ""}</span>
            </div>

            {/* Total */}
            <div className="tot-card">
              <div className="tot-l">
                <div className="tot-lbl">Total estimado</div>
                <div className="tot-cnt">
                  {items.length} ítem{items.length !== 1 ? "s" : ""}
                </div>
              </div>
              <div className="tot-r">
                {descuento > 0 && <div className="tot-disc">{fmt(bruto)}</div>}
                <div className="tot-amt">{fmt(neto)}</div>
              </div>
            </div>
          </div>

          {/* Observaciones */}
          <div className="sec obs">
            <label>📝 Observaciones</label>
            <textarea value={obs} onChange={(e) => setObs(e.target.value)} placeholder="Plazos, condiciones, notas para el cliente..." />
          </div>

          {/* Acciones */}
          <div className="acts">
            <button className="by" onClick={guardarYPDF}>
              <i className="ti ti-file-download" /> Guardar y exportar PDF
            </button>
            <button className="bo" onClick={limpiar}>
              <i className="ti ti-refresh" /> Limpiar
            </button>
          </div>

          {/* PDF Preview */}
          <div id="pdf-scroll-anchor" />
          {pdfVisible && <PDFPreview nro={nro} vehiculo={vActual} items={items} descuento={descuento} obs={obs} onClose={() => setPdfVisible(false)} />}
        </div>

        {/* ── PANEL: HISTORIAL ── */}
        <div className={`pnl${tab === "historial" ? " act" : ""}`}>
          <div className="hist-filter">
            <input type="text" value={histSearch} onChange={(e) => setHistSearch(e.target.value)} placeholder="Buscar por dominio, marca o número..." />
            {histSearch && (
              <button className="bo" onClick={() => setHistSearch("")}>
                ✕
              </button>
            )}
          </div>
          {histFiltrado.length === 0 ? (
            <div className="hist-empty">{historial.length ? "Sin resultados para esa búsqueda." : 'Todavía no hay presupuestos guardados.\nGenerá uno desde "Nuevo presupuesto".'}</div>
          ) : (
            histFiltrado.map((h, i) => {
              const veh = h.vehiculo ? `${h.vehiculo.dominio} · ${h.vehiculo.marca} ${h.vehiculo.modelo} ${h.vehiculo.anio}` : "Sin vehículo";
              const resumen =
                h.items
                  .map((x) => `${x.piezaNombre} — ${x.trabajoNombre}`)
                  .slice(0, 3)
                  .join(", ") + (h.items.length > 3 ? ` +${h.items.length - 3} más` : "");
              return (
                <div key={i} className="hcard">
                  <div className="hcard-hdr">
                    <div className="hcard-nro">📄 Presupuesto #{h.nro}</div>
                    <div className="hcard-fecha">{h.fecha}</div>
                  </div>
                  <div className="hcard-veh">🚗 {veh}</div>
                  <div className="hcard-items">{resumen}</div>
                  <div className="hcard-foot">
                    <div className="hcard-disc">{h.descuento > 0 ? `Descuento ${h.descuento}% aplicado` : ""}</div>
                    <div className="hcard-tot">{fmt(h.neto)}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* MODAL */}
      {modalOpen && <ModalVehiculo dominioInicial={dominio} onClose={() => setModalOpen(false)} onSave={handleSaveVehiculo} />}
    </>
  );
}
