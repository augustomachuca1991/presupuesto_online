// src/data/piezasTrabajos.js
// Cuando conectes Supabase, esto puede venir de tablas `piezas` y `trabajos`

const IconCapot = () => (
  <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" width="22" height="22">
    <path d="M4 22 C6 16, 10 13, 18 12 C26 13, 30 16, 32 22 Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M4 22 L32 22 L30 26 L6 26 Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M10 22 C11 17, 14 14, 18 13 C22 14, 25 17, 26 22" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    <line x1="4" y1="22" x2="32" y2="22" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

const IconParagolpes = () => (
  <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" width="22" height="22">
    <rect x="4" y="13" width="28" height="8" rx="3" stroke="currentColor" strokeWidth="1.8" />
    <rect x="7" y="21" width="22" height="4" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
    <rect x="6" y="13" width="4" height="3" rx="1" stroke="currentColor" strokeWidth="1.2" />
    <rect x="26" y="13" width="4" height="3" rx="1" stroke="currentColor" strokeWidth="1.2" />
    <line x1="15" y1="13" x2="15" y2="21" stroke="currentColor" strokeWidth="1" />
    <line x1="21" y1="13" x2="21" y2="21" stroke="currentColor" strokeWidth="1" />
  </svg>
);

const IconGuardabarroDelIzq = () => (
  <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" width="22" height="22">
    <path d="M24 8 C18 8, 10 10, 8 14 L8 24 C10 26, 14 27, 18 27 L24 27" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M24 8 L28 8 L28 27 L24 27" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <circle cx="13" cy="27" r="3.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 18 C9 16, 11 15, 14 15" stroke="currentColor" strokeWidth="1.1" />
  </svg>
);

const IconGuardabarroDelDer = () => (
  <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" width="22" height="22">
    <path d="M12 8 C18 8, 26 10, 28 14 L28 24 C26 26, 22 27, 18 27 L12 27" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M12 8 L8 8 L8 27 L12 27" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <circle cx="23" cy="27" r="3.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M28 18 C27 16, 25 15, 22 15" stroke="currentColor" strokeWidth="1.1" />
  </svg>
);

const IconGuardabarroTraIzq = () => (
  <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" width="22" height="22">
    <path d="M24 9 C20 9, 14 10, 10 13 C8 16, 8 20, 8 24 L8 27 L24 27" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M24 9 L28 9 L28 27 L24 27" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <circle cx="14" cy="27" r="3.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 20 C9 22, 10 24, 12 25" stroke="currentColor" strokeWidth="1.1" />
  </svg>
);

const IconGuardabarroTraDer = () => (
  <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" width="22" height="22">
    <path d="M12 9 C16 9, 22 10, 26 13 C28 16, 28 20, 28 24 L28 27 L12 27" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M12 9 L8 9 L8 27 L12 27" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <circle cx="22" cy="27" r="3.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M28 20 C27 22, 26 24, 24 25" stroke="currentColor" strokeWidth="1.1" />
  </svg>
);

const IconPuerta = () => (
  <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" width="22" height="22">
    <rect x="6" y="7" width="24" height="22" rx="2" stroke="currentColor" strokeWidth="1.8" />
    <rect x="9" y="10" width="18" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
    <circle cx="24" cy="20" r="1.8" stroke="currentColor" strokeWidth="1.3" />
    <line x1="6" y1="19" x2="30" y2="19" stroke="currentColor" strokeWidth="1" />
  </svg>
);

const IconTecho = () => (
  <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" width="22" height="22">
    <path d="M6 20 C8 14, 12 11, 18 11 C24 11, 28 14, 30 20" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <line x1="6" y1="20" x2="30" y2="20" stroke="currentColor" strokeWidth="1.8" />
    <line x1="6" y1="20" x2="6" y2="25" stroke="currentColor" strokeWidth="1.8" />
    <line x1="30" y1="20" x2="30" y2="25" stroke="currentColor" strokeWidth="1.8" />
    <line x1="6" y1="25" x2="30" y2="25" stroke="currentColor" strokeWidth="1.4" />
    <path d="M10 20 C11 15, 14 12, 18 12 C22 12, 25 15, 26 20" stroke="currentColor" strokeWidth="1" />
  </svg>
);

const IconBaul = () => (
  <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" width="22" height="22">
    <path d="M6 20 C8 16, 12 14, 18 14 C24 14, 28 16, 30 20 L30 26 L6 26 Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <line x1="6" y1="20" x2="30" y2="20" stroke="currentColor" strokeWidth="1.2" />
    <path d="M12 20 C13 17, 15 15, 18 15 C21 15, 23 17, 24 20" stroke="currentColor" strokeWidth="1" />
    <line x1="15" y1="22" x2="21" y2="22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const IconLuneta = () => (
  <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" width="22" height="22">
    <path d="M6 22 L10 14 L26 14 L30 22 Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M8 22 L11 15 L25 15 L28 22" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
    <line x1="6" y1="22" x2="30" y2="22" stroke="currentColor" strokeWidth="1.5" />
    <line x1="13" y1="14" x2="11" y2="22" stroke="currentColor" strokeWidth="0.9" />
    <line x1="18" y1="14" x2="18" y2="22" stroke="currentColor" strokeWidth="0.9" />
    <line x1="23" y1="14" x2="25" y2="22" stroke="currentColor" strokeWidth="0.9" />
  </svg>
);

const IconParabrisas = () => (
  <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" width="22" height="22">
    <path d="M6 24 L10 13 L26 13 L30 24 Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M8 24 L11 14 L25 14 L28 24" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
    <line x1="6" y1="24" x2="30" y2="24" stroke="currentColor" strokeWidth="1.5" />
    <path d="M10 22 Q18 20 26 22" stroke="currentColor" strokeWidth="1.2" fill="none" />
    <path d="M10 19 Q18 17 26 19" stroke="currentColor" strokeWidth="0.9" fill="none" />
  </svg>
);

const IconEspejoIzq = () => (
  <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" width="22" height="22">
    <path d="M20 14 C16 14, 12 16, 11 19 L11 23 C12 25, 15 26, 18 26 L22 26 L22 14 Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <line x1="22" y1="14" x2="26" y2="17" stroke="currentColor" strokeWidth="1.5" />
    <line x1="22" y1="20" x2="26" y2="20" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const IconEspejoDer = () => (
  <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" width="22" height="22">
    <path d="M16 14 C20 14, 24 16, 25 19 L25 23 C24 25, 21 26, 18 26 L14 26 L14 14 Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <line x1="14" y1="14" x2="10" y2="17" stroke="currentColor" strokeWidth="1.5" />
    <line x1="14" y1="20" x2="10" y2="20" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const IconLlanta = () => (
  <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" width="22" height="22">
    <circle cx="18" cy="18" r="12" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="18" cy="18" r="7" stroke="currentColor" strokeWidth="1.4" />
    <circle cx="18" cy="18" r="2.5" stroke="currentColor" strokeWidth="1.4" />
    <line x1="18" y1="11" x2="18" y2="15" stroke="currentColor" strokeWidth="1.2" />
    <line x1="18" y1="21" x2="18" y2="25" stroke="currentColor" strokeWidth="1.2" />
    <line x1="11" y1="18" x2="15" y2="18" stroke="currentColor" strokeWidth="1.2" />
    <line x1="21" y1="18" x2="25" y2="18" stroke="currentColor" strokeWidth="1.2" />
    <line x1="13" y1="13" x2="15.5" y2="15.5" stroke="currentColor" strokeWidth="1.2" />
    <line x1="20.5" y1="20.5" x2="23" y2="23" stroke="currentColor" strokeWidth="1.2" />
    <line x1="23" y1="13" x2="20.5" y2="15.5" stroke="currentColor" strokeWidth="1.2" />
    <line x1="15.5" y1="20.5" x2="13" y2="23" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

export const piezas = [
  { id: "capot", nombre: "Capot", icono: <IconCapot /> },
  { id: "pg_del", nombre: "Paragolpes del.", icono: <IconParagolpes /> },
  { id: "pg_tra", nombre: "Paragolpes tra.", icono: <IconParagolpes /> },
  { id: "gb_di", nombre: "Guardab. del. izq.", icono: <IconGuardabarroDelIzq /> },
  { id: "gb_dd", nombre: "Guardab. del. der.", icono: <IconGuardabarroDelDer /> },
  { id: "gb_ti", nombre: "Guardab. tra. izq.", icono: <IconGuardabarroTraIzq /> },
  { id: "gb_td", nombre: "Guardab. tra. der.", icono: <IconGuardabarroTraDer /> },
  { id: "pu_di", nombre: "Puerta del. izq.", icono: <IconPuerta /> },
  { id: "pu_dd", nombre: "Puerta del. der.", icono: <IconPuerta /> },
  { id: "pu_ti", nombre: "Puerta tra. izq.", icono: <IconPuerta /> },
  { id: "pu_td", nombre: "Puerta tra. der.", icono: <IconPuerta /> },
  { id: "techo", nombre: "Techo", icono: <IconTecho /> },
  { id: "baul", nombre: "Baúl / Compuerta", icono: <IconBaul /> },
  { id: "luneta", nombre: "Luneta", icono: <IconLuneta /> },
  { id: "parabrisas", nombre: "Parabrisas", icono: <IconParabrisas /> },
  { id: "esp_i", nombre: "Espejo izq.", icono: <IconEspejoIzq /> },
  { id: "esp_d", nombre: "Espejo der.", icono: <IconEspejoDer /> },
  { id: "llanta", nombre: "Llantas", icono: <IconLlanta /> },
];

// Trabajos específicos por pieza. Si la pieza no aparece acá, se usa `trabajosGenericos`
export const trabajosPorPieza = {
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

// Fallback para piezas sin trabajos específicos
export const trabajosGenericos = [
  { id: "abo", nombre: "Reparación abolladura", precio: 28000 },
  { id: "chapa", nombre: "Chapa entera", precio: 85000 },
  { id: "pint", nombre: "Pintura 2 manos", precio: 40000 },
  { id: "cambio", nombre: "Cambio de pieza", precio: 90000 },
  { id: "masilla", nombre: "Masilla y aparejos", precio: 15000 },
  { id: "pulido", nombre: "Pulido y encerado", precio: 12000 },
];

/** Devuelve los trabajos de una pieza, o el fallback genérico */
export const getTrabajosDePieza = (piezaId) => trabajosPorPieza[piezaId] ?? trabajosGenericos;
