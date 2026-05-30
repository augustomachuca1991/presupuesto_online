// src/components/ordenes/DetalleOrden.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { supabase } from "@/lib/supabase";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import OrdenEstadoBadge from "@/components/ordenes/OrdenEstadoBadge";
import Field from "@/components/ui/Field";
import { OrdenFotos } from "@/components/ordenes/OrdenFotos";

// ─── Transiciones permitidas ───────────────────────────────────────────────
const TRANSICIONES = {
  pendiente: ["en_progreso", "cancelada"],
  en_progreso: ["pausada", "completada", "cancelada"],
  pausada: ["en_progreso", "cancelada"],
  completada: ["en_progreso"],
  cancelada: [],
};

// Estilo outlined — color como acento, fondo neutro en reposo
const ACCION = {
  en_progreso: {
    label: "Iniciar trabajo",
    icon: "ti-play",
    cls: "border-blue-400 text-blue-600 hover:bg-blue-50",
  },
  pausada: {
    label: "Pausar",
    icon: "ti-player-pause",
    cls: "border-amber-400 text-amber-600 hover:bg-amber-50",
  },
  completada: {
    label: "Marcar completa",
    icon: "ti-circle-check",
    cls: "border-emerald-400 text-emerald-600 hover:bg-emerald-50",
  },
  cancelada: {
    label: "Cancelar orden",
    icon: "ti-ban",
    cls: "border-red-300 text-red-500 hover:bg-red-50",
  },
};

// ─── Botones de transición ─────────────────────────────────────────────────
function TransicionesEstado({ estadoActual, onCambiar, guardando }) {
  const siguientes = TRANSICIONES[estadoActual] ?? [];

  if (!siguientes.length)
    return (
      <div className="flex items-center gap-1.5 text-[12px] text-ant3 italic">
        <i className="ti ti-lock text-[12px]" />
        Estado final — sin transiciones disponibles
      </div>
    );

  return (
    <div className="flex flex-wrap gap-2">
      {siguientes.map((sig) => {
        const a = ACCION[sig];
        return (
          <button
            key={sig}
            onClick={() => onCambiar(sig)}
            disabled={guardando}
            className={`flex items-center gap-1.5 text-[12px] font-semibold
                        px-3 h-8 rounded-lg border bg-white
                        transition-colors cursor-pointer disabled:opacity-40
                        ${a.cls}`}
          >
            <i className={`ti ${a.icon} text-[13px]`} />
            {a.label}
          </button>
        );
      })}
    </div>
  );
}

// ─── Schema Yup ───────────────────────────────────────────────────────────
const esquema = Yup.object({
  fecha_inicio: Yup.date().nullable().typeError("Fecha inválida"),

  fecha_fin_est: Yup.date()
    .nullable()
    .typeError("Fecha inválida")
    .when("fecha_inicio", ([fi], schema) => (fi ? schema.min(fi, "Debe ser posterior al inicio") : schema)),

  fecha_fin_real: Yup.date()
    .nullable()
    .typeError("Fecha inválida")
    .when("fecha_inicio", ([fi], schema) => (fi ? schema.min(fi, "Debe ser posterior al inicio") : schema)),

  notas_tecnico: Yup.string().nullable().max(500, "Máximo 500 caracteres"),
});

// ─── Helper visual ────────────────────────────────────────────────────────
const fmtFecha = (fStr) => {
  if (!fStr) return <span className="text-ant3 italic text-[12px]">No asignada</span>;
  const [year, month, day] = fStr.split("-");
  return `${day}/${month}/${year}`;
};

// ─── Input de fecha reutilizable ──────────────────────────────────────────
function DateInput({ name, formik }) {
  const err = formik.touched[name] && formik.errors[name];
  return (
    <div>
      <input
        type="date"
        id={name}
        name={name}
        value={formik.values[name] ?? ""}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className={`input-base ${err ? "border-red-400 focus:ring-red-300/30" : ""}`}
      />
      {err && (
        <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
          <i className="ti ti-alert-circle text-[11px]" />
          {err}
        </p>
      )}
    </div>
  );
}

