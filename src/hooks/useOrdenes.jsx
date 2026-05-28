// src/hooks/useOrdenes.js

import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";

export function useOrdenes() {
  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");

  useEffect(() => {
    async function cargar() {
      const { data, error } = await supabase
        .from("ordenes_trabajo")
        .select(
          `
          id, estado, fecha_inicio, fecha_fin_est, fecha_fin_real,
          notas_tecnico, created_at,
          presupuestos (
            nro, total_neto,
            vehiculos ( dominio, anio,
              marcas ( nombre ),
              modelos ( nombre )
            ),
            clientes ( nombre, apellido )
          )
        `
        )
        .order("created_at", { ascending: false });

      if (!error) setOrdenes(data ?? []);
      setCargando(false);
    }
    cargar();
  }, []);

  const ordenesFiltradas = useMemo(() => {
    const q = busqueda.toLowerCase().trim();

    return ordenes.filter((o) => {
      const p = o.presupuestos;
      const v = p?.vehiculos;

      const matchEstado = filtroEstado === "todos" || o.estado === filtroEstado;

      const matchBusqueda = !q || p?.nro?.toLowerCase().includes(q) || v?.dominio?.toLowerCase().includes(q);

      return matchEstado && matchBusqueda;
    });
  }, [ordenes, busqueda, filtroEstado]);

  return {
    ordenes,
    ordenesFiltradas,
    cargando,
    busqueda,
    setBusqueda,
    filtroEstado,
    setFiltroEstado,
  };
}
