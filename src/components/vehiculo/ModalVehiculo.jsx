// src/components/vehiculo/ModalVehiculo.jsx
import { useState, useEffect } from "react";
import { ICONS } from "@/constants/icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import { supabase } from "@/lib/supabase";
import { ModalGenerico } from "@/components/ui/ModalGenerico";
import { FormInput, FormSelect } from "@/components/ui/FormComponents";
import Field from "@/components/ui/Field";

const ANIO_MIN = 1970;
const ANIO_MAX = new Date().getFullYear() + 1;

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
  marca_id: Yup.string().required("Seleccioná una marca"),
  modelo_id: Yup.string().required("Seleccioná un modelo"),
  color: Yup.string(),
  codigoPintura: Yup.string(),
});

export function ModalVehiculo({ vehiculo, dominioInicial = "", onClose, onSave }) {
  const esEdicion = !!vehiculo;
  const [catalogo, setCatalogo] = useState({ marcas: [], modelos: [], isLoading: false, isError: false });
  const [colorLibre, setColorLibre] = useState(() => {
    if (vehiculo?.color) return !COLORES_PRESET.some((c) => c.nombre === vehiculo.color);
    return false;
  });

  useEffect(() => {
    let active = true;
    setCatalogo((prev) => ({ ...prev, isLoading: true }));
    Promise.all([
      supabase.from("marcas").select("id, nombre").order("nombre"),
      supabase.from("modelos").select("id, nombre, marca_id").order("nombre"),
    ]).then(([marcasRes, modelosRes]) => {
      if (active) {
        setCatalogo({
          marcas: marcasRes.data ?? [],
          modelos: modelosRes.data ?? [],
          isLoading: false,
          isError: !!(marcasRes.error || modelosRes.error),
        });
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const initVals = esEdicion
    ? {
        dominio: vehiculo.dominio ?? "",
        marca_id: String(vehiculo.marca_id ?? vehiculo.marca?.id ?? ""),
        modelo_id: String(vehiculo.modelo_id ?? vehiculo.modelo?.id ?? ""),
        anio: vehiculo.anio ?? "",
        color: vehiculo.color ?? "",
        codigoPintura: vehiculo.codigo_pintura ?? vehiculo.codigoPintura ?? "",
      }
    : {
        dominio: dominioInicial ?? "",
        marca_id: "",
        modelo_id: "",
        anio: "",
        color: "Blanco",
        codigoPintura: "",
      };
  const formik = useFormik({
    initialValues: initVals,
    validationSchema,
    onSubmit: async (values) => {
      if (!values.marca_id || !values.modelo_id) {
        if (!values.marca_id) formik.setFieldError("marca_id", "Seleccioná una marca");
        if (!values.modelo_id) formik.setFieldError("modelo_id", "Seleccioná un modelo");
        return;
      }
      try {
        const datos = {
          dominio: values.dominio.toUpperCase().trim(),
          marca_id: values.marca_id,
          modelo_id: values.modelo_id,
          anio: Number(values.anio),
          color: values.color.trim() || "Sin especificar",
          codigoPintura: values.codigoPintura.toUpperCase().trim() || null,
        };
        const result = await onSave(datos);
        const ok = result?.ok ?? result;
        if (ok) onClose();
      } catch (error) {
        console.error("Error al procesar el formulario de vehículo:", error);
        formik.setFieldError("dominio", "Ocurrió un error al procesar la solicitud.");
      }
    },
  });

  const modelosFiltrados = formik.values.marca_id
    ? catalogo.modelos.filter((m) => String(m.marca_id) === formik.values.marca_id)
    : [];

  const guardando = formik.isSubmitting;

  const handleColorPreset = (nombre) => {
    formik.setFieldValue("color", nombre);
    setColorLibre(false);
  };

  return (
    <ModalGenerico
      titulo={esEdicion ? `Editar — ${vehiculo.dominio}` : "Alta de vehículo"}
      subtitulo={esEdicion ? "Modificá los datos del vehículo" : "Completá los datos del vehículo"}
      iconClass={ICONS.CAR}
      guardando={guardando}
      onClose={onClose}
      labelGuardar={esEdicion ? "Guardar cambios" : "Registrar vehículo"}
      onSave={formik.handleSubmit}
    >
      <div className="space-y-3">
        {catalogo.isError && (
          <div className="flex items-center gap-2 text-[12px] text-red-400 bg-red-500/10 border border-red-500/30 rounded-md px-3 py-2">
            <i className={ICONS.ALERT_TRIANGLE} />
            No se pudieron cargar las marcas. Verificá tu conexión e intentá de nuevo.
          </div>
        )}

        <div className={TEXTO_SECCION}>Identificación</div>

        <div className="grid grid-cols-2 gap-3">
          <FormInput
            label="Dominio"
            name="dominio"
            formik={formik}
            required
            maxLength={8}
            placeholder="AB123CD"
            onChange={(e) => formik.setFieldValue("dominio", e.target.value.toUpperCase())}
          />
          <FormInput
            label="Año"
            name="anio"
            type="number"
            formik={formik}
            required
            min={ANIO_MIN}
            max={ANIO_MAX}
            placeholder="2026"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="relative w-full">
            <FormSelect
              label="Marca"
              name="marca_id"
              formik={formik}
              required
              disabled={catalogo.isLoading || catalogo.isError}
              onChange={(e) => {
                formik.setFieldValue("marca_id", e.target.value);
                formik.setFieldValue("modelo_id", "");
              }}
            >
              <option value="">
                {catalogo.isLoading ? "Cargando..." : "Seleccionar..."}
              </option>
              {catalogo.marcas.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nombre}
                </option>
              ))}
            </FormSelect>
            {catalogo.isLoading && (
              <i className={`${ICONS.LOADER} animate-spin absolute right-8 bottom-3 text-ant3 text-[14px] z-10`} />
            )}
          </div>

          <FormSelect
            label="Modelo"
            name="modelo_id"
            formik={formik}
            required
            disabled={!modelosFiltrados.length || catalogo.isLoading}
          >
            <option value="">
              {!formik.values.marca_id
                ? "Elegí la marca primero"
                : modelosFiltrados.length === 0
                  ? "Sin modelos disponibles"
                  : "Seleccionar modelo..."}
            </option>
            {modelosFiltrados.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre}
              </option>
            ))}
          </FormSelect>
        </div>

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
      </div>
    </ModalGenerico>
  );
}
