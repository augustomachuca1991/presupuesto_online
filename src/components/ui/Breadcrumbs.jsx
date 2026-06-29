import { ICONS } from "@/constants/icons";
import { Link, useLocation } from "react-router-dom";
import { NAV_ITEMS } from "@/utils/navigation";

const LABELS_DINAMICOS = NAV_ITEMS.reduce((acc, item) => {
  const key = item.to.replace(/^\//, "");
  acc[key] = item.label;
  return acc;
}, {});

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

    let label;
    if (esUUID(seg)) {
      label = uuidLabels[seg] ?? `#${seg.slice(0, 8)}...`;
    } else {
      label = LABELS_DINAMICOS[seg] ?? seg.charAt(0).toUpperCase() + seg.slice(1);
    }

    return { label, path, esUltimo };
  });

  return (
    <nav className="flex items-center gap-1.5 text-[12px] mb-5 overflow-x-auto">
      <Link to="/" className="text-antm hover:text-antl transition-colors">
        <i className={`${ICONS.HOME} text-[13px]`} />
      </Link>

      {items.map(({ label, path, esUltimo }) => (
        <span key={path} className="flex items-center gap-1.5">
          <i className={`${ICONS.CHEVRON_RIGHT} text-[11px] text-ant3`} />
          {esUltimo ? (
            <span className="text-antl font-medium">{label}</span>
          ) : (
            <Link to={path} className="text-antm hover:text-antl transition-colors">
              {label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
