import React from "react";

const ORDEN_ESTADOS = {
  pendiente: { label: "Pendiente", color: "bg-gray-100 text-gray-500 border-gray-200" },
  en_proceso: { label: "En proceso", color: "bg-blue-50 text-blue-600 border-blue-200" },
  finalizado: { label: "Finalizado", color: "bg-green-50 text-green-600 border-green-200" },
  entregado: { label: "Entregado", color: "bg-purple-50 text-purple-600 border-purple-200" },
};

const OrdenEstadoBadge = ({ estado }) => {
  const { label, color } = ORDEN_ESTADOS[estado] ?? { label: estado, color: "bg-gray-100 text-gray-400 border-gray-200" };
  return <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${color}`}>{label}</span>;
};

export default OrdenEstadoBadge;
