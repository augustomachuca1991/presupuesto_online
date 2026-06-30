import { supabase } from "./supabase";

export async function audit(accion, entidad, entidadId = null, detalle = null) {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) return;
    await supabase.from("audit_log").insert({
      user_id: session.user.id,
      accion,
      entidad,
      entidad_id: entidadId,
      detalle,
    });
  } catch (err) {
    console.error("[audit]", err);
  }
}
