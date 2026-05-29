// src/hooks/usePiezas.js

import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { invalidarCacheCatalogo } from "@/hooks/useCatalogo";

const CATEGORIAS = ["carrocería", "vidrios", "accesorios", "rodado"];

async function _fetchPiezas() {
  const { data, error } = await supabase
    .from("piezas")
    .select(
      `
      id, nombre, categoria,
      trabajos_catalogo ( id, nombre, precio_base, activo )
    `
    )
    .order("categoria")
    .order("nombre");
  if (error) throw error;
  return data ?? [];
}

export function usePiezas() {
  const [piezas, setPiezas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await _fetchPiezas();
      setPiezas(data);
      invalidarCacheCatalogo(); // invalida el cache del formulario de presupuesto
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  // ── PIEZAS ────────────────────────────────────────────────────────────────

  const crearPieza = useCallback(
    async ({ nombre, categoria }) => {
      const { error } = await supabase.from("piezas").insert({ nombre: nombre.trim(), categoria });
      if (error) return { ok: false, error: error.message };
      await refetch();
      return { ok: true };
    },
    [refetch]
  );

  const editarPieza = useCallback(
    async (id, { nombre, categoria }) => {
      const { error } = await supabase.from("piezas").update({ nombre: nombre.trim(), categoria }).eq("id", id);
      if (error) return { ok: false, error: error.message };
      await refetch();
      return { ok: true };
    },
    [refetch]
  );

  const eliminarPieza = useCallback(
    async (id) => {
      // Supabase cascade borra los trabajos_catalogo asociados (definido en migration 001)
      const { error } = await supabase.from("piezas").delete().eq("id", id);
      if (error) return { ok: false, error: error.message };
      await refetch();
      return { ok: true };
    },
    [refetch]
  );

  // ── TRABAJOS ──────────────────────────────────────────────────────────────

  const crearTrabajo = useCallback(
    async (piezaId, { nombre, precio_base }) => {
      const { error } = await supabase.from("trabajos_catalogo").insert({ pieza_id: piezaId, nombre: nombre.trim(), precio_base: parseInt(precio_base) || 0 });
      if (error) return { ok: false, error: error.message };
      await refetch();
      return { ok: true };
    },
    [refetch]
  );

  const editarTrabajo = useCallback(
    async (id, { nombre, precio_base, activo }) => {
      const payload = {
        nombre: nombre.trim(),
        precio_base: parseInt(precio_base) || 0,
      };
      // Solo incluir activo si viene explícitamente
      if (activo !== undefined) payload.activo = activo;

      const { error } = await supabase.from("trabajos_catalogo").update(payload).eq("id", id);
      if (error) return { ok: false, error: error.message };
      await refetch();
      return { ok: true };
    },
    [refetch]
  );

  const eliminarTrabajo = useCallback(
    async (id) => {
      const { error } = await supabase.from("trabajos_catalogo").delete().eq("id", id);
      if (error) return { ok: false, error: error.message };
      await refetch();
      return { ok: true };
    },
    [refetch]
  );

  const toggleActivo = useCallback(async (id, activo) => {
    const { error } = await supabase.from("trabajos_catalogo").update({ activo: !activo }).eq("id", id);
    if (error) return { ok: false, error: error.message };
    setPiezas((prev) =>
      prev.map((p) => ({
        ...p,
        trabajos_catalogo: p.trabajos_catalogo.map((t) => (t.id === id ? { ...t, activo: !activo } : t)),
      }))
    );
    invalidarCacheCatalogo();
    return { ok: true };
  }, []);

  return {
    piezas,
    cargando,
    error,
    refetch,
    CATEGORIAS,
    crearPieza,
    editarPieza,
    eliminarPieza,
    crearTrabajo,
    editarTrabajo,
    eliminarTrabajo,
    toggleActivo,
  };
}
