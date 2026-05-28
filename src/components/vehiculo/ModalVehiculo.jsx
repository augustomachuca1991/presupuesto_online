// src/components/vehiculo/ModalVehiculo.jsx

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMarcasModelos } from "@/hooks/useMarcasModelos";
import { resolverIdsVehiculo } from "@/hooks/useVehiculos";

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

const validationSchema = Yup.object({
  dominio: Yup.string()
    .required("El dominio es requerido")
    .min(6, "Mínimo 6 caracteres")
    .matches(/^[A-Z0-9]+$/, "Solo letras y números")
    .matches(/^([A-Z]{3}[0-9]{3}|[A-Z]{2}[0-9]{3}[A-Z]{2})$/, "Formato: ABC123 o AB123CD"),
  anio: Yup.number()
    .required("El año es requerido")
    .min(ANIO_MIN, `Año mínimo ${ANIO_MIN}`)
    .max(ANIO_MAX, `Año máximo ${ANIO_MAX}`)
    .integer("Debe ser un año válido")
    .typeError("Ingresá un año válido"),
  marca: Yup.string().required("Seleccioná una marca"),
  modelo: Yup.string().required("Seleccioná un modelo"),
  titularNombre: Yup.string(),
  titularApellido: Yup.string(),
  titularEmail: Yup.string().email("Formato de email inválido"),
  titularTelefono: Yup.string()
    .required("Debe ingresar un numero de telefono")
    .matches(/^[0-9]+$/, "Solo se permiten números")
    .max(10, "Máximo 10 dígitos"),
  color: Yup.string(),
  codigoPintura: Yup.string(),
});

// ─── Field wrapper ────────────────────────────────────────────────────────
function Field({ label, required, error, touched, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[12px] text-ant3">
        {label}
        {required && <span className="text-ant3 font-normal ml-0.5">*</span>}
      </label>
      {children}
      {touched && error && (
        <div className="flex items-center gap-1 text-[11px] text-[#a32d2d]">
          <i className="ti ti-alert-circle text-[13px]" />
          {error}
        </div>
      )}
    </div>
  );
}

const inputBase = "border border-border rounded-md px-2.5 py-1.5 text-[13px] bg-white text-ant outline-none focus:border-ant w-full";
const inputErr = "!border-[#e24b4a]";

// ─── Componente principal ─────────────────────────────────────────────────
/**
 * Props:
 *   dominioInicial  string
 *   onClose         () => void
 *   onSave          (datosVehiculo) => Promise<void>  — recibe objeto ya con marca_id y modelo_id
 */
