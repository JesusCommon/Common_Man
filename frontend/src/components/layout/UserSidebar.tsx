import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store";
import { userNavigationConfig } from "@/config/useNavigation";
import { ChevronLeft, ChevronRight, LogOut, X } from "lucide-react";

interface UserSidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function UserSidebar({ mobileOpen, onMobileClose }: UserSidebarProps) {
  const [colapsado, setColapsado] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);

  const isActive = (route: string) => location.pathname.startsWith(route);

  const handleNav = (route: string) => {
    navigate(route);
    onMobileClose();
  };

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-[#E4E4E1] flex flex-col shrink-0
          transform transition-transform duration-300
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:sticky lg:top-16 lg:bottom-auto lg:h-[calc(100vh-4rem)] lg:self-start
          ${colapsado ? "lg:w-17" : "lg:w-60"}
        `}
      >
        <div className="flex items-center justify-between px-4 h-16 border-b border-[#F4F4F5] lg:hidden">
          <span className="text-sm font-semibold text-[#18181B]">Navegación</span>
          <button
            onClick={onMobileClose}
            className="p-1 rounded-lg hover:bg-[#F4F4F5] text-[#52525B]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="relative hidden lg:block px-4 pt-4 pb-2">
          {!colapsado && (
            <span className="text-xs font-semibold text-[#A1A19A] uppercase tracking-wider">
              Menú
            </span>
          )}
          <button
            onClick={() => setColapsado(!colapsado)}
            className="absolute -right-3 top-5 w-6 h-6 bg-white border border-[#E4E4E1] rounded-full flex items-center justify-center text-[#52525B] hover:bg-[#F4F4F5] z-10"
            title={colapsado ? "Expandir" : "Colapsar"}
          >
            {colapsado ? (
              <ChevronRight className="w-3 h-3" />
            ) : (
              <ChevronLeft className="w-3 h-3" />
            )}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
          {userNavigationConfig.map(({ id, label, icon: Icon, route }) => {
            const active = isActive(route);
            return (
              <button
                key={id}
                onClick={() => handleNav(route)}
                title={colapsado ? label : undefined}
                className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                  colapsado ? "lg:justify-center lg:px-2" : ""
                } ${
                  active
                    ? "bg-[#18181B] text-white shadow-sm"
                    : "text-[#52525B] hover:bg-[#F4F4F5] hover:text-[#18181B]"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className={`truncate ${colapsado ? "lg:hidden" : ""}`}>
                  {label}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="border-t border-[#F4F4F5] p-3 space-y-2">
          {!colapsado && user && (
            <div className="flex items-center gap-2 px-1">
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#2563EB] to-[#1D4ED8] flex items-center justify-center text-white text-xs font-bold overflow-hidden shrink-0">
                {user.avatar ? (
                  <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  user.nombre?.charAt(0).toUpperCase() || "U"
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#18181B] truncate">
                  {user.nombre} {user.apellido}
                </p>
                <p className="text-[10px] text-[#A1A19A] truncate">@{user.username}</p>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            title={colapsado ? "Cerrar sesión" : undefined}
            className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition ${
              colapsado ? "lg:justify-center lg:px-2" : ""
            }`}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span className={`${colapsado ? "lg:hidden" : ""}`}>Cerrar sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
}