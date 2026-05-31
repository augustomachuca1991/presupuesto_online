// src/hooks/usePresupuesto.js
//
// Lógica de negocio del presupuesto.
// Los items, descuento y obs se sincronizan con el store global
// para sobrevivir a la navegación entre páginas.

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { usePresupuestoDraft } from "@/store/usePresupuestoDraft";

const DESCUENTO_MAX = 50;

async function _fetchProximoNro() {
  const { data, error } = await supabase.rpc("proximo_nro_presupuesto");
  if (error || !data) return "????";
  const actual = parseInt(data, 10);
  return String(isNaN(actual) ? 1 : actual + 1).padStart(4, "0");
}

export function usePresupuesto({ piezas = [], trabajosDe = () => [] } = {}) {
  const piezasRef = useRef(piezas);
  const trabajosDeRef = useRef(trabajosDe);
  piezasRef.current = piezas;
  trabajosDeRef.current = trabajosDe;

  // Lee el estado persistido del store
  const { items: itemsStore, descuento: descuentoStore, obs: obsStore, setItems: setItemsStore, setDescuento: setDescuentoStore, setObs: setObsStore, resetDraft } = usePresupuestoDraft();

  // Estado local — no necesita persistir
  const [nroDisplay, setNroDisplay] = useState("....");
  const [piezaSelId, setPiezaSelId] = useState(null);

  // Estado sincronizado con el store
  const [items, setItemsLocal] = useState(itemsStore);
  const [descuento, setDescuentoLocal] = useState(descuentoStore);
  const [obs, setObsLocal] = useState(obsStore);

  // Sincroniza al store cada vez que cambia el estado local
  useEffect(() => {
    setItemsStore(items);
  }, [items, setItemsStore]);
  useEffect(() => {
    setDescuentoStore(descuento);
  }, [descuento, setDescuentoStore]);
  useEffect(() => {
    setObsStore(obs);
  }, [obs, setObsStore]);

  // Cargar próximo nro al montar
  useEffect(() => {
    _fetchProximoNro().then(setNroDisplay);
  }, []);

  // ── Cálculos ──────────────────────────────────────────────────────────────
  const bruto = useMemo(() => items.reduce((sum, it) => sum + it.precio, 0), [items]);
  const ahorro = useMemo(() => Math.round((bruto * descuento) / 100), [bruto, descuento]);
  const neto = bruto - ahorro;

  // ── Setters que actualizan local + store ──────────────────────────────────
  const setItems = useCallback((v) => setItemsLocal(typeof v === "function" ? v : () => v), []);
  const setDescuento = useCallback((v) => setDescuentoLocal(v), []);
  const setObs = useCallback((v) => setObsLocal(v), []);

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
    setItemsLocal((prev) => {
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
    setItemsLocal((prev) => prev.map((it, i) => (i === index ? { ...it, precio } : it)));
  }, []);

  // ── Descuento ─────────────────────────────────────────────────────────────
  const cambiarDescuento = useCallback((valor) => {
    const v = Math.min(DESCUENTO_MAX, Math.max(0, parseInt(valor) || 0));
    setDescuentoLocal(v);
  }, []);

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
      obs,
    }),
    [items, descuento, bruto, ahorro, neto, obs]
  );

  // ── Reset — limpia local + store ──────────────────────────────────────────
  const resetPresupuesto = useCallback(() => {
    setItemsLocal([]);
    setPiezaSelId(null);
    setDescuentoLocal(0);
    setObsLocal("");
    resetDraft();
    setNroDisplay("....");
    _fetchProximoNro().then(setNroDisplay);
  }, [resetDraft]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const cantPorPieza = useCallback((piezaId) => items.filter((x) => x.piezaId === piezaId).length, [items]);

  const trabajoSeleccionado = useCallback((piezaId, trabajoId) => items.some((x) => x.key === `${piezaId}|${trabajoId}`), [items]);

  return {
    nro: nroDisplay,
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
