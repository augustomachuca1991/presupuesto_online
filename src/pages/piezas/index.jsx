// src/pages/PiezasPage.jsx
import { useState, useMemo } from "react";
import { usePiezas } from "@/hooks/usePiezas";
import { useToast } from "@/hooks/useToast";
import { Toasts } from "@/components/ui/Toasts";
import { fmt } from "@/utils/fmt";

const ICONOS_CATEGORIA = {
  carrocería: "ti-car",
  vidrios: "ti-ripple",
  accesorios: "ti-settings-2",
  rodado: "ti-circle",
};

// ─── Estilos base ─────────────────────────────────────────────────────────
const inp = "w-full border border-border rounded-md px-2.5 py-1.5 text-[13px] bg-white text-ant outline-none focus:border-ant";

// ─── Modal — header oscuro, body blanco (igual que ModalVehiculo) ─────────
function Modal({ titulo, subtitulo, icono, onClose, children, footer }) {
  return (
    <div className="fixed inset-0 bg-ant/55 flex items-center justify-center z-[200] p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-xl border border-border w-[480px] max-w-full shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header oscuro */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-ant">
          <div className="w-[38px] h-[38px] rounded-lg flex items-center justify-center border border-border bg-bg text-yel shrink-0">
            <i className={`ti ${icono} text-[18px]`} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[15px] font-semibold text-antl leading-tight">{titulo}</div>
            {subtitulo && <div className="text-[12px] text-antm mt-0.5">{subtitulo}</div>}
          </div>
          <button onClick={onClose} className="text-antm hover:text-antl cursor-pointer p-1 rounded hover:bg-white/10 transition-colors">
            <i className="ti ti-x text-[15px]" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5">{children}</div>

        {/* Footer */}
        {footer && <div className="flex justify-end gap-2 px-5 py-4 border-t border-border">{footer}</div>}
      </div>
    </div>
  );
}

