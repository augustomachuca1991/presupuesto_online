// src/pages/Login.jsx
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import logoVM from "@/assets/logo-text.svg";
import { LoginForm } from "@/pages/login/components/LoginForm";
import { RecoveryForm } from "@/pages/login/components/RecoveryForm";
import { InputField } from "@/pages/login/components/InputField";
import { S } from "@/pages/login/components/Styles";

const { VITE_APP_DESCRIPTION } = import.meta.env;

// ─── Esquemas de validación ───────────────────────────────────────────────
/* const emailSchema = Yup.string().email("Email inválido").required("Requerido");

const loginSchema = Yup.object({
  email: emailSchema,
  password: Yup.string().min(6, "Mínimo 6 caracteres").required("Requerido"),
});

const recoverySchema = Yup.object({ email: emailSchema });
 */

// ─── Página principal ─────────────────────────────────────────────────────
export default function Login() {
  const [recoveryMode, setRecoveryMode] = useState(false);

  return (
    <div className="min-h-screen bg-[#f7f6f1] flex items-center justify-center px-4">
      {/* Textura de fondo */}
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
            <img src={logoVM} alt="VM Chapa & Pintura" />
          </div>
          <p className="text-[#5f5e5a] text-[13px] mt-0.5">{VITE_APP_DESCRIPTION}</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl border border-[#e2e0d8] shadow-sm overflow-hidden">
          <div className="h-1 bg-[#ef9f27]" />
          <div className="px-6 py-6">{recoveryMode ? <RecoveryForm onBack={() => setRecoveryMode(false)} /> : <LoginForm onRecovery={() => setRecoveryMode(true)} />}</div>
        </div>

        <p className="text-center text-[11px] text-[#5f5e5a] mt-5">Sistema privado · Solo personal autorizado</p>
      </div>
    </div>
  );
}
