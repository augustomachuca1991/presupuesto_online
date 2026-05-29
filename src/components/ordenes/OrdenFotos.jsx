// src/components/ordenes/OrdenFotos.jsx

import { useRef, useState } from "react";
import { useOrdenAdjuntos } from "@/hooks/useOrdenAdjuntos";

export function OrdenFotos({ ordenId }) {
  const { fotos, subiendo, subirFotos, borrarFoto } = useOrdenAdjuntos(ordenId);
  const [preview, setPreview] = useState(null);
  const inputRef = useRef();

  const handleChange = (e) => {
    const archivos = Array.from(e.target.files);
    if (archivos.length) subirFotos(archivos);
    e.target.value = "";
  };

  return (
    <div className="bg-white border border-border rounded-xl px-4 py-3">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[13px] font-medium text-ant">
          Fotos del trabajo
          {fotos.length > 0 && (
            <span className="ml-2 text-[11px] text-ant3 font-normal">
              {fotos.length} foto{fotos.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={subiendo}
          className="flex items-center gap-1.5 text-[12px] px-3 h-7 rounded-md border border-border text-ant3 hover:text-ant hover:bg-antl transition-colors cursor-pointer disabled:opacity-50"
        >
          {subiendo ? <i className="ti ti-loader-2 animate-spin text-[13px]" /> : <IconUpload />}
          {subiendo ? "Subiendo..." : "Agregar fotos"}
        </button>
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleChange} />
      </div>

      {fotos.length === 0 && !subiendo ? (
        <div
          onClick={() => inputRef.current?.click()}
          className="border border-dashed border-border rounded-lg py-8 flex flex-col items-center gap-2 text-ant3 cursor-pointer hover:border-ant hover:text-ant transition-colors"
        >
          <IconPhoto size={24} />
          <span className="text-[12px]">Tocá para agregar fotos del trabajo</span>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {fotos.map((foto) => (
            <div key={foto.id} className="relative group aspect-square rounded-lg overflow-hidden border border-border">
              <img src={foto.url} alt={foto.nombre} className="w-full h-full object-cover cursor-pointer" onClick={() => setPreview(foto.url)} />
              <button
                onClick={() => borrarFoto(foto)}
                className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-red-500"
              >
                <IconX size={10} />
              </button>
            </div>
          ))}

          {/* Placeholder de carga */}
          {subiendo && (
            <div className="aspect-square rounded-lg border border-dashed border-border flex items-center justify-center text-ant3">
              <i className="ti ti-loader-2 animate-spin text-[18px]" />
            </div>
          )}
        </div>
      )}

      {/* Lightbox simple */}
      {preview && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setPreview(null)}>
          <img src={preview} className="max-w-full max-h-full rounded-lg shadow-xl" />
        </div>
      )}
    </div>
  );
}

// SVG Icons
function IconUpload() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function IconPhoto({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

function IconX({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
