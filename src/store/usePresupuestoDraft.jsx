// src/store/usePresupuestoDraft.js
//
// Store global para persistir el borrador del presupuesto entre navegaciones.
// Vive fuera del ciclo de vida de los componentes — sobrevive al cambio de página.
//
// Qué persiste:
//   - vehiculoActual   → el vehículo seleccionado
//   - propietarioActual → el propietario seleccionado
//   - items            → trabajos agregados con precios editados
//   - descuento        → porcentaje de descuento
//   - obs              → observaciones
//
// Qué NO persiste (se recalcula):
//   - piezaSelId       → la pieza del paso 1 (se cierra al volver)
//   - bruto/ahorro/neto → son derivados de items y descuento

import { create } from "zustand";

export const usePresupuestoDraft = create((set) => ({
  // ── Estado ─────────────────────────────────────────────────────────────
  vehiculoActual: null,
  propietarioActual: null,
  items: [],
  descuento: 0,
  obs: "",

  // ── Acciones ───────────────────────────────────────────────────────────
  setVehiculo: (v) => set({ vehiculoActual: v }),
  setPropietario: (p) => set({ propietarioActual: p }),
  setItems: (its) => set({ items: its }),
  setDescuento: (d) => set({ descuento: d }),
  setObs: (o) => set({ obs: o }),

  resetDraft: () =>
    set({
      vehiculoActual: null,
      propietarioActual: null,
      items: [],
      descuento: 0,
      obs: "",
    }),
}));
