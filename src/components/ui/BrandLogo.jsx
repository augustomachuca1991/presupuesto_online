// src/components/ui/BrandLogo.jsx

import { useState } from "react";
import { getLogoUrl } from "@/utils/brandLogoMap";

const _brokenUrls = new Set();

export function BrandLogo({ marca = "", className = "w-5 h-5", size }) {
  const [errorCarga, setErrorCarga] = useState(false);
  const logoUrl = getLogoUrl(marca);
  const style = size ? { width: size, height: size } : undefined;
  const inicial = marca.charAt(0).toUpperCase();

  if (!logoUrl || errorCarga || _brokenUrls.has(logoUrl)) {
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
      onError={() => {
        _brokenUrls.add(logoUrl);
        setErrorCarga(true);
      }}
      loading="lazy"
    />
  );
}
