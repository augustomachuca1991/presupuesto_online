// src/hooks/useVehiculos.js
import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/lib/supabase";

// ─── Queries & Helpers Privados ───────────────────────────────────────────

/**
 * Busca un vehículo por dominio exacto usando la vista v_vehiculos.
 */
async function _buscarPorDominio(dominio) {
  const { data, error } = await supabase.from("v_vehiculos").select("*").eq("dominio", dominio.trim().toUpperCase()).maybeSingle();

  if (error) throw error;
  return data;
}

/**
 * Busca coincidencias parciales de dominio para el autocomplete.
 */
async function _sugerirDominios(query) {
  if (!query || query.length < 2) return [];

  const { data, error } = await supabase.from("v_vehiculos").select("id, dominio, marca, modelo, anio, color").ilike("dominio", `%${query.trim().toUpperCase()}%`).order("dominio").limit(5);

  if (error) throw error;
  return data ?? [];
}

/**
 * Carga de maestros para los selectores del CRUD
 */
async function _cargarMarcas() {
  const { data } = await supabase.from("marcas").select("id, nombre").order("nombre");
  return data ?? [];
}

async function _cargarModelos(marcaId = null) {
  let q = supabase.from("modelos").select("id, nombre, marca_id").order("nombre");
  if (marcaId) q = q.eq("marca_id", marcaId);
  const { data } = await q;
  return data ?? [];
}

const STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  FOUND: "found",
  NOTFOUND: "not_found",
  ERROR: "error",
};

