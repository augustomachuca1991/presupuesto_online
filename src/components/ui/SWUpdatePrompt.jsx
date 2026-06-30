import { useRegisterSW } from "virtual:pwa-register/react";
import { useState } from "react";

function IconRefreshCw({ size = 13 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

function IconX({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1={18} y1={6} x2={6} y2={18} />
      <line x1={6} y1={6} x2={18} y2={18} />
    </svg>
  );
}

export default function SWUpdatePrompt() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    immediate: true,
  });

  const [dismissed, setDismissed] = useState(false);

  if (!needRefresh || dismissed) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-9999 flex justify-center px-4 pt-3">
      <div
        className={[
          "flex items-center gap-3 rounded-sm border border-border w-full max-w-xl lg:max-w-3xl",
          "bg-linear-to-b from-[#444444] to-[#333333]",
          "px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_2px_4px_rgba(0,0,0,0.3)]",
        ].join(" ")}
        role="status"
      >
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.5px] text-[#aaaaaa] mb-0.5">Actualizaci&oacute;n disponible</p>
          <p className="text-xs text-[#dddddd]">Hay una nueva versi&oacute;n lista para instalar.</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => updateServiceWorker(true)}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-sm text-xs font-bold uppercase tracking-[0.3px] text-white bg-yel hover:bg-[#d4453a] active:bg-[#a3301f] transition-colors"
          >
            <IconRefreshCw size={13} />
            Actualizar
          </button>

          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Cerrar aviso"
            className="flex items-center justify-center w-8 h-8 rounded-sm text-ant3 hover:text-[#ffffff] hover:bg-white/5 transition-colors"
          >
            <IconX size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
