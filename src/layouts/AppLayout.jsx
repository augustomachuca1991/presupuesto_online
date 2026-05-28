// src/layouts/AppLayout.jsx
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/presupuestos", icon: "ti-file-text", label: "Presupuestos" },
  { to: "/vehiculos", icon: "ti-car", label: "Vehículos" },
  { to: "/ordenes", icon: "ti-clipboard", label: "Órdenes" },
  { to: "/turnos", icon: "ti-calendar", label: "Turnos" },
];

const { VITE_APP_NAME, VITE_APP_DESCRIPTION } = import.meta.env;

export function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex w-full min-h-screen bg-bg font-sans relative">
      {menuOpen && <div onClick={() => setMenuOpen(false)} className="fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity duration-200" />}

      {/* 2. Sidebar */}
      <aside
        className={`
        /* Estructura fija y transiciones para Mobile */
        fixed inset-y-0 left-0 z-50 w-[220px] bg-ant flex flex-col border-r border-ant2 transition-transform duration-300 transform
        ${menuOpen ? "translate-x-0" : "-translate-x-full"}
        md:relative md:translate-x-0 md:flex md:shrink-0 md:min-h-screen
      `}
      >
        {/* Logo y Botón de cerrar interno (Solo visible en mobile) */}
        <div className="px-5 py-5 border-b border-ant2 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <i className="ti ti-car-crash text-[22px] text-yel" />
            <div>
              <div className="text-[14px] font-semibold text-antl leading-tight">{VITE_APP_NAME}</div>
              <div className="text-[11px] text-antm">{VITE_APP_DESCRIPTION}</div>
            </div>
          </div>

          {/* Botón cerrar para mobile */}
          <button onClick={() => setMenuOpen(false)} className="md:hidden text-antm hover:text-antl cursor-pointer p-1">
            <i className="ti ti-x text-[18px]" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
          {NAV_ITEMS.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={() => setMenuOpen(false)} // Cierra el menú al hacer clic en mobile
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-md text-[13px] font-medium transition-colors cursor-pointer
                ${isActive ? "bg-yel text-yeld font-semibold" : "text-antm hover:bg-ant2 hover:text-antl"}`
              }
            >
              <i className={`ti ${icon} text-[16px]`} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-ant2">
          <div className="text-[11px] text-ant3">v0.1.0</div>
        </div>
      </aside>

      {/* 3. Contenedor de Contenido Principal */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Navbar superior para Mobile (Contiene la hamburguesa) */}
        <header className="w-full h-14 bg-white border-b border-border flex items-center px-4 justify-between md:hidden shrink-0">
          <button onClick={() => setMenuOpen(true)} className="text-ant p-2 hover:bg-bg rounded-md transition-colors cursor-pointer flex items-center justify-center">
            <i className="ti ti-menu-2 text-[20px]" />
          </button>
          {/* Título o marca central rápida en Mobile */}
          <div className="text-[14px] font-semibold text-ant leading-tight font-mono uppercase tracking-wider">{VITE_APP_NAME}</div>
          <div className="w-9" /> {/* Spacer para mantener centrado el texto */}
        </header>

        {/* Contenido Dinámico de las Pantallas */}
        <main className="flex-1 overflow-y-auto bg-bg p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