// ─── Hook Unificado ───────────────────────────────────────────────────────
export function useVehiculos() {
  // ── Estados Principales / Búsqueda ─────────────────────────────
  const [vehiculoActual, setVehiculoActual] = useState(null);
  const [estado, setEstado] = useState(STATUS.IDLE);
  const [errorMsg, setErrorMsg] = useState(null);
  const [sugerencias, setSugerencias] = useState([]);

  // ── Estados CRUD y Listados ────────────────────────────────────
  const [vehiculos, setVehiculos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);

  const resetVehiculo = useCallback(() => {
    setVehiculoActual(null);
    setEstado(STATUS.IDLE);
    setErrorMsg(null);
    setSugerencias([]);
  }, []);

  // ── Carga de Listas Masivas (READ) ──────────────────────────────
  const cargarVehiculos = useCallback(async () => {
    setEstado(STATUS.LOADING);
    setErrorMsg(null);

    const { data, error: err } = await supabase.from("v_vehiculos").select("*").order("created_at", { ascending: false });

    if (err) {
      setErrorMsg(err.message);
      setEstado(STATUS.ERROR);
      return;
    }

    setVehiculos(data ?? []);
    setEstado(STATUS.IDLE);
  }, []);

  // Carga de modelos bajo demanda (filtrado por marca)
  const cargarModelos = useCallback(async (marcaId = null) => {
    const data = await _cargarModelos(marcaId);
    setModelos(data);
  }, []);

  // Ciclo de carga inicial automático de catálogos y grilla
  useEffect(() => {
    cargarVehiculos();
    _cargarMarcas().then(setMarcas);
    _cargarModelos().then(setModelos);
  }, [cargarVehiculos]);

  // ── Autocomplete Realtime ────────────────────────────────────────────────
  const sugerirVehiculos = useCallback(async (query) => {
    try {
      const resultado = await _sugerirDominios(query);
      setSugerencias(resultado);
    } catch {
      setSugerencias([]);
    }
  }, []);

  // ── Buscador de Mostrador ────────────────────────────────────────────────
  const buscarVehiculo = useCallback(async (dominio) => {
    const val = dominio.trim().toUpperCase().replace(/\s+/g, "");
    setSugerencias([]);

    if (!val) {
      setErrorMsg("Ingresá un dominio para buscar.");
      setEstado(STATUS.ERROR);
      return { encontrado: false, vehiculo: null };
    }

    setEstado(STATUS.LOADING);
    setErrorMsg(null);

    try {
      const vehiculo = await _buscarPorDominio(val);

      if (vehiculo) {
        setVehiculoActual({ ...vehiculo, esNuevo: false });
        setEstado(STATUS.FOUND);
        return { encontrado: true, vehiculo };
      } else {
        setVehiculoActual(null);
        setEstado(STATUS.NOTFOUND);
        return { encontrado: false, vehiculo: null };
      }
    } catch (err) {
      setErrorMsg(err.message ?? "Error al buscar el vehículo.");
      setEstado(STATUS.ERROR);
      return { encontrado: false, vehiculo: null };
    }
  }, []);

  // ── Insertar Vehículo Simple (CREATE) ────────────────────────────────────
  const agregarVehiculo = useCallback(
    async (datosVehiculo) => {
      setEstado(STATUS.LOADING);
      setErrorMsg(null);

      const dominioFormateado = datosVehiculo.dominio.toUpperCase().trim().replace(/\s+/g, "");

      const vehiculoFormateado = {
        dominio: dominioFormateado,
        marca_id: datosVehiculo.marca_id,
        modelo_id: datosVehiculo.modelo_id,
        anio: parseInt(datosVehiculo.anio, 10),
        color: datosVehiculo.color || null,
        codigo_pintura: datosVehiculo.codigoPintura || datosVehiculo.codigo_pintura || null,
      };

      try {
        const { data: vehiculo, error } = await supabase.from("vehiculos").insert([vehiculoFormateado]).select("id").single();

        if (error) {
          if (error.code === "23505") {
            throw new Error(`El dominio ${dominioFormateado} ya está registrado.`);
          }
          throw error;
        }

        // Re-fecheamos de la vista para sincronizar strings de marcas/modelos
        const { data: vehiculoCurrent, error: errVista } = await supabase.from("v_vehiculos").select("*").eq("id", vehiculo.id).single();

        if (errVista) throw errVista;

        setVehiculoActual({ ...vehiculoCurrent, esNuevo: true });
        setEstado(STATUS.FOUND);

        // Actualizamos la grilla local de vehículos
        await cargarVehiculos();

        return { ok: true, vehiculo: vehiculoCurrent, error: null };
      } catch (err) {
        const msg = err.message ?? "Error al dar de alta el vehículo.";
        setErrorMsg(msg);
        setEstado(STATUS.ERROR);
        return { ok: false, vehiculo: null, error: msg };
      }
    },
    [cargarVehiculos]
  );

  // ── Transacción RPC: Vehículo + Propietario (CREATE ADVANCED) ────────────
  const agregarVehiculoYPropietario = useCallback(
    async (datos) => {
      setEstado(STATUS.LOADING);
      setErrorMsg(null);

      const dominioFormateado = datos.dominio.toUpperCase().trim().replace(/\s+/g, "");

      const formatDatos = {
        p_nombre: datos.titularNombre.trim().toLowerCase(),
        p_apellido: datos.titularApellido.trim().toLowerCase(),
        p_email: datos.titularEmail?.trim() || null,
        p_telefono: datos.titularTelefono?.trim() || null,
        p_dominio: dominioFormateado,
        p_marca_id: datos.marca_id,
        p_modelo_id: datos.modelo_id,
        p_anio: parseInt(datos.anio, 10),
        p_color: datos.color || null,
        p_codigo_pintura: datos.codigoPintura?.toUpperCase().trim() || null,
      };

      try {
        const { data, error } = await supabase.rpc("insertar_vehiculo_y_cliente", formatDatos);

        if (error) {
          if (error.message.includes("vehiculos_dominio_key") || error.code === "23505") {
            throw new Error(`El dominio ${dominioFormateado} ya está registrado.`);
          }
          throw error;
        }

        setVehiculoActual({
          ...data,
          esNuevo: true,
          cliente_id: data.cliente_id ?? null,
          titular: `${formatDatos.p_nombre} ${formatDatos.p_apellido}`,
        });
        setEstado(STATUS.FOUND);

        await cargarVehiculos();
        return { ok: true, vehiculo: data, error: null };
      } catch (err) {
        const msg = err.message ?? "Error al procesar el alta.";
        setErrorMsg(msg);
        setEstado(STATUS.ERROR);
        return { ok: false, vehiculo: null, error: msg };
      }
    },
    [cargarVehiculos]
  );

  // ── Editar Vehículo (UPDATE) ─────────────────────────────────────────────
  const editarVehiculo = useCallback(
    async (id, datos) => {
      setEstado(STATUS.LOADING);
      setErrorMsg(null);

      const dominioFormateado = datos.dominio ? datos.dominio.toUpperCase().trim().replace(/\s+/g, "") : "";

      const payload = {
        dominio: dominioFormateado,
        marca_id: datos.marca_id,
        modelo_id: datos.modelo_id,
        anio: parseInt(datos.anio, 10),
        color: datos.color || null,
        codigo_pintura: datos.codigoPintura || datos.codigo_pintura || null,
      };

      try {
        const { error: err } = await supabase.from("vehiculos").update(payload).eq("id", id);

        if (err) {
          if (err.code === "23505") {
            throw new Error(`El dominio ${dominioFormateado} ya está registrado.`);
          }
          throw err;
        }

        setEstado(STATUS.IDLE);
        await cargarVehiculos();
        return { ok: true, error: null };
      } catch (err) {
        const msg = err.message ?? "Error al editar el vehículo.";
        setErrorMsg(msg);
        setEstado(STATUS.ERROR);
        return { ok: false, error: msg };
      }
    },
    [cargarVehiculos]
  );

  // ── Eliminar Vehículo (DELETE) ───────────────────────────────────────────
  const eliminarVehiculo = useCallback(
    async (id) => {
      setEstado(STATUS.LOADING);
      setErrorMsg(null);

      try {
        const { error: err } = await supabase.from("vehiculos").delete().eq("id", id);
        if (err) throw err;

        setEstado(STATUS.IDLE);
        await cargarVehiculos();
        return { ok: true, error: null };
      } catch (err) {
        const msg = err.message ?? "Error al eliminar el vehículo.";
        setErrorMsg(msg);
        setEstado(STATUS.ERROR);
        return { ok: false, error: msg };
      }
    },
    [cargarVehiculos]
  );

  return {
    // Retornos globales y listas
    vehiculoActual,
    vehiculos,
    estado,
    errorMsg,
    error: errorMsg, // Aliasing de compatibilidad
    isLoading: estado === STATUS.LOADING,
    sugerencias,
    marcas,
    modelos,

    // Métodos del Ciclo del Vehículo
    buscarVehiculo,
    sugerirVehiculos,
    resetVehiculo,
    cargarModelos,
    refetch: cargarVehiculos,

    // Pipeline CRUD Unificado
    crearVehiculo: agregarVehiculo, // Mapeado directo para compatibilidad con la vista CRUD
    agregarVehiculo,
    agregarVehiculoYPropietario,
    editarVehiculo,
    eliminarVehiculo,
  };
}

// ─── Helper: Resolver IDs desde nombres ──────────────────────────────────
export async function resolverIdsVehiculo(marcaNombre, modeloNombre) {
  const { data, error } = await supabase.from("modelos").select("id, marca_id, marcas(nombre)").eq("nombre", modeloNombre).eq("marcas.nombre", marcaNombre).maybeSingle();

  if (error || !data) return null;

  return {
    marca_id: data.marca_id,
    modelo_id: data.id,
  };
}
