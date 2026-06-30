// src/pages/MarcasModelosPage.jsx
import { useState, memo, useMemo } from "react";
import { ICONS } from "@/constants/icons";
import { useMarcasModelosCRUD } from "@/hooks/useMarcasModelosCRUD";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
// Agregar al import
import { useToast } from "@/hooks/useToast";
import { Toasts } from "@/components/ui/Toasts";

// ── Inline form ───────────────────────────────────────────────────────────
function InlineForm({ placeholder, onConfirm, onCancel, loading, initialValue = "" }) {
  const [valor, setValor] = useState(initialValue);
  const confirm = () => {
    if (valor.trim()) onConfirm(valor.trim());
  };

  return (
    <div className="flex gap-2 mt-2">
      <input
        autoFocus
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") confirm();
          if (e.key === "Escape") onCancel();
        }}
        placeholder={placeholder}
        className="flex-1 px-3 h-8 rounded-md border border-border bg-ant2 text-[13px] text-antl outline-none focus:border-ant transition"
      />
      <button
        type="button"
        onClick={confirm}
        disabled={loading || !valor.trim()}
        aria-label="Confirmar"
        className="h-8 px-3 rounded-md bg-ant text-antl text-[12px] font-medium hover:bg-ant2 disabled:opacity-50 transition cursor-pointer"
      >
        {loading ? <i className={`${ICONS.LOADER} animate-spin`} /> : <i className={ICONS.CHECK} />}
      </button>
      <button type="button" onClick={onCancel} aria-label="Cerrar" className="h-8 px-3 rounded-md border border-white/20 text-[12px] text-antm hover:text-antl transition cursor-pointer">
        <i className={ICONS.CLOSE} />
      </button>
    </div>
  );
}

