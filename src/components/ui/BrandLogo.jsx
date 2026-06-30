// src/components/ui/BrandLogo.jsx

import { useState } from "react";
import { getLogoUrl } from "@/utils/brandLogoMap";

export function BrandLogo({ marca = "", className = "w-5 h-5", size }) {
  const [errorCarga, setErrorCarga] = useState(false);
  const logoUrl = getLogoUrl(marca);
  const style = size ? { width: size, height: size } : undefined;
  const inicial = marca.charAt(0).toUpperCase();

  // Debug: ver qué URL se está intentando cargar
  // console.log(`[BrandLogo] marca="${marca}" → url="${logoUrl}"`);

  if (!logoUrl || errorCarga) {
    return (
      <span className={`flex items-center justify-center font-bold text-antm select-none ${className}`} style={style} title={marca}>
        {inicial}
      </span>
    );
  }

  return (
    <img
      src={logoUrl}
      alt={marca}
      className={`object-contain ${className}`}
      style={style}
      onError={(e) => {
        console.warn(`[BrandLogo] No se pudo cargar: ${e.currentTarget.src}`);
        setErrorCarga(true);
      }}
      loading="lazy"
    />
  );
}
