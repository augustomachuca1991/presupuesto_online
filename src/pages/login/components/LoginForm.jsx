import { useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { InputField } from "@/components/auth/InputField";
import { S } from "@/components/auth/AuthStyles";
import { ICONS } from "@/constants/icons";

// ─── Estilos centralizados ────────────────────────────────────────────────

const loginSchema = Yup.object({
  email: Yup.string().email("Email inválido").required("Requerido"),
  password: Yup.string().min(6, "Mínimo 6 caracteres").required("Requerido"),
});

export function LoginForm({ onRecovery }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const cooldownRef = useRef(false);
  const { signIn } = useAuth();
  const goTo = useNavigate();

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      if (cooldownRef.current) return;
      cooldownRef.current = true;
      setLoading(true);
      setError("");
      const { error } = await signIn(values.email, values.password);
      if (error) {
        const msg =
          error.message?.toLowerCase().includes("invalid login credentials")
            ? "Email o contraseña incorrectos."
            : "Error al iniciar sesión. Intentalo de nuevo.";
        setError(msg);
        setLoading(false);
        setTimeout(() => { cooldownRef.current = false; }, 1500);
      }
    },
  });

  return (
    <>
      <h2 className={S.sectionTitle}>Iniciar sesión</h2>
      <p className={S.sectionSub}>Ingresá tus credenciales para continuar</p>

      <form onSubmit={formik.handleSubmit} noValidate className="space-y-4">
        <InputField id="email" label="Email" type="email" placeholder="tucorreo@ejemplo.com" field={formik.getFieldProps("email")} meta={formik.getFieldMeta("email")} icon={ICONS.MAIL} />
        <InputField
          id="password"
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          field={formik.getFieldProps("password")}
          meta={formik.getFieldMeta("password")}
          icon={ICONS.LOCK}
          right={
            <button type="button" onClick={onRecovery} className="text-[11px] text-[#5f5e5a] hover:text-[#ef9f27] transition-colors">
              ¿Olvidaste tu contraseña?
            </button>
          }
        />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md px-3 py-2 flex items-center gap-2">
            <i className={`${ICONS.ALERT_TRIANGLE} text-red-500 text-[14px] shrink-0`} />
            <p className="text-red-600 text-[12px]">{error}</p>
          </div>
        )}

        <button type="submit" disabled={loading} className={`${S.btnPrimary} mt-1`}>
          {loading ? (
            <>
              <i className={`${ICONS.LOADER} animate-spin text-[14px]`} /> Ingresando...
            </>
          ) : (
            <>
              Ingresar <i className={`${ICONS.ARROW_RIGHT} text-[14px]`} />
            </>
          )}
        </button>
      </form>
    </>
  );
}
