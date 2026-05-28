// src/hooks/usePresupuesto.js

import { useState, useMemo, useCallback, useRef } from "react";

const DESCUENTO_MAX = 50;

export function usePresupuesto({ piezas = [], trabajosDe = () => [] } = {}) {
  // Refs sincronizadas en cada render — siempre apuntan al catálogo más reciente
  const piezasRef = useRef(piezas);
  const trabajosDeRef = useRef(trabajosDe);
  piezasRef.current = piezas;
  trabajosDeRef.current = trabajosDe;

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

  // Calculados directo en render leyendo los refs — sin useMemo para evitar
  // el problema de closure: cuando piezaSelId cambia, React re-renderiza y
  // estas líneas corren DESPUÉS de que los refs ya fueron actualizados arriba
  const piezaSeleccionada = piezaSelId ? (piezasRef.current.find((p) => p.id === piezaSelId) ?? null) : null;

  const trabajosDePiezaSel = piezaSelId ? trabajosDeRef.current(piezaSelId) : [];

  // ── Toggle trabajo ────────────────────────────────────────────────────────
  const toggleTrabajo = useCallback((piezaId, trabajoId) => {
    const key = `${piezaId}|${trabajoId}`;
    setItems((prev) => {
      const existe = prev.some((x) => x.key === key);
      if (existe) return prev.filter((x) => x.key !== key);

      const pieza = piezasRef.current.find((p) => p.id === piezaId);
      const trabajo = trabajosDeRef.current(piezaId).find((t) => t.id === trabajoId);
      if (!pieza || !trabajo) return prev;

      return [
        ...prev,
        {
          key,
          piezaId,
          trabajoId,
          piezaNombre: pieza.nombre,
          trabajoNombre: trabajo.nombre,
          precio: trabajo.precio_base,
          precioBase: trabajo.precio_base,
        },
      ];
    });
  }, []);

  // ── Edición de precio ─────────────────────────────────────────────────────
  const editarPrecio = useCallback((index, valor) => {
    const precio = Math.max(0, parseInt(valor) || 0);
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, precio } : it)));
  }, []);

  // ── Descuento ─────────────────────────────────────────────────────────────
  const cambiarDescuento = useCallback((valor) => {
    const v = Math.min(DESCUENTO_MAX, Math.max(0, parseInt(valor) || 0));
    setDescuento(v);
  }, []);

  // ── Registro ──────────────────────────────────────────────────────────────
  // ── Registro ──────────────────────────────────────────────────────────────
  // nro NO se incluye — lo genera Supabase con la sequence y lo devuelve el INSERT.
  // El header muestra `nro` como contador visual local, no como nro definitivo.
  const construirRegistro = useCallback(
    (vehiculo, cliente = null) => ({
      fecha: new Date().toISOString().split("T")[0],
      fechaDisplay: new Date().toLocaleDateString("es-AR"),
      vehiculo: vehiculo ? { ...vehiculo } : null,
      cliente: cliente ? { ...cliente } : null,
      items: items.map((x) => ({ ...x })),
      descuento,
      bruto,
      ahorro,
      neto,
      obs,
    }),
    [items, descuento, bruto, ahorro, neto, obs]
  );

  // ── Reset ─────────────────────────────────────────────────────────────────
  const resetPresupuesto = useCallback(() => {
    setItems([]);
    setPiezaSelId(null);
    setDescuento(0);
    setObs("");
    setNro((prev) => prev + 1);
  }, []);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const cantPorPieza = useCallback((piezaId) => items.filter((x) => x.piezaId === piezaId).length, [items]);

  const trabajoSeleccionado = useCallback((piezaId, trabajoId) => items.some((x) => x.key === `${piezaId}|${trabajoId}`), [items]);

  return {
    nro,
    items,
    descuento,
    obs,
    setObs,
    piezaSelId,
    piezaSeleccionada,
    trabajosDePiezaSel,
    bruto,
    ahorro,
    neto,
    seleccionarPieza,
    cerrarPieza,
    toggleTrabajo,
    editarPrecio,
    cambiarDescuento,
    construirRegistro,
    resetPresupuesto,
    cantPorPieza,
    trabajoSeleccionado,
    DESCUENTO_MAX,
  };
}
