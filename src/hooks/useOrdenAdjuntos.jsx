// src/hooks/useOrdenAdjuntos.js

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

const BUCKET = "orden-fotos";

export function useOrdenAdjuntos(ordenId) {
  const [fotos, setFotos] = useState([]);
  const [subiendo, setSubiendo] = useState(false);

  // Cargar fotos existentes
  useEffect(() => {
    if (!ordenId) return;
    async function cargar() {
      const { data } = await supabase.from("orden_adjuntos").select("id, url, path, nombre, orden_id, created_at").eq("orden_id", ordenId).order("created_at", { ascending: true });
      setFotos(data ?? []);
    }
    cargar();
  }, [ordenId]);

  // Subir fotos
  const subirFotos = useCallback(
    async (archivos) => {
      setSubiendo(true);
      const nuevas = [];

      for (const archivo of archivos) {
        const ext = archivo.name.split(".").pop();
        const path = `${ordenId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        const { error: errUp } = await supabase.storage.from(BUCKET).upload(path, archivo, { cacheControl: "3600", upsert: false });

        if (errUp) {
          console.error("Error subiendo foto:", errUp);
          continue;
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from(BUCKET).getPublicUrl(path);

        const { data: adj } = await supabase.from("orden_adjuntos").insert({ orden_id: ordenId, url: publicUrl, path, nombre: archivo.name }).select().single();

        if (adj) nuevas.push(adj);
      }

      setFotos((prev) => [...prev, ...nuevas]);
      setSubiendo(false);
    },
    [ordenId]
  );

  // Borrar foto
  const borrarFoto = useCallback(async (foto) => {
    await supabase.storage.from(BUCKET).remove([foto.path]);
    await supabase.from("orden_adjuntos").delete().eq("id", foto.id);
    setFotos((prev) => prev.filter((f) => f.id !== foto.id));
  }, []);

  return { fotos, subiendo, subirFotos, borrarFoto };
}
