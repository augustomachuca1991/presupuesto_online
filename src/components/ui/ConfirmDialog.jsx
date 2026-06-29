import { ICONS } from "@/constants/icons";

export function ConfirmDialog({ titulo = "¿Confirmás?", mensaje, labelConfirmar = "Confirmar", onConfirmar, onCancelar, loading = false, danger = false }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancelar} />
      <div className="relative w-full max-w-[360px] mx-4 bg-ant2 rounded border border-border shadow-2xl overflow-hidden">
        <div className="px-5 py-5">
          <div className={`flex items-center gap-3 mb-3`}>
            <span className={`flex items-center justify-center w-9 h-9 rounded shrink-0 ${danger ? "bg-red-900/30 text-red-400" : "bg-yell text-yel"}`}>
              <i className={`${danger ? ICONS.TRASH : ICONS.ALERT_CIRCLE} text-[18px]`} />
            </span>
            <h3 className="text-[14px] font-semibold text-antl">{titulo}</h3>
          </div>
          {mensaje && <p className="text-[13px] text-antm leading-relaxed">{mensaje}</p>}
        </div>
        <div className="flex gap-2 px-5 pb-5">
          <button
            onClick={onConfirmar}
            disabled={loading}
            className={`flex-1 h-9 rounded-md text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer
              ${
                danger
                  ? loading
                    ? "bg-ant text-antm cursor-not-allowed"
                    : "bg-red-600 text-white hover:bg-red-500"
                  : loading
                    ? "bg-ant text-antm cursor-not-allowed"
                    : "bg-yel text-yeld hover:bg-yelm"
              }`}
          >
            {loading ? (
              <>
                <i className={`${ICONS.LOADER} animate-spin`} /> Eliminando…
              </>
            ) : (
              labelConfirmar
            )}
          </button>
          <button onClick={onCancelar} className="h-9 px-4 rounded-md border border-white/20 text-[13px] text-antm bg-transparent hover:bg-ant2 transition-colors cursor-pointer">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
