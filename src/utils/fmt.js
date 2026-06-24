// src/utils/fmt.js
// Formatea un número como precio en pesos argentinos.
// Ej: fmt(42000) → "$42.000"

export const fmt = (n) => "$" + Math.round(n).toLocaleString("es-AR");

// Escapa caracteres HTML para prevenir XSS en strings HTML generados dinámicamente.
// Ej: esc('<script>alert("xss")</script>') → "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;"
export function esc(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Escapa wildcards de LIKE (% y _) para búsquedas literales con ilike.
// Evita que un término como "100%" devuelva todos los registros.
export function escSearch(term) {
  return String(term).replace(/[%_]/g, "\\$&");
}

// Arma el nombre completo del titular desde el cliente o el vehículo (fallback).
export function resolverTitular(cliente, vehiculo) {
  if (cliente?.nombre) {
    const nombre = cliente.nombre.trim();
    const apellido = cliente.apellido?.trim() ?? "";
    const capitalizar = (s) => s.replace(/\b\w/g, (c) => c.toUpperCase());
    return capitalizar(`${nombre} ${apellido}`.trim());
  }
  if (vehiculo?.ultimo_titular) return vehiculo.ultimo_titular;
  if (vehiculo?.titular) return vehiculo.titular;
  return "Sin propietario";
}
