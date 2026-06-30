export const ESTADOS = {
  borrador: { label: "Borrador", color: "bg-ant2 text-antm border-white/20" },
  emitido: { label: "Emitido", color: "bg-blue-900/30 text-blue-300 border-blue-800" },
  aprobado: { label: "Aprobado", color: "bg-green-900/30 text-green-300 border-green-800" },
  rechazado: { label: "Rechazado", color: "bg-red-900/30 text-red-300 border-red-800" },
  vencido: { label: "Vencido", color: "bg-orange-900/30 text-orange-300 border-orange-800" },
  orden: { label: "Orden Emitida", color: "bg-purple-900/30 text-purple-300 border-purple-800" },
};

export const TRANSICIONES = {
  borrador: { accion: "Emitir", siguiente: "emitido" },
  emitido: null,
  aprobado: null,
  rechazado: null,
  vencido: { accion: "Reenviar", siguiente: "emitido" },
  orden: null,
};

export function getEstado(key) {
  return ESTADOS[key] ?? { label: key, color: "bg-ant2 text-antm border-white/20" };
}
