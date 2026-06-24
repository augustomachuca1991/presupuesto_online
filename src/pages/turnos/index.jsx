import { useState, useMemo } from "react";
import { ICONS } from "@/constants/icons";
import { useTurnos } from "@/hooks/useTurnos";
import { useToast } from "@/hooks/useToast";
import { Toasts } from "@/components/ui/Toasts";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import TarjetaTurno, { ESTADOS } from "./components/TarjetaTurno";
import TurnoModal, { validarTurno, formBase } from "./components/TurnoModal";
import DeleteConfirm from "./components/DeleteConfirm";

const DIAS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MESES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Setiembre", "Octubre", "Noviembre", "Diciembre"];

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
    const errs = validarTurno(form);
    if (Object.keys(errs).length > 0) {
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

  function cerrarModal() { setModal(null); }

  return (
    <>
      <Toasts toasts={toasts} />
      <div className="max-w-[680px] mx-auto px-3 sm:px-4 pt-4 pb-12">
        <Breadcrumbs />

        <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl mb-5 shadow-sm border border-border">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-ant shrink-0">
            <i className={`${ICONS.CALENDAR} text-[20px] text-yel`} />
          </div>
          <div className="min-w-0">
            <div className="text-[15px] font-semibold text-ant tracking-tight">Turnos</div>
            <div className="text-[11px] text-ant3">{cargando ? "Cargando…" : `${turnos.length} turno${turnos.length !== 1 ? "s" : ""}`}</div>
          </div>
        </div>

        <div className="flex gap-1 border-b border-border mb-5">
          {[
            { id: "calendario", label: "Calendario", icon: ICONS.CALENDAR },
            { id: "historial", label: "Historial", icon: ICONS.LIST },
          ].map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => { setTab(id); if (id !== "calendario") setDiaSel(null); }}
              className={`flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium border-b-2 -mb-px cursor-pointer transition-colors
                ${tab === id ? "text-ant border-yel" : "text-ant3 border-transparent hover:text-ant"}`}
            >
              <i className={icon} /> {label}
            </button>
          ))}
        </div>

        {tab === "calendario" && (
          <>
            <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm mb-4">
              <div className="flex items-center justify-between px-4 py-3 bg-antl border-b border-border">
                <button onClick={() => navegar(-1)} aria-label="Mes anterior" className="text-ant3 hover:text-ant p-1 rounded cursor-pointer"><i className={ICONS.CHEVRON_LEFT} /></button>
                <div className="flex items-center gap-3">
                  <span className="text-[15px] font-semibold text-ant">{MESES[mes]} {anio}</span>
                  <button onClick={() => { setMes(hoy.getMonth()); setAnio(hoy.getFullYear()); }} className="text-[11px] font-medium text-ant3 border border-border rounded-md px-2.5 h-7 hover:bg-antl hover:text-ant cursor-pointer">Hoy</button>
                </div>
                <button onClick={() => navegar(1)} aria-label="Mes siguiente" className="text-ant3 hover:text-ant p-1 rounded cursor-pointer"><i className={ICONS.CHEVRON_RIGHT} /></button>
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
                          {pasada && <i className={`${ICONS.LOCK} text-ant3/30 text-[10px] absolute top-1.5 right-1.5`} />}
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

            {diaSel && (
              <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="flex items-center justify-between px-4 py-3 bg-antl border-b border-border">
                  <span className="text-[13px] font-semibold text-ant capitalize">
                    {new Date(diaSel + "T12:00:00").toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })}
                  </span>
                  {!esFechaPasada(diaSel) && (
                    <button onClick={() => abrirNuevo(diaSel)} className="bg-yel text-yeld text-[12px] font-semibold px-3 h-7 rounded-md flex items-center gap-1 hover:bg-yelm cursor-pointer">
                      <i className={ICONS.PLUS} /> Nuevo
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

        {tab === "historial" && (
          <div>
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <i className={`${ICONS.SEARCH} absolute left-2.5 top-1/2 -translate-y-1/2 text-[14px] text-ant3 pointer-events-none`} />
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar por cliente, teléfono, dominio, fecha…"
                  className="w-full pl-8 pr-8 h-9 rounded-md border border-border bg-white text-[13px] text-ant placeholder:text-ant3 focus:outline-none focus:border-yel focus:ring-1 focus:ring-yel/20 transition shadow-sm"
                />
                {busqueda && (
                  <button onClick={() => setBusqueda("")} aria-label="Cerrar" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ant3 hover:text-ant cursor-pointer">
                    <i className={ICONS.CLOSE} />
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

      {modal && (
        <TurnoModal
          modal={modal}
          form={form}
          setForm={setForm}
          errores={errores}
          guardando={guardando}
          esFechaPasada={esFechaPasada}
          onGuardar={handleGuardar}
          onClose={cerrarModal}
        />
      )}

      {eliminarId && (
        <DeleteConfirm
          onConfirm={handleEliminar}
          onCancel={() => setEliminarId(null)}
        />
      )}
    </>
  );
}
