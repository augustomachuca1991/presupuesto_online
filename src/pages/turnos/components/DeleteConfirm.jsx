import { useEffect, useRef } from "react";

export default function DeleteConfirm({ onConfirm, onCancel }) {
  const panelRef = useRef(null);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const btn = panel.querySelector("button:last-of-type");
    btn?.focus();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3" onKeyDown={(e) => e.key === "Escape" && onCancel()}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div ref={panelRef} className="relative w-full max-w-sm bg-ant2 rounded-2xl shadow-2xl border border-border p-5">
        <div className="text-[14px] font-semibold text-antl mb-4">Eliminar turno</div>
        <div className="flex gap-2">
          <button onClick={onConfirm} className="bg-red-500 text-white text-[13px] font-semibold px-4 h-9 rounded-md hover:bg-red-600 cursor-pointer">Sí, eliminar</button>
          <button onClick={onCancel} className="border border-white/20 text-antm text-[13px] px-3.5 h-9 rounded-md hover:bg-ant hover:text-antl cursor-pointer">Cancelar</button>
        </div>
      </div>
    </div>
  );
}
