// src/components/propietario/PropietarioBuscador.jsx

import { useRef, useEffect, useState } from "react";

/**
 * Props:
 *  - query: string                  — texto de búsqueda controlado
 *  - onQueryChange: (val) => void   — actualiza el query en el padre
 *  - onBuscar: () => void           — dispara la búsqueda
 *  - isLoading: bool
 *  - propietarioActual: object|null — cliente seleccionado
 *  - sugerencias: array             — lista de clientes que matchean
 *  - onSugerir: (val) => void       — filtra sugerencias mientras se escribe
 *  - onSeleccionarSugerencia: (cliente) => void
 *  - onQuitarPropietario: () => void
 */
export function PropietarioBuscador({ query, onQueryChange, onBuscar, isLoading, propietarioActual, sugerencias = [], onSugerir, onSeleccionarSugerencia, onQuitarPropietario }) {
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  /* Cierra dropdown al click fuera */
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    onQueryChange(val);
    if (val.trim().length >= 2) {
      onSugerir?.(val);
      setDropdownOpen(true);
    } else {
      setDropdownOpen(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setDropdownOpen(false);
      onBuscar();
    }
    if (e.key === "Escape") {
      setDropdownOpen(false);
    }
  };

  const handleSeleccionar = (cliente) => {
    setDropdownOpen(false);
    onSeleccionarSugerencia(cliente);
  };

  const nombreCompleto = (c) => {
    const texto = `${c.nombre ?? ""} ${c.apellido ?? ""}`.trim();

    return texto
      .toLowerCase()
      .split(/\s+/)
      .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
      .join(" ");
  };

  /* ── Si ya hay propietario seleccionado ── */
  if (propietarioActual) {
    return (
      <div className="mb-4">
        <label className="block text-[11px] font-semibold text-antm uppercase tracking-wide mb-1.5">Propietario</label>
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
          <button onClick={onQuitarPropietario} className="text-ant3 hover:text-ant transition-colors ml-auto shrink-0 cursor-pointer" title="Quitar propietario">
            <i className="ti ti-x text-[15px]" />
          </button>
        </div>
      </div>
    );
  }

  /* ── Formulario de búsqueda ── */
  return (
    <div className="mb-4">
      <label className="block text-[11px] font-semibold text-antm uppercase tracking-wide mb-1.5">Propietario</label>

      <div className="relative" ref={dropdownRef}>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <i className="ti ti-user-search absolute left-2.5 top-1/2 -translate-y-1/2 text-[15px] text-antm pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Nombre, apellido o teléfono…"
              className="w-full pl-8 pr-3 h-9 rounded-md border border-border bg-white text-[13px] text-ant placeholder:text-ant3 focus:outline-none focus:border-yel focus:ring-1 focus:ring-yel/30 transition"
              autoComplete="off"
            />
          </div>

          <button
            onClick={() => {
              setDropdownOpen(false);
              onBuscar();
            }}
            disabled={isLoading || !query.trim()}
            className={`h-9 px-3.5 rounded-md text-[13px] font-semibold flex items-center gap-1.5 transition-colors
              ${isLoading || !query.trim() ? "bg-border text-ant3 cursor-not-allowed" : "bg-yel text-yeld hover:bg-yelm cursor-pointer"}`}
          >
            {isLoading ? <i className="ti ti-loader-2 animate-spin text-[15px]" /> : <i className="ti ti-search text-[15px]" />}
            Buscar
          </button>
        </div>

        {/* Dropdown de sugerencias */}
        {dropdownOpen && sugerencias.length > 0 && (
          <ul className="absolute z-30 left-0 right-0 top-[calc(100%+4px)] bg-ant border border-border rounded-xl shadow-lg overflow-hidden">
            {sugerencias.map((c) => (
              <li key={c.id}>
                <button onClick={() => handleSeleccionar(c)} className="w-full text-left px-3 py-2 flex items-center gap-2.5 transition-colors cursor-pointer">
                  <i className="ti ti-user text-[15px] text-yel shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[13px] font-medium text-antl truncate">{nombreCompleto(c)}</div>
                    {(c.telefono || c.email) && <div className="text-[11px] text-antm truncate">{[c.telefono, c.email].filter(Boolean).join(" · ")}</div>}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
