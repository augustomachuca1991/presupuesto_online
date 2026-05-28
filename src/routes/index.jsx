import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Presupuestos from "@/pages/presupuestos";
import Vehiculos from "@/pages/vehiculos";
import Turnos from "@/pages/turnos";
import NotFound from "@/pages/404";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import ScrollToTop from "../components/ui/ScrollToTop";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Navigate to="/presupuestos" replace />} />
          <Route path="/presupuestos" element={<Presupuestos />} />
          <Route path="/vehiculos" element={<Vehiculos />} />
          <Route path="/turnos" element={<Turnos />} />
          {/* Ruta comodín: 404 simple */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
