import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ErrorBoundary from "@/components/ui/ErrorBoundary";
import ScrollToTop from "../components/ui/ScrollToTop";

import { AppLayout } from "@/layouts/AppLayout";

import Vehiculos from "@/pages/vehiculos";
import Presupuestos from "@/pages/presupuestos";
import Ordenes from "@/pages/ordenes";
import Login from "@/pages/login";
import NotFound from "@/pages/404";
import ResetPassword from "@/pages/reset-password";
import Piezas from "@/pages/piezas";
import Marcas from "@/pages/marcas";

import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/middleware/auth/ProtectedRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <ScrollToTop />
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/" element={<Navigate to="/presupuestos" replace />} />
                <Route path="/presupuestos" element={<Presupuestos />} />
                <Route path="/vehiculos" element={<Vehiculos />} />
                <Route path="/ordenes" element={<Ordenes />} />

                <Route path="/ordenes/:id" element={<Ordenes detalle={true} />} />
                <Route path="/piezas" element={<Piezas />} />
                <Route path="/marcas-modelos" element={<Marcas />} />
              </Route>
            </Route>

            {/* Ruta comodín: 404 simple */}
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
}
