import logoVM from "@/assets/bitmap-vm.svg";
import { BG_TEXTURE } from "@/components/auth/AuthStyles";

const { VITE_APP_DESCRIPTION } = import.meta.env;

export function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      {/* Textura de fondo */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.04]" style={{ backgroundImage: BG_TEXTURE }} />

      <div className="w-full max-w-sm relative">
        {/* Brand */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center gap-3 mb-3">
            <div className="w-20 h-20 rounded flex items-center justify-center shrink-0 overflow-hidden">
              <img src={logoVM} alt="VM" className="w-full h-full object-contain" />
            </div>
            <div className="text-left">
              <div className="text-[15px] font-semibold text-[#ef9f27] leading-tight">Victor Machuca</div>
              <div className="text-[11px] text-antm tracking-wider">CHAPA Y PINTURA</div>
            </div>
          </div>
          <p className="text-ant3 text-[13px]">{VITE_APP_DESCRIPTION}</p>
        </div>

        {/* Card */}
        <div className="bg-ant2 rounded border border-border shadow-sm overflow-hidden">
          <div className="h-1 bg-yel" />
          <div className="px-6 py-6">{children}</div>
        </div>

        <p className="text-center text-[11px] text-ant3 mt-5">Sistema privado · Solo personal autorizado</p>
      </div>
    </div>
  );
}
