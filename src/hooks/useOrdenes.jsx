// src/hooks/useOrdenes.js

import { useState, useEffect, useMemo, useCallback } from "react";
import { supabase } from "@/lib/supabase";

const PAGE_SIZE = 20;

export function useOrdenes() {
  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [cargandoMas, setCargandoMas] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");

  useEffect(() => {
    async function cargar() {
      setCargando(true);
      const { data, error, count } = await supabase
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
        `,
          { count: "exact" }
        )
        .order("created_at", { ascending: false })
        .range(0, PAGE_SIZE - 1);

      if (!error) setOrdenes(data ?? []);
      setTotalCount(count ?? 0);
      setCargando(false);
    }
    cargar();
  }, []);

  const cargarMasOrdenes = useCallback(async () => {
    const desde = ordenes.length;
    setCargandoMas(true);
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
      .order("created_at", { ascending: false })
      .range(desde, desde + PAGE_SIZE - 1);
    if (!error && data?.length) {
      setOrdenes((prev) => [...prev, ...data]);
    }
    setCargandoMas(false);
  }, [ordenes.length]);

  const puedeCargarMas = ordenes.length < totalCount;

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
    cargandoMas,
    puedeCargarMas,
    busqueda,
    setBusqueda,
    filtroEstado,
    setFiltroEstado,
    cargarMasOrdenes,
    totalCount,
  };
}
