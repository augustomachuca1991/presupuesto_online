// src/hooks/useVehiculos.js
//
// Conectado a Supabase. Usa la vista v_vehiculos del migration 004
// para que la respuesta ya traiga marca y modelo en texto.
//
// Si necesitás volver al mock temporalmente, cambiá la línea:
//   import { supabase } from "@/lib/supabase";
// por el mock original y restaurá las funciones _mock*.

import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

// ─── Queries ──────────────────────────────────────────────────────────────

/**
 * Busca un vehículo por dominio usando la vista v_vehiculos.
 * Devuelve null si no existe.
 */
async function _buscarPorDominio(dominio) {
  const { data, error } = await supabase
    .from("v_vehiculos") // vista del migration 004
    .select("*")
    .eq("dominio", dominio.trim().toUpperCase())
    .maybeSingle(); // null si no existe, sin lanzar error 406

  if (error) throw error;
  return data; // null | objeto vehículo
}

/**
 * Busca coincidencias parciales de dominio para el autocomplete.
 * Máximo 5 resultados, ordenados alfabéticamente.
 */
async function _sugerirDominios(query) {
  if (!query || query.length < 2) return [];

  const { data, error } = await supabase.from("v_vehiculos").select("id, dominio, marca, modelo, anio, color").ilike("dominio", `%${query.trim().toUpperCase()}%`).order("dominio").limit(5);

  if (error) throw error;
  return data ?? [];
}

const STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  FOUND: "found",
  NOTFOUND: "not_found",
  ERROR: "error",
};

// ─── Hook ─────────────────────────────────────────────────────────────────
export function useVehiculos() {
  const [vehiculoActual, setVehiculoActual] = useState(null);
  const [estado, setEstado] = useState(STATUS.IDLE); // idle | loading | found | not_found | error
  const [errorMsg, setErrorMsg] = useState(null);
  const [sugerencias, setSugerencias] = useState([]);

  const resetVehiculo = useCallback(() => {
    setVehiculoActual(null);
    setEstado(STATUS.IDLE);
    setErrorMsg(null);
    setSugerencias([]);
  }, []);

  // ── Autocomplete ──────────────────────────────────────────────────────────
  const sugerirVehiculos = useCallback(async (query) => {
    try {
      const resultado = await _sugerirDominios(query);
      setSugerencias(resultado);
    } catch {
      setSugerencias([]); // falla silenciosa: el autocomplete es best-effort
    }
  }, []);

  // ── Buscar por dominio ────────────────────────────────────────────────────
  const buscarVehiculo = useCallback(async (dominio) => {
    const val = dominio.trim().toUpperCase();
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

  // ── Agregar vehículo ──────────────────────────────────────────────────────
  const agregarVehiculo = useCallback(async (datosVehiculo) => {
    setEstado(STATUS.LOADING);
    setErrorMsg(null);

    const vehiculoFormateado = {
      dominio: datosVehiculo.dominio.toUpperCase().trim(),
      marca_id: datosVehiculo.marca_id,
      modelo_id: datosVehiculo.modelo_id,
      anio: datosVehiculo.anio,
      color: datosVehiculo.color || null,
      codigo_pintura: datosVehiculo.codigoPintura || null,
    };

    try {
      const { data: vehiculo, error } = await supabase.from("vehiculos").insert([vehiculoFormateado]).select("id").single();

      if (error) {
        if (error.code === "23505") {
          throw new Error(`El dominio ${datosVehiculo.dominio} ya está registrado.`);
        }
        throw error;
      }

      const { data: vehiculoCurrent, error: errVista } = await supabase.from("v_vehiculos").select("*").eq("id", vehiculo.id).single();

      if (errVista) throw errVista;

      setVehiculoActual({ ...vehiculoCurrent, esNuevo: true });
      setEstado(STATUS.FOUND);
      return { ok: true, vehiculo: vehiculoCurrent, error: null };
    } catch (err) {
      const msg = err.message ?? "Error al dar de alta el vehículo.";
      setErrorMsg(msg);
      setEstado(STATUS.ERROR);
      return { ok: false, vehiculo: null, error: msg };
    }
  }, []);

  const agregarVehiculoYPropietario = useCallback(async (datos) => {
    setEstado(STATUS.LOADING);
    setErrorMsg(null);
    const formatDatos = {
      p_nombre: datos.titularNombre.trim().toLowerCase(),
      p_apellido: datos.titularApellido.trim().toLowerCase(),
      p_email: datos.titularEmail?.trim() || null,
      p_telefono: datos.titularTelefono?.trim() || null,
      p_dominio: datos.dominio.toUpperCase().trim(),
      p_marca_id: datos.marca_id,
      p_modelo_id: datos.modelo_id,
      p_anio: parseInt(datos.anio, 10),
      p_color: datos.color || null,
      p_codigo_pintura: datos.codigoPintura?.toUpperCase().trim() || null,
    };

    try {
      // Invocamos la función RPC pasándole los parámetros exactos que espera
      const { data, error } = await supabase.rpc("insertar_vehiculo_y_cliente", formatDatos);

      if (error) {
        // Capturamos errores específicos para dar mensajes limpios
        if (error.message.includes("vehiculos_dominio_key") || error.code === "23505") {
          throw new Error(`El dominio ${datos.dominio} ya está registrado.`);
        }
        throw error;
      }

      // Si llegó acá, la transacción fue un éxito rotundo en la DB
      setVehiculoActual({ ...data, esNuevo: true });
      setEstado(STATUS.FOUND);
      return { ok: true, vehiculo: data, error: null };
    } catch (err) {
      const msg = err.message ?? "Error al procesar el alta.";
      setErrorMsg(msg);
      setEstado(STATUS.ERROR);
      return { ok: false, vehiculo: null, error: msg };
    }
  }, []);

  return {
    vehiculoActual,
    estado,
    errorMsg,
    isLoading: estado === "loading",
    sugerencias,
    buscarVehiculo,
    sugerirVehiculos,
    agregarVehiculo,
    resetVehiculo,
    agregarVehiculoYPropietario,
  };
}

// ─── Helper: resolver IDs desde nombres ──────────────────────────────────
//
// El modal maneja nombres en texto (lo que el usuario ve en los selects).
// Antes de llamar a agregarVehiculo(), necesitás los UUIDs de marca y modelo.
// Este helper los resuelve en un solo query.
//
// Uso en ModalVehiculo al hacer submit:
//
//   import { resolverIdsVehiculo } from "@/hooks/useVehiculos";
//
//   const ids = await resolverIdsVehiculo(values.marca, values.modelo);
//   if (!ids) { toast.error("Marca o modelo no encontrado."); return; }
//   agregarVehiculo({ ...values, ...ids });
//
export async function resolverIdsVehiculo(marcaNombre, modeloNombre) {
  const { data, error } = await supabase.from("modelos").select("id, marca_id, marcas(nombre)").eq("nombre", modeloNombre).eq("marcas.nombre", marcaNombre).maybeSingle();

  if (error || !data) return null;

  return {
    marca_id: data.marca_id,
    modelo_id: data.id,
  };
}
