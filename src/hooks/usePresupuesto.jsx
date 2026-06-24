import { useState, useMemo, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { usePresupuestoDraft } from "@/store/usePresupuestoDraft";

const DESCUENTO_MAX = 50;
const IVA_PORCENTAJE = 21;

export function usePresupuesto({ piezas = [], trabajosDe = () => [] } = {}) {
  const piezasRef = useRef(piezas);
  const trabajosDeRef = useRef(trabajosDe);
  piezasRef.current = piezas;
  trabajosDeRef.current = trabajosDe;

  const {
    items,
    descuento,
    obs,
    aplicaIva,
    setItems,
    setDescuento,
    setObs,
    setAplicaIva,
    resetDraft,
  } = usePresupuestoDraft();

  const [piezaSelId, setPiezaSelId] = useState(null);

  // ── Cálculos ──────────────────────────────────────────────────────────────
  const bruto = useMemo(() => items.reduce((sum, it) => sum + it.precio, 0), [items]);
  const ahorro = useMemo(() => Math.round((bruto * descuento) / 100), [bruto, descuento]);
  const neto = bruto - ahorro;
  const iva = useMemo(() => aplicaIva ? Math.round(neto * IVA_PORCENTAJE / 100) : 0, [neto, aplicaIva]);
  const total = neto + iva;

  // ── Pieza seleccionada ────────────────────────────────────────────────────
  const seleccionarPieza = useCallback((piezaId) => {
    setPiezaSelId((prev) => (prev === piezaId ? null : piezaId));
  }, []);

  const cerrarPieza = useCallback(() => setPiezaSelId(null), []);

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
  }, [setItems]);

  // ── Edición de precio ─────────────────────────────────────────────────────
  const editarPrecio = useCallback((index, valor) => {
    const precio = Math.max(0, parseInt(valor) || 0);
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, precio } : it)));
  }, [setItems]);

  // ── Descuento ─────────────────────────────────────────────────────────────
  const cambiarDescuento = useCallback((valor) => {
    const v = Math.min(DESCUENTO_MAX, Math.max(0, parseInt(valor) || 0));
    setDescuento(v);
  }, [setDescuento]);

  // ── Registro ──────────────────────────────────────────────────────────────
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
      aplicaIva,
      ivaPorcentaje: IVA_PORCENTAJE,
      totalIva: iva,
      total,
      obs,
    }),
    [items, descuento, bruto, ahorro, neto, aplicaIva, iva, total, obs]
  );

  // ── Reset — todo en el store ──────────────────────────────────────────────
  const resetPresupuesto = useCallback(() => {
    setPiezaSelId(null);
    resetDraft();
  }, [resetDraft]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const cantPorPieza = useCallback((piezaId) => items.filter((x) => x.piezaId === piezaId).length, [items]);

  const trabajoSeleccionado = useCallback((piezaId, trabajoId) => items.some((x) => x.key === `${piezaId}|${trabajoId}`), [items]);

  return {
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
    iva,
    total,
    aplicaIva,
    setAplicaIva,
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
    IVA_PORCENTAJE,
  };
}
