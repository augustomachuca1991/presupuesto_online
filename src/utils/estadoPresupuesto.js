// src/utils/estadoPresupuesto.js

export const ESTADOS = {
  borrador: { label: "Borrador", color: "bg-gray-100 text-gray-500 border-gray-200" },
  emitido: { label: "Emitido", color: "bg-blue-50 text-blue-600 border-blue-200" },
  aprobado: { label: "Aprobado", color: "bg-green-50 text-green-600 border-green-200" },
  rechazado: { label: "Rechazado", color: "bg-red-50 text-red-500 border-red-200" },
  vencido: { label: "Vencido", color: "bg-orange-50 text-orange-500 border-orange-200" },
  orden: { label: "En orden", color: "bg-purple-50 text-purple-600 border-purple-200" },
};

export const TRANSICIONES = {
  borrador: { accion: "Emitir", siguiente: "emitido" },
  emitido: null, // ← tiene dos caminos, lo manejamos aparte
  aprobado: { accion: "Generar orden", siguiente: "orden" },
  rechazado: null,
  vencido: { accion: "Reenviar", siguiente: "emitido" },
  orden: null,
};

export function getEstado(key) {
  return ESTADOS[key] ?? { label: key, color: "bg-gray-100 text-gray-400 border-gray-200" };
}
