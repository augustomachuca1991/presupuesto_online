// src/components/clientes/PropietarioBuscador.jsx
import { supabase } from "@/lib/supabase";
import { escSearch } from "@/utils/fmt";
import { ICONS } from "@/constants/icons";
import { BuscadorGenerico } from "@/components/ui/BuscadorGenerico";

const capitalizar = (s = "") =>
  s
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();

const nombreCompleto = (c) => capitalizar(`${c.nombre ?? ""} ${c.apellido ?? ""}`);

async function fetchClientesIniciales(limit = 5) {
  const { data } = await supabase
    .from("clientes")
    .select("id, nombre, apellido, telefono, email")
    .order("apellido")
    .limit(limit);
  return data ?? [];
}

async function fetchClientesBusqueda(q) {
  const term = q.trim().toLowerCase();
  const { data } = await supabase
    .from("clientes")
    .select("id, nombre, apellido, telefono, email")
    .or(`nombre.ilike.%${escSearch(term)}%,apellido.ilike.%${escSearch(term)}%,telefono.ilike.%${escSearch(term)}%`)
    .order("apellido")
    .limit(8);
  return data ?? [];
}

export function PropietarioBuscador({ propietarioActual, onSeleccionarSugerencia, onQuitarPropietario, onNuevo }) {
  return (
    <BuscadorGenerico
      selected={propietarioActual}
      onSelect={onSeleccionarSugerencia}
      onNuevo={onNuevo}
      onQuitar={onQuitarPropietario}
      fetchInitial={fetchClientesIniciales}
      fetchSearch={fetchClientesBusqueda}
      label="Propietario"
      labelSeleccionado="Propietario"
      placeholder="Buscar por nombre, apellido o teléfono..."
      placeholderTrigger="Seleccioná un propietario..."
      icono={ICONS.USER_SEARCH}
      itemKey={(c) => c.id}
      sinResultadosText="Sin resultados para esa búsqueda."
      emptyInitialText="No hay clientes registrados."
      nuevoTitle="Dar de alta un propietario nuevo"
      hintInicial="Mostrando los primeros 5 — escribí para filtrar"
      renderItem={(c) => (
        <>
          <div className="w-7 h-7 rounded-full bg-ant flex items-center justify-center shrink-0">
            <i className={`${ICONS.USER} text-[13px] text-antm`} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-medium text-antl truncate">{nombreCompleto(c)}</div>
            {(c.telefono || c.email) && (
              <div className="text-[11px] text-ant3 truncate">{[c.telefono, c.email].filter(Boolean).join(" · ")}</div>
            )}
          </div>
        </>
      )}
      renderSeleccionado={(c, onQuitar) => (
        <>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold text-antl truncate">{nombreCompleto(c)}</div>
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
              {c.telefono && (
                <span className="text-[11px] text-antm flex items-center gap-1">
                  <i className={`${ICONS.PHONE} text-[10px]`} />
                  {c.telefono}
                </span>
              )}
              {c.email && (
                <span className="text-[11px] text-antm flex items-center gap-1 truncate">
                  <i className={`${ICONS.MAIL} text-[10px]`} />
                  {c.email}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onQuitar}
            className="text-antm hover:text-antl transition-colors ml-auto shrink-0 cursor-pointer p-1 rounded hover:bg-white/10"
            aria-label="Quitar propietario"
          >
            <i className={`${ICONS.CLOSE} text-[15px]`} />
          </button>
        </>
      )}
    />
  );
}
