import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

export function useTurnos() {
  const [turnos, setTurnos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargar = useCallback(async () => {
    setCargando(true);
    const { data, error } = await supabase.from("turnos").select("*").order("fecha", { ascending: true }).order("hora", { ascending: true });
    if (!error) setTurnos(data ?? []);
    else console.error("Error cargando turnos:", error);
    setCargando(false);
  }, []);

  useEffect(() => { cargar(); }, []);

  const agregar = useCallback(async (turno) => {
    const { data, error } = await supabase.from("turnos").insert(turno).select().single();
    if (error) { console.error("Error creando turno:", error); return null; }
    setTurnos((prev) => [...prev, data].sort((a, b) => a.fecha.localeCompare(b.fecha) || (a.hora ?? "").localeCompare(b.hora ?? "")));
    return data;
  }, []);

  const editar = useCallback(async (id, cambios) => {
    const { data, error } = await supabase.from("turnos").update(cambios).eq("id", id).select().single();
    if (error) { console.error("Error editando turno:", error); return null; }
    setTurnos((prev) => prev.map((t) => (t.id === id ? data : t)));
    return data;
  }, []);

  const eliminar = useCallback(async (id) => {
    const { error } = await supabase.from("turnos").delete().eq("id", id);
    if (error) { console.error("Error eliminando turno:", error); return false; }
    setTurnos((prev) => prev.filter((t) => t.id !== id));
    return true;
  }, []);

  return { turnos, cargando, recargar: cargar, agregar, editar, eliminar };
}
