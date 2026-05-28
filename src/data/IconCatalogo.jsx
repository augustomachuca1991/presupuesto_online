// src/data/piezasTrabajos.js
// Cuando conectes Supabase, esto puede venir de tablas `piezas` y `trabajos`

const IconCapot = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 0 1 7.5 5.25h9a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-9Z" />
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

const IconPulido = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
    />
  </svg>
);

export const MAPA_ICONOS = {
  Capot: <IconCapot />,
  "Paragolpes delantero": <IconParagolpes />,
  "Paragolpes trasero": <IconParagolpes />,
  "Guardabarro del. izq.": <IconGuardabarroDelIzq />,
  "Guardabarro del. der.": <IconGuardabarroDelDer />,
  "Guardabarro tra. izq.": <IconGuardabarroTraIzq />,
  "Guardabarro tra. der.": <IconGuardabarroTraDer />,
  "Puerta del. izq.": <IconPuerta />,
  "Puerta del. der.": <IconPuerta />,
  "Puerta tra. izq.": <IconPuerta />,
  "Puerta tra. der.": <IconPuerta />,
  Techo: <IconTecho />,
  "Baúl / Compuerta": <IconBaul />,
  Luneta: <IconLuneta />,
  Parabrisas: <IconParabrisas />,
  "Espejo izq.": <IconEspejoIzq />,
  "Espejo der.": <IconEspejoDer />,
  Llantas: <IconLlanta />,
  Pulido: <IconPulido />,
};
