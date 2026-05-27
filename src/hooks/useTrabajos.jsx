import { useState, useEffect } from "react";

const TRABAJOS_MOCK = [
  { id: 1, nombre: "Chapa entera lateral", icono: "ti-rectangle", precio: 85000 },
  { id: 2, nombre: "Pintura completa (2 manos)", icono: "ti-droplet", precio: 120000 },
  { id: 3, nombre: "Pintura parcial (paño)", icono: "ti-droplet-half-filled", precio: 35000 },
  { id: 4, nombre: "Destemplado de paragolpes", icono: "ti-arrows-horizontal", precio: 18000 },
  { id: 5, nombre: "Reparación de abolladura", icono: "ti-hammer", precio: 28000 },
  { id: 6, nombre: "Cambio de luneta", icono: "ti-device-mobile", precio: 55000 },
  { id: 7, nombre: "Pulido y encerado", icono: "ti-sparkles", precio: 22000 },
  { id: 8, nombre: "Reparación de guardabarro", icono: "ti-tool", precio: 40000 },
  { id: 9, nombre: "Pintura de techo", icono: "ti-home", precio: 45000 },
  { id: 10, nombre: "Soldadura de carrocería", icono: "ti-flame", precio: 60000 },
  { id: 11, nombre: "Limpieza interior", icono: "ti-wand", precio: 12000 },
  { id: 12, nombre: "Pintura de llanta (x4)", icono: "ti-circle", precio: 32000 },
];

export function useTrabajos() {
  const [trabajos, setTrabajos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulamos una pequeña carga por si después usas una base de datos real
    const timer = setTimeout(() => {
      setTrabajos(TRABAJOS_MOCK);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return { trabajos, loadingTrabajos: loading };
}
