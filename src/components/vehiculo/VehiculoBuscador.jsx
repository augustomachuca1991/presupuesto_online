// src/components/vehiculo/VehiculoBuscador.jsx
import { supabase } from "@/lib/supabase";
import { escSearch } from "@/utils/fmt";
import { ICONS } from "@/constants/icons";
import { BuscadorGenerico } from "@/components/ui/BuscadorGenerico";

const COLORES_HEX = {
  Blanco: "#d0cfc8",
  "Blanco perla": "#ccc9be",
  Negro: "#1A1A1A",
  Gris: "#888780",
  "Gris oscuro": "#444441",
  Rojo: "#D85A30",
  Azul: "#378ADD",
  "Azul oscuro": "#185FA5",
  Verde: "#639922",
  Amarillo: "#EF9F27",
  Plateado: "#9a9890",
  Bordó: "#712B13",
};

async function fetchVehiculosIniciales(limit = 5) {
  const { data, error } = await supabase
    .from("v_vehiculos")
    .select("id, dominio, marca, modelo, anio, color")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) console.error("[VehiculoBuscador]", error.message);
  return data ?? [];
}

async function fetchVehiculosBusqueda(q) {
  const term = q.trim();
  const [r1, r2] = await Promise.all([
    supabase
      .from("v_vehiculos")
      .select("id, dominio, marca, modelo, anio, color")
      .ilike("dominio", `%${escSearch(term.toUpperCase())}%`)
      .limit(5),
    supabase
      .from("v_vehiculos")
      .select("id, dominio, marca, modelo, anio, color")
      .or(`marca.ilike.%${escSearch(term)}%,modelo.ilike.%${escSearch(term)}%`)
      .limit(5),
  ]);
  const todos = [...(r1.data ?? []), ...(r2.data ?? [])];
  const vistos = new Set();
  return todos
    .filter((v) => {
      if (vistos.has(v.id)) return false;
      vistos.add(v.id);
      return true;
    })
    .slice(0, 8);
}

function AutoSVG({ color }) {
  const hex = COLORES_HEX[color] ?? "#d3d1c7";
  return (
    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-bg border border-ant3/30">
      <svg viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-4" style={{ color: hex }}>
        <rect x="2" y="16" width="36" height="3" rx="1.5" fill="currentColor" opacity="0.3" />
        <path d="M3 16 L3 13 Q3 12 4 12 L36 12 Q37 12 37 13 L37 16 Z" fill="currentColor" />
        <path d="M11 12 Q13 7 16 6 L26 6 Q30 6 32 12 Z" fill="currentColor" />
        <path d="M24 12 Q27 8 29 7 L31 7 Q32 8 32 12 Z" fill="#1a1a1a" fillOpacity="0.55" />
        <path d="M11 12 Q12 8 14 7 L16 6.5 Q13.5 8 13 12 Z" fill="#1a1a1a" fillOpacity="0.45" />
        <path d="M14 12 L15 7 L23 7 L24 12 Z" fill="#1a1a1a" fillOpacity="0.4" />
        <rect x="23.5" y="7" width="1" height="5" fill="#1a1a1a" fillOpacity="0.3" />
        <circle cx="10" cy="17" r="4" fill="#1a1a1a" />
        <circle cx="10" cy="17" r="2.2" fill="#333" />
        <circle cx="10" cy="17" r="1" fill="#555" />
        <circle cx="30" cy="17" r="4" fill="#1a1a1a" />
        <circle cx="30" cy="17" r="2.2" fill="#333" />
        <circle cx="30" cy="17" r="1" fill="#555" />
        <path d="M36 13 L38 13.5 L38 14.5 L36 15 Z" fill="#fffbe6" fillOpacity="0.95" />
        <rect x="2" y="13" width="1.5" height="2" rx="0.4" fill="#ff3333" fillOpacity="0.85" />
        <rect x="20" y="13.2" width="3" height="1" rx="0.5" fill="#1a1a1a" fillOpacity="0.3" />
        <path d="M36 15 L38.5 15.2 L38.5 16 L36 16 Z" fill="currentColor" opacity="0.6" />
        <path d="M4 15 L1.5 15.2 L1.5 16 L4 16 Z" fill="currentColor" opacity="0.6" />
      </svg>
    </div>
  );
}

export function VehiculoBuscador({ vehiculoActual, onSeleccionar, onNuevo, onQuitarVehiculo }) {
  return (
    <BuscadorGenerico
      selected={vehiculoActual}
      onSelect={onSeleccionar}
      onNuevo={onNuevo}
      onQuitar={onQuitarVehiculo}
      fetchInitial={fetchVehiculosIniciales}
      fetchSearch={fetchVehiculosBusqueda}
      label="Vehículo"
      labelSeleccionado="Vehículo"
      placeholder="Dominio, marca o modelo..."
      placeholderTrigger="Seleccioná un vehículo..."
      icono={ICONS.CAR}
      inputTransform={(v) => v.toUpperCase()}
      inputClassName="uppercase font-mono"
      itemKey={(v) => v.id}
      sinResultadosText="Sin resultados."
      emptyInitialText="No hay vehículos registrados."
      nuevoTitle="Dar de alta un vehículo nuevo"
      hintInicial="Mostrando los últimos 5 — escribí para filtrar"
      renderItem={(v) => (
        <>
          <AutoSVG color={v.color} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-bold text-antl font-mono">{v.dominio}</span>
              <span className="text-[11px] text-ant3">
                {v.marca} {v.modelo} {v.anio}
              </span>
            </div>
            {v.color && (
              <div className="flex items-center gap-1.5 text-[11px] text-ant3 truncate">
                <span className="w-3 h-3 rounded-full shrink-0 border border-black/10" style={{ backgroundColor: COLORES_HEX[v.color] ?? v.color }} />
                {v.color}
              </div>
            )}
          </div>
        </>
      )}
      renderSeleccionado={(v, onQuitar) => (
        <>
          <div className="flex-1 min-w-0">
            <div className="text-[14px] font-bold text-antl font-mono tracking-wider">{v.dominio}</div>
            <div className="text-[11px] text-antm truncate mt-0.5">
              {v.marca} {v.modelo} {v.anio}
              {v.color && ` · ${v.color}`}
            </div>
          </div>
          {v.esNuevo ? (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-yell text-yeld shrink-0">NUEVO</span>
          ) : (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-green-900/30 text-green-300 shrink-0">✓ Encontrado</span>
          )}
          <button
            onClick={onQuitar}
            className="text-antm hover:text-antl transition-colors shrink-0 cursor-pointer p-1 rounded hover:bg-white/10"
            aria-label="Quitar vehículo"
          >
            <i className={`${ICONS.CLOSE} text-[15px]`} />
          </button>
        </>
      )}
    />
  );
}
