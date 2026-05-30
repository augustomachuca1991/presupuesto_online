import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { supabase } from "@/lib/supabase";
import logoVM from "@/assets/logo-text.svg";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  const { VITE_APP_DESCRIPTION } = import.meta.env;

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || (event === "SIGNED_IN" && session)) {
        setSessionReady(true);
      }
    });
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const type = params.get("type");

    if (accessToken && type === "recovery") {
      supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken ?? "" }).then(({ error }) => {
        if (!error) setSessionReady(true);
      });
    }

    return () => subscription.unsubscribe();
  }, []);

  const formik = useFormik({
    initialValues: { password: "", confirm: "" },
    validationSchema: Yup.object({
      password: Yup.string().min(8, "Mínimo 8 caracteres").required("Requerido"),
      confirm: Yup.string()
        .oneOf([Yup.ref("password")], "Las contraseñas no coinciden")
        .required("Requerido"),
    }),
    onSubmit: async ({ password }) => {
      setLoading(true);
      setError("");
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setError(error.message);
        setLoading(false); // ← estaba fuera del if, se ejecutaba siempre
      } else {
        setDone(true);
        setTimeout(() => navigate("/login"), 3000);
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-[#f7f6f1] flex items-center justify-center px-4">
      {/* Background texture */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232c2c2a' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="w-full max-w-sm relative">
        {/* Brand */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center  rounded-xl mb-4 ">
            <img src={logoVM} alt="Logo" />
          </div>
          <p className="text-[#5f5e5a] text-[13px] mt-0.5">{VITE_APP_DESCRIPTION}</p>
        </div>

        <div className="bg-white rounded-xl border border-[#e2e0d8] shadow-sm overflow-hidden">
          <div className="h-1 bg-[#ef9f27]" />

          <div className="px-6 py-6">
            {done ? (
              <div className="text-center py-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#f7f6f1] border border-[#e2e0d8] mb-4">
                  <i className="ti ti-circle-check text-[#ef9f27] text-2xl" />
                </div>
                <h2 className="text-[#2c2c2a] font-semibold text-[15px] mb-1">¡Contraseña actualizada!</h2>
                <p className="text-[#5f5e5a] text-[12px]">Redirigiendo al login en unos segundos...</p>
              </div>
            ) : !sessionReady ? (
              /* ⏳ Esperando que Supabase procese el token del hash */
              <div className="text-center py-6">
                <i className="ti ti-loader-2 animate-spin text-[#ef9f27] text-2xl mb-3 block" />
                <p className="text-[#5f5e5a] text-[13px]">Verificando enlace...</p>
              </div>
            ) : (
              /* 📝 Formulario */
              <>
                <h2 className="text-[#2c2c2a] font-semibold text-[15px] mb-1">Nueva contraseña</h2>
                <p className="text-[#5f5e5a] text-[12px] mb-5">Elegí una contraseña segura para tu cuenta</p>

                <form onSubmit={formik.handleSubmit} noValidate className="space-y-4">
                  {/* Nueva contraseña */}
                  <div>
                    <label className="block text-[11px] font-medium text-[#5f5e5a] uppercase tracking-wider mb-1.5">Nueva contraseña</label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#5f5e5a]">
                        <i className="ti ti-lock text-[14px]" />
                      </span>
                      <input
                        id="password"
                        type="password"
                        placeholder="Mínimo 8 caracteres"
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

                  {/* Confirmar contraseña */}
                  <div>
                    <label className="block text-[11px] font-medium text-[#5f5e5a] uppercase tracking-wider mb-1.5">Confirmá la contraseña</label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#5f5e5a]">
                        <i className="ti ti-lock-check text-[14px]" />
                      </span>
                      <input
                        id="confirm"
                        type="password"
                        placeholder="Repetí la contraseña"
                        {...formik.getFieldProps("confirm")}
                        className={`w-full border rounded-md pl-8 pr-3 py-1.5 text-[13px] bg-white text-[#2c2c2a] outline-none transition-colors
                          ${formik.touched.confirm && formik.errors.confirm ? "border-red-400 focus:border-red-400" : "border-[#e2e0d8] focus:border-[#2c2c2a]"}`}
                      />
                    </div>
                    {formik.touched.confirm && formik.errors.confirm && (
                      <p className="text-red-500 text-[11px] mt-1 flex items-center gap-1">
                        <i className="ti ti-alert-circle text-[12px]" />
                        {formik.errors.confirm}
                      </p>
                    )}
                  </div>

                  {/* Error de API */}
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
                        <i className="ti ti-loader-2 animate-spin text-[14px]" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        Guardar contraseña
                        <i className="ti ti-arrow-right text-[14px]" />
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
