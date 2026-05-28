// src/layouts/AppLayout.jsx

import { NavLink, Outlet } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/", icon: "ti-file-text", label: "Presupuestos" },
  { to: "/vehiculos", icon: "ti-car", label: "Vehículos" },
  { to: "/turnos", icon: "ti-calendar", label: "Turnos" },
];

export function AppLayout() {
  return (
    <div className="flex min-h-screen bg-bg">
      {/* Sidebar */}
      <aside className="w-[220px] shrink-0 bg-ant flex flex-col">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-ant2">
          <div className="flex items-center gap-2.5">
            <i className="ti ti-car-crash text-[22px] text-yel" />
            <div>
              <div className="text-[14px] font-semibold text-antl leading-tight">Chapa &amp; Pintura</div>
              <div className="text-[11px] text-antm">Sistema de gestión</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
          {NAV_ITEMS.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-md text-[13px] font-medium transition-colors
                ${isActive ? "bg-yel text-yeld" : "text-antm hover:bg-ant2 hover:text-antl"}`
              }
            >
              <i className={`ti ${icon} text-[16px]`} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-ant2">
          <div className="text-[11px] text-ant3">v0.1.0</div>
        </div>
      </aside>

      {/* Contenido */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