export function ModalVehiculo({ dominioInicial = "", onClose, onSave }) {
  // Marcas y modelos desde Supabase
  const { marcas, modelosDe, isLoading: cargandoCatalogo, isError: errorCatalogo } = useMarcasModelos();

  const [colorLibre, setColorLibre] = useState(false);
  const [resolviendoIds, setResolviendoIds] = useState(false);

  const formik = useFormik({
    initialValues: {
      dominio: dominioInicial,
      marca: "",
      modelo: "",
      anio: "",
      titularNombre: "",
      titularApellido: "",
      titularEmail: "",
      titularTelefono: "",
      color: "Blanco",
      codigoPintura: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setResolviendoIds(true);
      try {
        // Resuelve los UUIDs de marca y modelo desde sus nombres
        const ids = await resolverIdsVehiculo(values.marca, values.modelo);
        if (!ids) {
          formik.setFieldError("modelo", "No se encontró el modelo en la base de datos.");
          return;
        }

        await onSave({
          dominio: values.dominio.toUpperCase().trim(),
          marca_id: ids.marca_id,
          modelo_id: ids.modelo_id,
          marca: values.marca,
          modelo: values.modelo,
          anio: parseInt(values.anio),
          titularNombre: values.titularNombre.trim() || "Sin datos",
          titularApellido: values.titularApellido.trim() || "Sin datos",
          titularEmail: values.titularEmail.trim() || "Sin datos",
          titularTelefono: values.titularTelefono.trim() || "Sin datos",
          color: values.color.trim() || "Sin especificar",
          codigoPintura: values.codigoPintura.toUpperCase().trim() || null,
        });
      } finally {
        setResolviendoIds(false);
      }
    },
  });

  const modelos = modelosDe(formik.values.marca);
  const guardando = formik.isSubmitting || resolviendoIds;

  const handleColorPreset = (nombre) => {
    formik.setFieldValue("color", nombre);
    setColorLibre(false);
  };

  return (
    <div className="fixed inset-0 bg-ant/55 flex items-center justify-center z-[100] p-4" onClick={onClose}>
      <div className="bg-white rounded-xl border border-border w-[600px] max-w-full max-h-[90vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
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
          {/* Error de carga del catálogo */}
          {errorCatalogo && (
            <div className="flex items-center gap-2 text-[12px] text-[#791f1f] bg-[#fcebeb] border border-[#f09595] rounded-md px-3 py-2">
              <i className="ti ti-alert-triangle text-[15px]" />
              No se pudieron cargar las marcas. Verificá tu conexión e intentá de nuevo.
            </div>
          )}

          {/* ── Identificación ── */}
          <div className="text-[11px] font-medium text-ant3 tracking-widest uppercase">Identificación</div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Dominio" required error={formik.errors.dominio} touched={formik.touched.dominio}>
              <input
                {...formik.getFieldProps("dominio")}
                onChange={(e) => formik.setFieldValue("dominio", e.target.value.toUpperCase())}
                className={`${inputBase} ${formik.touched.dominio && formik.errors.dominio ? inputErr : ""}`}
                maxLength={8}
                placeholder="ABC123"
              />
            </Field>

            <Field label="Año" required error={formik.errors.anio} touched={formik.touched.anio}>
              <input
                {...formik.getFieldProps("anio")}
                type="number"
                className={`${inputBase} ${formik.touched.anio && formik.errors.anio ? inputErr : ""}`}
                min={ANIO_MIN}
                max={ANIO_MAX}
                placeholder="2022"
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Marca" required error={formik.errors.marca} touched={formik.touched.marca}>
              <div className="relative">
                <select
                  {...formik.getFieldProps("marca")}
                  onChange={(e) => {
                    formik.setFieldValue("marca", e.target.value);
                    formik.setFieldValue("modelo", ""); // resetea modelo al cambiar marca
                  }}
                  className={`${inputBase} ${formik.touched.marca && formik.errors.marca ? inputErr : ""} ${cargandoCatalogo ? "opacity-50" : ""}`}
                  disabled={cargandoCatalogo || errorCatalogo}
                >
                  <option value="">{cargandoCatalogo ? "Cargando..." : "Seleccionar..."}</option>
                  {marcas.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                {/* Spinner sobre el select mientras carga */}
                {cargandoCatalogo && <i className="ti ti-loader-2 animate-spin absolute right-8 top-2 text-ant3 text-[14px]" />}
              </div>
            </Field>

            <Field label="Modelo" required error={formik.errors.modelo} touched={formik.touched.modelo}>
              <select {...formik.getFieldProps("modelo")} className={`${inputBase} ${formik.touched.modelo && formik.errors.modelo ? inputErr : ""}`} disabled={!modelos.length || cargandoCatalogo}>
                <option value="">{!formik.values.marca ? "Elegí la marca primero" : modelos.length === 0 ? "Sin modelos disponibles" : "Seleccionar modelo..."}</option>
                {modelos.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {/* ── Propietario ── */}
          <div className="h-px bg-border" />
          <div className="text-[11px] font-medium text-ant3 tracking-widest uppercase">Propietario</div>

          <div className="grid grid-cols-2 gap-2">
            <Field label="Nombre" error={formik.errors.titularNombre} touched={formik.touched.titularNombre}>
              <input
                {...formik.getFieldProps("titularNombre")}
                className={`${inputBase} ${formik.touched.titularNombre && formik.errors.titularNombre ? inputErr : ""}`}
                placeholder="Nombre completo del propietario"
              />
            </Field>

            <Field label="Apellido" error={formik.errors.titularApellido} touched={formik.touched.titularApellido}>
              <input
                {...formik.getFieldProps("titularApellido")}
                className={`${inputBase} ${formik.touched.titularApellido && formik.errors.titularApellido ? inputErr : ""}`}
                placeholder="Apellido del propietario"
              />
            </Field>

            <Field label="Email" error={formik.errors.titularEmail} touched={formik.touched.titularEmail}>
              <input
                {...formik.getFieldProps("titularEmail")}
                className={`${inputBase} ${formik.touched.titularEmail && formik.errors.titularEmail ? inputErr : ""}`}
                placeholder="Email del propietario"
              />
            </Field>

            <Field label="Telefono" required error={formik.errors.titularTelefono} touched={formik.touched.titularTelefono}>
              <input
                {...formik.getFieldProps("titularTelefono")}
                className={`${inputBase} ${formik.touched.titularTelefono && formik.errors.titularTelefono ? inputErr : ""}`}
                placeholder="Telefono del propietario"
              />
            </Field>
          </div>

          {/* ── Color y pintura ── */}
          <div className="h-px bg-border" />
          <div className="text-[11px] font-medium text-ant3 tracking-widest uppercase">Color y pintura</div>

          <Field label="Color predominante">
            <div className="flex gap-1.5 flex-wrap mt-0.5">
              {COLORES_PRESET.map((c) => (
                <button
                  key={c.nombre}
                  type="button"
                  title={c.nombre}
                  onClick={() => handleColorPreset(c.nombre)}
                  style={{ background: c.hex, borderColor: c.borde ? "#e2e0d8" : c.hex }}
                  className={`w-6 h-6 rounded-full border-2 cursor-pointer transition-transform hover:scale-110
                    ${formik.values.color === c.nombre && !colorLibre ? "scale-125 !border-ant" : ""}`}
                />
              ))}
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Color (texto libre)">
              <input
                value={colorLibre ? formik.values.color : ""}
                onChange={(e) => {
                  formik.setFieldValue("color", e.target.value);
                  setColorLibre(true);
                }}
                onFocus={() => setColorLibre(true)}
                className={inputBase}
                placeholder="ej: Verde metalizado..."
              />
            </Field>
            <Field label="Código de pintura">
              <input
                {...formik.getFieldProps("codigoPintura")}
                onChange={(e) => formik.setFieldValue("codigoPintura", e.target.value.toUpperCase())}
                className={inputBase}
                maxLength={12}
                placeholder="ej: LY3D, 040, NH-821M..."
              />
            </Field>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            disabled={guardando}
            className="border border-border text-ant text-[13px] px-3.5 h-9 rounded-md flex items-center gap-1.5 hover:bg-antl cursor-pointer disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => formik.handleSubmit()}
            disabled={guardando || cargandoCatalogo}
            className="bg-yel text-yeld font-semibold text-[13px] px-4 h-9 rounded-md flex items-center gap-1.5 hover:bg-yelm cursor-pointer disabled:opacity-60"
          >
            {guardando ? (
              <>
                <i className="ti ti-loader-2 animate-spin" /> Guardando...
              </>
            ) : (
              <>
                <i className="ti ti-check" /> Guardar vehículo
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
