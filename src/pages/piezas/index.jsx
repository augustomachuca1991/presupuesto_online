// src/pages/PiezasPage.jsx
import { useState, useMemo } from "react";
import { usePiezas } from "@/hooks/usePiezas";
import { useToast } from "@/hooks/useToast";
import { Toasts } from "@/components/ui/Toasts";
import { ModalGenerico } from "@/components/ui/ModalGenerico";
import { FormInput, FormSelect } from "@/components/ui/FormComponents";
import ModalPieza from "@/components/piezas/ModalPieza";
import ModalTrabajo from "@/components/piezas/ModalTrabajo";
import CardPieza from "@/components/piezas/CardPieza";
import { fmt } from "@/utils/fmt";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

const ICONOS_CATEGORIA = {
  carrocería: "ti-car",
  vidrios: "ti-ripple",
  accesorios: "ti-settings-2",
  rodado: "ti-circle",
};

const CLASES_FILTRO_BASE = "inline-flex items-center gap-1.5 text-[12px] font-medium px-3 h-7 rounded-lg border transition-colors cursor-pointer";
const CLASES_FILTRO_ACTIVO = "bg-ant text-antl border-ant";
const CLASES_FILTRO_INACTIVO = "bg-white text-ant2 border-border hover:border-ant hover:text-ant";

const BTN_ACCION_CHICO = "text-ant3 text-[13px] px-2 h-7 rounded flex items-center gap-1 hover:bg-antl hover:text-ant cursor-pointer transition-colors";
const TEXTO_MINI_TITULO = "text-[10px] font-medium text-ant3 uppercase tracking-widest mb-1.5 px-0.5";

