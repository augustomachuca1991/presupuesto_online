// src/components/ui/Breadcrumbs.jsx

import { Link, useLocation, useParams } from "react-router-dom";

const LABELS = {
  presupuestos: "Presupuestos",
  vehiculos: "Vehículos",
  turnos: "Turnos",
  ordenes: "Órdenes",
};

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

    // Resolver label
    let label;
    if (esUUID(seg)) {
      label = uuidLabels[seg] ?? `#${seg.slice(0, 8)}...`; // muestra los primeros 8 chars
    } else {
      label = LABELS[seg] ?? seg;
    }

    return { label, path, esUltimo };
  });

  return (
    <nav className="flex items-center gap-1.5 text-[12px] mb-5">
      <Link to="/" className="text-ant3 hover:text-ant transition-colors">
        <i className="ti ti-home text-[13px]" />
      </Link>

      {items.map(({ label, path, esUltimo }) => (
        <span key={path} className="flex items-center gap-1.5">
          <i className="ti ti-chevron-right text-[11px] text-ant3" />
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
