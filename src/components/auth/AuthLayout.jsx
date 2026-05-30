// src/pages/auth/AuthLayout.jsx
// Layout compartido entre Login y ResetPassword
import logoVM from "@/assets/logo-text.svg";
import { BG_TEXTURE } from "@/components/auth/AuthStyles";

const { VITE_APP_DESCRIPTION } = import.meta.env;

export function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f7f6f1] flex items-center justify-center px-4">
      {/* Textura de fondo */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: BG_TEXTURE }} />

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
          <div className="px-6 py-6">{children}</div>
        </div>

        <p className="text-center text-[11px] text-[#5f5e5a] mt-5">Sistema privado · Solo personal autorizado</p>
      </div>
    </div>
  );
}
