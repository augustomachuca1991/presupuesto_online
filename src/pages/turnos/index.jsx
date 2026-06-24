import { useState, useMemo } from "react";
import { useTurnos } from "@/hooks/useTurnos";
import { useToast } from "@/hooks/useToast";
import { Toasts } from "@/components/ui/Toasts";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import * as Yup from "yup";

const DIAS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MESES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Setiembre", "Octubre", "Noviembre", "Diciembre"];

const ESTADOS = {
  pendiente: { label: "Pendiente", dot: "bg-amber-400", badge: "bg-amber-50 text-amber-700 border-amber-200" },
  confirmado: { label: "Confirmado", dot: "bg-blue-400", badge: "bg-blue-50 text-blue-700 border-blue-200" },
  en_progreso: { label: "En progreso", dot: "bg-purple-400", badge: "bg-purple-50 text-purple-700 border-purple-200" },
  completado: { label: "Completado", dot: "bg-green-400", badge: "bg-green-50 text-green-700 border-green-200" },
  cancelado: { label: "Cancelado", dot: "bg-red-300", badge: "bg-red-50 text-red-600 border-red-200" },
};

const turnoSchema = Yup.object({
  fecha: Yup.string().required("La fecha es obligatoria."),
  hora: Yup.string().nullable(),
  cliente_nombre: Yup.string()
    .required("El nombre del cliente es obligatorio.")
    .min(2, "Mínimo 2 caracteres."),
  cliente_telefono: Yup.string()
    .nullable()
    .matches(/^[\d\s\-+]{7,15}$/, "Teléfono inválido (solo dígitos, +, -, espacios)."),
  vehiculo_dominio: Yup.string()
    .nullable()
    .matches(/^[A-Za-z0-9]{6,7}$/, "Dominio inválido (ej: ABC123 o AB123CD)."),
  descripcion: Yup.string().nullable().max(500, "Máximo 500 caracteres."),
  estado: Yup.string().required(),
});

function formatearHora(hora) {
  if (!hora) return "";
  return hora.slice(0, 5);
}

