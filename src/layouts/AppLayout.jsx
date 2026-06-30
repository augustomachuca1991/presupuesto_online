import { useState, Suspense } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ICONS } from "@/constants/icons";
import { NAV_ITEMS } from "@/utils/navigation";
import logoSVG from "@/assets/bitmap-vm.svg";
import LoadingScreenPulse from "@/components/ui/LoadingScreenPulse";

function getInitials(user) {
  const full = user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? "";
  if (full.trim()) {
    const parts = full.trim().split(" ");
    return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0].slice(0, 2).toUpperCase();
  }
  return (user?.email ?? "").slice(0, 2).toUpperCase();
}

function getDisplayName(user) {
  return user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? user?.email?.split("@")[0] ?? "Usuario";
}

function UserAvatar({ user, size = 32 }) {
  return (
    <div
      className="rounded-full bg-yel flex items-center justify-center
                 font-bold text-yeld shrink-0 select-none"
      style={{ width: size, height: size, fontSize: size * 0.35 }}
    >
      {getInitials(user)}
    </div>
  );
}

export function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="flex w-full min-h-screen bg-bg font-sans relative">
      {menuOpen && <div onClick={() => setMenuOpen(false)} className="fixed inset-0 bg-black/50 z-40 md:hidden" />}

      {/* ── Sidebar ──────────────────────────────────────────────── */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col bg-ant border-r border-ant2
          transition-transform duration-300 transform
          ${menuOpen ? "translate-x-0" : "-translate-x-full"}

          md:sticky md:top-0 md:h-screen
          md:translate-x-0 md:flex md:shrink-0 md:w-[220px] max-md:w-16
        `}
      >
        {/* Logo */}
        <div className="max-md:px-2 md:px-5 py-5 border-b border-ant2 shrink-0">
          <div className="flex items-center justify-start max-md:gap-1 md:gap-3">
            <div className="max-md:w-9 max-md:h-9 md:w-14 md:h-14 rounded flex items-center justify-center shrink-0 overflow-hidden">
              <img src={logoSVG} alt="VM" className="w-full h-full object-contain" />
            </div>
            <div className="hidden md:block min-w-0">
              <div className="text-[13px] font-semibold text-[#ef9f27] leading-tight truncate">Victor Machuca</div>
              <div className="text-[10px] text-antm tracking-wider">CHAPA Y PINTURA</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 px-3 py-4 flex-1 overflow-y-auto">
          {NAV_ITEMS.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-center md:justify-start gap-3 px-0 md:px-3 py-2.5 rounded-md text-[13px]
                 font-medium transition-colors cursor-pointer
                 ${isActive ? "bg-yel/10 text-yel font-semibold" : "text-ant3 hover:bg-ant2 hover:text-antl"}`
              }
              title={label}
            >
              <i className={`${icon} text-[18px] shrink-0`} />
              <span className="hidden md:inline truncate">{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 py-3 border-t border-ant2 space-y-1 shrink-0">
          <div className="flex items-center justify-center md:justify-start gap-2.5 px-0 md:px-3 py-2.5 rounded-md">
            <UserAvatar user={user} size={34} />
            <div className="hidden md:block flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-antl truncate capitalize">{getDisplayName(user)}</div>
              <div className="text-[10px] text-antm truncate">{user?.email ?? ""}</div>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center md:justify-start gap-3 px-0 md:px-3 py-2 rounded-md
                       text-[13px] font-medium text-antm
                       hover:bg-ant2 hover:text-antl transition-colors cursor-pointer"
            title="Cerrar sesión"
          >
            <i className={`${ICONS.LOGOUT} text-[18px] shrink-0`} />
            <span className="hidden md:inline">Cerrar sesión</span>
          </button>

          <div className="hidden md:block px-3 pt-1 text-[10px] text-ant3">v0.1.0</div>
        </div>
      </aside>

      {/* ── Contenido ────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Header mobile */}
        <header
          className="w-full h-10 bg-ant border-b border-ant2 flex items-center
                     px-4 justify-between md:hidden shrink-0"
        >
          <button onClick={() => setMenuOpen(true)} className="text-antm hover:text-antl p-1 rounded-md transition-colors cursor-pointer">
            <i className={`${ICONS.MENU_2} text-[18px]`} />
          </button>

          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded flex items-center justify-center shrink-0 overflow-hidden">
              <img src={logoSVG} alt="VM" className="w-full h-full object-contain" />
            </div>
            <div className="text-[12px] font-semibold text-[#ef9f27] truncate">Victor Machuca</div>
          </div>

          <div onClick={() => setMenuOpen(true)} className="cursor-pointer" title={user?.email}>
            <UserAvatar user={user} size={26} />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-bg p-4 md:p-6">
          <Suspense fallback={<LoadingScreenPulse />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
