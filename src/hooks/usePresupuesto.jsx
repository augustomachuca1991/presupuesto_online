// src/hooks/usePresupuesto.js
//
// Toda la lógica de negocio del presupuesto en un único hook.
// El componente sólo se encarga de renderizar.

import { useState, useMemo, useCallback } from "react";
import { piezas, getTrabajosDePieza } from "@/data/PiezasTrabajos";

const DESCUENTO_MAX = 50;

export function usePresupuesto() {
  const [nro, setNro] = useState(1);
  const [items, setItems] = useState([]);
  const [piezaSelId, setPiezaSelId] = useState(null);
  const [descuento, setDescuento] = useState(0);
  const [obs, setObs] = useState("");

  // ── Cálculos derivados ────────────────────────────────────────────────────
  const bruto = useMemo(() => items.reduce((sum, it) => sum + it.precio, 0), [items]);
  const ahorro = useMemo(() => Math.round((bruto * descuento) / 100), [bruto, descuento]);
  const neto = bruto - ahorro;

  // ── Selección de pieza ────────────────────────────────────────────────────
  const seleccionarPieza = useCallback((piezaId) => {
    setPiezaSelId((prev) => (prev === piezaId ? null : piezaId));
  }, []);

  const cerrarPieza = useCallback(() => setPiezaSelId(null), []);

  // La pieza seleccionada completa + sus trabajos disponibles
  const piezaSeleccionada = useMemo(() => (piezaSelId ? (piezas.find((p) => p.id === piezaSelId) ?? null) : null), [piezaSelId]);

  const trabajosDePiezaSel = useMemo(() => (piezaSelId ? getTrabajosDePieza(piezaSelId) : []), [piezaSelId]);

  // ── Toggle de trabajo ─────────────────────────────────────────────────────
  /**
   * Agrega o quita un trabajo de la lista.
   * La clave compuesta `piezaId|trabajoId` garantiza unicidad.
   */
  const toggleTrabajo = useCallback((piezaId, trabajoId) => {
    const key = `${piezaId}|${trabajoId}`;

    setItems((prev) => {
      const existe = prev.some((x) => x.key === key);
      if (existe) return prev.filter((x) => x.key !== key);

      const pieza = piezas.find((p) => p.id === piezaId);
      const lista = getTrabajosDePieza(piezaId);
      const trabajo = lista.find((t) => t.id === trabajoId);

      if (!pieza || !trabajo) return prev;

      return [
        ...prev,
        {
          key,
          piezaId,
          trabajoId,
          piezaNombre: pieza.nombre,
          trabajoNombre: trabajo.nombre,
          precio: trabajo.precio,
          precioBase: trabajo.precio,
        },
      ];
    });
  }, []);

  // ── Edición de precio individual ──────────────────────────────────────────
  const editarPrecio = useCallback((index, valor) => {
    const precio = Math.max(0, parseInt(valor) || 0);
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, precio } : it)));
  }, []);

  // ── Descuento ─────────────────────────────────────────────────────────────
  const cambiarDescuento = useCallback((valor) => {
    const v = Math.min(DESCUENTO_MAX, Math.max(0, parseInt(valor) || 0));
    setDescuento(v);
  }, []);

  // ── Construir registro para historial ─────────────────────────────────────
  /**
   * Arma el objeto registro para guardar en historial.
   * @param {object|null} vehiculo - vehículo actual del hook useVehiculos
   */
  const construirRegistro = useCallback(
    (vehiculo) => ({
      nro: String(nro).padStart(4, "0"),
      fecha: new Date().toLocaleDateString("es-AR"),
      vehiculo: vehiculo ? { ...vehiculo } : null,
      items: items.map((x) => ({ ...x })),
      descuento,
      bruto,
      ahorro,
      neto,
      obs,
    }),
    [nro, items, descuento, bruto, ahorro, neto, obs]
  );

  // ── Reset completo ────────────────────────────────────────────────────────
  const resetPresupuesto = useCallback(() => {
    setItems([]);
    setPiezaSelId(null);
    setDescuento(0);
    setObs("");
    setNro((prev) => prev + 1);
  }, []);

  // ── Helpers de estado ─────────────────────────────────────────────────────
  /** Cantidad de trabajos seleccionados para una pieza */
  const cantPorPieza = useCallback((piezaId) => items.filter((x) => x.piezaId === piezaId).length, [items]);

  /** Si un trabajo específico está seleccionado */
  const trabajoSeleccionado = useCallback((piezaId, trabajoId) => items.some((x) => x.key === `${piezaId}|${trabajoId}`), [items]);

  return {
    // Estado
    nro,
    items,
    descuento,
    obs,
    setObs,

    // Pieza seleccionada
    piezaSelId,
    piezaSeleccionada,
    trabajosDePiezaSel,

    // Totales
    bruto,
    ahorro,
    neto,

    // Acciones
    seleccionarPieza,
    cerrarPieza,
    toggleTrabajo,
    editarPrecio,
    cambiarDescuento,
    construirRegistro,
    resetPresupuesto,

    // Helpers
    cantPorPieza,
    trabajoSeleccionado,

    // Config
    DESCUENTO_MAX,
  };
}
