// src/components/ui/Breadcrumbs.jsx

import { ICONS } from "@/constants/icons";
import { Link, useLocation } from "react-router-dom";
import { NAV_ITEMS } from "@/utils/navigation";

// Generamos el mapa { presupuestos: "Presupuestos", vehiculos: "Vehículos", ... } dinámicamente
const LABELS_DINAMICOS = NAV_ITEMS.reduce((acc, item) => {
  // Quitamos la barra inicial del path ("/vehiculos" -> "vehiculos") para usarlo de clave
  const key = item.to.replace(/^\//, "");
  acc[key] = item.label;
  return acc;
}, {});

// Si el segmento es un UUID, lo reemplaza por un label más amigable
function esUUID(str) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

export function Breadcrumbs({ uuidLabels = {} }) {
  const { pathname } = useLocation();

  const segmentos = pathname.split("/").filter(Boolean);

  if (segmentos.length === 0) return null;

  const items = segmentos.map((seg, i) => {
    const path = "/" + segmentos.slice(0, i + 1).join("/");
    const esUltimo = i === segmentos.length - 1;

    // Resolver label usando el diccionario dinámico
    let label;
    if (esUUID(seg)) {
      label = uuidLabels[seg] ?? `#${seg.slice(0, 8)}...`;
    } else {
      label = LABELS_DINAMICOS[seg] ?? seg.charAt(0).toUpperCase() + seg.slice(1);
      // Por si una ruta no está en NAV_ITEMS, le hace un fallback estético metiendo mayúscula inicial.
    }

    return { label, path, esUltimo };
  });

  return (
    <nav className="flex items-center gap-1.5 text-[12px] mb-5">
      <Link to="/" className="text-ant3 hover:text-ant transition-colors">
        <i className={ICONS.HOME + " text-[13px]"} />
      </Link>

      {items.map(({ label, path, esUltimo }) => (
        <span key={path} className="flex items-center gap-1.5">
          <i className={ICONS.CHEVRON_RIGHT + " text-[11px] text-ant3"} />
          {esUltimo ? (
            <span className="text-ant font-medium">{label}</span>
          ) : (
            <Link to={path} className="text-ant3 hover:text-ant transition-colors">
              {label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
