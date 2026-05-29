// src/components/ordenes/DetalleOrden.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import OrdenEstadoBadge from "@/components/ordenes/OrdenEstadoBadge";
import Field from "@/components/ui/Field";
import { OrdenFotos } from "@/components/ordenes/OrdenFotos";

export default function DetalleOrden({ id }) {
  const [orden, setOrden] = useState(null);
  const [form, setForm] = useState({});
  const [guardando, setGuardando] = useState(false);
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
      setForm({
        estado: data.estado,
        fecha_inicio: data.fecha_inicio ?? "",
        fecha_fin_est: data.fecha_fin_est ?? "",
        fecha_fin_real: data.fecha_fin_real ?? "",
        notas_tecnico: data.notas_tecnico ?? "",
      });
    }
    cargar();
  }, [id]);

  const handleGuardar = async () => {
    setGuardando(true);
    const payload = {
      estado: form.estado,
      fecha_inicio: form.fecha_inicio || null,
      fecha_fin_est: form.fecha_fin_est || null,
      fecha_fin_real: form.fecha_fin_real || null,
      notas_tecnico: form.notas_tecnico || null,
      // ← sacar updated_at, lo maneja Supabase solo
    };
    const { error } = await supabase.from("ordenes_trabajo").update(payload).eq("id", id);
    setGuardando(false);
    if (error) {
      console.error("Error guardando:", error);
      alert("No se pudieron guardar los cambios.");
    } else {
      alert("Cambios guardados correctamente.");
    }
  };

  if (!orden) return <div className="p-6 text-[13px] text-ant3">Cargando...</div>;

  const p = orden.presupuestos;
  const v = p?.vehiculos;
  const cl = p?.clientes;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Breadcrumbs
        uuidLabels={{
          [id]: orden ? `Presupuesto #${orden.presupuestos?.nro}` : "Cargando...",
        }}
      />
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate("/ordenes")} className="text-ant3 hover:text-ant text-[13px] cursor-pointer">
          ← Volver
        </button>
        <h1 className="text-[18px] font-semibold text-ant">Orden · Presupuesto #{p?.nro}</h1>
        <OrdenEstadoBadge estado={form.estado} />
      </div>

      {/* Info vehículo y cliente */}
      <div className="bg-white border border-border rounded-xl px-4 py-3 mb-4">
        <div className="text-[13px] font-medium text-ant mb-2">Vehículo y cliente</div>
        <div className="text-[13px] text-ant">
          🚗 {v?.dominio} · {v?.marcas?.nombre} {v?.modelos?.nombre} {v?.anio} · {v?.color}
        </div>
        {cl && (
          <div className="text-[12px] text-ant3 mt-1">
            👤 {cl.nombre} {cl.apellido} · {cl.telefono}
          </div>
        )}
      </div>

      {/* Items del presupuesto (solo lectura) */}
      <div className="bg-white border border-border rounded-xl px-4 py-3 mb-4">
        <div className="text-[13px] font-medium text-ant mb-2">Trabajos a realizar</div>
        {p?.presupuesto_items?.map((it, i) => (
          <div key={i} className="flex justify-between text-[13px] text-ant py-1 border-b border-border last:border-0">
            <span>
              {it.pieza_nombre} — {it.trabajo_nombre}
            </span>
            <span className="font-mono text-ant3">{it.precio_unitario.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 })}</span>
          </div>
        ))}
      </div>

      {/* Formulario editable */}
      <div className="bg-white border border-border rounded-xl px-4 py-3 flex flex-col gap-3">
        <div className="text-[13px] font-medium text-ant">Datos de la orden</div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Fecha inicio">
            <input type="date" value={form.fecha_inicio} onChange={(e) => setForm({ ...form, fecha_inicio: e.target.value })} className="input-base" />
          </Field>
          <Field label="Fecha estimada fin">
            <input type="date" value={form.fecha_fin_est} onChange={(e) => setForm({ ...form, fecha_fin_est: e.target.value })} className="input-base" />
          </Field>
          <Field label="Fecha real fin">
            <input type="date" value={form.fecha_fin_real} onChange={(e) => setForm({ ...form, fecha_fin_real: e.target.value })} className="input-base" />
          </Field>
          <Field label="Estado">
            <select value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })} className="input-base">
              <option value="pendiente">Pendiente</option>
              <option value="en_progreso">En progreso</option>
              <option value="pausada">Pausada</option>
              <option value="completada">Completada</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </Field>
        </div>

        <Field label="Notas del técnico">
          <textarea value={form.notas_tecnico} rows={3} onChange={(e) => setForm({ ...form, notas_tecnico: e.target.value })} className="input-base resize-none" />
        </Field>
        <OrdenFotos ordenId={id} />

        <button onClick={handleGuardar} disabled={guardando} className="self-end text-[13px] px-4 h-8 rounded-md bg-ant text-antl hover:bg-ant2 transition-colors cursor-pointer disabled:opacity-50">
          {guardando ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </div>
  );
}
