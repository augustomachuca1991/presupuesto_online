import { ICONS } from "@/constants/icons";
import { useState } from "react";
import { fmt } from "@/utils/fmt";

const FilaTrabajo = ({ trabajo, onEditar, onEliminar, onToggle }) => {
  const [confirmando, setConfirmando] = useState(false);

  return (
    <div className={`flex items-center gap-2.5 px-2 py-2 rounded-lg ${!trabajo.activo ? "opacity-50" : ""}`}>
      <button
        onClick={() => onToggle(trabajo.id, trabajo.activo)}
        aria-label="Alternar trabajo"
        className={`w-8 h-4 rounded-full flex-shrink-0 relative cursor-pointer transition-colors ${trabajo.activo ? "bg-yel" : "bg-border"}`}
      >
        <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-all ${trabajo.activo ? "left-[18px]" : "left-0.5"}`} />
      </button>

      <span className={`flex-1 text-[13px] ${trabajo.activo ? "text-ant" : "text-ant3 line-through"}`}>{trabajo.nombre}</span>

      <span className="text-[12px] font-medium text-ant2 font-mono shrink-0">{fmt(trabajo.precio_base)}</span>

      <div className="flex items-center gap-1 shrink-0">
        <button onClick={() => onEditar(trabajo)} aria-label="Editar" className="w-7 h-7 rounded-lg flex items-center justify-center text-ant3 hover:text-ant hover:bg-antl cursor-pointer transition-colors">
          <i className={`${ICONS.PENCIL} text-[13px]`} />
        </button>
        {confirmando ? (
          <div className="flex items-center gap-1">
            <button onClick={() => onEliminar(trabajo.id)} className="text-[11px] text-red-500 font-medium cursor-pointer px-1">
              Sí
            </button>
            <button onClick={() => setConfirmando(false)} className="text-[11px] text-ant3 cursor-pointer px-1">
              No
            </button>
          </div>
        ) : (
          <button onClick={() => setConfirmando(true)} aria-label="Eliminar" className="w-7 h-7 rounded-lg flex items-center justify-center text-ant3 hover:text-red-500 hover:bg-red-50 cursor-pointer transition-colors">
            <i className={`${ICONS.TRASH} text-[13px]`} />
          </button>
        )}
      </div>
    </div>
  );
};

export default FilaTrabajo;
