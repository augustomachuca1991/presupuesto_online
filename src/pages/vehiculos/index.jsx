// src/pages/VehiculosPage.jsx

import { useState, useMemo } from "react";
import { useVehiculos } from "@/hooks/useVehiculos";
import { useToast } from "@/hooks/useToast";
import { Toasts } from "@/components/ui/Toasts";
import { ModalVehiculo } from "@/components/vehiculo/ModalVehiculo";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { BrandLogo } from "@/components/ui/BrandLogo";

const ANIO_ACTUAL = new Date().getFullYear();

const getMarca = (v) => v.marca ?? v.marca?.nombre ?? null;
const getModelo = (v) => v.modelo ?? v.modelo?.nombre ?? null;

// ── Fila de vehículo ──────────────────────────────────────────────────────
function VehiculoRow({ v, onEditar, onEliminar }) {
  const modelo = getModelo(v);

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border last:border-0 hover:bg-antl transition-colors">
      <span className="text-[13px] font-medium text-ant font-mono tracking-widest w-20 shrink-0">{v.dominio}</span>
      <span className="text-[10px] font-semibold bg-yel text-yeld px-1.5 py-0.5 rounded shrink-0">{v.anio}</span>
      <span className="flex-1 text-[12px] text-ant2 min-w-0 truncate">{[modelo, v.color, v.codigo_pintura].filter(Boolean).join(" · ")}</span>
      <div className="flex gap-1.5 shrink-0">
        <button
          onClick={() => onEditar(v)}
          className="w-7 h-7 rounded-lg flex items-center justify-center border border-border text-ant3 hover:text-ant hover:bg-white transition-colors cursor-pointer"
          title="Editar"
        >
          <i className="ti ti-pencil text-[13px]" />
        </button>
        <button
          onClick={() => onEliminar(v)}
          className="w-7 h-7 rounded-lg flex items-center justify-center border border-border text-ant3 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors cursor-pointer"
          title="Eliminar"
        >
          <i className="ti ti-trash text-[13px]" />
        </button>
      </div>
    </div>
  );
}

