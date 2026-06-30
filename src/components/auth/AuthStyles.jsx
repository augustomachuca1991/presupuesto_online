export const S = {
  input: (hasError) =>
    `w-full border rounded-md pl-8 pr-3 py-1.5 text-[13px] bg-ant2 text-antl outline-none transition-colors ${
      hasError ? "border-red-400 focus:border-red-400" : "border-border focus:border-yel"
    }`,
  label: "block text-[11px] font-medium text-antm uppercase tracking-wider mb-1.5",
  inputIcon: "absolute left-2.5 top-1/2 -translate-y-1/2 text-ant3",
  fieldError: "text-red-400 text-[11px] mt-1 flex items-center gap-1",
  btnPrimary:
    "w-full bg-yel hover:bg-yelm disabled:opacity-60 disabled:cursor-not-allowed text-yeld text-[13px] font-medium rounded-md px-4 py-2 transition-colors flex items-center justify-center gap-2",
  btnGhost: "flex items-center gap-1 text-[11px] text-antm hover:text-antl transition-colors",
  sectionTitle: "text-antl font-semibold text-[15px] mb-1",
  sectionSub: "text-ant3 text-[12px] mb-5",
};

export const BG_TEXTURE = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")"`;

