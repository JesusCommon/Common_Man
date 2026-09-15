import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store";
import { usePerfil, useAuthInit } from "@/hooks";
import { useWebSocket } from "@/hooks/useWebSocket";
import { NotificacionesDropdown } from "@/components/NotificacionesDropdown";
import { UserSidebar } from "@/components/layout/UserSidebar";
import { useState, useRef, useEffect } from "react";
import { Menu, ChevronDown, ExternalLink, Settings, Shield } from "lucide-react";

export default function MainLayout() {
  useAuthInit();
  useWebSocket();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.rol === "admin";
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  usePerfil();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isConfig = location.pathname.startsWith("/configuracion");

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#18181B]">
      <header className="sticky top-0 z-40 border-b border-[#E4E4E1] bg-white/80 backdrop-blur-md">
        <div className="h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-[#F4F4F5] text-[#52525B]"
              title="Abrir menú"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link to="/dashboard" className="flex items-center gap-2.5 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-[#18181B] flex items-center justify-center">
                <span className="text-[#FAFAF8] text-xs font-bold font-[Space_Grotesk]">C</span>
              </div>
              <span className="text-lg font-bold text-[#18181B] tracking-tight font-[Space_Grotesk]">
                Common Man
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <NotificacionesDropdown />

            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-[#F4F4F5] transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#2563EB] to-[#1D4ED8] flex items-center justify-center text-white text-sm font-bold overflow-hidden">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    user?.nombre?.charAt(0).toUpperCase() || "U"
                  )}
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-[#52525B] transition-transform ${menuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-[#E4E4E1] bg-white shadow-lg py-2 overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#F4F4F5]">
                    <p className="text-sm font-semibold text-[#18181B]">
                      {user?.nombre} {user?.apellido}
                    </p>
                    <p className="text-xs text-[#A1A19A]">@{user?.username}</p>
                  </div>

                  <button
                    onClick={() => { setMenuOpen(false); navigate(`/perfil/${user?.username}`); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#52525B] hover:bg-[#FAFAF8] transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Ver perfil público
                  </button>

                  <button
                    onClick={() => { setMenuOpen(false); navigate("/configuracion"); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#52525B] hover:bg-[#FAFAF8] transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Configuración
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => { setMenuOpen(false); navigate("/admin"); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#2563EB] hover:bg-[#EFF4FE] transition-colors"
                    >
                      <Shield className="w-4 h-4" />
                      Panel Admin
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex items-start">
        <UserSidebar
          mobileOpen={mobileNavOpen}
          onMobileClose={() => setMobileNavOpen(false)}
        />

        <main className={`flex-1 min-w-0 ${isConfig ? "" : "px-4 sm:px-6 lg:px-8 py-8"}`}>
          {isConfig ? (
            <Outlet />
          ) : (
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}