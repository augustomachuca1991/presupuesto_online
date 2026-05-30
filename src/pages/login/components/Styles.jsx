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
