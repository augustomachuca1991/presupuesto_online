import React from "react";

const ORDEN_ESTADOS = {
  pendiente: { label: "Pendiente", color: "bg-gray-100 text-gray-500 border-gray-200" },
  en_progreso: { label: "En progreso", color: "bg-blue-50 text-blue-600 border-blue-200" },
  pausada: { label: "Pausada", color: "bg-yellow-50 text-yellow-600 border-yellow-200" },
  completada: { label: "Completada", color: "bg-green-50 text-green-600 border-green-200" },
  cancelada: { label: "Cancelada", color: "bg-red-50 text-red-500 border-red-200" },
};

const OrdenEstadoBadge = ({ estado }) => {
  const { label, color } = ORDEN_ESTADOS[estado] ?? { label: estado, color: "bg-gray-100 text-gray-400 border-gray-200" };
  return <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${color}`}>{label}</span>;
};

export default OrdenEstadoBadge;
