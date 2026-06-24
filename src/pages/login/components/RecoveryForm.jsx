import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ICONS } from "@/constants/icons";
import { InputField } from "@/components/auth/InputField";
import { S } from "@/components/auth/AuthStyles";
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
        <i className={`${ICONS.ARROW_LEFT} text-[12px]`} /> Volver
      </button>
      <h2 className={S.sectionTitle}>Recuperar contraseña</h2>
      <p className={S.sectionSub}>Ingresá tu email y te enviamos un link para restablecerla.</p>
      <form onSubmit={formik.handleSubmit} noValidate className="space-y-4">
        <InputField id="recovery-email" label="Email" type="email" placeholder="tucorreo@ejemplo.com" field={formik.getFieldProps("email")} meta={formik.getFieldMeta("email")} icon={ICONS.MAIL} />
        <button type="submit" disabled={loading} className={S.btnPrimary}>
          {loading ? (
            <>
              <i className={`${ICONS.LOADER} animate-spin text-[14px]`} /> Enviando...
            </>
          ) : (
            <>
              <i className={`${ICONS.SEND} text-[14px]`} /> Enviar link
            </>
          )}
        </button>
      </form>
    </>
  );
}
