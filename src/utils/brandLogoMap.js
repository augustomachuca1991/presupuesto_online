// src/utils/brandLogoMap.js
//
// Importa los SVGs como módulos desde src/assets/logos-autos/.
// Vite los procesa y genera las URLs correctas en cualquier entorno.

import audi from "@/assets/logos-autos/audi.svg";
import bmw from "@/assets/logos-autos/bmw.svg";
import chevrolet from "@/assets/logos-autos/chevrolet.svg";
import citroen from "@/assets/logos-autos/citroen.svg";
import fiat from "@/assets/logos-autos/fiat.svg";
import ford from "@/assets/logos-autos/ford.svg";
import honda from "@/assets/logos-autos/honda.svg";
import hyundai from "@/assets/logos-autos/hyundai.svg";
import jeep from "@/assets/logos-autos/jeep.svg";
import nissan from "@/assets/logos-autos/nissan.svg";
import peugeot from "@/assets/logos-autos/peugeot.svg";
import porsche from "@/assets/logos-autos/porsche.svg";
import renault from "@/assets/logos-autos/renault.svg";
import toyota from "@/assets/logos-autos/toyota.svg";
import volkswagen from "@/assets/logos-autos/volkswagen.svg";

const LOGO_MAP = {
  audi,
  bmw,
  chevrolet,
  citroen,
  fiat,
  ford,
  honda,
  hyundai,
  jeep,
  nissan,
  peugeot,
  porsche,
  renault,
  toyota,
  volkswagen,
};

/**
 * Normaliza para comparación:
 * "Citroën" → "citroen", "Volkswagen" → "volkswagen"
 */
function normalizar(str = "") {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

/**
 * @param {string} marca - nombre tal como viene de la DB
 * @returns {string|null} URL procesada por Vite, o null si no hay logo
 */
export function getLogoUrl(marca) {
  if (!marca) return null;
  return LOGO_MAP[normalizar(marca)] ?? null;
}

export const MARCAS_CON_LOGO = new Set(Object.keys(LOGO_MAP));
