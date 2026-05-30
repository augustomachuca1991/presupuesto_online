// src/components/ui/FormComponents.jsx
import React from "react";

// Tus constantes originales exactas para mantener la consistencia oscura
const CAMPO_BASE =
  "w-full px-3 h-9 rounded-md border border-border bg-ant text-[13px] text-antl placeholder:text-ant3 focus:outline-none focus:border-yel focus:ring-1 focus:ring-yel/30 transition disabled:opacity-50 disabled:bg-ant/50";
const LABEL_BASE = "block text-[11px] font-semibold text-antm uppercase tracking-wide mb-1";

// Conservamos tu variante para el modo vista/lectura adaptado a este mismo esquema
const VISTA_TEXTO_BASE = "w-full px-3 h-9 rounded-md border border-transparent bg-ant/40 text-[13px] text-antl/70 flex items-center";

/**
 * Componente Label unificado
 */
export function Label({ children, required }) {
  return (
    <label className={LABEL_BASE}>
      {children}
      {required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
  );
}

/**
 * Input de Texto / Número Genérico
 */
export function FormInput({ label, required, error, isEditing = true, valueText, className = "", ...props }) {
  return (
    <div className="w-full">
      {label && <Label required={required}>{label}</Label>}

      {isEditing ? (
        <input className={`${CAMPO_BASE} ${error ? "border-red-400 focus:border-red-400 focus:ring-red-400/20" : ""} ${className}`} {...props} />
      ) : (
        <div className={`${VISTA_TEXTO_BASE} ${className}`}>{valueText || props.value || "—"}</div>
      )}

      {isEditing && error && <p className="text-[11px] text-red-400 mt-1">{error}</p>}
    </div>
  );
}

/**
 * Selector / Dropdown Genérico
 */
export function FormSelect({ label, required, error, isEditing = true, valueText, children, className = "", ...props }) {
  return (
    <div className="w-full">
      {label && <Label required={required}>{label}</Label>}

      {isEditing ? (
        <select className={`${CAMPO_BASE} ${error ? "border-red-400 focus:border-red-400 focus:ring-red-400/20" : ""} ${className}`} {...props}>
          {children}
        </select>
      ) : (
        <div className={`${VISTA_TEXTO_BASE} ${className}`}>{valueText || "—"}</div>
      )}

      {isEditing && error && <p className="text-[11px] text-red-400 mt-1">{error}</p>}
    </div>
  );
}