function TarjetaTurno({ t, esPasada, onEditar, onEliminar }) {
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
          <button onClick={() => onEditar(t)} className="w-7 h-7 rounded-lg flex items-center justify-center border border-border text-ant3 hover:text-ant hover:bg-white cursor-pointer" title="Editar">
            <i className="ti ti-pencil text-[12px]" />
          </button>
          <button onClick={() => onEliminar(t.id)} className="w-7 h-7 rounded-lg flex items-center justify-center border border-border text-ant3 hover:text-red-500 hover:border-red-200 hover:bg-red-50 cursor-pointer" title="Eliminar">
            <i className="ti ti-trash text-[12px]" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function TurnosPage() {
  const { turnos, cargando, agregar, editar, eliminar } = useTurnos();
  const { toasts, toast } = useToast();
  const [tab, setTab] = useState("calendario");
  const [busqueda, setBusqueda] = useState("");

  const hoy = useMemo(() => new Date(), []);
  const hoyStr = useMemo(() => `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}-${String(hoy.getDate()).padStart(2, "0")}`, [hoy]);

  function esFechaPasada(fecha) { return fecha < hoyStr; }
  const [mes, setMes] = useState(hoy.getMonth());
  const [anio, setAnio] = useState(hoy.getFullYear());
  const [diaSel, setDiaSel] = useState(null);
  const [modal, setModal] = useState(null);
  const [eliminarId, setEliminarId] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [errores, setErrores] = useState({});

  const formBase = { fecha: "", hora: "", cliente_nombre: "", cliente_telefono: "", vehiculo_dominio: "", vehiculo_info: "", descripcion: "", estado: "pendiente" };
  const [form, setForm] = useState({ ...formBase });

  const turnosPorFecha = useMemo(() => {
    const m = {};
    turnos.forEach((t) => {
      if (!m[t.fecha]) m[t.fecha] = [];
      m[t.fecha].push(t);
    });
    return m;
  }, [turnos]);

  const calendario = useMemo(() => {
    const primerDia = new Date(anio, mes, 1);
    const ultimoDia = new Date(anio, mes + 1, 0);
    const celdas = [];
    for (let i = 0; i < primerDia.getDay(); i++) celdas.push(null);
    for (let d = 1; d <= ultimoDia.getDate(); d++) {
      const fecha = `${anio}-${String(mes + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const ts = new Date(anio, mes, d);
      celdas.push({ dia: d, fecha, hoy: ts.toDateString() === hoy.toDateString(), pasado: esFechaPasada(fecha), turnos: turnosPorFecha[fecha] ?? [] });
    }
    while (celdas.length % 7 !== 0) celdas.push(null);
    return celdas;
  }, [anio, mes, turnosPorFecha, hoy]);

  const turnosDia = diaSel ? (turnosPorFecha[diaSel] ?? []) : [];

  const turnosFiltrados = useMemo(() => {
    const q = busqueda.toLowerCase().trim();
    if (!q) return [...turnos].sort((a, b) => b.fecha.localeCompare(a.fecha) || (b.hora ?? "").localeCompare(a.hora ?? ""));
    return turnos
      .filter((t) =>
        t.cliente_nombre.toLowerCase().includes(q) ||
        (t.cliente_telefono ?? "").includes(q) ||
        (t.vehiculo_dominio ?? "").toLowerCase().includes(q) ||
        (t.vehiculo_info ?? "").toLowerCase().includes(q) ||
        (t.descripcion ?? "").toLowerCase().includes(q) ||
        t.fecha.includes(q)
      )
      .sort((a, b) => b.fecha.localeCompare(a.fecha) || (b.hora ?? "").localeCompare(a.hora ?? ""));
  }, [turnos, busqueda]);

  function navegar(d) {
    let m = mes + d, a = anio;
    if (m < 0) { m = 11; a--; } else if (m > 11) { m = 0; a++; }
    setMes(m); setAnio(a);
  }

  function abrirNuevo(fecha) {
    setForm({ ...formBase, fecha });
    setErrores({});
    setModal("nuevo");
  }

  function abrirEditar(t) {
    setForm({ ...t });
    setErrores({});
    setModal(t);
  }

  async function handleGuardar() {
    try {
      turnoSchema.validateSync(form, { abortEarly: false });
      setErrores({});
    } catch (err) {
      const errs = {};
      err.inner.forEach((e) => { if (e.path) errs[e.path] = e.message; });
      setErrores(errs);
      toast.error("Corregí los campos marcados en rojo.");
      return;
    }

    if (modal === "nuevo" && esFechaPasada(form.fecha)) {
      toast.error("No podés crear turnos en el pasado.");
      return;
    }

    setGuardando(true);
    const payload = {
      ...form,
      cliente_nombre: form.cliente_nombre.trim(),
      cliente_telefono: form.cliente_telefono.trim(),
      vehiculo_dominio: form.vehiculo_dominio.trim().toUpperCase(),
      vehiculo_info: form.vehiculo_info.trim(),
    };

    if (modal === "nuevo") {
      const r = await agregar(payload);
      if (r) { toast.success("Turno creado."); setModal(null); }
      else toast.error("No se pudo crear el turno.");
    } else if (modal?.id) {
      const r = await editar(modal.id, payload);
      if (r) { toast.success("Turno actualizado."); setModal(null); }
      else toast.error("No se pudo actualizar.");
    }
    setGuardando(false);
  }

  async function handleEliminar() {
    if (!eliminarId) return;
    const ok = await eliminar(eliminarId);
    if (ok) { toast.success("Turno eliminado."); setEliminarId(null); setDiaSel(null); }
    else toast.error("No se pudo eliminar.");
  }

  return (
    <>
      <Toasts toasts={toasts} />
      <div className="max-w-[680px] mx-auto px-3 sm:px-4 pt-4 pb-12">
        <Breadcrumbs />

        <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl mb-5 shadow-sm border border-border">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-ant shrink-0">
            <i className="ti ti-calendar text-[20px] text-yel" />
          </div>
          <div className="min-w-0">
            <div className="text-[15px] font-semibold text-ant tracking-tight">Turnos</div>
            <div className="text-[11px] text-ant3">{cargando ? "Cargando…" : `${turnos.length} turno${turnos.length !== 1 ? "s" : ""}`}</div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 border-b border-border mb-5">
          {[
            { id: "calendario", label: "Calendario", icon: "ti-calendar" },
            { id: "historial", label: "Historial", icon: "ti-list" },
          ].map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => { setTab(id); if (id !== "calendario") setDiaSel(null); }}
              className={`flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium border-b-2 -mb-px cursor-pointer transition-colors
                ${tab === id ? "text-ant border-yel" : "text-ant3 border-transparent hover:text-ant"}`}
            >
              <i className={`ti ${icon}`} /> {label}
            </button>
          ))}
        </div>

        {/* ── Panel: Calendario ── */}
        {tab === "calendario" && (
          <>
            <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm mb-4">
              <div className="flex items-center justify-between px-4 py-3 bg-antl border-b border-border">
                <button onClick={() => navegar(-1)} className="text-ant3 hover:text-ant p-1 rounded cursor-pointer"><i className="ti ti-chevron-left text-[18px]" /></button>
                <div className="flex items-center gap-3">
                  <span className="text-[15px] font-semibold text-ant">{MESES[mes]} {anio}</span>
                  <button onClick={() => { setMes(hoy.getMonth()); setAnio(hoy.getFullYear()); }} className="text-[11px] font-medium text-ant3 border border-border rounded-md px-2.5 h-7 hover:bg-antl hover:text-ant cursor-pointer">Hoy</button>
                </div>
                <button onClick={() => navegar(1)} className="text-ant3 hover:text-ant p-1 rounded cursor-pointer"><i className="ti ti-chevron-right text-[18px]" /></button>
              </div>

              <div className="grid grid-cols-7 border-b border-border">
                {DIAS.map((d) => (
                  <div key={d} className="text-[10px] font-bold text-ant3 uppercase tracking-wider text-center py-2 border-r border-border last:border-r-0">{d}</div>
                ))}
              </div>

              <div className="grid grid-cols-7">
                {calendario.map((celda, i) => {
                  const pasada = celda?.pasado;
                  return (
                    <div
                      key={i}
                      onClick={() => { if (celda && !pasada) setDiaSel(celda.fecha === diaSel ? null : celda.fecha); }}
                      className={`min-h-[80px] border-r border-b border-border last:border-r-0 p-1.5 flex flex-col transition-colors relative
                        ${celda ? (pasada ? "bg-antl/40 cursor-default select-none" : "cursor-pointer hover:bg-antl/50") : "bg-antl/30"}
                        ${celda?.hoy ? "bg-yel/5" : ""}
                        ${celda?.fecha === diaSel ? "ring-2 ring-yel ring-inset" : ""}
                        ${pasada ? "after:absolute after:inset-0 after:bg-[repeating-linear-gradient(135deg,transparent,transparent_4px,rgba(0,0,0,0.03)_4px,rgba(0,0,0,0.03)_8px)] after:pointer-events-none" : ""}`}
                    >
                      {celda && (
                        <>
                          <span className={`text-[11px] font-medium mb-0.5 ${celda.hoy ? "text-yel font-bold" : pasada ? "text-ant3/50" : "text-ant"}`}>{celda.dia}</span>
                          {pasada && <i className="ti ti-lock text-ant3/30 text-[10px] absolute top-1.5 right-1.5" />}
                          <div className="flex flex-wrap gap-0.5 mt-auto opacity-30">
                            {celda.turnos.slice(0, 4).map((t) => (
                              <span key={t.id} className={`w-1.5 h-1.5 rounded-full ${ESTADOS[t.estado]?.dot ?? "bg-ant3"}`} />
                            ))}
                            {celda.turnos.length > 4 && <span className="text-[9px] text-ant3 font-medium">+{celda.turnos.length - 4}</span>}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Panel del día ── */}
            {diaSel && (
              <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="flex items-center justify-between px-4 py-3 bg-antl border-b border-border">
                  <span className="text-[13px] font-semibold text-ant capitalize">
                    {new Date(diaSel + "T12:00:00").toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })}
                  </span>
                  {!esFechaPasada(diaSel) && (
                    <button onClick={() => abrirNuevo(diaSel)} className="bg-yel text-yeld text-[12px] font-semibold px-3 h-7 rounded-md flex items-center gap-1 hover:bg-yelm cursor-pointer">
                      <i className="ti ti-plus text-[13px]" /> Nuevo
                    </button>
                  )}
                </div>

                {turnosDia.length === 0 ? (
                  <div className="text-[12px] text-ant3 text-center py-8">Sin turnos para este día.</div>
                ) : (
                  <div className="divide-y divide-border">
                    {turnosDia.map((t) => (
                      <TarjetaTurno key={t.id} t={t} esPasada={esFechaPasada(t.fecha)} onEditar={abrirEditar} onEliminar={setEliminarId} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* ── Panel: Historial ── */}
        {tab === "historial" && (
          <div>
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <i className="ti ti-search absolute left-2.5 top-1/2 -translate-y-1/2 text-[14px] text-ant3 pointer-events-none" />
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar por cliente, teléfono, dominio, fecha…"
                  className="w-full pl-8 pr-8 h-9 rounded-md border border-border bg-white text-[13px] text-ant placeholder:text-ant3 focus:outline-none focus:border-yel focus:ring-1 focus:ring-yel/20 transition shadow-sm"
                />
                {busqueda && (
                  <button onClick={() => setBusqueda("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ant3 hover:text-ant cursor-pointer">
                    <i className="ti ti-x text-[13px]" />
                  </button>
                )}
              </div>
            </div>

            {cargando ? (
              <div className="text-[13px] text-ant3 text-center py-8">Cargando historial…</div>
            ) : turnosFiltrados.length === 0 ? (
              <div className="text-[13px] text-ant3 text-center py-8 px-4 border border-dashed border-border rounded-md whitespace-pre-line">
                {busqueda ? "Sin resultados para esa búsqueda." : "Todavía no hay turnos registrados."}
              </div>
            ) : (
              <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm divide-y divide-border">
                {turnosFiltrados.map((t) => (
                  <TarjetaTurno key={t.id} t={t} esPasada={esFechaPasada(t.fecha)} onEditar={abrirEditar} onEliminar={setEliminarId} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Modal crear/editar ── */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setModal(null)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-border max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <span className="text-[15px] font-semibold text-ant flex items-center gap-2">
                <i className={`ti ${modal === "nuevo" ? "ti-plus" : "ti-pencil"}`} />
                {modal === "nuevo" ? "Nuevo turno" : "Editar turno"}
              </span>
              <button onClick={() => setModal(null)} className="text-ant3 hover:text-ant cursor-pointer"><i className="ti ti-x text-[18px]" /></button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-ant3 uppercase tracking-widest mb-1">Fecha</label>
                  <input type="date" value={form.fecha} onChange={(e) => setForm((p) => ({ ...p, fecha: e.target.value }))} className={`w-full px-3 h-9 rounded-md border bg-white text-[13px] text-ant focus:outline-none transition ${errores.fecha ? "border-red-400 ring-1 ring-red-200" : "border-border focus:border-yel"}`} />
                  {errores.fecha && <p className="text-[11px] text-red-500 mt-1">{errores.fecha}</p>}
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-ant3 uppercase tracking-widest mb-1">Hora</label>
                  <input type="time" value={form.hora ?? ""} onChange={(e) => setForm((p) => ({ ...p, hora: e.target.value || null }))} className={`w-full px-3 h-9 rounded-md border bg-white text-[13px] text-ant focus:outline-none transition ${errores.hora ? "border-red-400 ring-1 ring-red-200" : "border-border focus:border-yel"}`} />
                  {errores.hora && <p className="text-[11px] text-red-500 mt-1">{errores.hora}</p>}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-ant3 uppercase tracking-widest mb-1">Cliente *</label>
                <input type="text" value={form.cliente_nombre} onChange={(e) => setForm((p) => ({ ...p, cliente_nombre: e.target.value }))} placeholder="Nombre y apellido" className={`w-full px-3 h-9 rounded-md border bg-white text-[13px] text-ant placeholder:text-ant3 focus:outline-none transition ${errores.cliente_nombre ? "border-red-400 ring-1 ring-red-200" : "border-border focus:border-yel"}`} />
                {errores.cliente_nombre && <p className="text-[11px] text-red-500 mt-1">{errores.cliente_nombre}</p>}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-ant3 uppercase tracking-widest mb-1">Teléfono</label>
                <input type="text" value={form.cliente_telefono} onChange={(e) => setForm((p) => ({ ...p, cliente_telefono: e.target.value }))} placeholder="+54 379 4XXXXXXX" className={`w-full px-3 h-9 rounded-md border bg-white text-[13px] text-ant placeholder:text-ant3 focus:outline-none transition ${errores.cliente_telefono ? "border-red-400 ring-1 ring-red-200" : "border-border focus:border-yel"}`} />
                {errores.cliente_telefono && <p className="text-[11px] text-red-500 mt-1">{errores.cliente_telefono}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-ant3 uppercase tracking-widest mb-1">Dominio</label>
                  <input type="text" value={form.vehiculo_dominio} onChange={(e) => setForm((p) => ({ ...p, vehiculo_dominio: e.target.value }))} placeholder="AB123CD" className={`w-full px-3 h-9 rounded-md border bg-white text-[13px] text-ant placeholder:text-ant3 uppercase focus:outline-none transition ${errores.vehiculo_dominio ? "border-red-400 ring-1 ring-red-200" : "border-border focus:border-yel"}`} />
                  {errores.vehiculo_dominio && <p className="text-[11px] text-red-500 mt-1">{errores.vehiculo_dominio}</p>}
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-ant3 uppercase tracking-widest mb-1">Vehículo</label>
                  <input type="text" value={form.vehiculo_info} onChange={(e) => setForm((p) => ({ ...p, vehiculo_info: e.target.value }))} placeholder="Ford Focus 2018" className="w-full px-3 h-9 rounded-md border border-border bg-white text-[13px] text-ant placeholder:text-ant3 focus:outline-none focus:border-yel" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-ant3 uppercase tracking-widest mb-1">Descripción</label>
                <textarea value={form.descripcion} onChange={(e) => setForm((p) => ({ ...p, descripcion: e.target.value }))} placeholder="Trabajo a realizar..." rows={3} className={`w-full px-3 py-2 rounded-md border bg-white text-[13px] text-ant placeholder:text-ant3 focus:outline-none transition resize-none ${errores.descripcion ? "border-red-400 ring-1 ring-red-200" : "border-border focus:border-yel"}`} />
                {errores.descripcion && <p className="text-[11px] text-red-500 mt-1">{errores.descripcion}</p>}
              </div>

              <div>
                <label className="block text-[10px] font-bold text-ant3 uppercase tracking-widest mb-1">Estado</label>
                <select value={form.estado} onChange={(e) => setForm((p) => ({ ...p, estado: e.target.value }))} className="w-full px-3 h-9 rounded-md border border-border bg-white text-[13px] text-ant focus:outline-none focus:border-yel">
                  {Object.entries(ESTADOS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
            </div>

            <div className="flex gap-2 px-5 py-4 border-t border-border">
              <button onClick={handleGuardar} disabled={guardando} className="bg-yel text-yeld text-[13px] font-semibold px-4 h-9 rounded-md flex items-center gap-1.5 hover:bg-yelm cursor-pointer disabled:opacity-50">
                {guardando ? <i className="ti ti-loader-2 animate-spin" /> : <i className="ti ti-device-floppy" />}
                {modal === "nuevo" ? "Crear turno" : "Guardar cambios"}
              </button>
              <button onClick={() => setModal(null)} className="border border-border text-ant text-[13px] px-3.5 h-9 rounded-md hover:bg-antl cursor-pointer">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Confirmar eliminación ── */}
      {eliminarId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setEliminarId(null)} />
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-border p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center shrink-0">
                <i className="ti ti-alert-triangle text-[20px] text-red-500" />
              </div>
              <div>
                <div className="text-[14px] font-semibold text-ant">Eliminar turno</div>
                <div className="text-[12px] text-ant3">¿Eliminás este turno? No se puede deshacer.</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleEliminar} className="bg-red-500 text-white text-[13px] font-semibold px-4 h-9 rounded-md hover:bg-red-600 cursor-pointer">Sí, eliminar</button>
              <button onClick={() => setEliminarId(null)} className="border border-border text-ant text-[13px] px-3.5 h-9 rounded-md hover:bg-antl cursor-pointer">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
