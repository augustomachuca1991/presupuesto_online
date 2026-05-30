// src/pages/auth/authStyles.js
// Estilos y componentes compartidos entre Login y ResetPassword

// ─── Estilos centralizados ────────────────────────────────────────────────
export const S = {
  input: (hasError) =>
    `w-full border rounded-md pl-8 pr-3 py-1.5 text-[13px] bg-white text-[#2c2c2a] outline-none transition-colors ${
      hasError ? "border-red-400 focus:border-red-400" : "border-[#e2e0d8] focus:border-[#2c2c2a]"
    }`,
  label: "block text-[11px] font-medium text-[#5f5e5a] uppercase tracking-wider mb-1.5",
  inputIcon: "absolute left-2.5 top-1/2 -translate-y-1/2 text-[#5f5e5a]",
  fieldError: "text-red-500 text-[11px] mt-1 flex items-center gap-1",
  btnPrimary:
    "w-full bg-[#2c2c2a] hover:bg-[#444441] disabled:opacity-60 disabled:cursor-not-allowed text-white text-[13px] font-medium rounded-md px-4 py-2 transition-colors flex items-center justify-center gap-2",
  btnGhost: "flex items-center gap-1 text-[11px] text-[#5f5e5a] hover:text-[#2c2c2a] transition-colors",
  sectionTitle: "text-[#2c2c2a] font-semibold text-[15px] mb-1",
  sectionSub: "text-[#5f5e5a] text-[12px] mb-5",
};

// ─── Textura SVG de fondo ─────────────────────────────────────────────────
export const BG_TEXTURE = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232c2c2a' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`;
