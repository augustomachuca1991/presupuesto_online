import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import logoVM from "@/assets/logo-text.svg";

const { VITE_APP_NAME, VITE_APP_DESCRIPTION } = import.meta.env;

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recoveryMode, setRecoveryMode] = useState(false);
  const [recoverySent, setRecoverySent] = useState(false);
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const { signIn } = useAuth();
  const goTo = useNavigate();

  // — Formulario login —
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Email inválido").required("Requerido"),
      password: Yup.string().min(6, "Mínimo 6 caracteres").required("Requerido"),
    }),
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

  // — Formulario recovery —
  const recoveryFormik = useFormik({
    initialValues: { email: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Email inválido").required("Requerido"),
    }),
    onSubmit: async ({ email }) => {
      setRecoveryLoading(true);
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      setRecoverySent(true);
      setRecoveryLoading(false);
    },
  });

  return (
    <div className="min-h-screen bg-[#f7f6f1] flex items-center justify-center px-4">
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232c2c2a' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="w-full max-w-sm relative">
        {/* Brand */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center mb-4">
            <img src={logoVM} alt="Logo" />
          </div>
          <p className="text-[#5f5e5a] text-[13px] mt-0.5">{VITE_APP_DESCRIPTION}</p>
        </div>

        <div className="bg-white rounded-xl border border-[#e2e0d8] shadow-sm overflow-hidden">
          <div className="h-1 bg-[#ef9f27]" />

          <div className="px-6 py-6">
            {/* ——— RECOVERY ENVIADO ——— */}
            {recoverySent ? (
              <div className="text-center py-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#f7f6f1] border border-[#e2e0d8] mb-4">
                  <i className="ti ti-mail-check text-[#ef9f27] text-2xl" />
                </div>
                <h2 className="text-[#2c2c2a] font-semibold text-[15px] mb-1">Revisá tu email</h2>
                <p className="text-[#5f5e5a] text-[12px] mb-4">
                  Te enviamos un link para restablecer tu contraseña a <span className="font-medium text-[#2c2c2a]">{recoveryFormik.values.email}</span>.
                </p>
                <button
                  onClick={() => {
                    setRecoveryMode(false);
                    setRecoverySent(false);
                  }}
                  className="text-[12px] text-[#5f5e5a] hover:text-[#2c2c2a] transition-colors flex items-center gap-1 mx-auto"
                >
                  <i className="ti ti-arrow-left text-[12px]" />
                  Volver al login
                </button>
              </div>
            ) : recoveryMode ? (
              /* ——— FORMULARIO RECOVERY ——— */
              <>
                <button onClick={() => setRecoveryMode(false)} className="flex items-center gap-1 text-[11px] text-[#5f5e5a] hover:text-[#2c2c2a] transition-colors mb-4">
                  <i className="ti ti-arrow-left text-[12px]" />
                  Volver
                </button>
                <h2 className="text-[#2c2c2a] font-semibold text-[15px] mb-1">Recuperar contraseña</h2>
                <p className="text-[#5f5e5a] text-[12px] mb-5">Ingresá tu email y te enviamos un link para restablecerla.</p>
                <form onSubmit={recoveryFormik.handleSubmit} noValidate className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-medium text-[#5f5e5a] uppercase tracking-wider mb-1.5">Email</label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#5f5e5a]">
                        <i className="ti ti-mail text-[14px]" />
                      </span>
                      <input
                        id="recovery-email"
                        type="email"
                        placeholder="tucorreo@ejemplo.com"
                        {...recoveryFormik.getFieldProps("email")}
                        className={`w-full border rounded-md pl-8 pr-3 py-1.5 text-[13px] bg-white text-[#2c2c2a] outline-none transition-colors
                          ${recoveryFormik.touched.email && recoveryFormik.errors.email ? "border-red-400 focus:border-red-400" : "border-[#e2e0d8] focus:border-[#2c2c2a]"}`}
                      />
                    </div>
                    {recoveryFormik.touched.email && recoveryFormik.errors.email && (
                      <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                        <i className="ti ti-alert-circle text-[12px]" />
                        {recoveryFormik.errors.email}
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={recoveryLoading}
                    className="w-full bg-[#2c2c2a] hover:bg-[#444441] disabled:opacity-60 disabled:cursor-not-allowed
                      text-white text-[13px] font-medium rounded-md px-4 py-2 transition-colors
                      flex items-center justify-center gap-2"
                  >
                    {recoveryLoading ? (
                      <>
                        <i className="ti ti-loader-2 animate-spin text-[14px]" /> Enviando...
                      </>
                    ) : (
                      <>
                        <i className="ti ti-send text-[14px]" /> Enviar link
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              /* ——— FORMULARIO LOGIN ——— */
              <>
                <h2 className="text-[#2c2c2a] font-semibold text-[15px] mb-1">Iniciar sesión</h2>
                <p className="text-[#5f5e5a] text-[12px] mb-5">Ingresá tus credenciales para continuar</p>

                <form onSubmit={formik.handleSubmit} noValidate className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-medium text-[#5f5e5a] uppercase tracking-wider mb-1.5">Email</label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#5f5e5a]">
                        <i className="ti ti-mail text-[14px]" />
                      </span>
                      <input
                        id="email"
                        type="email"
                        placeholder="tucorreo@ejemplo.com"
                        {...formik.getFieldProps("email")}
                        className={`w-full border rounded-md pl-8 pr-3 py-1.5 text-[13px] bg-white text-[#2c2c2a] outline-none transition-colors
                          ${formik.touched.email && formik.errors.email ? "border-red-400 focus:border-red-400" : "border-[#e2e0d8] focus:border-[#2c2c2a]"}`}
                      />
                    </div>
                    {formik.touched.email && formik.errors.email && (
                      <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                        <i className="ti ti-alert-circle text-[12px]" />
                        {formik.errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[11px] font-medium text-[#5f5e5a] uppercase tracking-wider">Contraseña</label>
                      <button type="button" onClick={() => setRecoveryMode(true)} className="text-[11px] text-[#5f5e5a] hover:text-[#ef9f27] transition-colors">
                        ¿Olvidaste tu contraseña?
                      </button>
                    </div>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#5f5e5a]">
                        <i className="ti ti-lock text-[14px]" />
                      </span>
                      <input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        {...formik.getFieldProps("password")}
                        className={`w-full border rounded-md pl-8 pr-3 py-1.5 text-[13px] bg-white text-[#2c2c2a] outline-none transition-colors
                          ${formik.touched.password && formik.errors.password ? "border-red-400 focus:border-red-400" : "border-[#e2e0d8] focus:border-[#2c2c2a]"}`}
                      />
                    </div>
                    {formik.touched.password && formik.errors.password && (
                      <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                        <i className="ti ti-alert-circle text-[12px]" />
                        {formik.errors.password}
                      </p>
                    )}
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-md px-3 py-2 flex items-center gap-2">
                      <i className="ti ti-alert-triangle text-red-500 text-[14px] shrink-0" />
                      <p className="text-red-600 text-[12px]">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-1 bg-[#2c2c2a] hover:bg-[#444441] disabled:opacity-60 disabled:cursor-not-allowed
                      text-white text-[13px] font-medium rounded-md px-4 py-2 transition-colors
                      flex items-center justify-center gap-2"
                  >
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
            )}
          </div>
        </div>

        <p className="text-center text-[11px] text-[#5f5e5a] mt-5">Sistema privado · Solo personal autorizado</p>
      </div>
    </div>
  );
}
