// src/components/ui/BrandLogo.jsx
//
// Logos SVG monocromáticos de marcas de autos.
// Todos usan viewBox="0 0 40 40" y fill/stroke="currentColor".
// Uso: <BrandLogo marca="toyota" className="w-6 h-6 text-ant" />

// ── Logos individuales ────────────────────────────────────────────────────

// Chevrolet — bowtie clásico con vaciado interior
function Chevrolet() {
  return (
    <svg viewBox="0 0 40 40" fill="currentColor">
      <path
        fillRule="evenodd"
        d="
        M0 15 L17 15 L15.5 25 L0 25 Z
        M2 17 L13 17 L11.8 23 L2 23 Z
        M21 15 L40 15 L40 25 L22.5 25 Z
        M25.5 17 L38 17 L38 23 L27 23 Z
      "
      />
    </svg>
  );
}

// Citroën — doble chevron
function Citroen() {
  return (
    <svg viewBox="0 0 40 40" fill="currentColor">
      <path d="M20 5 L37 16.5 L34.5 20 L20 10 L5.5 20 L3 16.5 Z" />
      <path d="M20 18 L37 29.5 L34.5 33 L20 23 L5.5 33 L3 29.5 Z" />
    </svg>
  );
}

// Fiat — círculo con escudo interior y travesaño
function Fiat() {
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2.2">
      <ellipse cx="20" cy="20" rx="17" ry="17" />
      <ellipse cx="20" cy="20" rx="11" ry="11" />
      {/* Cruz interior */}
      <line x1="20" y1="9" x2="20" y2="31" strokeWidth="2" />
      <line x1="9" y1="20" x2="31" y2="20" strokeWidth="2" />
    </svg>
  );
}

// Ford — óvalo clásico (sin texto)
function Ford() {
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2.5">
      <ellipse cx="20" cy="20" rx="18" ry="13" />
      <ellipse cx="20" cy="20" rx="11" ry="7" />
    </svg>
  );
}

// Honda — H bold
function Honda() {
  return (
    <svg viewBox="0 0 40 40" fill="currentColor">
      <rect x="7" y="7" width="5.5" height="26" />
      <rect x="27.5" y="7" width="5.5" height="26" />
      <rect x="7" y="17" width="26" height="6" />
    </svg>
  );
}

// Peugeot — escudo con arco superior (basado en su crest)
function Peugeot() {
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2.2">
      {/* Escudo */}
      <path d="M20 3 C20 3 33 7 33 14 L33 28 L20 37 L7 28 L7 14 C7 7 20 3 20 3 Z" />
      {/* León simplificado: línea diagonal + cabeza */}
      <circle cx="20" cy="13" r="4" fill="currentColor" stroke="none" />
      <path d="M16 17 L20 30" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

// Renault — rombo (su logo actual)
function Renault() {
  return (
    <svg viewBox="0 0 40 40" fill="currentColor">
      <path
        fillRule="evenodd"
        d="
        M20 1 L39 20 L20 39 L1 20 Z
        M20 7 L33 20 L20 33 L7 20 Z
      "
      />
      {/* Línea diagonal interior del rombo de Renault */}
      <path d="M14 20 L20 13 L26 20 L20 27 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

// Toyota — tres óvalos superpuestos
function Toyota() {
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2">
      {/* Óvalo exterior */}
      <ellipse cx="20" cy="22" rx="18" ry="11" />
      {/* Óvalo horizontal interior */}
      <ellipse cx="20" cy="22" rx="11" ry="6" />
      {/* Óvalo vertical interior */}
      <ellipse cx="20" cy="20" rx="5.5" ry="14" />
    </svg>
  );
}

// Volkswagen — VW en círculo
function Volkswagen() {
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="20" cy="20" r="17.5" />
      {/* V */}
      <path d="M14 10 L20 20 L26 10" strokeLinecap="round" strokeLinejoin="round" />
      {/* W */}
      <path d="M10 21 L14.5 31 L20 24 L25.5 31 L30 21" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Default — auto genérico (para marcas no reconocidas)
function DefaultCar() {
  return (
    <svg viewBox="0 0 40 40" fill="currentColor">
      <path
        d="
        M8 24
        L9.5 17
        L13 12
        L27 12
        L30.5 17
        L32 24
        L32 28
        L8 28 Z
      "
      />
      {/* Ventanas */}
      <path
        fillRule="evenodd"
        d="
        M14 14 L17 14 L17 21 L12 21 L12.5 16 Z
        M19 14 L26 14 L27.5 16 L28 21 L19 21 Z
      "
        fill="white"
        opacity="0.5"
      />
      {/* Ruedas */}
      <circle cx="13.5" cy="28" r="4.5" />
      <circle cx="13.5" cy="28" r="2" fill="white" />
      <circle cx="26.5" cy="28" r="4.5" />
      <circle cx="26.5" cy="28" r="2" fill="white" />
    </svg>
  );
}

// ── Mapa normalizado ──────────────────────────────────────────────────────
const LOGOS = {
  chevrolet: Chevrolet,
  citroën: Citroen,
  citroen: Citroen,
  fiat: Fiat,
  ford: Ford,
  honda: Honda,
  peugeot: Peugeot,
  renault: Renault,
  toyota: Toyota,
  volkswagen: Volkswagen,
  vw: Volkswagen,
};

// ── Componente público ────────────────────────────────────────────────────
/**
 * <BrandLogo marca="toyota" className="w-6 h-6 text-ant" />
 * Si la marca no está en el mapa, muestra el auto genérico.
 */
export function BrandLogo({ marca = "", className = "w-7 h-7" }) {
  const key = marca.toLowerCase().trim();
  const Logo = LOGOS[key] ?? DefaultCar;
  return <Logo className={className} />;
}

export default BrandLogo;