// ─── Label ────────────────────────────────────────────────────────────────
function Label({ children, required }) {
  return (
    <label className="text-[11px] font-medium text-ant3 uppercase tracking-widest">
      {children}
      {required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
  );
}

// ─── Modal nueva/editar pieza ─────────────────────────────────────────────
function ModalPieza({ pieza, categorias, onGuardar, onClose, guardando }) {
  const [nombre, setNombre] = useState(pieza?.nombre ?? "");
  const [categoria, setCategoria] = useState(pieza?.categoria ?? categorias[0]);

  const handleSubmit = () => {
    if (!nombre.trim()) return;
    onGuardar({ nombre, categoria });
  };

  return (
    <Modal
      titulo={pieza ? "Editar pieza" : "Nueva pieza"}
      subtitulo={pieza ? `Modificá los datos de "${pieza.nombre}"` : "Completá los datos para crearla"}
      icono="ti-components"
      onClose={onClose}
      footer={
        <>
          <button onClick={onClose} className="border border-border text-ant text-[13px] px-3.5 h-9 rounded-md flex items-center gap-1.5 hover:bg-antl cursor-pointer disabled:opacity-50">
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!nombre.trim() || guardando}
            className="bg-yel text-yeld font-semibold text-[13px] px-4 h-9 rounded-md flex items-center gap-1.5 hover:bg-yelm cursor-pointer disabled:opacity-60"
          >
            {guardando ? <i className="ti ti-loader-2 animate-spin" /> : <i className="ti ti-check" />}
            {pieza ? "Guardar cambios" : "Crear pieza"}
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label required>Nombre</Label>
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} className={inp} placeholder="ej: Capot, Luneta trasera…" autoFocus onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Categoría</Label>
          <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className={inp}>
            {categorias.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>
    </Modal>
  );
}

// ─── Modal nuevo/editar trabajo ───────────────────────────────────────────
function ModalTrabajo({ trabajo, piezaNombre, onGuardar, onClose, guardando }) {
  const [nombre, setNombre] = useState(trabajo?.nombre ?? "");
  const [precio, setPrecio] = useState(trabajo?.precio_base ?? "");

  const handleSubmit = () => {
    if (!nombre.trim() || !precio) return;
    onGuardar({ nombre, precio_base: precio });
  };

  return (
    <Modal
      titulo={trabajo ? "Editar trabajo" : "Nuevo trabajo"}
      subtitulo={`Pieza: ${piezaNombre}`}
      icono="ti-tool"
      onClose={onClose}
      footer={
        <>
          <button onClick={onClose} className="border border-border text-ant text-[13px] px-3.5 h-9 rounded-md flex items-center gap-1.5 hover:bg-antl cursor-pointer disabled:opacity-50">
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!nombre.trim() || !precio || guardando}
            className="bg-yel text-yeld font-semibold text-[13px] px-4 h-9 rounded-md flex items-center gap-1.5 hover:bg-yelm cursor-pointer disabled:opacity-60"
          >
            {guardando ? <i className="ti ti-loader-2 animate-spin" /> : <i className="ti ti-check" />}
            {trabajo ? "Guardar cambios" : "Crear trabajo"}
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label required>Nombre del trabajo</Label>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className={inp}
            placeholder="ej: Reparación abolladura, Pintura 2 manos…"
            autoFocus
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label required>Precio base</Label>
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[13px] text-ant3">$</span>
            <input type="number" value={precio} onChange={(e) => setPrecio(e.target.value)} className={`${inp} pl-6`} placeholder="28000" min={0} step={100} />
          </div>
        </div>
      </div>
    </Modal>
  );
}

// ─── Fila de trabajo ──────────────────────────────────────────────────────
function FilaTrabajo({ trabajo, onEditar, onEliminar, onToggle }) {
  const [confirmando, setConfirmando] = useState(false);

  return (
    <div className={`flex items-center gap-2.5 px-2 py-2 rounded-lg ${!trabajo.activo ? "opacity-50" : ""}`}>
      <button
        onClick={() => onToggle(trabajo.id, trabajo.activo)}
        className={`w-8 h-4 rounded-full flex-shrink-0 relative cursor-pointer transition-colors ${trabajo.activo ? "bg-yel" : "bg-border"}`}
      >
        <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-all ${trabajo.activo ? "left-[18px]" : "left-0.5"}`} />
      </button>

      <span className={`flex-1 text-[13px] ${trabajo.activo ? "text-ant" : "text-ant3 line-through"}`}>{trabajo.nombre}</span>

      <span className="text-[12px] font-medium text-ant2 font-mono shrink-0">{fmt(trabajo.precio_base)}</span>

      <div className="flex items-center gap-1 shrink-0">
        <button onClick={() => onEditar(trabajo)} className="w-7 h-7 rounded-lg flex items-center justify-center text-ant3 hover:text-ant hover:bg-antl cursor-pointer transition-colors">
          <i className="ti ti-pencil text-[13px]" />
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
          <button onClick={() => setConfirmando(true)} className="w-7 h-7 rounded-lg flex items-center justify-center text-ant3 hover:text-red-500 hover:bg-red-50 cursor-pointer transition-colors">
            <i className="ti ti-trash text-[13px]" />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Card de pieza ────────────────────────────────────────────────────────
function CardPieza({ pieza, onEditarPieza, onEliminarPieza, onNuevoTrabajo, onEditarTrabajo, onEliminarTrabajo, onToggleTrabajo }) {
  const [expandida, setExpandida] = useState(false);
  const [confirmando, setConfirmando] = useState(false);

  const activos = pieza.trabajos_catalogo?.filter((t) => t.activo).length ?? 0;
  const total = pieza.trabajos_catalogo?.length ?? 0;

  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
      <div className="flex items-center gap-3 px-4 py-3">
        <button onClick={() => setExpandida((p) => !p)} className="flex items-center gap-3 flex-1 min-w-0 text-left cursor-pointer w-full">
          <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-antl text-ant3 shrink-0">
            <i className={`ti ${ICONOS_CATEGORIA[pieza.categoria] ?? "ti-tool"}`} /> {pieza.categoria}
          </span>
          <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center md:justify-between md:gap-3">
            <span className="text-[14px] font-semibold text-ant truncate block">{pieza.nombre}</span>
            <span className="text-[11px] text-ant3 shrink-0 mt-0.5 md:mt-0">
              {activos}/{total} trabajos
            </span>
          </div>
          <i className={`ti ti-chevron-down text-ant3 text-[14px] shrink-0 transition-transform ${expandida ? "rotate-180" : ""}`} />
        </button>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => onNuevoTrabajo(pieza)}
            className="text-ant3 text-[13px] px-2 h-7 rounded flex items-center gap-1 hover:bg-antl hover:text-ant cursor-pointer transition-colors"
            title="Agregar trabajo"
          >
            <i className="ti ti-plus text-[13px]" />
          </button>
          <button
            onClick={() => onEditarPieza(pieza)}
            className="text-ant3 text-[13px] px-2 h-7 rounded flex items-center gap-1 hover:bg-antl hover:text-ant cursor-pointer transition-colors"
            title="Editar pieza"
          >
            <i className="ti ti-pencil text-[13px]" />
          </button>
          {confirmando ? (
            <div className="flex items-center gap-1">
              <button onClick={() => onEliminarPieza(pieza.id)} className="text-[11px] text-red-500 hover:text-red-700 cursor-pointer px-1 whitespace-nowrap">
                ¿Eliminar todo?
              </button>
              <button onClick={() => setConfirmando(false)} className="text-[11px] text-ant3 hover:text-ant cursor-pointer px-1">
                No
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmando(true)}
              className="text-ant3 text-[13px] px-2 h-7 rounded flex items-center gap-1 hover:bg-antl hover:text-ant cursor-pointer transition-colors"
              title="Eliminar pieza"
            >
              <i className="ti ti-trash text-[13px] text-red-400" />
            </button>
          )}
        </div>
      </div>

      {expandida && (
        <div className="border-t border-border px-2 py-2">
          {total === 0 ? (
            <div className="text-[12px] text-ant3 text-center py-3">
              Sin trabajos.{" "}
              <button onClick={() => onNuevoTrabajo(pieza)} className="text-ant underline cursor-pointer">
                Agregar uno
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-0.5">
              {pieza.trabajos_catalogo
                .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"))
                .map((t) => (
                  <FilaTrabajo key={t.id} trabajo={t} onEditar={(trabajo) => onEditarTrabajo(pieza, trabajo)} onEliminar={onEliminarTrabajo} onToggle={onToggleTrabajo} />
                ))}
            </div>
          )}
          <div className="mt-2 pt-2 border-t border-border">
            <button
              onClick={() => onNuevoTrabajo(pieza)}
              className="w-full flex items-center justify-center gap-1.5 text-[12px] text-ant3 hover:text-ant hover:bg-antl rounded-md py-1.5 cursor-pointer transition-colors"
            >
              <i className="ti ti-plus text-[13px]" /> Agregar trabajo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

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

          <div>
            <p className="text-[10px] font-medium text-ant3 uppercase tracking-widest mb-1.5 px-0.5">Categoría</p>
            <div className="flex gap-1.5 flex-wrap">
              {["todas", ...CATEGORIAS].map((c) => (
                <button
                  key={c}
                  onClick={() => setFiltroCategoria(c)}
                  className={`inline-flex items-center gap-1.5 text-[12px] font-medium px-3 h-7 rounded-lg border transition-colors cursor-pointer
                    ${filtroCategoria === c ? "bg-ant text-antl border-ant" : "bg-white text-ant2 border-border hover:border-ant hover:text-ant"}`}
                >
                  {c !== "todas" && <i className={`ti ${ICONOS_CATEGORIA[c] ?? "ti-tool"} text-[12px]`} />}
                  {c === "todas" ? "Todas" : c.charAt(0).toUpperCase() + c.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-medium text-ant3 uppercase tracking-widest mb-1.5 px-0.5">Estado</p>
            <div className="flex gap-1.5">
              {[
                { val: "todos", label: "Todos", icon: "ti-list" },
                { val: "activos", label: "Activos", icon: "ti-check" },
                { val: "inactivos", label: "Inactivos", icon: "ti-x" },
              ].map(({ val, label, icon }) => (
                <button
                  key={val}
                  onClick={() => setFiltroTrabajo(val)}
                  className={`inline-flex items-center gap-1.5 text-[12px] font-medium px-3 h-7 rounded-lg border transition-colors cursor-pointer
                    ${filtroTrabajo === val ? "bg-ant text-antl border-ant" : "bg-white text-ant2 border-border hover:border-ant hover:text-ant"}`}
                >
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
