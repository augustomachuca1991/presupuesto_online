import { ICONS, ICONOS_CATEGORIA } from "@/constants/icons";
import { useState } from "react";
import FilaTrabajo from "@/components/piezas/FilaTrabajo";

const CardPieza = ({ pieza, onEditarPieza, onEliminarPieza, onNuevoTrabajo, onEditarTrabajo, onEliminarTrabajo, onToggleTrabajo }) => {
  const [expandida, setExpandida] = useState(false);
  const [confirmando, setConfirmando] = useState(false);

  const activos = pieza.trabajos_catalogo?.filter((t) => t.activo).length ?? 0;
  const total = pieza.trabajos_catalogo?.length ?? 0;

  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
      <div className="flex items-center gap-3 px-4 py-3">
        <button onClick={() => setExpandida((p) => !p)} className="flex items-center gap-3 flex-1 min-w-0 text-left cursor-pointer w-full">
          <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-antl text-ant3 shrink-0">
            <i className={ICONOS_CATEGORIA[pieza.categoria] ?? ICONS.TOOL} /> {pieza.categoria}
          </span>
          <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center md:justify-between md:gap-3">
            <span className="text-[14px] font-semibold text-ant truncate block">{pieza.nombre}</span>
            <span className="text-[11px] text-ant3 shrink-0 mt-0.5 md:mt-0">
              {activos}/{total} trabajos
            </span>
          </div>
          <i className={`${ICONS.CHEVRON_DOWN} text-ant3 text-[14px] shrink-0 transition-transform ${expandida ? "rotate-180" : ""}`} />
        </button>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => onNuevoTrabajo(pieza)}
            aria-label="Agregar"
            className="text-ant3 text-[13px] px-2 h-7 rounded flex items-center gap-1 hover:bg-antl hover:text-ant cursor-pointer transition-colors"
            title="Agregar trabajo"
          >
            <i className={`${ICONS.PLUS} text-[13px]`} />
          </button>
          <button
            onClick={() => onEditarPieza(pieza)}
            aria-label="Editar"
            className="text-ant3 text-[13px] px-2 h-7 rounded flex items-center gap-1 hover:bg-antl hover:text-ant cursor-pointer transition-colors"
            title="Editar pieza"
          >
            <i className={`${ICONS.PENCIL} text-[13px]`} />
          </button>
          {confirmando ? (
            <div className="flex items-center gap-1">
              <button onClick={() => onEliminarPieza(pieza.id)} className="text-[11px] text-red-500 hover:text-red-700 cursor-pointer px-1 whitespace-nowrap">
                ¿Eliminar todo?
              </button>
              <button onClick={() => setConfirmando(false)} className="text-[11px] text-ant3 hover:text-ant cursor-pointer px-1">
                No
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmando(true)}
              aria-label="Eliminar"
              className="text-ant3 text-[13px] px-2 h-7 rounded flex items-center gap-1 hover:bg-antl hover:text-ant cursor-pointer transition-colors"
              title="Eliminar pieza"
            >
              <i className={`${ICONS.TRASH} text-[13px] text-red-400`} />
            </button>
          )}
        </div>
      </div>

      {expandida && (
        <div className="border-t border-border px-2 py-2">
          {total === 0 ? (
            <div className="text-[12px] text-ant3 text-center py-3">
              Sin trabajos.{" "}
              <button onClick={() => onNuevoTrabajo(pieza)} className="text-ant underline cursor-pointer">
                Agregar uno
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-0.5">
              {pieza.trabajos_catalogo
                .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"))
                .map((t) => (
                  <FilaTrabajo key={t.id} trabajo={t} onEditar={(trabajo) => onEditarTrabajo(pieza, trabajo)} onEliminar={onEliminarTrabajo} onToggle={onToggleTrabajo} />
                ))}
            </div>
          )}
          <div className="mt-2 pt-2 border-t border-border">
            <button
              onClick={() => onNuevoTrabajo(pieza)}
              className="w-full flex items-center justify-center gap-1.5 text-[12px] text-ant3 hover:text-ant hover:bg-antl rounded-md py-1.5 cursor-pointer transition-colors"
            >
              <i className={`${ICONS.PLUS} text-[13px]`} /> Agregar trabajo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardPieza;