// ─── Componente principal ──────────────────────────────────────────────────
export default function DetalleOrden({ id }) {
  const [orden, setOrden] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [estadoActual, setEstadoActual] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function cargar() {
      const { data } = await supabase
        .from("ordenes_trabajo")
        .select(
          `
          *,
          presupuestos (
            nro, total_neto, observaciones,
            vehiculos ( dominio, anio, color,
              marcas ( nombre ), modelos ( nombre )
            ),
            clientes ( nombre, apellido, telefono ),
            presupuesto_items ( pieza_nombre, trabajo_nombre, precio_unitario )
          )
        `
        )
        .eq("id", id)
        .single();

      setOrden(data);
      setEstadoActual(data.estado);
      formik.resetForm({
        values: {
          fecha_inicio: data.fecha_inicio ?? "",
          fecha_fin_est: data.fecha_fin_est ?? "",
          fecha_fin_real: data.fecha_fin_real ?? "",
          notas_tecnico: data.notas_tecnico ?? "",
        },
      });
    }
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // ── Formik ────────────────────────────────────────────────────
  const formik = useFormik({
    initialValues: {
      fecha_inicio: "",
      fecha_fin_est: "",
      fecha_fin_real: "",
      notas_tecnico: "",
    },
    validationSchema: esquema,
    onSubmit: async (values) => {
      setGuardando(true);
      const payload = {
        fecha_inicio: values.fecha_inicio || null,
        fecha_fin_est: values.fecha_fin_est || null,
        fecha_fin_real: values.fecha_fin_real || null,
        notas_tecnico: values.notas_tecnico || null,
      };
      const { error } = await supabase.from("ordenes_trabajo").update(payload).eq("id", id);
      setGuardando(false);
      if (error) {
        alert("No se pudieron guardar los cambios.");
      } else {
        setIsEditing(false);
      }
    },
  });

  const handleCancelarEdicion = () => {
    formik.resetForm();
    setIsEditing(false);
  };

  // ── Cambio de estado ──────────────────────────────────────────
  const handleCambiarEstado = async (nuevoEstado) => {
    const extras = {};
    if (nuevoEstado === "en_progreso" && !formik.values.fecha_inicio) {
      extras.fecha_inicio = new Date().toISOString().split("T")[0];
    }
    if (nuevoEstado === "completada") {
      extras.fecha_fin_real = new Date().toISOString().split("T")[0];
    }

    setGuardando(true);
    const { error } = await supabase
      .from("ordenes_trabajo")
      .update({ estado: nuevoEstado, ...extras })
      .eq("id", id);
    setGuardando(false);

    if (error) {
      alert("No se pudo cambiar el estado.");
    } else {
      setEstadoActual(nuevoEstado);
      if (Object.keys(extras).length) {
        formik.setValues((prev) => ({ ...prev, ...extras }));
      }
    }
  };

  if (!orden)
    return (
      <div className="flex items-center justify-center h-40 text-[13px] text-ant3">
        <i className="ti ti-loader-2 animate-spin mr-2" /> Cargando...
      </div>
    );

  const p = orden.presupuestos;
  const v = p?.vehiculos;
  const cl = p?.clientes;

  return (
    <div className="max-w-2xl mx-auto px-3 sm:px-6 pt-3 pb-12">
      <Breadcrumbs uuidLabels={{ [id]: orden ? `Presupuesto #${p?.nro}` : "Cargando..." }} />

      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="bg-white border border-border rounded-xl px-4 pt-3.5 pb-3 mb-4 shadow-sm">
        {/* Fila 1: volver + editar */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => navigate("/ordenes")}
            className="flex items-center gap-1 text-[12px] font-medium text-ant3
                       hover:text-ant transition-colors cursor-pointer"
          >
            <i className="ti ti-arrow-left text-[13px]" /> Volver
          </button>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 text-[12px] font-semibold px-3 h-7
                         border border-border rounded-md bg-antl text-ant
                         hover:border-ant hover:bg-white transition-colors cursor-pointer"
            >
              <i className="ti ti-pencil text-[12px]" /> Editar
            </button>
          )}
        </div>

        {/* Fila 2: título + badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-ant3 uppercase tracking-widest mb-0.5">Orden de trabajo</p>
            <h1 className="text-[18px] font-bold text-ant leading-tight">
              Presupuesto <span className="font-mono">#{String(p?.nro).padStart(4, "0")}</span>
            </h1>
          </div>
          <div className="pt-0.5 shrink-0">
            <OrdenEstadoBadge estado={estadoActual} />
          </div>
        </div>

        {/* Fila 3: transiciones */}
        <div className="pt-3 border-t border-border">
          <p className="text-[10px] font-bold text-ant3 uppercase tracking-widest mb-2">Cambiar estado</p>
          <TransicionesEstado estadoActual={estadoActual} onCambiar={handleCambiarEstado} guardando={guardando} />
        </div>
      </div>

      {/* ── Vehículo y cliente ───────────────────────────────────── */}
      <div className="bg-white border border-border rounded-xl px-4 py-3 mb-3 shadow-sm">
        <div className="text-[10px] font-bold text-ant3 uppercase tracking-widest mb-2.5">Vehículo y cliente</div>

        <div className="flex items-center gap-2.5 mb-2.5">
          <div
            className="flex items-center justify-center w-9 h-9 rounded-xl
                          bg-yel/10 border border-yel/20 shrink-0"
          >
            <i className="ti ti-car text-[16px] text-yel" />
          </div>
          <div className="min-w-0">
            <span className="text-[14px] font-bold text-ant font-mono tracking-wide">{v?.dominio}</span>
            <div className="text-[12px] mt-0.5 flex flex-wrap gap-x-1 text-ant">
              <span className="font-medium">{v?.marcas?.nombre}</span>
              {v?.modelos?.nombre && <span className="font-medium">{v.modelos.nombre}</span>}
              {v?.anio && (
                <>
                  <span className="text-ant3">·</span>
                  <span>{v.anio}</span>
                </>
              )}
              {v?.color && (
                <>
                  <span className="text-ant2">·</span>
                  <span className="text-ant3">{v.color}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {cl && (
          <div className="flex items-center gap-2.5 pt-2.5 border-t border-border">
            <div
              className="flex items-center justify-center w-9 h-9 rounded-xl
                            bg-border/50 shrink-0"
            >
              <i className="ti ti-user text-[16px] text-muted" />
            </div>
            <div className="min-w-0">
              <span className="text-[13px] font-semibold text-ant capitalize">
                {cl.nombre} {cl.apellido}
              </span>
              {cl.telefono && (
                <div className="text-[12px] text-ant3 flex items-center gap-1 mt-0.5">
                  <i className="ti ti-phone text-[11px]" />
                  {cl.telefono}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Trabajos ─────────────────────────────────────────────── */}
      <div className="bg-white border border-border rounded-xl px-4 py-3 mb-3 shadow-sm">
        <div className="text-[10px] font-bold text-ant3 uppercase tracking-widest mb-2.5">Trabajos a realizar</div>
        {p?.presupuesto_items?.map((it, i) => (
          <div
            key={i}
            className="flex justify-between items-start text-[13px]
                                  py-2 border-b border-border last:border-0 gap-2"
          >
            <span className="flex-1 leading-snug">
              <span className="font-medium text-ant">{it.pieza_nombre}</span>
              <span className="text-ant3"> — {it.trabajo_nombre}</span>
            </span>
            <span className="font-mono text-[12px] font-semibold text-ant shrink-0">
              {it.precio_unitario.toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
                maximumFractionDigits: 0,
              })}
            </span>
          </div>
        ))}
      </div>

      {/* ── Datos de la orden ────────────────────────────────────── */}
      <form onSubmit={formik.handleSubmit} className="bg-white border border-border rounded-xl px-4 py-3 flex flex-col gap-3 shadow-sm">
        <div className="text-[10px] font-bold text-ant3 uppercase tracking-widest">Datos de la orden</div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Fecha inicio">
            {isEditing ? <DateInput name="fecha_inicio" formik={formik} /> : <p className="text-[13px] font-medium text-ant px-1 py-1">{fmtFecha(formik.values.fecha_inicio)}</p>}
          </Field>

          <Field label="Fecha estimada fin">
            {isEditing ? <DateInput name="fecha_fin_est" formik={formik} /> : <p className="text-[13px] font-medium text-ant px-1 py-1">{fmtFecha(formik.values.fecha_fin_est)}</p>}
          </Field>

          <Field label="Fecha real fin">
            {isEditing ? <DateInput name="fecha_fin_real" formik={formik} /> : <p className="text-[13px] font-medium text-ant px-1 py-1">{fmtFecha(formik.values.fecha_fin_real)}</p>}
          </Field>

          <Field label="Estado">
            <div className="pt-0.5">
              <OrdenEstadoBadge estado={estadoActual} />
            </div>
          </Field>
        </div>

        <Field
          label={
            <span className="flex items-center justify-between w-full">
              Notas del técnico
              {isEditing && (
                <span className={`text-[10px] font-normal tabular-nums ${(formik.values.notas_tecnico?.length ?? 0) > 450 ? "text-red-400" : "text-ant3"}`}>
                  {formik.values.notas_tecnico?.length ?? 0}/500
                </span>
              )}
            </span>
          }
        >
          {isEditing ? (
            <div>
              <textarea
                name="notas_tecnico"
                value={formik.values.notas_tecnico ?? ""}
                rows={3}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`input-base resize-none ${formik.touched.notas_tecnico && formik.errors.notas_tecnico ? "border-red-400" : ""}`}
              />
              {formik.touched.notas_tecnico && formik.errors.notas_tecnico && (
                <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                  <i className="ti ti-alert-circle text-[11px]" />
                  {formik.errors.notas_tecnico}
                </p>
              )}
            </div>
          ) : (
            <p
              className="text-[13px] text-ant bg-antl rounded-lg p-2.5 min-h-[60px]
                          whitespace-pre-wrap leading-relaxed"
            >
              {formik.values.notas_tecnico || <span className="text-ant3 italic">Sin notas registradas.</span>}
            </p>
          )}
        </Field>

        <OrdenFotos ordenId={id} />

        {/* Acciones */}
        {isEditing && (
          <div className="flex gap-2 pt-1 border-t border-border mt-1">
            <button
              type="submit"
              disabled={guardando || !formik.isValid}
              className="flex-1 h-9 rounded-md bg-ant text-antl text-[13px] font-semibold
                         hover:bg-ant2 transition-colors cursor-pointer
                         disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center justify-center gap-1.5"
            >
              {guardando ? (
                <>
                  <i className="ti ti-loader-2 animate-spin" /> Guardando…
                </>
              ) : (
                <>
                  <i className="ti ti-device-floppy" /> Guardar cambios
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleCancelarEdicion}
              disabled={guardando}
              className="h-9 px-4 rounded-md border border-border text-[13px] font-medium
                         text-ant hover:bg-antl transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancelar
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
