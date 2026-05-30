// src/components/ui/ModalGenerico.jsx
import { useState, useEffect } from "react";

/**
 * Props:
 * isOpen          — boolean
 * titulo          — string (ej: "Vehículo")
 * subtitulo       — string (ej: "Datos del alta")
 * iconClass       — string (ej: "ti-car")
 * hasEditMode     — boolean (si es false, siempre estará en modo edición nativo)
 * initialEditMode — boolean (por si querés que abra directo editando)
 * guardando       — boolean (estado de carga del botón principal)
 * onSave          — async fn (se ejecuta al guardar)
 * onClose         — fn (se ejecuta al cerrar o cancelar)
 * children        — fn o node. Si es fn, recibe { isEditing } para condicionar los inputs
 */
export function ModalGenerico({ titulo, subtitulo, iconClass = "ti-box", hasEditMode = false, initialEditMode = true, guardando = false, onSave, onClose, children }) {
  // Si no tiene "modo lectura", por defecto siempre está editando
  const [isEditing, setIsEditing] = useState(!hasEditMode || initialEditMode);

  // Sincronizar por si cambia externamente el modo inicial
  useEffect(() => {
    setIsEditing(!hasEditMode || initialEditMode);
  }, [initialEditMode, hasEditMode]);

  const handleManejadorSubmit = async () => {
    if (!onSave) return;
    const ok = await onSave();
    // Si el guardado fue exitoso y tiene modo lectura, volvemos a bloquear los inputs
    if (ok && hasEditMode) {
      setIsEditing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-0">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Panel Contenedor: rounded-2xl unificado para que no sea bottom-sheet en mobile */}
      <div className="relative w-full sm:max-w-[480px] bg-ant rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-ant shrink-0">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-yel/10 text-yel shrink-0">
            <i className={`ti ${iconClass} text-[17px]`} />
          </span>
          <div className="flex-1 min-w-0">
            <div className="text-[14px] font-semibold text-antl">{hasEditMode && !isEditing ? `Ver — ${titulo}` : titulo}</div>
            <div className="text-[11px] text-antm">{hasEditMode && !isEditing ? "Detalles del registro en modo lectura" : subtitulo}</div>
          </div>

          {/* Botón superior dinámico para alternar edición si tiene la opción */}
          {hasEditMode && !isEditing && (
            <button onClick={() => setIsEditing(true)} className="text-[11px] font-medium text-yel hover:underline cursor-pointer mr-2">
              Editar
            </button>
          )}

          <button onClick={onClose} className="text-ant3 hover:text-antl transition-colors cursor-pointer">
            <i className="ti ti-x text-[16px]" />
          </button>
        </div>

        {/* Cuerpo Scrolleable */}
        <div className="px-5 py-4 space-y-3 overflow-y-auto flex-1">{typeof children === "function" ? children({ isEditing }) : children}</div>

        {/* Footer condicional */}
        {isEditing && (
          <div className="flex gap-2 px-5 py-4 border-t border-border bg-ant shrink-0">
            <button
              onClick={handleManejadorSubmit}
              disabled={guardando}
              className={`flex-1 h-9 rounded-md text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-colors
                ${guardando ? "bg-border text-ant3 cursor-not-allowed" : "bg-yel text-yeld hover:bg-yelm cursor-pointer"}`}
            >
              {guardando ? (
                <>
                  <i className="ti ti-loader-2 animate-spin" /> Guardando…
                </>
              ) : (
                <>
                  <i className="ti ti-device-floppy" /> Guardar cambios
                </>
              )}
            </button>
            <button
              onClick={hasEditMode ? () => setIsEditing(false) : onClose}
              disabled={guardando}
              className="h-9 px-4 rounded-md border border-border text-[13px] text-ant bg-antl transition-colors cursor-pointer disabled:opacity-50"
            >
              {hasEditMode ? "Cancelar" : "Cerrar"}
            </button>
          </div>
        )}

        {/* Footer simple si está solo leyendo */}
        {hasEditMode && !isEditing && (
          <div className="flex justify-end px-5 py-3 border-t border-border bg-ant/50 shrink-0">
            <button onClick={onClose} className="h-8 px-4 rounded-md border border-border text-[12px] text-ant bg-antl transition-colors cursor-pointer">
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
