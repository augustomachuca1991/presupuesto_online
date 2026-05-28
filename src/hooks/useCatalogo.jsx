// src/hooks/useCatalogo.js
//
// Trae piezas y trabajos del catálogo desde Supabase una sola vez por sesión.
// Mismo patrón de cache que useMarcasModelos: un fetch por sesión,
// sin re-fetch en cada render ni en cada apertura del formulario.
//
// Lo que devuelve:
//   piezas            → Array<{ id, nombre, icono, categoria }>
//   trabajosDe(id)    → Array<{ id, nombre, precio_base }> para una pieza
//   isLoading         → boolean
//   isError           → boolean

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

// ─── Mapa de iconos por nombre de pieza (solo presentación, no va a la DB) ──
const ICONOS_PIEZA = {
  Capot: "⬛",
  "Paragolpes delantero": "⬜",
  "Paragolpes trasero": "⬜",
  "Guardabarro del. izq.": "◧",
  "Guardabarro del. der.": "◨",
  "Guardabarro tra. izq.": "◧",
  "Guardabarro tra. der.": "◨",
  "Puerta del. izq.": "🚪",
  "Puerta del. der.": "🚪",
  "Puerta tra. izq.": "🚪",
  "Puerta tra. der.": "🚪",
  Techo: "🏠",
  "Baúl / Compuerta": "📦",
  Luneta: "🪟",
  Parabrisas: "🪟",
  "Espejo izq.": "◁",
  "Espejo der.": "▷",
  Llantas: "⭕",
};
const ICONO_DEFAULT = "🔧";

// ─── Cache en módulo-scope ────────────────────────────────────────────────
let _cache = null; // { piezas: Pieza[], trabajos: Map<uuid, Trabajo[]> }
let _promesa = null;

// Orden visual fijo de las piezas (por categoría y posición en el auto)
const ORDEN_CATEGORIA = ["carrocería", "vidrios", "accesorios", "rodado"];

async function _fetchCatalogo() {
  if (_cache) return _cache;
  if (_promesa) return _promesa;

  _promesa = (async () => {
    // Un solo query: todos los trabajos activos con su pieza incluida
    // Supabase resuelve el join vía FK trabajos_catalogo.pieza_id → piezas.id
    const { data, error } = await supabase
      .from("trabajos_catalogo")
      .select(
        `
        id,
        nombre,
        precio_base,
        piezas (
          id,
          nombre,
          categoria
        )
      `
      )
      .eq("activo", true)
      .order("nombre", { ascending: true });

    if (error) throw error;

    // Construir mapa pieza_id → trabajos[]
    const trabajosMap = new Map();
    const piezasMap = new Map(); // para deduplicar piezas

    for (const row of data) {
      const pieza = row.piezas;
      if (!pieza) continue;

      // Acumular pieza única — icono se resuelve desde el mapa del frontend
      if (!piezasMap.has(pieza.id)) {
        piezasMap.set(pieza.id, {
          ...pieza,
          icono: ICONOS_PIEZA[pieza.nombre] ?? ICONO_DEFAULT,
        });
      }

      // Acumular trabajos por pieza
      if (!trabajosMap.has(pieza.id)) {
        trabajosMap.set(pieza.id, []);
      }
      trabajosMap.get(pieza.id).push({
        id: row.id,
        nombre: row.nombre,
        precio_base: row.precio_base,
      });
    }

    // Ordenar piezas por categoría (orden visual) y luego alfabético
    const piezas = Array.from(piezasMap.values()).sort((a, b) => {
      const catA = ORDEN_CATEGORIA.indexOf(a.categoria ?? "");
      const catB = ORDEN_CATEGORIA.indexOf(b.categoria ?? "");
      if (catA !== catB) return catA - catB;
      return a.nombre.localeCompare(b.nombre, "es");
    });

    _cache = { piezas, trabajos: trabajosMap };
    _promesa = null;
    return _cache;
  })();

  return _promesa;
}

export function invalidarCacheCatalogo() {
  _cache = null;
  _promesa = null;
}

// ─── Hook ─────────────────────────────────────────────────────────────────
export function useCatalogo() {
  const [estado, setEstado] = useState(() => (_cache ? "ready" : "idle"));
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
        setError(err.message ?? "Error al cargar el catálogo.");
        setEstado("error");
      });
  }, []);

  // Trabajos de una pieza por su UUID. Devuelve [] si no cargó o no existe.
  const trabajosDe = useCallback(
    (piezaId) => {
      if (!catalogo || !piezaId) return [];
      return catalogo.trabajos.get(piezaId) ?? [];
    },
    [catalogo]
  );

  return {
    piezas: catalogo?.piezas ?? [],
    trabajosDe,
    isLoading: estado === "loading",
    isError: estado === "error",
    error,
  };
}
