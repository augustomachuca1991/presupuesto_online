// src/layouts/AppLayout.jsx
import { NavLink, Outlet } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/presupuestos", icon: "ti-file-text", label: "Presupuestos" },
  { to: "/vehiculos", icon: "ti-car", label: "Vehículos" },
  { to: "/ordenes", icon: "ti-clipboard", label: "Órdenes" },
  { to: "/turnos", icon: "ti-calendar", label: "Turnos" },
];

export function AppLayout() {
  return (
    // Agregamos w-full para asegurar que ocupe todo el ancho
    <div className="flex w-full min-h-screen bg-bg font-sans">
      {/* Sidebar */}
      <aside className="w-[220px] min-h-screen shrink-0 bg-ant flex flex-col border-r border-ant2">
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

      {/* Contenido Dinámico */}
      <main className="flex-1 min-h-screen overflow-y-auto bg-bg p-6">
        <Outlet />
      </main>
    </div>
  );
}
