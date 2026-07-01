import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

export default {
  fetch: withSupabase({ auth: ["secret"] }, async (_req, ctx) => {
    const supabase = ctx.supabaseAdmin;

    const hoy = new Date().toISOString().split("T")[0];

    const { data: vencidos, error } = await supabase
      .from("presupuestos")
      .select("id")
      .eq("estado", "emitido")
      .lte("fecha_vencimiento", hoy);

    if (error) {
      console.error("Error consultando presupuestos:", error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    for (const p of vencidos ?? []) {
      await supabase
        .from("presupuestos")
        .update({ estado: "vencido", updated_at: new Date().toISOString() })
        .eq("id", p.id);

      await supabase.from("audit_log").insert({
        user_id: null,
        accion: "presupuesto.vencer_auto",
        entidad: "presupuestos",
        entidad_id: p.id,
        detalle: { desde: "emitido", hacia: "vencido", automatico: true },
      });
    }

    return new Response(JSON.stringify({ vencidos: vencidos?.length ?? 0 }));
  }),
};
