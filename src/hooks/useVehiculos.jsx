// src/hooks/useVehiculos.js

import { useState, useCallback } from "react";
import { vehiculosMock } from "@/data/vehiculosMock";

const delay = (ms = 250) => new Promise((res) => setTimeout(res, ms));

let _db = [...vehiculosMock];

async function _mockBuscar(dominio) {
  await delay(200 + Math.random() * 150);
  return _db.find((v) => v.dominio === dominio) ?? null;
}

async function _mockAgregar(vehiculo) {
  await delay(200 + Math.random() * 150);
  const existe = _db.some((v) => v.dominio === vehiculo.dominio);
  if (existe) throw new Error(`El dominio ${vehiculo.dominio} ya está registrado.`);
  _db = [..._db, vehiculo];
  return vehiculo;
}

// Busca coincidencias parciales, máximo 5
function _mockSugerir(query) {
  if (!query || query.length < 2) return [];
  const q = query.toUpperCase();
  return _db.filter((v) => v.dominio.includes(q)).slice(0, 5);
}

export function useVehiculos() {
  const [vehiculoActual, setVehiculoActual] = useState(null);
  const [estado, setEstado] = useState("idle");
  const [errorMsg, setErrorMsg] = useState(null);
  const [sugerencias, setSugerencias] = useState([]);

  const resetVehiculo = useCallback(() => {
    setVehiculoActual(null);
    setEstado("idle");
    setErrorMsg(null);
    setSugerencias([]);
  }, []);

  const sugerirVehiculos = useCallback((query) => {
    setSugerencias(_mockSugerir(query));
  }, []);

  const buscarVehiculo = useCallback(async (dominio) => {
    const val = dominio.trim().toUpperCase();
    setSugerencias([]); // cierra el dropdown al buscar
    if (!val) {
      setErrorMsg("Ingresá un dominio para buscar.");
      setEstado("error");
      return { encontrado: false, vehiculo: null };
    }

    setEstado("loading");
    setErrorMsg(null);

    try {
      const vehiculo = await _mockBuscar(val);
      if (vehiculo) {
        setVehiculoActual({ ...vehiculo, esNuevo: false });
        setEstado("found");
        return { encontrado: true, vehiculo };
      } else {
        setVehiculoActual(null);
        setEstado("not_found");
        return { encontrado: false, vehiculo: null };
      }
    } catch (err) {
      setErrorMsg(err.message ?? "Error al buscar el vehículo.");
      setEstado("error");
      return { encontrado: false, vehiculo: null };
    }
  }, []);

  const agregarVehiculo = useCallback(async (datosVehiculo) => {
    setEstado("loading");
    setErrorMsg(null);

    try {
      const vehiculo = await _mockAgregar(datosVehiculo);
      setVehiculoActual({ ...vehiculo, esNuevo: true });
      setEstado("found");
      return { ok: true, vehiculo, error: null };
    } catch (err) {
      const msg = err.message ?? "Error al dar de alta el vehículo.";
      setErrorMsg(msg);
      setEstado("error");
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
  };
}
