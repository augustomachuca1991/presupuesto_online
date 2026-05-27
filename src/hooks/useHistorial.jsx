// src/hooks/useHistorial.js
//
// Maneja el historial de presupuestos guardados.
// En el futuro, `agregarRegistro` puede hacer un INSERT a Supabase
// y `historial` puede venir de un SELECT inicial.

import { useState, useMemo, useCallback } from "react";

export function useHistorial() {
  const [historial, setHistorial] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  const agregarRegistro = useCallback((registro) => {
    setHistorial((prev) => [registro, ...prev]);
  }, []);

  const historialFiltrado = useMemo(() => {
    const q = busqueda.toLowerCase().trim();
    if (!q) return historial;

    return historial.filter((h) => {
      const veh = h.vehiculo ? `${h.vehiculo.dominio} ${h.vehiculo.marca} ${h.vehiculo.modelo}`.toLowerCase() : "";
      return veh.includes(q) || h.nro.includes(q);
    });
  }, [historial, busqueda]);

  return {
    historial,
    historialFiltrado,
    busqueda,
    setBusqueda,
    agregarRegistro,
    totalGuardados: historial.length,
  };
}
