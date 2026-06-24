import * as Yup from "yup";
import { ESTADOS } from "./TarjetaTurno";

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

export function validarTurno(form) {
  try {
    turnoSchema.validateSync(form, { abortEarly: false });
    return {};
  } catch (err) {
    const errs = {};
    err.inner.forEach((e) => { if (e.path) errs[e.path] = e.message; });
    return errs;
  }
}

export const formBase = {
  fecha: "", hora: "", cliente_nombre: "", cliente_telefono: "",
  vehiculo_dominio: "", vehiculo_info: "", descripcion: "", estado: "pendiente",
};

export default function TurnoModal({ modal, form, setForm, errores, guardando, esFechaPasada, onGuardar, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-border max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <span className="text-[15px] font-semibold text-ant flex items-center gap-2">
            <i className={`ti ${modal === "nuevo" ? "ti-plus" : "ti-pencil"}`} />
            {modal === "nuevo" ? "Nuevo turno" : "Editar turno"}
          </span>
          <button onClick={onClose} className="text-ant3 hover:text-ant cursor-pointer"><i className="ti ti-x text-[18px]" /></button>
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
          <button onClick={onGuardar} disabled={guardando} className="bg-yel text-yeld text-[13px] font-semibold px-4 h-9 rounded-md flex items-center gap-1.5 hover:bg-yelm cursor-pointer disabled:opacity-50">
            {guardando ? <i className="ti ti-loader-2 animate-spin" /> : <i className="ti ti-device-floppy" />}
            {modal === "nuevo" ? "Crear turno" : "Guardar cambios"}
          </button>
          <button onClick={onClose} className="border border-border text-ant text-[13px] px-3.5 h-9 rounded-md hover:bg-antl cursor-pointer">Cancelar</button>
        </div>
      </div>
    </div>
  );
}
