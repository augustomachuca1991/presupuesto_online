import React from "react";

const ORDEN_ESTADOS = {
  pendiente: { label: "Pendiente", color: "bg-ant2 text-antm border-border" },
  en_progreso: { label: "En progreso", color: "bg-blue-900/30 text-blue-300 border-blue-800" },
  pausada: { label: "Pausada", color: "bg-yellow-900/30 text-yellow-300 border-yellow-800" },
  completada: { label: "Completada", color: "bg-green-900/30 text-green-300 border-green-800" },
  cancelada: { label: "Cancelada", color: "bg-red-900/30 text-red-300 border-red-800" },
};

const OrdenEstadoBadge = ({ estado }) => {
  const { label, color } = ORDEN_ESTADOS[estado] ?? { label: estado, color: "bg-ant2 text-ant3 border-border" };
  return <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border whitespace-nowrap ${color}`}>{label}</span>;
};

export default OrdenEstadoBadge;
