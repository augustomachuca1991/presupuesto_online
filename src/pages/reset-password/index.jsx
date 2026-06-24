// src/pages/ResetPassword.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { supabase } from "@/lib/supabase";
import { ICONS } from "@/constants/icons";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { InputField } from "@/components/auth/InputField";
import { S } from "@/components/auth/AuthStyles";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || (event === "SIGNED_IN" && session)) {
        setSessionReady(true);
      }
    });

    const params = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");

    if (accessToken && params.get("type") === "recovery") {
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
      setLoading(false);
      if (error) {
        setError(error.message);
      } else {
        setDone(true);
        setTimeout(() => navigate("/login"), 3000);
      }
    },
  });

  return (
    <AuthLayout>
      {done ? (
        <div className="text-center py-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-bg border border-border mb-4">
            <i className={`${ICONS.CIRCLE_CHECK} text-yel text-2xl`} />
          </div>
          <h2 className={S.sectionTitle}>¡Contraseña actualizada!</h2>
          <p className="text-ant3 text-[12px]">Redirigiendo al login en unos segundos...</p>
        </div>
      ) : !sessionReady ? (
        <div className="text-center py-6">
          <i className={`${ICONS.LOADER} animate-spin text-yel text-2xl mb-3 block`} />
          <p className="text-ant3 text-[13px]">Verificando enlace...</p>
        </div>
      ) : (
        <>
          <h2 className={S.sectionTitle}>Nueva contraseña</h2>
          <p className={S.sectionSub}>Elegí una contraseña segura para tu cuenta</p>

          <form onSubmit={formik.handleSubmit} noValidate className="space-y-4">
            <InputField
              id="password"
              label="Nueva contraseña"
              type="password"
              placeholder="Mínimo 8 caracteres"
              field={formik.getFieldProps("password")}
              meta={formik.getFieldMeta("password")}
              icon={ICONS.LOCK}
            />
            <InputField
              id="confirm"
              label="Confirmá la contraseña"
              type="password"
              placeholder="Repetí la contraseña"
              field={formik.getFieldProps("confirm")}
              meta={formik.getFieldMeta("confirm")}
              icon={ICONS.LOCK_CHECK}
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
                  <i className={`${ICONS.LOADER} animate-spin text-[14px]`} /> Guardando...
                </>
              ) : (
                <>
                  Guardar contraseña <i className={`${ICONS.ARROW_RIGHT} text-[14px]`} />
                </>
              )}
            </button>
          </form>
        </>
      )}
    </AuthLayout>
  );
}
