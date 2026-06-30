// src/hooks/useHistorial.js

import { useState, useMemo, useCallback, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const PAGE_SIZE = 20;

export function useHistorial() {
  const [historial, setHistorial] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [cargandoMas, setCargandoMas] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [proximoNro, setProximoNro] = useState(null);

  // ── Carga inicial con paginación ──────────────────────────────────────────
  useEffect(() => {
    async function cargar() {
      setCargando(true);

      // Último nro registrado para mostrar el próximo en el header
      const { data: ultimo } = await supabase.from("presupuestos").select("nro").order("nro", { ascending: false }).limit(1).maybeSingle();
      setProximoNro((Number(ultimo?.nro) ?? 0) + 1);

      const { data, error, count } = await supabase
        .from("presupuestos")
        .select(
          `
          id, nro, estado, descuento_pct, total_bruto, total_neto,
          observaciones, fecha_emision, fecha_vencimiento,
          vehiculos ( dominio, color, anio,
            marcas  ( nombre ),
            modelos ( nombre )
          ),
          clientes ( id, nombre, apellido, telefono, email ),
          presupuesto_items (
            pieza_nombre, trabajo_nombre, precio_unitario, sort_order
          )
        `,
          { count: "exact" }
        )
        .order("created_at", { ascending: false })
        .range(0, PAGE_SIZE - 1);

      if (error) {
        console.error("Error cargando historial:", error);
        setCargando(false);
        return;
      }

      setHistorial(data.map(_transformar));
      setTotalCount(count ?? 0);
      setCargando(false);
    }

    cargar();
  }, []);

  // ── Transformar fila de Supabase al formato interno ───────────────────────
  function _transformar(p) {
    const v = p.vehiculos;
    const marca = v?.marcas?.nombre ?? "";
    const modelo = v?.modelos?.nombre ?? "";
    return {
      id: p.id,
      nro: p.nro,
      estado: p.estado,
      fecha: p.fecha_emision,
      fechaDisplay: p.fecha_emision ? new Date(p.fecha_emision + "T00:00:00").toLocaleDateString("es-AR") : "",
      obs: p.observaciones ?? "",
      descuento: p.descuento_pct ?? 0,
      bruto: p.total_bruto,
      neto: p.total_neto,
      ahorro: p.total_bruto - p.total_neto,
      aplicaIva: false,
      ivaPorcentaje: 0,
      totalIva: 0,
      vehiculo: v ? { dominio: v.dominio, marca, modelo, anio: v.anio, color: v.color ?? "" } : null,
      cliente: p.clientes ?? null,
      items: (p.presupuesto_items ?? [])
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((it) => ({
          piezaNombre: it.pieza_nombre,
          trabajoNombre: it.trabajo_nombre,
          precio: it.precio_unitario,
        })),
    };
  }

  // ── Cargar más resultados ─────────────────────────────────────────────────
  const cargarMasHistorial = useCallback(async () => {
    const desde = historial.length;
    setCargandoMas(true);
    const { data, error } = await supabase
      .from("presupuestos")
      .select(
        `
        id, nro, estado, descuento_pct, total_bruto, total_neto,
        observaciones, fecha_emision, fecha_vencimiento,
        vehiculos ( dominio, color, anio,
          marcas  ( nombre ),
          modelos ( nombre )
        ),
        clientes ( id, nombre, apellido, telefono, email ),
        presupuesto_items (
          pieza_nombre, trabajo_nombre, precio_unitario, sort_order
        )
      `
      )
      .order("created_at", { ascending: false })
      .range(desde, desde + PAGE_SIZE - 1);

    if (!error && data?.length) {
      setHistorial((prev) => [...prev, ...data.map(_transformar)]);
    }
    setCargandoMas(false);
  }, [historial.length]);

  // ── Guardar presupuesto en Supabase ───────────────────────────────────────
  const agregarRegistro = useCallback(async (registro) => {
      const { data: presupuesto, error: errP } = await supabase
      .from("presupuestos")
      .insert({
        vehiculo_id: registro.vehiculo?.id ?? null,
        cliente_id: registro.cliente?.id ?? null,
        estado: "borrador",
        descuento_pct: registro.descuento,
        total_bruto: registro.bruto,
        total_neto: registro.neto,
        aplica_iva: registro.aplicaIva ?? false,
        iva_porcentaje: registro.ivaPorcentaje ?? 21,
        total_iva: registro.totalIva ?? 0,
        observaciones: registro.obs || null,
        fecha_emision: registro.fecha,
        fecha_vencimiento: registro.fechaVencimiento ?? null,
      })
      .select("id, nro") // ← pedimos el nro real que generó Supabase
      .single();

    if (errP) {
      console.error("Error guardando presupuesto:", errP);
      return false;
    }

    if (registro.items?.length) {
      const filas = registro.items.map((it, i) => ({
        presupuesto_id: presupuesto.id,
        pieza_id: it.piezaId ?? null,
        trabajo_id: it.trabajoId ?? null,
        pieza_nombre: it.piezaNombre,
        trabajo_nombre: it.trabajoNombre,
        precio_unitario: it.precio,
        sort_order: i,
      }));

      const { error: errI } = await supabase.from("presupuesto_items").insert(filas);
      if (errI) {
        console.error("Error guardando items:", errI);
        return false;
      }
    }

    // Agregamos al estado local con el nro real de Supabase
    const nuevoRegistro = {
      ...registro,
      id: presupuesto.id,
      nro: presupuesto.nro,
      estado: "borrador",
      fechaDisplay: registro.fechaDisplay ?? registro.fecha,
      aplicaIva: registro.aplicaIva ?? false,
      ivaPorcentaje: registro.ivaPorcentaje ?? 21,
      totalIva: registro.totalIva ?? 0,
    };

    setHistorial((prev) => [nuevoRegistro, ...prev]);

    // Actualizamos el próximo nro para el header
    setProximoNro(Number(presupuesto.nro) + 1);

    return true;
  }, []);

  // ── Cambiar estado ────────────────────────────────────────────────────────
  const cambiarEstado = useCallback(async (id, nuevoEstado) => {
    const { error } = await supabase.from("presupuestos").update({ estado: nuevoEstado, updated_at: new Date().toISOString() }).eq("id", id);

    if (error) {
      console.error("Error actualizando estado:", error);
      return false;
    }

    setHistorial((prev) => prev.map((h) => (h.id === id ? { ...h, estado: nuevoEstado } : h)));
    return true;
  }, []);

  // ── Generar orden de trabajo ──────────────────────────────────────────────
  const generarOrden = useCallback(
    async (presupuestoId) => {
      const { data, error } = await supabase.from("ordenes_trabajo").insert({ presupuesto_id: presupuestoId, estado: "pendiente" }).select().single();

      if (error) {
        console.error("Error generando orden:", error);
        return false;
      }

      await cambiarEstado(presupuestoId, "orden");
      return data;
    },
    [cambiarEstado]
  );

  // ── Filtro de búsqueda ────────────────────────────────────────────────────
  const historialFiltrado = useMemo(() => {
    const q = busqueda.toLowerCase().trim();
    if (!q) return historial;
    return historial.filter((h) => {
      const veh = h.vehiculo ? `${h.vehiculo.dominio} ${h.vehiculo.marca} ${h.vehiculo.modelo}`.toLowerCase() : "";
      return veh.includes(q) || String(h.nro).includes(q);
    });
  }, [historial, busqueda]);

  const puedeCargarMas = historial.length < totalCount;

  return {
    historial,
    historialFiltrado,
    busqueda,
    setBusqueda,
    agregarRegistro,
    totalGuardados: historial.length,
    totalCount,
    cargando,
    cargandoMas,
    puedeCargarMas,
    cambiarEstado,
    generarOrden,
    cargarMasHistorial,
    proximoNro,
  };
}
