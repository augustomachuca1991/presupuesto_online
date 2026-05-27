// src/utils/fmt.js
// Formatea un número como precio en pesos argentinos.
// Ej: fmt(42000) → "$42.000"

export const fmt = (n) => "$" + Math.round(n).toLocaleString("es-AR");
