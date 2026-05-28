// src/components/ordenes/ListaOrdenes.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export default function ListaOrdenes() {
  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function cargarOrdenes() {
      try {
        // Traemos las órdenes (podés incluir datos del vehículo si armaste la relación)
        const { data, error } = await supabase.from("ordenes_trabajo").select("*").order("created_at", { ascending: false });

        if (error) throw error;
        setOrdenes(data || []);
      } catch (err) {
        console.error("Error al cargar órdenes:", err.message);
      } finally {
        setCargando(false);
      }
    }
    cargarOrdenes();
  }, []);

  if (cargando) return <div className="text-[13px] text-ant3 text-center py-8">Cargando órdenes de trabajo...</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-ant mb-4">Órdenes de Trabajo</h1>

      <div className="flex flex-col gap-2">
        {ordenes.length === 0 ? (
          <div className="text-[13px] text-ant3 text-center py-8 border border-dashed border-border rounded-md">No hay órdenes de trabajo activas.</div>
        ) : (
          ordenes.map((orden) => (
            <div key={orden.id} className="bg-white border border-border rounded-xl p-4 flex justify-between items-center shadow-sm">
              <div>
                <div className="text-[14px] font-semibold text-ant">Orden #{orden.nro_orden || orden.id.slice(0, 5)}</div>
                <div className="text-[12px] text-ant3">
                  Estado: <span className="capitalize font-medium">{orden.estado}</span>
                </div>
              </div>
              <button onClick={() => navigate(`/ordenes/${orden.id}`)} className="border border-border text-ant text-[13px] px-3 py-1.5 rounded-md hover:bg-antl cursor-pointer transition-colors">
                Ver Detalle ➔
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
