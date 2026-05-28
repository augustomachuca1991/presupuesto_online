// src/hooks/useMarcasModelos.js
//
// Trae marcas y modelos desde Supabase una sola vez por sesión.
// El resultado se cachea en módulo-scope: si dos componentes montan
// este hook al mismo tiempo, solo se hace un fetch.
//
// Forma de uso en ModalVehiculo:
//
//   const { marcas, modelosDe, isLoading } = useMarcasModelos();
//
//   // Lista de nombres de marcas para el <select>
//   marcas → ["Chevrolet", "Citroën", "Fiat", ...]
//
//   // Modelos de una marca específica
//   modelosDe("Ford") → ["Bronco", "EcoSport", "Fiesta", ...]

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

// ─── Cache en módulo-scope ────────────────────────────────────────────────
// Persiste entre renders y entre montajes del hook, pero se resetea
// si el usuario recarga la página — comportamiento correcto para un catálogo.
let _cache = null; // { marcas: string[], modelos: Map<string, string[]> }
let _promesa = null; // evita fetches paralelos si el hook monta dos veces

async function _fetchCatalogo() {
  // Si ya está cacheado, no va a la base
  if (_cache) return _cache;

  // Si ya hay una promesa en vuelo, la reutiliza
  if (_promesa) return _promesa;

  _promesa = (async () => {
    // Trae modelos junto con el nombre de la marca en un solo query
    // Supabase resuelve el join via la FK modelo.marca_id → marcas.id
    const { data, error } = await supabase
      .from("modelos")
      .select(
        `
        nombre,
        marcas ( nombre )
      `
      )
      .order("nombre", { ascending: true });

    if (error) throw error;

    // Construye el mapa  marca → [modelo1, modelo2, ...]
    const mapa = new Map();
    for (const row of data) {
      const marca = row.marcas?.nombre;
      if (!marca) continue;
      if (!mapa.has(marca)) mapa.set(marca, []);
      mapa.get(marca).push(row.nombre);
    }

    // Lista de marcas ordenada alfabéticamente
    const marcas = Array.from(mapa.keys()).sort((a, b) => a.localeCompare(b, "es"));

    _cache = { marcas, modelos: mapa };
    _promesa = null;
    return _cache;
  })();

  return _promesa;
}

// Permite invalidar el cache desde afuera (útil si se agrega una marca nueva)
export function invalidarCacheMarcas() {
  _cache = null;
  _promesa = null;
}

// ─── Hook ─────────────────────────────────────────────────────────────────
export function useMarcasModelos() {
  const [estado, setEstado] = useState(() =>
    // Si el cache ya existe al montar (segunda vez que abre el modal),
    // arranca en "ready" directamente sin mostrar spinner
    _cache ? "ready" : "idle"
  );
  const [catalogo, setCatalogo] = useState(_cache);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (_cache) {
      setCatalogo(_cache);
      setEstado("ready");
      return;
    }

    setEstado("loading");

    _fetchCatalogo()
      .then((data) => {
        setCatalogo(data);
        setEstado("ready");
      })
      .catch((err) => {
        setError(err.message ?? "Error al cargar marcas y modelos.");
        setEstado("error");
      });
  }, []);

  // Devuelve los modelos de una marca como array de strings.
  // Si la marca no existe o el catálogo no cargó, devuelve [].
  const modelosDe = useCallback(
    (marca) => {
      if (!catalogo || !marca) return [];
      return catalogo.modelos.get(marca) ?? [];
    },
    [catalogo]
  );

  return {
    marcas: catalogo?.marcas ?? [], // string[]
    modelosDe, // (marca: string) => string[]
    isLoading: estado === "loading",
    isError: estado === "error",
    error,
  };
}
