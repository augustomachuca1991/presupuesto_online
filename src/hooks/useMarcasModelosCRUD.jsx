// src/hooks/useMarcasModelosCRUD.js
//
// Hook exclusivo para la página de ABM de marcas y modelos.
// Trabaja con objetos completos { id, nombre } — distinto de useMarcasModelos
// que solo expone strings para los selects.
// Al mutar datos llama a invalidarCacheMarcas() para que el cache de
// useMarcasModelos se regenere la próxima vez que se use.

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { invalidarCacheMarcas } from "./useMarcasModelos";

export function useMarcasModelosCRUD() {
  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // ── Carga inicial ─────────────────────────────────────────────────────────
  useEffect(() => {
    async function cargar() {
      setIsLoading(true);
      setIsError(false);

      const [{ data: dm, error: em }, { data: dmo, error: emo }] = await Promise.all([
        supabase.from("marcas").select("id, nombre").order("nombre"),
        supabase.from("modelos").select("id, marca_id, nombre").order("nombre"),
      ]);

      if (em || emo) {
        console.error("Error cargando marcas/modelos:", em ?? emo);
        setIsError(true);
      } else {
        setMarcas(dm ?? []);
        setModelos(dmo ?? []);
      }

      setIsLoading(false);
    }
    cargar();
  }, []);

  // ── CRUD Marcas ───────────────────────────────────────────────────────────
  const agregarMarca = useCallback(async (nombre) => {
    const { data, error } = await supabase.from("marcas").insert({ nombre: nombre.trim() }).select().single();

    if (error) return { ok: false, error: error.message };

    setMarcas((prev) => [...prev, data].sort((a, b) => a.nombre.localeCompare(b.nombre, "es")));
    invalidarCacheMarcas();
    return { ok: true, marca: data };
  }, []);

  const editarMarca = useCallback(async (id, nombre) => {
    const { data, error } = await supabase.from("marcas").update({ nombre: nombre.trim() }).eq("id", id).select().single();

    if (error) return { ok: false, error: error.message };

    setMarcas((prev) => prev.map((m) => (m.id === id ? data : m)).sort((a, b) => a.nombre.localeCompare(b.nombre, "es")));
    invalidarCacheMarcas();
    return { ok: true };
  }, []);

  const eliminarMarca = useCallback(async (id) => {
    // Supabase eliminará los modelos en cascada si tenés ON DELETE CASCADE,
    // si no, los eliminamos primero manualmente
    const { error: errMod } = await supabase.from("modelos").delete().eq("marca_id", id);

    if (errMod) return { ok: false, error: errMod.message };

    const { error } = await supabase.from("marcas").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };

    setMarcas((prev) => prev.filter((m) => m.id !== id));
    setModelos((prev) => prev.filter((mo) => mo.marca_id !== id));
    invalidarCacheMarcas();
    return { ok: true };
  }, []);

  // ── CRUD Modelos ──────────────────────────────────────────────────────────
  const agregarModelo = useCallback(async (marca_id, nombre) => {
    const { data, error } = await supabase.from("modelos").insert({ marca_id, nombre: nombre.trim() }).select().single();

    if (error) return { ok: false, error: error.message };

    setModelos((prev) => [...prev, data].sort((a, b) => a.nombre.localeCompare(b.nombre, "es")));
    invalidarCacheMarcas();
    return { ok: true, modelo: data };
  }, []);

  const editarModelo = useCallback(async (id, nombre) => {
    const { data, error } = await supabase.from("modelos").update({ nombre: nombre.trim() }).eq("id", id).select().single();

    if (error) return { ok: false, error: error.message };

    setModelos((prev) => prev.map((mo) => (mo.id === id ? data : mo)).sort((a, b) => a.nombre.localeCompare(b.nombre, "es")));
    invalidarCacheMarcas();
    return { ok: true };
  }, []);

  const eliminarModelo = useCallback(async (id) => {
    const { error } = await supabase.from("modelos").delete().eq("id", id);
    if (error) return { ok: false, error: error.message };

    setModelos((prev) => prev.filter((mo) => mo.id !== id));
    invalidarCacheMarcas();
    return { ok: true };
  }, []);

  return {
    marcas,
    modelos,
    isLoading,
    isError,
    agregarMarca,
    editarMarca,
    eliminarMarca,
    agregarModelo,
    editarModelo,
    eliminarModelo,
  };
}
