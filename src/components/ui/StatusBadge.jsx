// src/components/ui/EstadoBadge.jsx

import { getEstado } from "@/utils/estadoPresupuesto";

export function StatusBadge({ estado }) {
  const { label, color } = getEstado(estado);
  return <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${color}`}>{label}</span>;
}
