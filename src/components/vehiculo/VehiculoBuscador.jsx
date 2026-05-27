// src/components/vehiculo/VehiculoBuscador.jsx
import { useState } from "react";

const ALERT_CLASSES = {
  o: "bg-[#EAF3DE] text-[#27500A]",
  e: "bg-[#FCEBEB] text-[#791F1F]",
  i: "bg-antl text-ant2",
};

// Valida formato ABC123 o AB123CD
function esDominioValido(val) {
  return /^[A-Z]{3}[0-9]{3}$/.test(val) || /^[A-Z]{2}[0-9]{3}[A-Z]{2}$/.test(val);
}

export function VehiculoBuscador({ dominio, onDominioChange, onBuscar, onNuevo, isLoading, vehiculoActual, alertState, sugerencias, onSugerir, onSeleccionarSugerencia, onQuitarVehiculo }) {
  const [showSugerencias, setShowSugerencias] = useState(false);

  const handleChange = (val) => {
    const upper = val.toUpperCase();
    onDominioChange(upper);
    onSugerir(upper);
    setShowSugerencias(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setShowSugerencias(false);
      onBuscar();
    }
    if (e.key === "Escape") setShowSugerencias(false);
  };

  const handleSeleccionar = (v) => {
    onSeleccionarSugerencia(v.dominio);
    setShowSugerencias(false);
  };

  const dominioValido = esDominioValido(dominio);

  return (
    <div className="mb-5">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-widest uppercase text-ant3 mb-2">
        <i className="ti ti-car" /> Vehículo
      </div>

      {/* Barra de búsqueda */}
      <div className="flex gap-2 relative">
        <div className="flex-1 relative">
          <input
            id="dominio"
            type="text"
            value={dominio}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => dominio.length >= 2 && setShowSugerencias(true)}
            onBlur={() => setTimeout(() => setShowSugerencias(false), 150)}
            placeholder="Dominio (ej: ABC123 o AB123CD)"
            maxLength={8}
            disabled={isLoading}
            className="w-full border border-border rounded-md px-2.5 py-1.5 text-[13px] bg-white text-ant outline-none focus:border-ant disabled:opacity-50"
          />

          {/* Dropdown sugerencias */}
          {showSugerencias && sugerencias.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-md shadow-lg z-50 overflow-hidden">
              {sugerencias.map((v) => (
                <button
                  key={v.dominio}
                  onMouseDown={() => handleSeleccionar(v)}
                  className="w-full flex items-center justify-between px-3 py-2 hover:bg-antl cursor-pointer text-left border-b border-border last:border-b-0"
                >
                  <div>
                    <span className="text-[13px] font-semibold font-mono text-ant">{v.dominio}</span>
                    <span className="text-[12px] text-ant3 ml-2">
                      {v.marca} {v.modelo} {v.anio}
                    </span>
                  </div>
                  <span className="text-[11px] text-ant3">{v.titular}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={onNuevo}
          disabled={isLoading}
          className="bg-ant text-antl text-[13px] px-3.5 h-9 rounded-md flex items-center gap-1.5 hover:bg-ant2 disabled:opacity-50 cursor-pointer shrink-0"
        >
          <i className="ti ti-plus" />
          <span className="hidden sm:inline">Nuevo</span>
        </button>
      </div>

      {/* Hint de formato */}
      {dominio.length > 0 && !dominioValido && <div className="text-[11px] text-ant3 mt-1">Formato: 3 letras + 3 números (ABC123) o 2 letras + 3 números + 2 letras (AB123CD)</div>}

      {/* Alerta inline */}
      {alertState.msg && <div className={`${ALERT_CLASSES[alertState.type] ?? ALERT_CLASSES.i} text-[13px] px-3 py-2 rounded-md mt-2`}>{alertState.msg}</div>}

      {/* Tarjeta del vehículo */}
      {vehiculoActual && (
        <div className="flex items-center gap-3 bg-white border border-border rounded-xl px-4 py-3 mt-2.5">
          <div className="w-10 h-10 rounded-full bg-antl flex items-center justify-center text-lg text-ant2 shrink-0">🚗</div>
          <div className="flex-1 min-w-0">
            <div className="text-[16px] font-semibold tracking-wider font-mono text-ant">{vehiculoActual.dominio}</div>
            <div className="text-[12px] text-ant3 mt-0.5 truncate">
              {vehiculoActual.marca} {vehiculoActual.modelo} {vehiculoActual.anio} · {vehiculoActual.color} · {vehiculoActual.titular}
            </div>
          </div>
          {vehiculoActual.esNuevo ? (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-yell text-yeld shrink-0">NUEVO</span>
          ) : (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#EAF3DE] text-[#27500A] shrink-0">✓ Encontrado</span>
          )}
          <button onClick={onQuitarVehiculo} title="Quitar vehículo" className="text-ant3 hover:text-[#791f1f] hover:bg-[#fcebeb] p-1 rounded cursor-pointer transition-colors">
            <i className="ti ti-x text-[14px]" />
          </button>
        </div>
      )}
    </div>
  );
}
