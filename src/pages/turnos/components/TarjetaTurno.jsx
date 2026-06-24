import { ICONS } from "@/constants/icons";

export const ESTADOS = {
  pendiente: { label: "Pendiente", dot: "bg-amber-400", badge: "bg-amber-50 text-amber-700 border-amber-200" },
  confirmado: { label: "Confirmado", dot: "bg-blue-400", badge: "bg-blue-50 text-blue-700 border-blue-200" },
  en_progreso: { label: "En progreso", dot: "bg-purple-400", badge: "bg-purple-50 text-purple-700 border-purple-200" },
  completado: { label: "Completado", dot: "bg-green-400", badge: "bg-green-50 text-green-700 border-green-200" },
  cancelado: { label: "Cancelado", dot: "bg-red-300", badge: "bg-red-50 text-red-600 border-red-200" },
};

export function formatearHora(hora) {
  if (!hora) return "";
  return hora.slice(0, 5);
}

export default function TarjetaTurno({ t, esPasada, onEditar, onEliminar }) {
  const est = ESTADOS[t.estado] ?? { label: t.estado, badge: "bg-gray-100 text-gray-500 border-gray-200" };
  return (
    <div className="flex items-start gap-3 px-4 py-3 border-b border-border last:border-b-0 hover:bg-antl/30 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="text-[11px] font-mono text-ant3">{t.fecha}</span>
          {t.hora && <span className="text-[11px] font-mono text-ant3">{formatearHora(t.hora)}</span>}
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${est.badge}`}>{est.label}</span>
        </div>
        <div className="text-[13px] font-medium text-ant">{t.cliente_nombre}</div>
        {t.cliente_telefono && <div className="text-[11px] text-ant3">{t.cliente_telefono}</div>}
        {(t.vehiculo_dominio || t.vehiculo_info) && (
          <div className="text-[11px] text-ant2 mt-0.5">{t.vehiculo_dominio}{t.vehiculo_info ? ` · ${t.vehiculo_info}` : ""}</div>
        )}
        {t.descripcion && <div className="text-[11px] text-ant3 mt-1.5 bg-antl rounded-md px-2.5 py-1.5">{t.descripcion}</div>}
      </div>
      {!esPasada && (
        <div className="flex gap-1 shrink-0">
          <button onClick={() => onEditar(t)} aria-label="Editar" className="w-7 h-7 rounded-lg flex items-center justify-center border border-border text-ant3 hover:text-ant hover:bg-white cursor-pointer" title="Editar">
            <i className={ICONS.PENCIL} />
          </button>
          <button onClick={() => onEliminar(t.id)} aria-label="Eliminar" className="w-7 h-7 rounded-lg flex items-center justify-center border border-border text-ant3 hover:text-red-500 hover:border-red-200 hover:bg-red-50 cursor-pointer" title="Eliminar">
            <i className={ICONS.TRASH} />
          </button>
        </div>
      )}
    </div>
  );
}
