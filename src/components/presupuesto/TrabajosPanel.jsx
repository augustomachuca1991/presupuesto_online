// src/components/presupuesto/TrabajosPanel.jsx
import { memo } from "react";
import { ICONS } from "@/constants/icons";
import { fmt } from "@/utils/fmt";
import { ModalGenerico } from "@/components/ui/ModalGenerico";

export const TrabajosPanel = memo(function TrabajosPanel({ pieza, trabajos, onToggle, onCerrar, trabajoSeleccionado }) {
  if (!pieza) return null;

  const cantSeleccionados = trabajos.filter((t) => trabajoSeleccionado(pieza.id, t.id)).length;

  return (
    <ModalGenerico
      titulo={pieza.nombre}
      subtitulo={cantSeleccionados > 0 ? `${cantSeleccionados} trabajo${cantSeleccionados > 1 ? "s" : ""} seleccionado${cantSeleccionados > 1 ? "s" : ""}` : "Seleccioná los trabajos a realizar"}
      iconClass={ICONS.TOOL}
      hasEditMode={false}
      guardando={false}
      onClose={onCerrar}
      onSave={onCerrar}
      labelGuardar="Confirmar"
    >
      <div className="space-y-1 -mx-1">
        {trabajos.length === 0 ? (
          <div className="text-center py-8 text-ant3 text-[13px]">
            <i className={`${ICONS.MOOD_EMPTY} text-[24px] block mb-2`} />
            No hay trabajos disponibles para esta pieza
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-px bg-border rounded-lg overflow-hidden">
            {trabajos.map((t) => {
              const precio = t.precio_base ?? t.precio ?? 0;
              const isSel = trabajoSeleccionado(pieza.id, t.id);
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onToggle(pieza.id, t.id)}
                  className={`flex items-center justify-between gap-3 px-4 py-3 text-left cursor-pointer transition-colors
                    ${isSel ? "bg-yel/10" : "bg-ant hover:bg-ant2"}`}
                >
                  <div className="min-w-0">
                    <div className={`text-[13px] font-medium truncate ${isSel ? "text-yel" : "text-antl"}`}>{t.nombre}</div>
                    <div className="text-[12px] text-ant3 font-mono mt-0.5">{fmt(precio)}</div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors
                      ${isSel ? "bg-yel border-yel text-yeld" : "border-ant2"}`}
                  >
                    {isSel && <i className={`${ICONS.CHECK} text-[11px]`} />}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </ModalGenerico>
  );
});
