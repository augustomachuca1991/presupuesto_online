// src/hooks/useHistorial.js

import { useState, useMemo, useCallback, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { escSearch } from "@/utils/fmt";
import { audit } from "@/lib/audit";

const PAGE_SIZE = 20;
const COLUMNAS = `
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
`;

async function _buscarIds(termino, desde, limite) {
  const q = escSearch(termino.trim());
  const { data: ids, count } = await supabase
    .from("v_presupuestos_busqueda")
    .select("id", { count: "exact" })
    .or(
      `nro::text.ilike.%${q}%,dominio.ilike.%${q}%,marca.ilike.%${q}%,modelo.ilike.%${q}%,cliente_nombre.ilike.%${q}%`
    )
    .range(desde, desde + limite - 1);

  return { ids: (ids ?? []).map((r) => r.id), totalCount: count ?? 0 };
}

async function _cargarPagina(desde, limite, matchedIds = null) {
  let query = supabase
    .from("presupuestos")
    .select(COLUMNAS, matchedIds ? undefined : { count: "exact" })
    .order("created_at", { ascending: false })
    .range(desde, desde + limite - 1);

  if (matchedIds) {
    query = query.in("id", matchedIds);
  }

  const { data, error, count } = await query;
  return { data: data ?? [], error, count: count ?? 0 };
}

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

      const { data: ultimo } = await supabase.from("presupuestos").select("nro").order("nro", { ascending: false }).limit(1).maybeSingle();
      setProximoNro((Number(ultimo?.nro) ?? 0) + 1);

      let matchedIds = null;

      if (busqueda.trim()) {
        const r = await _buscarIds(busqueda, 0, PAGE_SIZE);
        matchedIds = r.ids;
        setTotalCount(r.totalCount);
      }

      const { data, error, count } = await _cargarPagina(0, PAGE_SIZE, matchedIds);

      if (error) {
        console.error("Error cargando historial:", error);
        setCargando(false);
        return;
      }

      setHistorial(data.map(_transformar));
      if (!matchedIds) setTotalCount(count);
      setCargando(false);
    }

    cargar();
  }, [busqueda]);

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

    let matchedIds = null;
    if (busqueda.trim()) {
      const r = await _buscarIds(busqueda, desde, PAGE_SIZE);
      matchedIds = r.ids;
    }

    const { data, error } = await _cargarPagina(desde, PAGE_SIZE, matchedIds);

    if (!error && data?.length) {
      setHistorial((prev) => [...prev, ...data.map(_transformar)]);
    }
    setCargandoMas(false);
  }, [historial.length, busqueda]);

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
      .select("id, nro")
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
    setProximoNro(Number(presupuesto.nro) + 1);

    audit("presupuesto.crear", "presupuestos", presupuesto.id, { nro: presupuesto.nro });
    return true;
  }, []);

  // ── Cambiar estado ────────────────────────────────────────────────────────
  const cambiarEstado = useCallback(async (id, nuevoEstado) => {
    const updateData = { estado: nuevoEstado, updated_at: new Date().toISOString() };
    if (nuevoEstado === "emitido") {
      const fv = new Date();
      fv.setDate(fv.getDate() + 15);
      updateData.fecha_vencimiento = fv.toISOString().split("T")[0];
    }
    const { error } = await supabase.from("presupuestos").update(updateData).eq("id", id);

    if (error) {
      console.error("Error actualizando estado:", error);
      return false;
    }

    setHistorial((prev) => {
      const anterior = prev.find((h) => h.id === id);
      audit("presupuesto.estado", "presupuestos", id, { desde: anterior?.estado, hacia: nuevoEstado });
      return prev.map((h) => (h.id === id ? { ...h, estado: nuevoEstado } : h));
    });
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
      audit("orden.generar", "ordenes_trabajo", data.id, { presupuesto_id: presupuestoId });
      return data;
    },
    [cambiarEstado]
  );

  const historialFiltrado = useMemo(() => historial, [historial]);
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
