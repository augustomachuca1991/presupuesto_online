// src/components/vehiculo/VehiculoBuscador.jsx
//
// Select desplegable con buscador — mismo patrón que PropietarioBuscador.
// Al abrir muestra los últimos 5 vehículos. Al escribir filtra por dominio,
// marca o modelo en tiempo real.
// Botón "Nuevo" para dar de alta un vehículo que no existe.

import { useRef, useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

async function fetchVehiculosIniciales(limit = 5) {
  const { data, error } = await supabase.from("v_vehiculos").select("id, dominio, marca, modelo, anio, color").order("created_at", { ascending: false }).limit(limit);
  if (error) console.error("[VehiculoBuscador]", error.message);
  return data ?? [];
}

async function fetchVehiculosBusqueda(q) {
  const term = q.trim();
  // Dos queries separados para evitar el 400 del or() con columnas mixtas
  const [r1, r2] = await Promise.all([
    supabase.from("v_vehiculos").select("id, dominio, marca, modelo, anio, color").ilike("dominio", `%${term.toUpperCase()}%`).limit(5),
    supabase.from("v_vehiculos").select("id, dominio, marca, modelo, anio, color").or(`marca.ilike.%${term}%,modelo.ilike.%${term}%`).limit(5),
  ]);
  const todos = [...(r1.data ?? []), ...(r2.data ?? [])];
  const vistos = new Set();
  return todos
    .filter((v) => {
      if (vistos.has(v.id)) return false;
      vistos.add(v.id);
      return true;
    })
    .slice(0, 8);
}

export function VehiculoBuscador({ vehiculoActual, onSeleccionar, onNuevo, onQuitarVehiculo }) {
  const [open, setOpen] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [vehiculos, setVehiculos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const wrapRef = useRef(null);
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  // Cerrar al click fuera
  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleOpen = useCallback(async () => {
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
    if (!busqueda.trim()) {
      setCargando(true);
      const data = await fetchVehiculosIniciales(5);
      setVehiculos(data);
      setCargando(false);
    }
  }, [busqueda]);

  const handleBusqueda = useCallback((val) => {
    setBusqueda(val);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      setCargando(true);
      const data = val.trim().length >= 1 ? await fetchVehiculosBusqueda(val) : await fetchVehiculosIniciales(5);
      setVehiculos(data);
      setCargando(false);
    }, 250);
  }, []);

  const handleSeleccionar = (vehiculo) => {
    setOpen(false);
    setBusqueda("");
    onSeleccionar(vehiculo);
  };

  // ── Tarjeta cuando ya hay vehículo seleccionado ───────────────────────────
  if (vehiculoActual) {
    return (
      <div className="mb-4">
        <label className="block text-[11px] font-semibold text-ant3 uppercase tracking-widest mb-1.5">Vehículo</label>
        <div className="flex items-center gap-2.5 px-3 py-2.5 bg-ant rounded-xl border border-border">
          <i className="ti ti-car text-[18px] text-yel shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-[14px] font-bold text-antl font-mono tracking-wider">{vehiculoActual.dominio}</div>
            <div className="text-[11px] text-antm truncate mt-0.5">
              {vehiculoActual.marca} {vehiculoActual.modelo} {vehiculoActual.anio}
              {vehiculoActual.color && ` · ${vehiculoActual.color}`}
            </div>
          </div>
          {vehiculoActual.esNuevo ? (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-yell text-yeld shrink-0">NUEVO</span>
          ) : (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#EAF3DE] text-[#27500A] shrink-0">✓ Encontrado</span>
          )}
          <button onClick={onQuitarVehiculo} className="text-ant3 hover:text-antl transition-colors shrink-0 cursor-pointer p-1 rounded hover:bg-white/10" title="Quitar vehículo">
            <i className="ti ti-x text-[15px]" />
          </button>
        </div>
      </div>
    );
  }

  // ── Select desplegable con buscador ──────────────────────────────────────
  return (
    <div className="mb-4">
      <label className="block text-[11px] font-semibold text-ant3 uppercase tracking-widest mb-1.5">Vehículo</label>

      <div className="flex gap-2">
        <div className="relative flex-1" ref={wrapRef}>
          {/* Trigger */}
          <button
            type="button"
            onClick={handleOpen}
            className={`w-full flex items-center gap-2 px-3 h-9 rounded-md border text-left text-[13px] transition-all cursor-pointer
              ${open ? "border-yel ring-1 ring-yel/30 bg-white" : "border-border bg-white hover:border-ant3"}`}
          >
            <i className="ti ti-car text-[15px] text-ant3 shrink-0" />
            <span className="flex-1 text-ant3 font-mono select-none">Seleccioná un vehículo...</span>
            <i className={`ti ti-chevron-down text-[13px] text-ant3 transition-transform duration-150 ${open ? "rotate-180" : ""}`} />
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute z-40 left-0 right-0 top-[calc(100%+4px)] bg-white border border-border rounded-xl shadow-lg overflow-hidden">
              {/* Input de búsqueda */}
              <div className="p-2 border-b border-border">
                <div className="relative">
                  <i className="ti ti-search absolute left-2.5 top-1/2 -translate-y-1/2 text-[13px] text-ant3 pointer-events-none" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={busqueda}
                    onChange={(e) => handleBusqueda(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
                    placeholder="Dominio, marca o modelo..."
                    className="w-full pl-8 pr-3 h-8 rounded-md border border-border text-[12px] text-ant font-mono bg-white outline-none focus:border-yel focus:ring-1 focus:ring-yel/30 transition uppercase"
                    autoComplete="off"
                  />
                </div>
              </div>

              {/* Lista */}
              <ul className="max-h-52 overflow-y-auto divide-y divide-border">
                {cargando ? (
                  <li className="flex items-center justify-center gap-2 py-5 text-[12px] text-ant3">
                    <i className="ti ti-loader-2 animate-spin text-[14px]" /> Buscando...
                  </li>
                ) : vehiculos.length === 0 ? (
                  <li className="py-5 text-center text-[12px] text-ant3">{busqueda.trim() ? "Sin resultados." : "No hay vehículos registrados."}</li>
                ) : (
                  vehiculos.map((v) => (
                    <li key={v.id}>
                      <button type="button" onMouseDown={() => handleSeleccionar(v)} className="w-full text-left px-3 py-2.5 flex items-center gap-2.5 hover:bg-antl transition-colors cursor-pointer">
                        <div className="w-7 h-7 rounded-full bg-antl flex items-center justify-center shrink-0">
                          <i className="ti ti-car text-[13px] text-ant2" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[13px] font-bold text-ant font-mono">{v.dominio}</span>
                            <span className="text-[11px] text-ant3">
                              {v.marca} {v.modelo} {v.anio}
                            </span>
                          </div>
                          {v.color && (
                            <div className="text-[11px] text-ant3 truncate">
                              <i className="ti ti-palette text-[10px] mr-0.5" />
                              {v.color}
                            </div>
                          )}
                        </div>
                      </button>
                    </li>
                  ))
                )}
              </ul>

              {/* Footer */}
              <div className="px-3 py-1.5 border-t border-border bg-antl">
                <p className="text-[10px] text-ant3">{busqueda.trim() ? `${vehiculos.length} resultado${vehiculos.length !== 1 ? "s" : ""}` : "Mostrando los últimos 5 — escribí para filtrar"}</p>
              </div>
            </div>
          )}
        </div>

        {/* Botón nuevo vehículo */}
        <button
          type="button"
          onClick={onNuevo}
          className="bg-ant text-antl text-[13px] font-medium px-3.5 h-9 rounded-md flex items-center gap-1.5 hover:bg-ant2 cursor-pointer shrink-0 transition-colors"
          title="Dar de alta un vehículo nuevo"
        >
          <i className="ti ti-plus text-[14px]" />
          <span className="hidden sm:inline">Nuevo</span>
        </button>
      </div>
    </div>
  );
}
