// src/components/clientes/ModalPropietario.jsx
import { useFormik } from "formik";
import * as Yup from "yup";
import { ModalGenerico } from "@/components/ui/ModalGenerico";
import { FormInput } from "@/components/ui/FormComponents";
import { ICONS } from "@/constants/icons";

const validationSchema = Yup.object({
  nombre: Yup.string().required("El nombre es requerido").min(2, "Mínimo 2 caracteres"),
  apellido: Yup.string().required("El apellido es requerido").min(2, "Mínimo 2 caracteres"),
  email: Yup.string().required("El correo electrónico es requerido").email("Formato de correo inválido"),
  telefono: Yup.string()
    .required("El teléfono es requerido")
    .matches(/^[0-9]+$/, "Solo se permiten números")
    .min(7, "Mínimo 7 dígitos")
    .max(15, "Máximo 15 dígitos"),
});

export function ModalPropietario({ propietarioInicial = null, onClose, onSave }) {
  const isEditMode = !!propietarioInicial;

  const formik = useFormik({
    initialValues: {
      nombre: propietarioInicial?.nombre || "",
      apellido: propietarioInicial?.apellido || "",
      email: propietarioInicial?.email || "",
      telefono: propietarioInicial?.telefono || "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const pudoGuardar = await onSave({
          id: propietarioInicial?.id || undefined,
          nombre: values.nombre.trim(),
          apellido: values.apellido.trim(),
          email: values.email.toLowerCase().trim(),
          telefono: values.telefono.trim(),
        });

        // Si la función onSave de tu página confirma el éxito devolviendo true, cierra
        if (pudoGuardar) onClose();
      } catch {
        formik.setFieldError("nombre", "Ocurrió un error al procesar la solicitud.");
      }
    },
  });

  return (
    <ModalGenerico
      titulo={isEditMode ? "Editar Propietario" : "Nuevo Propietario"}
      subtitulo={isEditMode ? "Modificá los datos del contacto" : "Registrá un nuevo cliente en el sistema"}
      iconClass={ICONS.USER}
      guardando={formik.isSubmitting}
      onClose={onClose}
      onSave={formik.handleSubmit}
    >
      <div className="text-[10px] font-medium text-ant3 uppercase tracking-widest my-1.5 px-0.5">Datos Personales</div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FormInput label="Nombre" name="nombre" formik={formik} required placeholder="Juan" />

        <FormInput label="Apellido" name="apellido" formik={formik} required placeholder="Pérez" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FormInput label="Correo Electrónico" name="email" type="email" formik={formik} required placeholder="juan@email.com" />

        <FormInput label="Teléfono" name="telefono" formik={formik} required placeholder="3794123456" maxLength={15} />
      </div>
    </ModalGenerico>
  );
}
