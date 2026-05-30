// src/components/vehiculo/ModalVehiculoCRUD.jsx

import { useState, useEffect } from "react";

const CAMPO = "w-full px-3 h-9 rounded-md border border-border bg-ant text-[13px] text-antl placeholder:text-ant3 focus:outline-none focus:border-yel focus:ring-1 focus:ring-yel/30 transition";
const LABEL = "block text-[11px] font-semibold text-antm uppercase tracking-wide mb-1";

const EMPTY = {
  dominio: "",
  marca_id: "",
  modelo_id: "",
  anio: "",
  color: "",
  codigo_pintura: "",
};

/**
 * Props:
 *  vehiculo     — objeto a editar (null = crear)
 *  marcas       — [{ id, nombre }]
 *  modelos      — [{ id, nombre, marca_id }]
 *  onCargarModelos(marcaId) — carga modelos de una marca
 *  onSave(datos) — async fn, retorna { ok, error }
 *  onClose()
 */
export function ModalVehiculoCRUD({ vehiculo, marcas, modelos, onCargarModelos, onSave, onClose }) {
  const esEdicion = !!vehiculo;
  const [form, setForm] = useState(EMPTY);
  const [guardando, setGuardando] = useState(false);
  const [errores, setErrores] = useState({});

  /* Precarga si es edición */
  useEffect(() => {
    if (vehiculo) {
      setForm({
        dominio: vehiculo.dominio ?? "",
        marca_id: vehiculo.marca_id ?? vehiculo.marca?.id ?? "",
        modelo_id: vehiculo.modelo_id ?? vehiculo.modelo?.id ?? "",
        anio: vehiculo.anio ?? "",
        color: vehiculo.color ?? "",
        codigo_pintura: vehiculo.codigo_pintura ?? "",
      });
      if (vehiculo.marca_id) onCargarModelos(vehiculo.marca_id);
    } else {
      setForm(EMPTY);
    }
    setErrores({});
  }, [vehiculo]);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleMarcaChange = (e) => {
    const id = e.target.value;
    set("marca_id", id);
    set("modelo_id", "");
    if (id) onCargarModelos(id);
  };

  const validar = () => {
    const e = {};
    if (!form.dominio.trim()) e.dominio = "Requerido";
    if (!form.marca_id) e.marca_id = "Requerido";
    if (!form.modelo_id) e.modelo_id = "Requerido";
    if (!form.anio || isNaN(form.anio) || form.anio < 1900 || form.anio > new Date().getFullYear() + 1) e.anio = "Año inválido";
    return e;
  };

  const handleSubmit = async () => {
    const e = validar();
    if (Object.keys(e).length) {
      setErrores(e);
      return;
    }
    setGuardando(true);
    const datos = { ...form, dominio: form.dominio.toUpperCase().trim(), anio: Number(form.anio) };
    const { ok, error } = await onSave(datos);
    setGuardando(false);
    if (!ok) setErrores({ _global: error ?? "Error al guardar." });
  };

  const modelosFiltrados = form.marca_id ? modelos.filter((m) => m.marca_id === form.marca_id) : modelos;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full sm:max-w-[480px] bg-ant rounded-t-2xl sm:rounded-2xl shadow-2xl border border-border overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-yel/10 text-yel shrink-0">
            <i className={`ti ti-car text-[17px]`} />
          </span>
          <div className="flex-1 min-w-0">
            <div className="text-[14px] font-semibold text-antl">{esEdicion ? `Editar — ${vehiculo.dominio}` : "Nuevo vehículo"}</div>
            <div className="text-[11px] text-antm">{esEdicion ? "Modificá los datos del vehículo" : "Completá los datos para darlo de alta"}</div>
          </div>
          <button onClick={onClose} className="text-ant3 hover:text-antl transition-colors cursor-pointer ml-auto">
            <i className="ti ti-x text-[16px]" />
          </button>
        </div>

        {/* Cuerpo */}
        <div className="px-5 py-4 space-y-3 max-h-[70vh] overflow-y-auto">
          {errores._global && (
            <div className="text-[12px] text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2 flex items-center gap-2">
              <i className="ti ti-alert-circle" /> {errores._global}
            </div>
          )}

          {/* Dominio */}
          <div>
            <label className={LABEL}>Dominio / Patente</label>
            <input
              className={`${CAMPO} uppercase ${errores.dominio ? "border-red-400" : ""}`}
              value={form.dominio}
              onChange={(e) => set("dominio", e.target.value)}
              placeholder="AB123CD"
              maxLength={8}
            />
            {errores.dominio && <p className="text-[11px] text-red-400 mt-1">{errores.dominio}</p>}
          </div>

          {/* Marca + Modelo */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL}>Marca</label>
              <select className={`${CAMPO} ${errores.marca_id ? "border-red-400" : ""}`} value={form.marca_id} onChange={handleMarcaChange}>
                <option value="">— Seleccioná —</option>
                {marcas.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nombre}
                  </option>
                ))}
              </select>
              {errores.marca_id && <p className="text-[11px] text-red-400 mt-1">{errores.marca_id}</p>}
            </div>
            <div>
              <label className={LABEL}>Modelo</label>
              <select className={`${CAMPO} ${errores.modelo_id ? "border-red-400" : ""}`} value={form.modelo_id} onChange={(e) => set("modelo_id", e.target.value)} disabled={!form.marca_id}>
                <option value="">— Seleccioná —</option>
                {modelosFiltrados.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nombre}
                  </option>
                ))}
              </select>
              {errores.modelo_id && <p className="text-[11px] text-red-400 mt-1">{errores.modelo_id}</p>}
            </div>
          </div>

          {/* Año + Color */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL}>Año</label>
              <input
                className={`${CAMPO} ${errores.anio ? "border-red-400" : ""}`}
                type="number"
                value={form.anio}
                onChange={(e) => set("anio", e.target.value)}
                placeholder="2020"
                min={1900}
                max={new Date().getFullYear() + 1}
              />
              {errores.anio && <p className="text-[11px] text-red-400 mt-1">{errores.anio}</p>}
            </div>
            <div>
              <label className={LABEL}>Color</label>
              <input className={CAMPO} value={form.color} onChange={(e) => set("color", e.target.value)} placeholder="Gris" />
            </div>
          </div>

          {/* Código de pintura */}
          <div>
            <label className={LABEL}>Código de pintura</label>
            <input className={`${CAMPO} uppercase`} value={form.codigo_pintura} onChange={(e) => set("codigo_pintura", e.target.value)} placeholder="NH-821N" />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-5 py-4 border-t border-border">
          <button
            onClick={handleSubmit}
            disabled={guardando}
            className={`flex-1 h-9 rounded-md text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-colors
              ${guardando ? "bg-border text-ant3 cursor-not-allowed" : "bg-yel text-yeld hover:bg-yelm cursor-pointer"}`}
          >
            {guardando ? (
              <>
                <i className="ti ti-loader-2 animate-spin" /> Guardando…
              </>
            ) : (
              <>
                <i className={`ti ${esEdicion ? "ti-device-floppy" : "ti-plus"}`} /> {esEdicion ? "Guardar cambios" : "Crear vehículo"}
              </>
            )}
          </button>
          <button onClick={onClose} className="h-9 px-4 rounded-md border border-border text-[13px] text-ant bg-antl transition-colors cursor-pointer">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
