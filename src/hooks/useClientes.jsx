import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { escSearch } from "@/utils/fmt";
import { audit } from "@/lib/audit";

const STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
};

export function useClientes() {
  const [clientes, setClientes] = useState([]);
  const [estado, setEstado] = useState(STATUS.IDLE); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState(null);
  const [propietarioActual, setPropietarioActual] = useState(null);
  const [propietarioQuery, setPropietarioQuery] = useState("");
  const [buscandoPropietario, setBuscandoPropietario] = useState(false);
  const [sugerenciasPropietario, setSugerenciasPropietario] = useState([]);

  /** Búsqueda completa al presionar Buscar */
  const buscarPropietario = useCallback(async (q) => {
    if (!q?.trim()) return;
    setBuscandoPropietario(true);
    const term = q.trim().toLowerCase();

    const { data, error } = await supabase.from("clientes").select("id, nombre, apellido, telefono, email").or(`nombre.ilike.%${escSearch(term)}%,apellido.ilike.%${escSearch(term)}%,telefono.ilike.%${escSearch(term)}%`).limit(10);

    setBuscandoPropietario(false);
    if (error || !data?.length) return;
    // Si hay exactamente uno, lo seleccionamos directo
    if (data.length === 1) {
      setPropietarioActual(data[0]);
      setSugerenciasPropietario([]);
    } else {
      setSugerenciasPropietario(data);
    }
  }, []);

  /** Filtra sugerencias mientras el usuario escribe */
  const sugerirPropietarios = useCallback(async (q) => {
    if (!q || q.trim().length < 2) {
      setSugerenciasPropietario([]);
      return;
    }
    const term = q.trim().toLowerCase();
    const { data } = await supabase.from("clientes").select("id, nombre, apellido, telefono, email").or(`nombre.ilike.%${escSearch(term)}%,apellido.ilike.%${escSearch(term)}%,telefono.ilike.%${escSearch(term)}%`).limit(6);
    setSugerenciasPropietario(data ?? []);
  }, []);

  /** Selecciona desde el dropdown */
  const seleccionarPropietario = useCallback((cliente) => {
    setPropietarioActual(cliente);
    setSugerenciasPropietario([]);
    setPropietarioQuery(`${cliente.nombre ?? ""} ${cliente.apellido ?? ""}`.trim());
  }, []);

  /** Editar un cliente existente por ID */
  const editarCliente = useCallback(async (id, datos) => {
    setEstado(STATUS.LOADING);
    setErrorMsg(null);

    const clienteFormateado = {
      nombre: datos.nombre.trim().toLowerCase(),
      apellido: datos.apellido.trim().toLowerCase(),
      telefono: datos.telefono.trim(),
      email: datos.email.trim(),
    };

    try {
      const { data, error } = await supabase
        .from("clientes")
        .update(clienteFormateado)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      setClientes((prev) => prev.map((c) => (c.id === id ? data : c)));
      setEstado(STATUS.SUCCESS);

      audit("cliente.editar", "clientes", id);
      return { ok: true, cliente: data, error: null };
    } catch (err) {
      const msg = err.message || "Error al actualizar el cliente.";
      setErrorMsg(msg);
      setEstado(STATUS.ERROR);
      return { ok: false, cliente: null, error: msg };
    }
  }, []);

  /** Limpia todo */
  const resetPropietario = useCallback(() => {
    setPropietarioActual(null);
    setPropietarioQuery("");
    setSugerenciasPropietario([]);
  }, []);

  // Función para dar de alta un nuevo cliente en Supabase
  const nuevoCliente = useCallback(async (datosCliente) => {
    setEstado(STATUS.LOADING);
    setErrorMsg(null);

    // Formateamos nombre y apellido a minúsculas, y limpiamos espacios de más
    const clienteFormateado = {
      nombre: datosCliente.nombre.trim().toLowerCase(),
      apellido: datosCliente.apellido.trim().toLowerCase(),
      telefono: datosCliente.telefono.trim(),
      email: datosCliente.email.trim(),
    };

    try {
      const { data, error } = await supabase
        .from("clientes")
        .insert([clienteFormateado])
        .select() // Trae el objeto recién creado con su ID, created_at, etc.
        .single();

      if (error) {
        // Capturamos si el email o teléfono ya existen (si tenés un índice UNIQUE en la DB)
        if (error.code === "23505") {
          throw new Error("El email o teléfono ya se encuentran registrados.");
        }
        throw error;
      }

      // Actualizamos el estado local agregando el cliente al principio de la lista
      setClientes((prev) => [data, ...prev]);
      setEstado(STATUS.SUCCESS);

      audit("cliente.crear", "clientes", data.id, { nombre: data.nombre, apellido: data.apellido });
      return { ok: true, cliente: data, error: null };
    } catch (err) {
      const msg = err.message || "Error al registrar el cliente.";
      setErrorMsg(msg);
      setEstado(STATUS.ERROR);
      return { ok: false, cliente: null, error: msg };
    }
  }, []);

  return {
    propietarioActual,
    propietarioQuery,
    setPropietarioQuery,
    buscandoPropietario,
    sugerenciasPropietario,
    buscarPropietario,
    sugerirPropietarios,
    seleccionarPropietario,
    resetPropietario,
    clientes,
    estado,
    errorMsg,
    isLoading: estado === STATUS.LOADING,
    nuevoCliente,
    editarCliente,
  };
}
