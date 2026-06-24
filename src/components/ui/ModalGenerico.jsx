// src/components/ui/ModalGenerico.jsx
import { ICONS } from "@/constants/icons";
import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Props:
 * titulo          — string
 * subtitulo       — string
 * iconClass       — string (ej: "ti-car")
 * hasEditMode     — boolean
 * initialEditMode — boolean
 * guardando       — boolean
 * onSave          — fn (se llama al click del botón guardar — NO maneja form, solo dispara acción)
 * onClose         — fn
 * children        — fn ({ isEditing }) o node
 * labelGuardar    — string (label personalizado del botón, default "Guardar")
 */
export function ModalGenerico({ titulo, subtitulo, iconClass = "ti-box", hasEditMode = false, initialEditMode = true, guardando = false, onSave, onClose, children, labelGuardar = "Guardar" }) {
  const [isEditing, setIsEditing] = useState(!hasEditMode || initialEditMode);
  const panelRef = useRef(null);

  useEffect(() => {
    setIsEditing(!hasEditMode || initialEditMode);
  }, [initialEditMode, hasEditMode]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") { onClose(); return; }
    if (e.key === "Tab") {
      const panel = panelRef.current;
      if (!panel) return;
      const focusable = Array.from(panel.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
  }, [onClose]);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const focusable = panel.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable.length) focusable[0].focus();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-0" onKeyDown={handleKeyDown}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Panel — simple div, sin form */}
      <div ref={panelRef} className="relative w-full sm:max-w-[480px] bg-ant rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col max-h-[90vh]" role="dialog" aria-modal="true" aria-label={titulo}>
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-ant shrink-0">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-yel/10 text-yel shrink-0">
            <i className={`${iconClass} text-[17px]`} />
          </span>
          <div className="flex-1 min-w-0">
            <div className="text-[14px] font-semibold text-antl">{hasEditMode && !isEditing ? `Ver — ${titulo}` : titulo}</div>
            <div className="text-[11px] text-antm">{hasEditMode && !isEditing ? "Detalles del registro en modo lectura" : subtitulo}</div>
          </div>

          {hasEditMode && !isEditing && (
            <button type="button" onClick={() => setIsEditing(true)} className="text-[11px] font-medium text-yel hover:underline cursor-pointer mr-2">
              Editar
            </button>
          )}

          <button type="button" onClick={onClose} aria-label="Cerrar" className="text-ant3 hover:text-antl transition-colors cursor-pointer">
            <i className={ICONS.CLOSE + " text-[16px]"} />
          </button>
        </div>

        {/* Cuerpo scrolleable — acá van los children con su propio <form> si lo necesitan */}
        <div className="px-5 py-4 space-y-3 overflow-y-auto flex-1">{typeof children === "function" ? children({ isEditing }) : children}</div>

        {/* Footer edición */}
        {isEditing && (
          <div className="flex gap-2 px-5 py-4 border-t border-border bg-ant shrink-0">
            <button
              type="button" // ← type button siempre, el submit lo maneja el form del hijo
              disabled={guardando}
              onClick={onSave} // ← dispara formik.handleSubmit() o lo que le pases
              className={`flex-1 h-9 rounded-md text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-colors
                ${guardando ? "bg-border text-ant3 cursor-not-allowed" : "bg-yel text-yeld hover:bg-yelm cursor-pointer"}`}
            >
              {guardando ? (
                <>
                  <i className={ICONS.LOADER + " animate-spin"} /> Guardando…
                </>
              ) : (
                <>
                  <i className={ICONS.SAVE} /> {labelGuardar}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={hasEditMode ? () => setIsEditing(false) : onClose}
              disabled={guardando}
              className="h-9 px-4 rounded-md border border-border text-[13px] text-ant bg-antl transition-colors cursor-pointer disabled:opacity-50"
            >
              {hasEditMode ? "Cancelar" : "Cerrar"}
            </button>
          </div>
        )}

        {/* Footer solo lectura */}
        {hasEditMode && !isEditing && (
          <div className="flex justify-end px-5 py-3 border-t border-border bg-ant/50 shrink-0">
            <button type="button" onClick={onClose} className="h-8 px-4 rounded-md border border-border text-[12px] text-ant bg-antl transition-colors cursor-pointer">
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
