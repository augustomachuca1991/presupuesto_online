// src/hooks/useHistorial.js
//
// Maneja el historial de presupuestos guardados.
// En el futuro, `agregarRegistro` puede hacer un INSERT a Supabase
// y `historial` puede venir de un SELECT inicial.

import { useState, useMemo, useCallback, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export function useHistorial() {
  const [historial, setHistorial] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);

  // ── Carga inicial ──────────────────────────────────────────
  useEffect(() => {
    async function cargarHistorial() {
      setCargando(true);

      const { data, error } = await supabase
        .from("presupuestos")
        .select(
          `
          id, nro, estado, descuento_pct, total_bruto, total_neto,
          observaciones, fecha_emision, fecha_vencimiento,
          vehiculos ( dominio, color, anio,
            marcas ( nombre ),
            modelos ( nombre )
          ),
          clientes ( nombre, apellido ),
          presupuesto_items (
            pieza_nombre, trabajo_nombre, precio_unitario, sort_order
          )
        `
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error cargando historial:", error);
        setCargando(false);
        return;
      }

      // Transformar al formato que espera HistorialPanel/HistorialCard
      const registros = data.map(transformar);
      setHistorial(registros);
      setCargando(false);
    }

    cargarHistorial();
  }, []);

  function transformar(p) {
    const v = p.vehiculos;
    const marca = v?.marcas?.nombre ?? "";
    const modelo = v?.modelos?.nombre ?? "";

    return {
      id: p.id,
      nro: p.nro,
      estado: p.estado,
      fecha: p.fecha_emision,
      obs: p.observaciones ?? "",
      descuento: p.descuento_pct ?? 0,
      bruto: p.total_bruto,
      neto: p.total_neto,
      ahorro: p.total_bruto - p.total_neto,

      vehiculo: v
        ? {
            dominio: v.dominio,
            marca,
            modelo,
            anio: v.anio,
            color: v.color ?? "",
            titular: p.clientes ? `${p.clientes.nombre} ${p.clientes.apellido}` : "",
          }
        : null,

      items: (p.presupuesto_items ?? [])
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((it) => ({
          piezaNombre: it.pieza_nombre,
          trabajoNombre: it.trabajo_nombre,
          precio: it.precio_unitario,
        })),
    };
  }

  const cambiarEstado = useCallback(async (id, nuevoEstado) => {
    const { error } = await supabase.from("presupuestos").update({ estado: nuevoEstado, updated_at: new Date().toISOString() }).eq("id", id);

    if (error) {
      console.error("Error actualizando estado:", error);
      return false;
    }

    // Actualizar local sin refetch
    setHistorial((prev) => prev.map((h) => (h.id === id ? { ...h, estado: nuevoEstado } : h)));

    return true;
  }, []);

  const agregarRegistro = useCallback((registro) => {
    setHistorial((prev) => [registro, ...prev]);
  }, []);

  const historialFiltrado = useMemo(() => {
    const q = busqueda.toLowerCase().trim();
    if (!q) return historial;

    return historial.filter((h) => {
      const veh = h.vehiculo ? `${h.vehiculo.dominio} ${h.vehiculo.marca} ${h.vehiculo.modelo}`.toLowerCase() : "";
      return veh.includes(q) || h.nro.includes(q);
    });
  }, [historial, busqueda]);

  const generarOrden = useCallback(
    async (presupuestoId) => {
      // 1. Insertar la orden
      const { data, error } = await supabase
        .from("ordenes_trabajo")
        .insert({
          presupuesto_id: presupuestoId,
          estado: "pendiente", // estado inicial de la orden
          fecha_inicio: null, // el técnico la completa después
          fecha_fin_est: null,
          fecha_fin_real: null,
          notas_tecnico: null,
        })
        .select()
        .single();

      if (error) {
        console.error("Error generando orden:", error);
        return false;
      }

      // 2. Actualizar estado del presupuesto
      await cambiarEstado(presupuestoId, "orden");

      return data;
    },
    [cambiarEstado]
  );

  return {
    historial,
    historialFiltrado,
    busqueda,
    setBusqueda,
    agregarRegistro,
    totalGuardados: historial.length,
    cargando,
    cambiarEstado,
    generarOrden,
  };
}
