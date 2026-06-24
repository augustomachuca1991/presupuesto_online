// src/components/clientes/PropietarioBuscador.jsx
//
// Campo tipo "select con buscador":
// — Al hacer click muestra un dropdown con los primeros 5 clientes
// — Al escribir filtra en tiempo real con debounce
// — Al seleccionar muestra la tarjeta del propietario

import { useRef, useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { escSearch } from "@/utils/fmt";

const capitalizar = (s = "") =>
  s
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();

const nombreCompleto = (c) => capitalizar(`${c.nombre ?? ""} ${c.apellido ?? ""}`);

async function fetchClientesIniciales(limit = 5) {
  const { data } = await supabase.from("clientes").select("id, nombre, apellido, telefono, email").order("apellido").limit(limit);
  return data ?? [];
}

async function fetchClientesBusqueda(q) {
  const term = q.trim().toLowerCase();
  const { data } = await supabase
    .from("clientes")
    .select("id, nombre, apellido, telefono, email")
    .or(`nombre.ilike.%${escSearch(term)}%,apellido.ilike.%${escSearch(term)}%,telefono.ilike.%${escSearch(term)}%`)
    .order("apellido")
    .limit(8);
  return data ?? [];
}

export function PropietarioBuscador({ propietarioActual, onSeleccionarSugerencia, onQuitarPropietario, onNuevo }) {
  const [open, setOpen] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [clientes, setClientes] = useState([]);
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

  // Al abrir sin texto → cargar iniciales
  const handleOpen = useCallback(async () => {
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
    if (!busqueda.trim()) {
      setCargando(true);
      const data = await fetchClientesIniciales(5);
      setClientes(data);
      setCargando(false);
    }
  }, [busqueda]);

  // Debounce búsqueda mientras escribe
  const handleBusqueda = useCallback((val) => {
    setBusqueda(val);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      setCargando(true);
      const data = val.trim().length >= 1 ? await fetchClientesBusqueda(val) : await fetchClientesIniciales(5);
      setClientes(data);
      setCargando(false);
    }, 250);
  }, []);

  const handleSeleccionar = (cliente) => {
    setOpen(false);
    setBusqueda("");
    onSeleccionarSugerencia(cliente);
  };

  // ── Tarjeta cuando ya hay propietario seleccionado ────────────────────────
  if (propietarioActual) {
    return (
      <div className="mb-4">
        <label className="block text-[11px] font-semibold text-ant3 uppercase tracking-widest mb-1.5">Propietario</label>
        <div className="flex items-center gap-2.5 px-3 py-2.5 bg-ant rounded-xl border border-border">
          <i className="ti ti-user-check text-[18px] text-yel shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold text-antl truncate">{nombreCompleto(propietarioActual)}</div>
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
              {propietarioActual.telefono && (
                <span className="text-[11px] text-antm flex items-center gap-1">
                  <i className="ti ti-phone text-[10px]" />
                  {propietarioActual.telefono}
                </span>
              )}
              {propietarioActual.email && (
                <span className="text-[11px] text-antm flex items-center gap-1 truncate">
                  <i className="ti ti-mail text-[10px]" />
                  {propietarioActual.email}
                </span>
              )}
            </div>
          </div>
          <button onClick={onQuitarPropietario} className="text-ant3 hover:text-antl transition-colors ml-auto shrink-0 cursor-pointer p-1 rounded hover:bg-white/10" title="Quitar propietario">
            <i className="ti ti-x text-[15px]" />
          </button>
        </div>
      </div>
    );
  }

  // ── Select desplegable con buscador ──────────────────────────────────────
  return (
    <div className="mb-4">
      <label className="block text-[11px] font-semibold text-ant3 uppercase tracking-widest mb-1.5">Propietario</label>

      {/* Contenedor Flex para alinear el Selector y el Botón "Nuevo" */}
      <div className="flex gap-2 items-center">
        {/* El wrapper del dropdown ahora consume el espacio restante de la fila */}
        <div className="relative flex-1" ref={wrapRef}>
          {/* Trigger */}
          <button
            type="button"
            onClick={handleOpen}
            className={`w-full flex items-center gap-2 px-3 h-9 rounded-md border text-left text-[13px] transition-all cursor-pointer
              ${open ? "border-yel ring-1 ring-yel/30 bg-white" : "border-border bg-white hover:border-ant3"}`}
          >
            <i className="ti ti-user-search text-[15px] text-ant3 shrink-0" />
            <span className="flex-1 text-ant3 select-none">Seleccioná un propietario...</span>
            <i className={`ti ti-chevron-down text-[13px] text-ant3 transition-transform duration-150 ${open ? "rotate-180" : ""}`} />
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute z-40 left-0 right-0 top-[calc(100%+4px)] bg-white border border-border rounded-xl shadow-lg overflow-hidden">
              {/* Input de búsqueda interno */}
              <div className="p-2 border-b border-border">
                <div className="relative">
                  <i className="ti ti-search absolute left-2.5 top-1/2 -translate-y-1/2 text-[13px] text-ant3 pointer-events-none" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={busqueda}
                    onChange={(e) => handleBusqueda(e.target.value)}
                    onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
                    placeholder="Buscar por nombre, apellido o teléfono..."
                    className="w-full pl-8 pr-3 h-8 rounded-md border border-border text-[12px] text-ant bg-white outline-none focus:border-yel focus:ring-1 focus:ring-yel/30 transition"
                    autoComplete="off"
                  />
                </div>
              </div>

              {/* Lista de clientes */}
              <ul className="max-h-52 overflow-y-auto divide-y divide-border">
                {cargando ? (
                  <li className="flex items-center justify-center gap-2 py-5 text-[12px] text-ant3">
                    <i className="ti ti-loader-2 animate-spin text-[14px]" /> Buscando...
                  </li>
                ) : clientes.length === 0 ? (
                  <li className="py-5 text-center text-[12px] text-ant3">{busqueda.trim() ? "Sin resultados para esa búsqueda." : "No hay clientes registrados."}</li>
                ) : (
                  // Usamos onMouseDown en lugar de onClick para evitar que el blur cierre el modal antes de capturar el evento
                  clientes.map((c) => (
                    <li key={c.id}>
                      <button type="button" onMouseDown={() => handleSeleccionar(c)} className="w-full text-left px-3 py-2.5 flex items-center gap-2.5 hover:bg-antl transition-colors cursor-pointer">
                        <div className="w-7 h-7 rounded-full bg-antl flex items-center justify-center shrink-0">
                          <i className="ti ti-user text-[13px] text-ant2" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[13px] font-medium text-ant truncate">{nombreCompleto(c)}</div>
                          {(c.telefono || c.email) && <div className="text-[11px] text-ant3 truncate">{[c.telefono, c.email].filter(Boolean).join(" · ")}</div>}
                        </div>
                      </button>
                    </li>
                  ))
                )}
              </ul>

              {/* Footer con hint */}
              <div className="px-3 py-1.5 border-t border-border bg-antl">
                <p className="text-[10px] text-ant3">{busqueda.trim() ? `${clientes.length} resultado${clientes.length !== 1 ? "s" : ""}` : "Mostrando los primeros 5 — escribí para filtrar"}</p>
              </div>
            </div>
          )}
        </div>

        {/* Botón nuevo propietario */}
        <button
          type="button"
          onClick={onNuevo}
          className="bg-ant text-antl text-[13px] font-medium px-3.5 h-9 rounded-md flex items-center gap-1.5 hover:bg-ant2 cursor-pointer shrink-0 transition-colors"
          title="Dar de alta un propietario nuevo"
        >
          <i className="ti ti-plus text-[14px]" />
          <span className="hidden sm:inline">Nuevo</span>
        </button>
      </div>
    </div>
  );
}
