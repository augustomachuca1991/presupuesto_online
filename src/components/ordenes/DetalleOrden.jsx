// src/components/ordenes/DetalleOrden.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export default function DetalleOrden({ id }) {
  const [orden, setOrden] = useState(null);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function cargarDetalle() {
      try {
        const { data, error } = await supabase.from("ordenes_trabajo").select("*").eq("id", id).single();

        if (error) throw error;
        setOrden(data);
      } catch (err) {
        console.error("Error al obtener la orden:", err.message);
      } finally {
        setCargando(false);
      }
    }
    cargarDetalle();
  }, [id]);

  if (cargando) return <div className="text-[13px] text-ant3 text-center py-8">Cargando detalles de la orden...</div>;
  if (!orden) return <div className="text-[13px] text-center py-8 text-red-500">No se encontró la orden de trabajo.</div>;

  return (
    <div className="p-6">
      {/* Botón de retorno */}
      <button onClick={() => navigate("/ordenes")} className="mb-4 text-[13px] text-ant3 hover:text-ant flex items-center gap-1 cursor-pointer transition-colors">
        ⬅ Volver al listado
      </button>

      <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-ant mb-2">Detalle de Orden de Trabajo</h2>
        <div className="font-mono text-[13px] text-ant3 bg-antl p-2.5 rounded border border-border mb-4">ID de Registro: {orden.id}</div>

        {/* Renderizá acá los datos de tu orden (estados del auto, fotos, inputs de avance) */}
        <div className="text-[13px] text-ant space-y-1">
          <p>
            <strong>Estado del Proceso:</strong> <span className="capitalize">{orden.estado}</span>
          </p>
          <p>
            <strong>Fecha de Ingreso:</strong> {new Date(orden.created_at).toLocaleDateString("es-AR")}
          </p>
        </div>
      </div>
    </div>
  );
}
