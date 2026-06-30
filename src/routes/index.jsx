import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ErrorBoundary from "@/components/ui/ErrorBoundary";
import ScrollToTop from "../components/ui/ScrollToTop";
import LoadingScreenPulse from "@/components/ui/LoadingScreenPulse";

import { AppLayout } from "@/layouts/AppLayout";

const Presupuestos = lazy(() => import("@/pages/presupuestos"));
const Vehiculos = lazy(() => import("@/pages/vehiculos"));
const Ordenes = lazy(() => import("@/pages/ordenes"));
const Login = lazy(() => import("@/pages/login"));
const NotFound = lazy(() => import("@/pages/404"));
const ResetPassword = lazy(() => import("@/pages/reset-password"));
const Piezas = lazy(() => import("@/pages/piezas"));
const Marcas = lazy(() => import("@/pages/marcas"));
const Turnos = lazy(() => import("@/pages/turnos"));

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
                <Route path="/turnos" element={<Turnos />} />
              </Route>
            </Route>

            {/* Ruta comodín: 404 simple */}
            <Route path="/login" element={<Suspense fallback={<LoadingScreenPulse />}><Login /></Suspense>} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
}