// ─── Página principal ─────────────────────────────────────────────────────
export default function PiezasPage() {
  const { toast, toasts } = useToast();
  const { piezas, cargando, error, CATEGORIAS, crearPieza, editarPieza, eliminarPieza, crearTrabajo, editarTrabajo, eliminarTrabajo, toggleActivo } = usePiezas();

  const [busqueda, setBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("todas");
  const [filtroTrabajo, setFiltroTrabajo] = useState("todos");
  const [modalPieza, setModalPieza] = useState(null);
  const [modalTrabajo, setModalTrabajo] = useState(null);
  const [guardando, setGuardando] = useState(false);

  const piezasFiltradas = useMemo(() => {
    const q = busqueda.toLowerCase().trim();
    return piezas.filter((p) => {
      if (filtroCategoria !== "todas" && p.categoria !== filtroCategoria) return false;
      if (q) {
        const matchPieza = p.nombre.toLowerCase().includes(q);
        const matchTrabajos = p.trabajos_catalogo?.some((t) => t.nombre.toLowerCase().includes(q));
        if (!matchPieza && !matchTrabajos) return false;
      }
      if (filtroTrabajo === "activos" && !p.trabajos_catalogo?.some((t) => t.activo)) return false;
      if (filtroTrabajo === "inactivos" && !p.trabajos_catalogo?.some((t) => !t.activo)) return false;
      return true;
    });
  }, [piezas, busqueda, filtroCategoria, filtroTrabajo]);

  const totalTrabajos = piezas.reduce((s, p) => s + (p.trabajos_catalogo?.length ?? 0), 0);
  const totalActivos = piezas.reduce((s, p) => s + (p.trabajos_catalogo?.filter((t) => t.activo).length ?? 0), 0);

  const handleGuardarPieza = async (datos) => {
    setGuardando(true);
    const esEdicion = modalPieza !== "nueva";
    const { ok, error } = esEdicion ? await editarPieza(modalPieza.id, datos) : await crearPieza(datos);
    setGuardando(false);
    if (ok) {
      toast.success(esEdicion ? "Pieza actualizada." : "Pieza creada correctamente.");
      setModalPieza(null);
    } else toast.error(error ?? "No se pudo guardar.");
  };

  const handleEliminarPieza = async (id) => {
    const { ok, error } = await eliminarPieza(id);
    if (ok) toast.success("Pieza eliminada.");
    else toast.error(error ?? "No se pudo eliminar.");
  };

  const handleGuardarTrabajo = async (datos) => {
    if (!modalTrabajo?.pieza) return;
    setGuardando(true);
    const esEdicion = !!modalTrabajo.trabajo;
    const { ok, error } = esEdicion ? await editarTrabajo(modalTrabajo.trabajo.id, datos) : await crearTrabajo(modalTrabajo.pieza.id, datos);
    setGuardando(false);
    if (ok) {
      toast.success(esEdicion ? "Trabajo actualizado." : "Trabajo creado correctamente.");
      setModalTrabajo(null);
    } else toast.error(error ?? "No se pudo guardar.");
  };

  const handleEliminarTrabajo = async (id) => {
    const { ok, error } = await eliminarTrabajo(id);
    if (ok) toast.success("Trabajo eliminado.");
    else toast.error(error ?? "No se pudo eliminar.");
  };

  const handleToggle = async (id, activo) => {
    const { ok, error } = await toggleActivo(id, activo);
    if (!ok) toast.error(error ?? "No se pudo actualizar.");
  };

  return (
    <>
      <Toasts toasts={toasts} />

      <div className="max-w-[680px] mx-auto px-3 sm:px-4 pt-4 pb-12">
        <Breadcrumbs />
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 bg-ant rounded-xl mb-5 shadow-md">
          <i className="ti ti-tools text-[24px] text-yel shrink-0" />
          <div className="min-w-0">
            <div className="text-[15px] font-semibold text-antl tracking-tight">Catálogo de trabajos</div>
            <div className="text-[11px] text-antm">Piezas y precios del taller</div>
          </div>
          <button
            onClick={() => setModalPieza("nueva")}
            className="ml-auto bg-yel text-yeld text-[13px] font-semibold px-3.5 h-8 rounded-md flex items-center gap-1.5 hover:bg-yelm cursor-pointer shrink-0"
          >
            <i className="ti ti-plus" /> Nueva pieza
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {[
            { label: "Piezas", valor: piezas.length, icon: "ti-components" },
            { label: "Trabajos activos", valor: totalActivos, icon: "ti-tool" },
            { label: "Total trabajos", valor: totalTrabajos, icon: "ti-list" },
          ].map(({ label, valor, icon }) => (
            <div key={label} className="bg-white border border-border rounded-xl px-3 py-2.5 text-center">
              <div className="text-[20px] font-bold text-ant font-mono">{valor}</div>
              <div className="text-[11px] text-ant3 flex items-center justify-center gap-1 mt-0.5">
                <i className={`ti ${icon} text-[12px]`} />
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Buscador y filtros */}
        <div className="flex flex-col gap-2 mb-4">
          <div className="relative">
            <i className="ti ti-search absolute left-2.5 top-1/2 -translate-y-1/2 text-ant3 text-[14px]" />
            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar pieza o trabajo..."
              className="w-full border border-border rounded-xl pl-8 pr-3 h-10 text-[13px] bg-white text-ant outline-none focus:border-ant shadow-sm"
            />
            {busqueda && (
              <button onClick={() => setBusqueda("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ant3 hover:text-ant cursor-pointer">
                <i className="ti ti-x text-[14px]" />
              </button>
            )}
          </div>

          {/* Categorías */}
          <div>
            <p className={TEXTO_MINI_TITULO}>Categoría</p>
            <div className="flex gap-1.5 flex-wrap">
              {["todas", ...CATEGORIAS].map((c) => (
                <button key={c} onClick={() => setFiltroCategoria(c)} className={`${CLASES_FILTRO_BASE} ${filtroCategoria === c ? CLASES_FILTRO_ACTIVO : CLASES_FILTRO_INACTIVO}`}>
                  {c !== "todas" && <i className={`ti ${ICONOS_CATEGORIA[c] ?? "ti-tool"} text-[12px]`} />}
                  {c === "todas" ? "Todas" : c.charAt(0).toUpperCase() + c.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Estado */}
          <div>
            <p className={TEXTO_MINI_TITULO}>Estado</p>
            <div className="flex gap-1.5">
              {[
                { val: "todos", label: "Todos", icon: "ti-list" },
                { val: "activos", label: "Activos", icon: "ti-check" },
                { val: "inactivos", label: "Inactivos", icon: "ti-x" },
              ].map(({ val, label, icon }) => (
                <button key={val} onClick={() => setFiltroTrabajo(val)} className={`${CLASES_FILTRO_BASE} ${filtroTrabajo === val ? CLASES_FILTRO_ACTIVO : CLASES_FILTRO_INACTIVO}`}>
                  <i className={`ti ${icon} text-[12px]`} />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Lista */}
        {cargando ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 rounded-xl bg-antl animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="text-[13px] text-red-500 text-center py-8">{error}</div>
        ) : piezasFiltradas.length === 0 ? (
          <div className="text-[13px] text-ant3 text-center py-10 border border-dashed border-border rounded-xl">
            {busqueda || filtroCategoria !== "todas" || filtroTrabajo !== "todos" ? "Sin resultados para esa búsqueda." : "No hay piezas en el catálogo. Creá una con el botón de arriba."}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {piezasFiltradas.map((p) => (
              <CardPieza
                key={p.id}
                pieza={p}
                btnAccionClass={BTN_ACCION_CHICO} // Mandamos la clase reutilizable por prop si tu Card la usa por dentro
                onEditarPieza={(pieza) => setModalPieza(pieza)}
                onEliminarPieza={handleEliminarPieza}
                onNuevoTrabajo={(pieza) => setModalTrabajo({ pieza, trabajo: null })}
                onEditarTrabajo={(pieza, trabajo) => setModalTrabajo({ pieza, trabajo })}
                onEliminarTrabajo={handleEliminarTrabajo}
                onToggleTrabajo={handleToggle}
              />
            ))}
          </div>
        )}
      </div>

      {modalPieza && <ModalPieza pieza={modalPieza === "nueva" ? null : modalPieza} categorias={CATEGORIAS} onGuardar={handleGuardarPieza} onClose={() => setModalPieza(null)} guardando={guardando} />}
      {modalTrabajo && (
        <ModalTrabajo trabajo={modalTrabajo.trabajo} piezaNombre={modalTrabajo.pieza?.nombre ?? ""} onGuardar={handleGuardarTrabajo} onClose={() => setModalTrabajo(null)} guardando={guardando} />
      )}
    </>
  );
}
