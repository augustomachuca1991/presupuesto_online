import { useRef, useEffect, useState, useCallback } from "react";
import { ICONS } from "@/constants/icons";

const DEBOUNCE_MS = 250;

export function BuscadorGenerico({
  selected,
  onSelect,
  onNuevo,
  onQuitar,
  fetchInitial,
  fetchSearch,
  label,
  placeholder,
  placeholderTrigger,
  icono,
  inputTransform,
  inputClassName = "",
  itemKey,
  sinResultadosText,
  emptyInitialText,
  nuevoTitle,
  hintInicial,
  renderItem,
  renderSeleccionado,
  labelSeleccionado,
}) {
  const [open, setOpen] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [items, setItems] = useState([]);
  const [cargando, setCargando] = useState(false);
  const wrapRef = useRef(null);
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleOpen = useCallback(async () => {
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
    if (!busqueda.trim()) {
      setCargando(true);
      const data = await fetchInitial(5);
      setItems(data);
      setCargando(false);
    }
  }, [busqueda, fetchInitial]);

  const handleBusqueda = useCallback(
    (val) => {
      setBusqueda(val);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(async () => {
        setCargando(true);
        const data = val.trim().length >= 1 ? await fetchSearch(val) : await fetchInitial(5);
        setItems(data);
        setCargando(false);
      }, DEBOUNCE_MS);
    },
    [fetchInitial, fetchSearch]
  );

  const handleSeleccionar = (item) => {
    setOpen(false);
    setBusqueda("");
    onSelect(item);
  };

  // ── Selected card ─────────────────────────────────────────────────────────
  if (selected) {
    return (
      <div className="mb-4">
        {labelSeleccionado && (
          <label className="block text-[11px] font-semibold text-ant3 uppercase tracking-widest mb-1.5">{labelSeleccionado}</label>
        )}
        <div className="flex items-center gap-2.5 px-3 py-2.5 bg-ant rounded-xl border border-border">
          <i className={`${icono} text-[18px] text-yel shrink-0`} />
          {renderSeleccionado(selected, onQuitar)}
        </div>
      </div>
    );
  }

  // ── Dropdown ──────────────────────────────────────────────────────────────
  return (
    <div className="mb-4">
      {label && <label className="block text-[11px] font-semibold text-ant3 uppercase tracking-widest mb-1.5">{label}</label>}

      <div className="flex gap-2">
        <div className="relative flex-1" ref={wrapRef}>
          <button
            type="button"
            onClick={handleOpen}
            aria-expanded={open}
            aria-haspopup="listbox"
            className={`w-full flex items-center gap-2 px-3 h-9 rounded-md border text-left text-[13px] transition-all cursor-pointer
              ${open ? "border-yel ring-1 ring-yel/30 bg-white" : "border-border bg-white hover:border-ant3"}`}
          >
            <i className={`${icono} text-[15px] text-ant3 shrink-0`} />
            <span className="flex-1 text-ant3 select-none">{placeholderTrigger}</span>
            <i className={`${ICONS.CHEVRON_DOWN} text-[13px] text-ant3 transition-transform duration-150 ${open ? "rotate-180" : ""}`} />
          </button>

          {open && (
            <div className="absolute z-40 left-0 right-0 top-[calc(100%+4px)] bg-white border border-border rounded-xl shadow-lg overflow-hidden" role="listbox" aria-label={label}>
              <div className="p-2 border-b border-border">
                <div className="relative">
                  <i className={`${ICONS.SEARCH} absolute left-2.5 top-1/2 -translate-y-1/2 text-[13px] text-ant3 pointer-events-none`} />
                  <input
                    ref={inputRef}
                    type="text"
                    value={busqueda}
                    onChange={(e) => handleBusqueda(inputTransform ? inputTransform(e.target.value) : e.target.value)}
                    onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
                    placeholder={placeholder}
                    className={`w-full pl-8 pr-3 h-8 rounded-md border border-border text-[12px] text-ant bg-white outline-none focus:border-yel focus:ring-1 focus:ring-yel/30 transition ${inputClassName}`}
                    autoComplete="off"
                    role="searchbox"
                  />
                </div>
              </div>

              <ul className="max-h-52 overflow-y-auto divide-y divide-border">
                {cargando ? (
                  <li className="flex items-center justify-center gap-2 py-5 text-[12px] text-ant3">
                    <i className={`${ICONS.LOADER} animate-spin text-[14px]`} /> Buscando...
                  </li>
                ) : items.length === 0 ? (
                  <li className="py-5 text-center text-[12px] text-ant3">
                    {busqueda.trim() ? sinResultadosText : emptyInitialText}
                  </li>
                ) : (
                  items.map((item) => (
                    <li key={itemKey(item)} role="option" aria-selected={false}>
                      <button
                        type="button"
                        onMouseDown={() => handleSeleccionar(item)}
                        className="w-full text-left px-3 py-2.5 flex items-center gap-2.5 hover:bg-antl transition-colors cursor-pointer"
                      >
                        {renderItem(item)}
                      </button>
                    </li>
                  ))
                )}
              </ul>

              <div className="px-3 py-1.5 border-t border-border bg-antl">
                <p className="text-[10px] text-ant3">
                  {busqueda.trim()
                    ? `${items.length} resultado${items.length !== 1 ? "s" : ""}`
                    : hintInicial}
                </p>
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onNuevo}
          className="bg-ant text-antl text-[13px] font-medium px-3.5 h-9 rounded-md flex items-center gap-1.5 hover:bg-ant2 cursor-pointer shrink-0 transition-colors"
          title={nuevoTitle}
        >
          <i className={`${ICONS.PLUS} text-[14px]`} />
          <span className="hidden sm:inline">Nuevo</span>
        </button>
      </div>
    </div>
  );
}