// ── Fila de modelo ────────────────────────────────────────────────────────
const FilaModelo = memo(function FilaModelo({ modelo, onEditar, onEliminar, toast }) {
  const [editando, setEditando] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmar, setConfirmar] = useState(false);

  const handleEditar = async (nombre) => {
    setLoading(true);
    const { ok, error } = await onEditar(modelo.id, nombre);
    setLoading(false);
    setEditando(false);
    ok ? toast.success(`Modelo actualizado.`) : toast.error(error ?? "No se pudo editar.");
  };

  const handleEliminar = async () => {
    setLoading(true);
    const { ok, error } = await onEliminar(modelo.id);
    setLoading(false);
    setConfirmar(false);
    ok ? toast.success(`Modelo eliminado.`) : toast.error(error ?? "No se pudo eliminar.");
  };

  return (
    <div className="group">
      {confirmar && (
        <ConfirmDialog
          titulo="¿Eliminar modelo?"
          mensaje={`Se eliminará "${modelo.nombre}" permanentemente.`}
          labelConfirmar="Eliminar modelo"
          danger
          loading={loading}
          onConfirmar={handleEliminar}
          onCancelar={() => setConfirmar(false)}
        />
      )}

      {editando ? (
        <div className="px-3 py-1">
          <InlineForm placeholder="Nombre del modelo" initialValue={modelo.nombre} onConfirm={handleEditar} onCancel={() => setEditando(false)} loading={loading} />
        </div>
      ) : (
          <div className="flex items-center justify-between px-3 py-2 hover:bg-ant rounded-md transition-colors">
          <span className="text-[13px] text-antl">{modelo.nombre}</span>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button type="button" onClick={() => setEditando(true)} aria-label="Editar" className="w-6 h-6 flex items-center justify-center rounded text-antm hover:text-antl hover:bg-ant2 transition cursor-pointer">
              <i className={ICONS.PENCIL} />
            </button>
            <button
              type="button"
              onClick={() => setConfirmar(true)}
              aria-label="Eliminar"
              className="w-6 h-6 flex items-center justify-center rounded text-antm hover:text-red-400 hover:bg-red-900/20 transition cursor-pointer"
            >
              <i className={ICONS.TRASH} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

// ── Card de marca ─────────────────────────────────────────────────────────
const CardMarca = memo(function CardMarca({ marca, modelos, onEditarMarca, onEliminarMarca, onAgregarModelo, onEditarModelo, onEliminarModelo, toast }) {
  const [expandido, setExpandido] = useState(false);
  const [editandoMarca, setEditandoMarca] = useState(false);
  const [agregandoMod, setAgregandoMod] = useState(false);
  const [loadingMarca, setLoadingMarca] = useState(false);
  const [loadingMod, setLoadingMod] = useState(false);
  const [confirmarElim, setConfirmarElim] = useState(false);

  const modelosDeMarca = useMemo(() => modelos.filter((m) => m.marca_id === marca.id), [modelos, marca.id]);

  const handleEditarMarca = async (nombre) => {
    setLoadingMarca(true);
    const { ok, error } = await onEditarMarca(marca.id, nombre);
    setLoadingMarca(false);
    setEditandoMarca(false);
    ok ? toast.success(`Marca actualizada.`) : toast.error(error ?? "No se pudo editar.");
  };

  const handleEliminarMarca = async () => {
    setLoadingMarca(true);
    const { ok, error } = await onEliminarMarca(marca.id);
    setLoadingMarca(false);
    setConfirmarElim(false);
    ok ? toast.success(`Marca eliminada.`) : toast.error(error ?? "No se pudo eliminar.");
  };

  const handleAgregarModelo = async (nombre) => {
    setLoadingMod(true);
    const { ok, error } = await onAgregarModelo(marca.id, nombre);
    setLoadingMod(false);
    setAgregandoMod(false);
    ok ? toast.success(`Modelo "${nombre}" agregado.`) : toast.error(error ?? "No se pudo agregar.");
  };

  return (
    <>
      {confirmarElim && (
        <ConfirmDialog
          titulo="¿Eliminar marca?"
          mensaje={`Se eliminará "${marca.nombre}" y sus ${modelosDeMarca.length} modelo${modelosDeMarca.length !== 1 ? "s" : ""} permanentemente.`}
          labelConfirmar="Eliminar marca"
          danger
          loading={loadingMarca}
          onConfirmar={handleEliminarMarca}
          onCancelar={() => setConfirmarElim(false)}
        />
      )}

      <div className="bg-ant2 border border-border rounded-xl overflow-hidden shadow-sm hover:border-yel/40 transition-colors">
        {/* Header marca */}
        <div className="flex items-center gap-3 px-4 py-3">
          {editandoMarca ? (
            <div className="flex-1">
              <InlineForm placeholder="Nombre de la marca" initialValue={marca.nombre} onConfirm={handleEditarMarca} onCancel={() => setEditandoMarca(false)} loading={loadingMarca} />
            </div>
          ) : (
            <>
              <button type="button" onClick={() => setExpandido((p) => !p)} className="flex items-center gap-3 flex-1 min-w-0 text-left cursor-pointer group/btn">
                <div className="w-9 h-9 rounded-lg  flex items-center justify-center shrink-0 text-antl group-hover/btn:border-yel/50 group-hover/btn:bg-yel/5 transition-colors">
                  <BrandLogo marca={marca.nombre} className="w-8 h-8" />
                </div>
                <div className="flex-1 min-w-0 flex items-center gap-2">
                  <span className="text-[14px] font-semibold text-antl truncate">{marca.nombre}</span>
                  <span className="hidden md:inline-flex text-[11px] text-ant3 shrink-0">
                    {modelosDeMarca.length} modelo{modelosDeMarca.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <i className={`${ICONS.CHEVRON_DOWN} text-[13px] text-antm transition-transform shrink-0 ${expandido ? "rotate-180" : ""}`} />
              </button>

              <div className="flex gap-1 shrink-0 ml-1">
                <button
                  type="button"
                  onClick={() => {
                    setExpandido(true);
                    setAgregandoMod(true);
                  }}
                  className="h-7 px-2.5 rounded-md bg-yel text-yeld text-[11px] font-medium flex items-center gap-1 hover:bg-yelm transition cursor-pointer"
                >
                  <i className={ICONS.PLUS} /> Modelo
                </button>
                <button
                  type="button"
                  onClick={() => setEditandoMarca(true)}
                  aria-label="Editar"
                  className="w-7 h-7 flex items-center justify-center rounded-md text-antm hover:text-antl hover:bg-ant2 transition cursor-pointer"
                >
                  <i className={ICONS.PENCIL} />
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmarElim(true)}
                  aria-label="Eliminar"
                  className="w-7 h-7 flex items-center justify-center rounded-md text-antm hover:text-red-400 hover:bg-red-900/20 transition cursor-pointer"
                >
                  <i className={ICONS.TRASH} />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Lista modelos */}
        {expandido && (
          <div className="border-t border-border px-2 py-2">
            {modelosDeMarca.length === 0 && !agregandoMod ? (
              <p className="text-[12px] text-ant3 px-3 py-2 text-center">
                Sin modelos —{" "}
                <button onClick={() => setAgregandoMod(true)} className="text-antl underline cursor-pointer">
                  agregá el primero
                </button>
              </p>
            ) : (
              <div className="space-y-0.5">
                {modelosDeMarca.map((mo) => (
                  <FilaModelo key={mo.id} modelo={mo} onEditar={onEditarModelo} onEliminar={onEliminarModelo} toast={toast} />
                ))}
              </div>
            )}

            {agregandoMod && (
              <div className="px-1 mt-1">
                <InlineForm placeholder="Nombre del modelo (ej: Corolla)" onConfirm={handleAgregarModelo} onCancel={() => setAgregandoMod(false)} loading={loadingMod} />
              </div>
            )}

            {!agregandoMod && (
              <button
                type="button"
                onClick={() => setAgregandoMod(true)}
                className="w-full mt-1 flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] text-antm hover:text-antl hover:bg-ant transition cursor-pointer"
              >
                <i className={ICONS.PLUS} /> Agregar modelo
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
});

// ── Página ────────────────────────────────────────────────────────────────
export default function MarcasPage() {
  const { toast, toasts } = useToast();
  const { marcas, modelos, isLoading, isError, agregarMarca, editarMarca, eliminarMarca, agregarModelo, editarModelo, eliminarModelo } = useMarcasModelosCRUD();

  const [agregandoMarca, setAgregandoMarca] = useState(false);
  const [loadingMarca, setLoadingMarca] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const handleAgregarMarca = async (nombre) => {
    setLoadingMarca(true);
    const { ok, error } = await agregarMarca(nombre);
    setLoadingMarca(false);
    setAgregandoMarca(false);
    ok ? toast.success(`Marca "${nombre}" agregada.`) : toast.error(error ?? "No se pudo agregar.");
  };

  const marcasFiltradas = useMemo(() => busqueda.trim() ? marcas.filter((m) => m.nombre.toLowerCase().includes(busqueda.toLowerCase())) : marcas, [marcas, busqueda]);

  return (
    <div className="max-w-[680px] mx-auto px-3 sm:px-4 pt-4 pb-12">
      <Toasts toasts={toasts} />
      <Breadcrumbs />

      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-ant rounded-xl mb-5 shadow-md">
        <i className={`${ICONS.CAR} text-yel`} />
        <div className="min-w-0">
          <div className="text-[15px] font-semibold text-antl tracking-tight">Marcas y Modelos</div>
          <div className="text-[11px] text-antm">Catálogo de vehículos del taller</div>
        </div>
        <div className="ml-auto shrink-0">
          <span className="text-[11px] text-antm">
            {marcas.length} marcas · {modelos.length} modelos
          </span>
        </div>
      </div>

      {/* Barra de acciones */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <i className={`${ICONS.SEARCH} absolute left-2.5 top-1/2 -translate-y-1/2 text-ant3 text-[14px]`} />
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar marca..."
            className="w-full pl-8 pr-3 h-9 rounded-md border border-border bg-ant2 text-[13px] text-antl outline-none focus:border-ant transition shadow-sm"
          />
          {busqueda && (
            <button onClick={() => setBusqueda("")} aria-label="Cerrar" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-antm hover:text-antl cursor-pointer">
              <i className={ICONS.CLOSE} />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => setAgregandoMarca(true)}
          className="h-9 px-4 rounded-md bg-ant text-antl text-[13px] font-medium flex items-center gap-1.5 hover:bg-ant2 transition cursor-pointer shrink-0"
        >
          <i className={ICONS.PLUS} /> Nueva marca
        </button>
      </div>

      {/* Form nueva marca */}
      {agregandoMarca && (
        <div className="bg-ant2 border border-yel/40 rounded-xl px-4 py-3 mb-4 shadow-sm">
          <p className="text-[11px] font-semibold text-ant3 uppercase tracking-widest mb-1">Nueva marca</p>
          <InlineForm placeholder="Ej: Toyota, Ford, Volkswagen..." onConfirm={handleAgregarMarca} onCancel={() => setAgregandoMarca(false)} loading={loadingMarca} />
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 rounded-xl bg-ant animate-pulse" />
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="flex items-center gap-2 text-[13px] text-red-300 bg-red-900/20 border border-red-800 rounded-xl px-4 py-3">
          <i className={ICONS.ALERT_TRIANGLE} />
          No se pudieron cargar las marcas. Verificá tu conexión.
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && marcasFiltradas.length === 0 && (
        <div className="text-center py-12 text-ant3">
          <i className={`${ICONS.CAR_OFF} block mb-2`} />
          <p className="text-[13px]">{busqueda ? `Sin resultados para "${busqueda}"` : "No hay marcas cargadas aún"}</p>
        </div>
      )}

      {/* Lista */}
      {!isLoading && !isError && (
        <div className="space-y-2">
          {marcasFiltradas.map((marca) => (
            <CardMarca
              key={marca.id}
              marca={marca}
              modelos={modelos}
              onEditarMarca={editarMarca}
              onEliminarMarca={eliminarMarca}
              onAgregarModelo={agregarModelo}
              onEditarModelo={editarModelo}
              onEliminarModelo={eliminarModelo}
              toast={toast}
            />
          ))}
        </div>
      )}
    </div>
  );
}