// ── Grupo de marca ────────────────────────────────────────────────────────
function GrupoMarca({ marca, vehiculos, onEditar, onEliminar }) {
  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-antl border-b border-border">
        <div className="w-9 h-9 rounded-lg border border-border bg-white flex items-center justify-center overflow-hidden shrink-0">
          <BrandLogo marca={marca} className="w-7 h-7" />
        </div>
        <div>
          <div className="text-[13px] font-semibold text-ant">{marca}</div>
          <div className="text-[11px] text-ant3">
            {vehiculos.length} vehículo{vehiculos.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {/* Filas */}
      {vehiculos.map((v) => (
        <VehiculoRow key={v.id} v={v} onEditar={onEditar} onEliminar={onEliminar} />
      ))}
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────
function EmptyState({ hayFiltros }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
      <div className="w-16 h-16 rounded-2xl bg-antl border border-border flex items-center justify-center">
        <i className={`ti ${hayFiltros ? "ti-filter-off" : "ti-car-off"} text-[28px] text-ant3`} />
      </div>
      <div>
        <p className="text-[14px] font-semibold text-ant">{hayFiltros ? "Sin resultados" : "No hay vehículos"}</p>
        <p className="text-[12px] text-ant3 mt-1">{hayFiltros ? "Probá con otros filtros o búsqueda." : "Creá el primer vehículo con el botón +."}</p>
      </div>
    </div>
  );
}

const inputCls =
  "w-full px-3 h-8 rounded-md border border-border bg-white text-[12px] text-ant placeholder:text-ant3 focus:outline-none focus:border-yel focus:ring-1 focus:ring-yel/20 transition shadow-sm";

// ── Página ────────────────────────────────────────────────────────────────
export default function VehiculosPage() {
  const { toasts, toast } = useToast();
  const { vehiculos, isLoading, marcas, crearVehiculo, editarVehiculo, eliminarVehiculo } = useVehiculos();

  const [busqueda, setBusqueda] = useState("");
  const [filtroMarca, setFiltroMarca] = useState("");
  const [filtroAnioDesde, setFiltroAnioDesde] = useState("");
  const [filtroAnioHasta, setFiltroAnioHasta] = useState("");
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [vehiculoEditar, setVehiculoEditar] = useState(null);
  const [confirmEliminar, setConfirmEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  // ── Filtrado ──────────────────────────────────────────────────────────
  const vehiculosFiltrados = useMemo(() => {
    let lista = vehiculos;
    if (busqueda.trim()) {
      const q = busqueda.trim().toLowerCase();
      lista = lista.filter(
        (v) =>
          v.dominio?.toLowerCase().includes(q) ||
          (getMarca(v) ?? "").toLowerCase().includes(q) ||
          (getModelo(v) ?? "").toLowerCase().includes(q) ||
          String(v.anio).includes(q) ||
          (v.color ?? "").toLowerCase().includes(q) ||
          (v.codigo_pintura ?? "").toLowerCase().includes(q)
      );
    }
    if (filtroMarca) lista = lista.filter((v) => v.marca_id === filtroMarca);
    if (filtroAnioDesde) lista = lista.filter((v) => Number(v.anio) >= Number(filtroAnioDesde));
    if (filtroAnioHasta) lista = lista.filter((v) => Number(v.anio) <= Number(filtroAnioHasta));
    return lista;
  }, [vehiculos, busqueda, filtroMarca, filtroAnioDesde, filtroAnioHasta]);

  // ── Agrupar por marca ─────────────────────────────────────────────────
  const vehiculosPorMarca = useMemo(() => {
    const grupos = {};
    vehiculosFiltrados.forEach((v) => {
      const marca = getMarca(v) ?? "Sin marca";
      if (!grupos[marca]) grupos[marca] = [];
      grupos[marca].push(v);
    });
    return Object.entries(grupos).sort(([a], [b]) => a.localeCompare(b, "es"));
  }, [vehiculosFiltrados]);

  const hayFiltrosActivos = !!(busqueda || filtroMarca || filtroAnioDesde || filtroAnioHasta);
  const hayFiltroPanel = !!(filtroMarca || filtroAnioDesde || filtroAnioHasta);

  const limpiarFiltros = () => {
    setBusqueda("");
    setFiltroMarca("");
    setFiltroAnioDesde("");
    setFiltroAnioHasta("");
  };

  // ── Handlers ──────────────────────────────────────────────────────────
  const handleSave = async (datos) => {
    if (vehiculoEditar) {
      const { ok, error } = await editarVehiculo(vehiculoEditar.id, datos);
      if (ok) {
        toast.success("Vehículo actualizado correctamente.");
        setModalOpen(false);
      } else toast.error(error ?? "No se pudo guardar.");
      return { ok, error };
    } else {
      const { ok, error } = await crearVehiculo(datos);
      if (ok) {
        toast.success("Vehículo creado correctamente.");
        setModalOpen(false);
      } else toast.error(error ?? "No se pudo crear.");
      return { ok, error };
    }
  };

  const handleEliminar = async () => {
    if (!confirmEliminar) return;
    setEliminando(true);
    const { ok, error } = await eliminarVehiculo(confirmEliminar.id);
    setEliminando(false);
    setConfirmEliminar(null);
    if (ok) toast.success(`Vehículo ${confirmEliminar.dominio} eliminado.`);
    else toast.error(error ?? "No se pudo eliminar.");
  };

  const abrirEditar = (v) => {
    setVehiculoEditar(v);
    setModalOpen(true);
  };
  const abrirNuevo = () => {
    setVehiculoEditar(null);
    setModalOpen(true);
  };

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <>
      <Toasts toasts={toasts} />

      <div className="max-w-[620px] mx-auto px-3 sm:px-4 pt-4 pb-12">
        <Breadcrumbs />

        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl mb-5 shadow-sm border border-border">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-ant shrink-0">
            <i className="ti ti-car text-[20px] text-yel" />
          </div>
          <div className="min-w-0">
            <div className="text-[15px] font-semibold text-ant tracking-tight">Vehículos</div>
            <div className="text-[11px] text-ant3">{isLoading ? "Cargando…" : `${vehiculos.length} registrado${vehiculos.length !== 1 ? "s" : ""}`}</div>
          </div>
          <button
            onClick={abrirNuevo}
            className="ml-auto flex items-center gap-1.5 bg-yel text-yeld text-[13px] font-semibold px-3.5 h-9 rounded-lg hover:bg-yelm transition-colors cursor-pointer shrink-0"
          >
            <i className="ti ti-plus text-[15px]" />
            <span className="hidden sm:inline">Nuevo</span>
          </button>
        </div>

        {/* Buscador + Filtros */}
        <div className="mb-3 space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <i className="ti ti-search absolute left-2.5 top-1/2 -translate-y-1/2 text-[14px] text-ant3 pointer-events-none" />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por dominio, marca, color…"
                className="w-full pl-8 pr-8 h-9 rounded-md border border-border bg-white text-[13px] text-ant placeholder:text-ant3 focus:outline-none focus:border-yel focus:ring-1 focus:ring-yel/20 transition shadow-sm"
              />
              {busqueda && (
                <button onClick={() => setBusqueda("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ant3 hover:text-ant transition-colors cursor-pointer">
                  <i className="ti ti-x text-[13px]" />
                </button>
              )}
            </div>
            <button
              onClick={() => setFiltrosAbiertos((p) => !p)}
              className={`h-9 px-3 rounded-md border text-[13px] flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm whitespace-nowrap
                ${filtrosAbiertos || hayFiltroPanel ? "border-yel text-yel bg-yel/5" : "border-border bg-white text-antm hover:text-ant"}`}
            >
              <i className="ti ti-adjustments-horizontal text-[14px]" />
              <span className="hidden sm:inline">Filtros</span>
              {hayFiltroPanel && <span className="w-1.5 h-1.5 rounded-full bg-yel" />}
            </button>
          </div>

          {filtrosAbiertos && (
            <div className="bg-white border border-border rounded-xl px-4 py-3.5 space-y-3 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-ant3 uppercase tracking-widest mb-1.5">Marca</label>
                  <select value={filtroMarca} onChange={(e) => setFiltroMarca(e.target.value)} className={inputCls}>
                    <option value="">Todas</option>
                    {marcas.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-ant3 uppercase tracking-widest mb-1.5">Año desde</label>
                  <input type="number" value={filtroAnioDesde} onChange={(e) => setFiltroAnioDesde(e.target.value)} placeholder="1990" min={1900} max={ANIO_ACTUAL} className={inputCls} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-ant3 uppercase tracking-widest mb-1.5">Año hasta</label>
                  <input
                    type="number"
                    value={filtroAnioHasta}
                    onChange={(e) => setFiltroAnioHasta(e.target.value)}
                    placeholder={String(ANIO_ACTUAL)}
                    min={1900}
                    max={ANIO_ACTUAL + 1}
                    className={inputCls}
                  />
                </div>
              </div>
              {hayFiltrosActivos && (
                <button onClick={limpiarFiltros} className="text-[12px] text-ant3 hover:text-red-500 flex items-center gap-1 transition-colors cursor-pointer">
                  <i className="ti ti-filter-off text-[13px]" /> Limpiar filtros
                </button>
              )}
            </div>
          )}
        </div>

        {/* Contador */}
        {hayFiltrosActivos && !isLoading && (
          <div className="text-[12px] text-ant3 mb-3 flex items-center gap-1.5 px-1">
            <i className="ti ti-list-search text-[13px]" />
            {vehiculosFiltrados.length} resultado{vehiculosFiltrados.length !== 1 ? "s" : ""} de {vehiculos.length}
          </div>
        )}

        {/* Lista */}
        {isLoading ? (
          <div className="flex flex-col gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-[100px] bg-antl rounded-xl border border-border animate-pulse" />
            ))}
          </div>
        ) : vehiculosFiltrados.length === 0 ? (
          <EmptyState hayFiltros={hayFiltrosActivos} />
        ) : (
          <div className="flex flex-col gap-2.5">
            {vehiculosPorMarca.map(([marca, lista]) => (
              <GrupoMarca key={marca} marca={marca} vehiculos={lista} onEditar={abrirEditar} onEliminar={setConfirmEliminar} />
            ))}
          </div>
        )}
      </div>

      {modalOpen && <ModalVehiculo vehiculo={vehiculoEditar} onSave={handleSave} onClose={() => setModalOpen(false)} />}

      {confirmEliminar && (
        <ConfirmDialog
          titulo="Eliminar vehículo"
          mensaje={`¿Eliminás el vehículo con dominio ${confirmEliminar.dominio}? Esta acción no se puede deshacer.`}
          labelConfirmar="Sí, eliminar"
          onConfirmar={handleEliminar}
          onCancelar={() => setConfirmEliminar(null)}
          loading={eliminando}
          danger
        />
      )}
    </>
  );
}
