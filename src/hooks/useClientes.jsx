import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase"; // Tu cliente de Supabase

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

      return { ok: true, cliente: data, error: null };
    } catch (err) {
      const msg = err.message || "Error al registrar el cliente.";
      setErrorMsg(msg);
      setEstado(STATUS.ERROR);
      return { ok: false, cliente: null, error: msg };
    }
  }, []);

  return {
    clientes,
    estado,
    errorMsg,
    isLoading: estado === STATUS.LOADING,
    nuevoCliente,
  };
}
