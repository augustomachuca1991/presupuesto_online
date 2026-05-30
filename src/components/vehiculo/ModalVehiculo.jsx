// src/components/vehiculo/ModalVehiculo.jsx
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMarcasModelos } from "@/hooks/useMarcasModelos";
import { resolverIdsVehiculo } from "@/hooks/useVehiculos";
import { ModalGenerico } from "@/components/ui/ModalGenerico";
import { FormInput, FormSelect } from "@/components/ui/FormComponents";
import Field from "@/components/ui/Field";

const ANIO_MIN = 1970;
const ANIO_MAX = new Date().getFullYear() + 1;

// ─── Estilos de Interfaz Centralizados ────────────────────────────────────
const TEXTO_SECCION = "text-[10px] font-medium text-ant3 uppercase tracking-widest my-1.5 px-0.5";

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
    .required("Debe ingresar un número de teléfono")
    .matches(/^[0-9]+$/, "Solo se permiten números")
    .max(10, "Máximo 10 dígitos"),
  color: Yup.string(),
  codigoPintura: Yup.string(),
});

export function ModalVehiculo({ dominioInicial = "", onClose, onSave }) {
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
        const ids = await resolverIdsVehiculo(values.marca, values.modelo);
        if (!ids) {
          formik.setFieldError("modelo", "No se encontró el modelo en la base de datos.");
          return;
        }

        const pudoGuardar = await onSave({
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

        if (pudoGuardar) onClose();
      } catch {
        formik.setFieldError("dominio", "Ocurrió un error al procesar la solicitud.");
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
    <ModalGenerico titulo="Alta de vehículo" subtitulo="Completá los datos del vehículo" iconClass="ti-car" guardando={guardando} onClose={onClose} onSave={formik.handleSubmit}>
      {/* Mensaje de Error Catálogo */}
      {errorCatalogo && (
        <div className="flex items-center gap-2 text-[12px] text-red-400 bg-red-500/10 border border-red-500/30 rounded-md px-3 py-2 mb-2">
          <i className="ti ti-alert-triangle text-[15px]" />
          No se pudieron cargar las marcas. Verificá tu conexión e intentá de nuevo.
        </div>
      )}

      {/* ── SECCIÓN: Identificación ── */}
      <div className={TEXTO_SECCION}>Identificación</div>

      <div className="grid grid-cols-2 gap-3">
        <FormInput label="Dominio" name="dominio" formik={formik} required maxLength={8} placeholder="AB123CD" onChange={(e) => formik.setFieldValue("dominio", e.target.value.toUpperCase())} />

        <FormInput label="Año" name="anio" type="number" formik={formik} required min={ANIO_MIN} max={ANIO_MAX} placeholder="2026" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="relative w-full">
          <FormSelect
            label="Marca"
            name="marca"
            formik={formik}
            required
            disabled={cargandoCatalogo || errorCatalogo}
            onChange={(e) => {
              formik.setFieldValue("marca", e.target.value);
              formik.setFieldValue("modelo", "");
            }}
          >
            <option value="">{cargandoCatalogo ? "Cargando..." : "Seleccionar..."}</option>
            {marcas.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </FormSelect>
          {cargandoCatalogo && <i className="ti ti-loader-2 animate-spin absolute right-8 bottom-3 text-ant3 text-[14px] z-10" />}
        </div>

        <FormSelect label="Modelo" name="modelo" formik={formik} required disabled={!modelos.length || cargandoCatalogo}>
          <option value="">{!formik.values.marca ? "Elegí la marca primero" : modelos.length === 0 ? "Sin modelos disponibles" : "Seleccionar modelo..."}</option>
          {modelos.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </FormSelect>
      </div>

      {/* ── SECCIÓN: Propietario ── */}
      <div className="h-px bg-border my-1" />
      <div className={TEXTO_SECCION}>Propietario</div>

      <div className="grid grid-cols-2 gap-3">
        <FormInput label="Nombre" name="titularNombre" formik={formik} placeholder="Juan" />

        <FormInput label="Apellido" name="titularApellido" formik={formik} placeholder="Pérez" />

        <FormInput label="Email" name="titularEmail" formik={formik} placeholder="juan@email.com" />

        <FormInput label="Teléfono" name="titularTelefono" formik={formik} required placeholder="3794123456" />
      </div>

      {/* ── SECCIÓN: Color y pintura ── */}
      <div className="h-px bg-border my-1" />
      <div className={TEXTO_SECCION}>Color y pintura</div>

      <Field label="Color predominante">
        <div className="flex gap-1.5 flex-wrap mt-1">
          {COLORES_PRESET.map((c) => (
            <button
              key={c.nombre}
              type="button"
              title={c.nombre}
              onClick={() => handleColorPreset(c.nombre)}
              style={{ background: c.hex, borderColor: c.borde ? "#444441" : c.hex }}
              className={`w-6 h-6 rounded-full border-2 cursor-pointer transition-transform hover:scale-110
                ${formik.values.color === c.nombre && !colorLibre ? "scale-125 !border-yel ring-1 ring-yel/40" : ""}`}
            />
          ))}
        </div>
      </Field>

      <div className="grid grid-cols-2 gap-3">
        {/* Usamos FormInput directo para mantener el feedback de errores visuales de la UI */}
        <FormInput
          label="Color (texto libre)"
          name="color"
          value={colorLibre ? formik.values.color : ""}
          placeholder="ej: Verde metalizado..."
          formik={formik}
          onFocus={() => setColorLibre(true)}
          onChange={(e) => {
            formik.setFieldValue("color", e.target.value);
            setColorLibre(true);
          }}
        />

        <FormInput
          label="Código de pintura"
          name="codigoPintura"
          formik={formik}
          maxLength={12}
          placeholder="ej: LY3D, NH-821M..."
          onChange={(e) => formik.setFieldValue("codigoPintura", e.target.value.toUpperCase())}
        />
      </div>
    </ModalGenerico>
  );
}
