import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { InputField } from "@/pages/login/components/InputField";
import { S } from "@/pages/login/components/Styles";
import { RecoverySent } from "@/pages/login/components/RecoverySent";
import { supabase } from "@/lib/supabase";

const recoverySchema = Yup.object({ email: Yup.string().email("Email inválido").required("Requerido") });

export function RecoveryForm({ onBack }) {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: recoverySchema,
    onSubmit: async ({ email }) => {
      setLoading(true);
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      setLoading(false);
      setSent(true);
    },
  });

  if (sent) return <RecoverySent email={formik.values.email} onBack={onBack} />;

  return (
    <>
      <button onClick={onBack} className={`${S.btnGhost} mb-4`}>
        <i className="ti ti-arrow-left text-[12px]" /> Volver
      </button>
      <h2 className={S.sectionTitle}>Recuperar contraseña</h2>
      <p className={S.sectionSub}>Ingresá tu email y te enviamos un link para restablecerla.</p>
      <form onSubmit={formik.handleSubmit} noValidate className="space-y-4">
        <InputField id="recovery-email" label="Email" type="email" placeholder="tucorreo@ejemplo.com" field={formik.getFieldProps("email")} meta={formik.getFieldMeta("email")} icon="ti-mail" />
        <button type="submit" disabled={loading} className={S.btnPrimary}>
          {loading ? (
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
  );
}
