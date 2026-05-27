// src/components/vehiculo/ModalVehiculo.jsx

import { useState } from "react";
import { modelosPorMarca } from "@/data/marcasModelos";

const ANIO_MIN = 1970;
const ANIO_MAX = new Date().getFullYear() + 1;

const COLORES_PRESET = [
  { nombre: "Blanco", hex: "#F5F5F3", borde: true },
  { nombre: "Negro", hex: "#1A1A1A" },
  { nombre: "Gris", hex: "#888780" },
  { nombre: "Gris oscuro", hex: "#444441" },
  { nombre: "Rojo", hex: "#D85A30" },
  { nombre: "Azul", hex: "#378ADD" },
  { nombre: "Azul oscuro", hex: "#185FA5" },
  { nombre: "Verde", hex: "#639922" },
  { nombre: "Amarillo", hex: "#EF9F27" },
  { nombre: "Plateado", hex: "#B4B2A9", borde: true },
  { nombre: "Blanco perla", hex: "#EDE9DF", borde: true },
  { nombre: "Bordó", hex: "#712B13" },
];

function validar(form) {
  const errores = {};
  if (!form.dominio) errores.dominio = "El dominio es requerido";
  else if (form.dominio.length < 6) errores.dominio = "Mínimo 6 caracteres";
  else if (!/^[A-Z0-9]+$/.test(form.dominio)) errores.dominio = "Solo letras y números";

  if (!form.anio) errores.anio = "El año es requerido";
  else {
    const n = parseInt(form.anio);
    if (isNaN(n) || n < ANIO_MIN || n > ANIO_MAX) errores.anio = `Año entre ${ANIO_MIN} y ${ANIO_MAX}`;
  }

  if (!form.marca) errores.marca = "Seleccioná una marca";
  if (!form.modelo) errores.modelo = "Seleccioná un modelo";
  return errores;
}

// ── Subcomponentes ────────────────────────────────────────────────────────

function Field({ label, required, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[12px] text-ant3">
        {label}
        {required && <span className="text-ant3 font-normal ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <div className="flex items-center gap-1 text-[11px] text-[#a32d2d]">
          <i className="ti ti-alert-circle text-[13px]" />
          {error}
        </div>
      )}
    </div>
  );
}

const inputBase = "border border-border rounded-md px-2.5 py-1.5 text-[13px] bg-white text-ant outline-none focus:border-ant w-full";
const inputErr = "border-[#e24b4a]";

// ── Componente principal ──────────────────────────────────────────────────

