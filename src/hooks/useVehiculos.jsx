// src/hooks/useVehiculos.js
import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { escSearch } from "@/utils/fmt";

// ─── Queries privadas ─────────────────────────────────────────────────────

async function _buscarPorDominio(dominio) {
  const { data, error } = await supabase.from("v_vehiculos").select("*").eq("dominio", dominio.trim().toUpperCase()).maybeSingle();
  if (error) throw error;
  return data;
}

async function _sugerirDominios(query) {
  if (!query || query.length < 2) return [];
  const { data, error } = await supabase.from("v_vehiculos").select("id, dominio, marca, modelo, anio, color").ilike("dominio", `%${escSearch(query.trim().toUpperCase())}%`).order("dominio").limit(5);
  if (error) throw error;
  return data ?? [];
}

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

const PAGE_SIZE = 20;

// ─── Hook ─────────────────────────────────────────────────────────────────
export function useVehiculos() {
  const [vehiculoActual, setVehiculoActual] = useState(null);
  const [estado, setEstado] = useState(STATUS.IDLE);
  const [errorMsg, setErrorMsg] = useState(null);
  const [sugerencias, setSugerencias] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [cargandoMas, setCargandoMas] = useState(false);

  const resetVehiculo = useCallback(() => {
    setVehiculoActual(null);
    setEstado(STATUS.IDLE);
    setErrorMsg(null);
    setSugerencias([]);
  }, []);

  // ── Carga inicial con paginación ──────────────────────────────────────────
  const cargarVehiculos = useCallback(async () => {
    setEstado(STATUS.LOADING);
    const { data, error, count } = await supabase
      .from("v_vehiculos")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(0, PAGE_SIZE - 1);
    if (error) {
      setErrorMsg(error.message);
      setEstado(STATUS.ERROR);
      return;
    }
    setVehiculos(data ?? []);
    setTotalCount(count ?? 0);
    setEstado(STATUS.IDLE);
  }, []);

  // ── Cargar más resultados ─────────────────────────────────────────────────
  const cargarMasVehiculos = useCallback(async () => {
    const desde = vehiculos.length;
    setCargandoMas(true);
    const { data, error } = await supabase
      .from("v_vehiculos")
      .select("*")
      .order("created_at", { ascending: false })
      .range(desde, desde + PAGE_SIZE - 1);
    if (!error && data?.length) {
      setVehiculos((prev) => [...prev, ...data]);
    }
    setCargandoMas(false);
  }, [vehiculos.length]);

  const cargarModelos = useCallback(async (marcaId = null) => {
    const data = await _cargarModelos(marcaId);
    setModelos(data);
  }, []);

  useEffect(() => {
    cargarVehiculos();
    _cargarMarcas().then(setMarcas);
    _cargarModelos().then(setModelos);
  }, [cargarVehiculos]);

  // ── Autocomplete ──────────────────────────────────────────────────────────
  const sugerirVehiculos = useCallback(async (query) => {
    try {
      setSugerencias(await _sugerirDominios(query));
    } catch {
      setSugerencias([]);
    }
  }, []);

  // ── Buscar por dominio ────────────────────────────────────────────────────
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

  // ── Agregar vehículo simple ───────────────────────────────────────────────
  const agregarVehiculo = useCallback(
    async (datosVehiculo) => {
      setEstado(STATUS.LOADING);
      setErrorMsg(null);
      const dominio = datosVehiculo.dominio.toUpperCase().trim().replace(/\s+/g, "");
      try {
        const { data: v, error } = await supabase
          .from("vehiculos")
          .insert([
            {
              dominio,
              marca_id: datosVehiculo.marca_id,
              modelo_id: datosVehiculo.modelo_id,
              anio: parseInt(datosVehiculo.anio, 10),
              color: datosVehiculo.color || null,
              codigo_pintura: datosVehiculo.codigoPintura || datosVehiculo.codigo_pintura || null,
            },
          ])
          .select("id")
          .single();
        if (error) {
          if (error.code === "23505") throw new Error(`El dominio ${dominio} ya está registrado.`);
          throw error;
        }
        const { data: vehiculo, error: errVista } = await supabase.from("v_vehiculos").select("*").eq("id", v.id).single();
        if (errVista) throw errVista;
        setVehiculoActual({ ...vehiculo, esNuevo: true });
        setEstado(STATUS.FOUND);
        await cargarVehiculos();
        return { ok: true, vehiculo, error: null };
      } catch (err) {
        const msg = err.message ?? "Error al dar de alta el vehículo.";
        setErrorMsg(msg);
        setEstado(STATUS.ERROR);
        return { ok: false, vehiculo: null, error: msg };
      }
    },
    [cargarVehiculos]
  );

  // ── Agregar vehículo + propietario (RPC atómico) ──────────────────────────
  // Usa la función insertar_vehiculo_y_cliente del migration 009.
  // Devuelve { ok, vehiculo, cliente, error } — el page usa `cliente`
  // para llamar seleccionarPropietario() y mostrarlo seleccionado.
  const agregarVehiculoYPropietario = useCallback(
    async (datos) => {
      setEstado(STATUS.LOADING);
      setErrorMsg(null);
      const dominio = datos.dominio.toUpperCase().trim().replace(/\s+/g, "");
      try {
        const { data, error } = await supabase.rpc("insertar_vehiculo_y_cliente", {
          p_nombre: datos.titularNombre.trim().toLowerCase(),
          p_apellido: datos.titularApellido.trim().toLowerCase(),
          p_email: datos.titularEmail?.trim() || null,
          p_telefono: datos.titularTelefono?.trim() || null,
          p_dominio: dominio,
          p_marca_id: datos.marca_id,
          p_modelo_id: datos.modelo_id,
          p_anio: parseInt(datos.anio, 10),
          p_color: datos.color || null,
          p_codigo_pintura: datos.codigoPintura?.toUpperCase().trim() || null,
        });

        if (error) {
          if (error.message.includes("vehiculos_dominio_key") || error.code === "23505") throw new Error(`El dominio ${dominio} ya está registrado.`);
          throw error;
        }

        // El RPC devuelve JSON con vehiculo_id, cliente_id y todos los campos
        const vehiculo = {
          id: data.vehiculo_id,
          dominio: data.dominio,
          marca: data.marca,
          modelo: data.modelo,
          anio: data.anio,
          color: data.color,
          codigo_pintura: data.codigo_pintura,
          esNuevo: true,
        };

        // Objeto cliente listo para pasarlo a seleccionarPropietario()
        const cliente = {
          id: data.cliente_id,
          nombre: data.cliente_nombre,
          apellido: data.cliente_apellido,
          telefono: data.cliente_telefono,
          email: data.cliente_email,
        };

        setVehiculoActual(vehiculo);
        setEstado(STATUS.FOUND);
        await cargarVehiculos();
        return { ok: true, vehiculo, cliente, error: null };
      } catch (err) {
        const msg = err.message ?? "Error al procesar el alta.";
        setErrorMsg(msg);
        setEstado(STATUS.ERROR);
        return { ok: false, vehiculo: null, cliente: null, error: msg };
      }
    },
    [cargarVehiculos]
  );

  // ── Editar vehículo ───────────────────────────────────────────────────────
  const editarVehiculo = useCallback(
    async (id, datos) => {
      setEstado(STATUS.LOADING);
      setErrorMsg(null);
      const dominio = datos.dominio?.toUpperCase().trim().replace(/\s+/g, "") ?? "";
      try {
        const { error } = await supabase
          .from("vehiculos")
          .update({
            dominio,
            marca_id: datos.marca_id,
            modelo_id: datos.modelo_id,
            anio: parseInt(datos.anio, 10),
            color: datos.color || null,
            codigo_pintura: datos.codigoPintura || datos.codigo_pintura || null,
          })
          .eq("id", id);
        if (error) {
          if (error.code === "23505") throw new Error(`El dominio ${dominio} ya está registrado.`);
          throw error;
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

  // ── Eliminar vehículo ─────────────────────────────────────────────────────
  const eliminarVehiculo = useCallback(
    async (id) => {
      setEstado(STATUS.LOADING);
      setErrorMsg(null);
      try {
        const { error } = await supabase.from("vehiculos").delete().eq("id", id);
        if (error) throw error;
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

  const puedeCargarMas = vehiculos.length < totalCount;

  return {
    vehiculoActual,
    vehiculos,
    estado,
    errorMsg,
    error: errorMsg,
    isLoading: estado === STATUS.LOADING,
    sugerencias,
    marcas,
    modelos,
    totalCount,
    puedeCargarMas,
    cargandoMas,
    buscarVehiculo,
    sugerirVehiculos,
    resetVehiculo,
    cargarModelos,
    refetch: cargarVehiculos,
    cargarMasVehiculos,
    crearVehiculo: agregarVehiculo,
    agregarVehiculo,
    agregarVehiculoYPropietario,
    editarVehiculo,
    eliminarVehiculo,
  };
}

