import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { InputField } from "@/components/auth/InputField";
import { S } from "@/components/auth/AuthStyles";

// ─── Estilos centralizados ────────────────────────────────────────────────

const loginSchema = Yup.object({
  email: Yup.string().email("Email inválido").required("Requerido"),
  password: Yup.string().min(6, "Mínimo 6 caracteres").required("Requerido"),
});

export function LoginForm({ onRecovery }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signIn } = useAuth();
  const goTo = useNavigate();

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError("");
      const { error } = await signIn(values.email, values.password);
      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        goTo("/presupuestos");
      }
    },
  });

  return (
    <>
      <h2 className={S.sectionTitle}>Iniciar sesión</h2>
      <p className={S.sectionSub}>Ingresá tus credenciales para continuar</p>

      <form onSubmit={formik.handleSubmit} noValidate className="space-y-4">
        <InputField id="email" label="Email" type="email" placeholder="tucorreo@ejemplo.com" field={formik.getFieldProps("email")} meta={formik.getFieldMeta("email")} icon="ti-mail" />
        <InputField
          id="password"
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          field={formik.getFieldProps("password")}
          meta={formik.getFieldMeta("password")}
          icon="ti-lock"
          right={
            <button type="button" onClick={onRecovery} className="text-[11px] text-[#5f5e5a] hover:text-[#ef9f27] transition-colors">
              ¿Olvidaste tu contraseña?
            </button>
          }
        />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md px-3 py-2 flex items-center gap-2">
            <i className="ti ti-alert-triangle text-red-500 text-[14px] shrink-0" />
            <p className="text-red-600 text-[12px]">{error}</p>
          </div>
        )}

        <button type="submit" disabled={loading} className={`${S.btnPrimary} mt-1`}>
          {loading ? (
            <>
              <i className="ti ti-loader-2 animate-spin text-[14px]" /> Ingresando...
            </>
          ) : (
            <>
              Ingresar <i className="ti ti-arrow-right text-[14px]" />
            </>
          )}
        </button>
      </form>
    </>
  );
}