export function ModalVehiculo({ dominioInicial = "", onClose, onSave }) {
  const [form, setForm] = useState({
    dominio: dominioInicial,
    marca: "",
    modelo: "",
    anio: "",
    titular: "",
    color: "Blanco",
    codigoPintura: "",
  });
  const [errores, setErrores] = useState({});
  const [colorLibre, setColorLibre] = useState(false);

  const set = (k, v) => setForm((prev) => ({ ...prev, [k]: v, ...(k === "marca" ? { modelo: "" } : {}) }));

  const clearErr = (k) =>
    setErrores((prev) => {
      const e = { ...prev };
      delete e[k];
      return e;
    });

  const modelos = form.marca ? (modelosPorMarca[form.marca] ?? []) : [];

  const handleGuardar = () => {
    const e = validar(form);
    if (Object.keys(e).length) {
      setErrores(e);
      return;
    }
    onSave({
      dominio: form.dominio.toUpperCase().trim(),
      marca: form.marca,
      modelo: form.modelo,
      anio: parseInt(form.anio),
      titular: form.titular.trim() || "Sin datos",
      color: form.color.trim() || "Sin especificar",
      codigoPintura: form.codigoPintura.toUpperCase().trim() || null,
    });
  };

  return (
    <div className="fixed inset-0 bg-ant/55 flex items-center justify-center z-[100]" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-xl border border-border w-[600px] max-w-[95%] shadow-xl">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
          <div className="w-[38px] h-[38px] rounded-lg bg-bg border border-border flex items-center justify-center text-xl text-ant3">
            <i className="ti ti-car" />
          </div>
          <div>
            <h3 className="text-[16px] font-medium text-ant m-0">Alta de vehículo</h3>
            <p className="text-[13px] text-ant3 m-0">Completá los datos del vehículo</p>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4">
          {/* Identificación */}
          <div className="text-[11px] font-medium text-ant3 tracking-widest uppercase">Identificación</div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Dominio" required error={errores.dominio}>
              <input
                value={form.dominio}
                onChange={(e) => {
                  set("dominio", e.target.value.toUpperCase());
                  clearErr("dominio");
                }}
                className={`${inputBase} ${errores.dominio ? inputErr : ""}`}
                maxLength={8}
                placeholder="ABC123"
              />
            </Field>
            <Field label="Año" required error={errores.anio}>
              <input
                type="number"
                value={form.anio}
                onChange={(e) => {
                  set("anio", e.target.value);
                  clearErr("anio");
                }}
                className={`${inputBase} ${errores.anio ? inputErr : ""}`}
                min={ANIO_MIN}
                max={ANIO_MAX}
                placeholder="2022"
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Marca" required error={errores.marca}>
              <select
                value={form.marca}
                onChange={(e) => {
                  set("marca", e.target.value);
                  clearErr("marca");
                  clearErr("modelo");
                }}
                className={`${inputBase} ${errores.marca ? inputErr : ""}`}
              >
                <option value="">Seleccionar...</option>
                {Object.keys(modelosPorMarca).map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </Field>
            <Field label="Modelo" required error={errores.modelo}>
              <select
                value={form.modelo}
                onChange={(e) => {
                  set("modelo", e.target.value);
                  clearErr("modelo");
                }}
                className={`${inputBase} ${errores.modelo ? inputErr : ""}`}
                disabled={!modelos.length}
              >
                <option value="">{form.marca ? "Seleccionar modelo..." : "Elegí la marca primero"}</option>
                {modelos.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </Field>
          </div>

          {/* Propietario */}
          <div className="h-px bg-border" />
          <div className="text-[11px] font-medium text-ant3 tracking-widest uppercase">Propietario</div>

          <Field label="Titular">
            <input value={form.titular} onChange={(e) => set("titular", e.target.value)} className={inputBase} placeholder="Nombre completo del propietario" />
          </Field>

          {/* Color y pintura */}
          <div className="h-px bg-border" />
          <div className="text-[11px] font-medium text-ant3 tracking-widest uppercase">Color y pintura</div>

          <Field label="Color predominante">
            <div className="flex gap-1.5 flex-wrap mt-0.5">
              {COLORES_PRESET.map((c) => (
                <button
                  key={c.nombre}
                  type="button"
                  title={c.nombre}
                  onClick={() => {
                    set("color", c.nombre);
                    setColorLibre(false);
                  }}
                  style={{ background: c.hex, borderColor: c.borde ? "#e2e0d8" : c.hex }}
                  className={`w-6 h-6 rounded-full border-2 cursor-pointer transition-transform hover:scale-110
                    ${form.color === c.nombre && !colorLibre ? "scale-125 !border-ant" : ""}`}
                />
              ))}
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Color (texto libre)">
              <input
                value={colorLibre ? form.color : ""}
                onChange={(e) => {
                  set("color", e.target.value);
                  setColorLibre(true);
                }}
                onFocus={() => setColorLibre(true)}
                className={inputBase}
                placeholder="ej: Verde metalizado..."
              />
            </Field>
            <Field label="Código de pintura">
              <input value={form.codigoPintura} onChange={(e) => set("codigoPintura", e.target.value.toUpperCase())} className={inputBase} maxLength={12} placeholder="ej: LY3D, 040, NH-821M..." />
            </Field>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-border">
          <button onClick={onClose} className="border border-border text-ant text-[13px] px-3.5 h-9 rounded-md flex items-center gap-1.5 hover:bg-antl cursor-pointer">
            Cancelar
          </button>
          <button onClick={handleGuardar} className="bg-yel text-yeld font-semibold text-[13px] px-4 h-9 rounded-md flex items-center gap-1.5 hover:bg-yelm cursor-pointer">
            <i className="ti ti-check" /> Guardar vehículo
          </button>
        </div>
      </div>
    </div>
  );
}
