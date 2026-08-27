import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store";
import { usePerfil } from "@/hooks";
import { useAuthInit } from "@/hooks";
import { useState, useRef, useEffect } from "react";
import { Search, LogOut, User, Wallet, Shield, ChevronDown, Bell, TrendingUp, Lock } from "lucide-react";

type NavKey = "/dashboard" | "/buscar" | "/recargar" | "/perfil" | "/password";

interface NavItem {
  key: NavKey;
  label: string;
  icon: React.ElementType;
}

export default function MainLayout() {
  useAuthInit();
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.rol === "admin";
  
  const [menuOpen, setMenuOpen] = useState(false);
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

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const navItems: NavItem[] = [
    { key: "/dashboard", label: "Inicio", icon: TrendingUp },
    { key: "/buscar", label: "Buscar", icon: Search },
    { key: "/recargar", label: "Recargar", icon: Wallet },
    { key: "/perfil", label: "Perfil", icon: User },
    { key: "/password", label: "Seguridad", icon: Lock },
  ];

  const isActive = (path: NavKey) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#18181B]">
      {/* NAVBAR ÚNICA */}
      <nav className="sticky top-0 z-50 border-b border-[#E4E4E1] bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between gap-4">
            
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-2.5 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-[#18181B] flex items-center justify-center">
                <span className="text-[#FAFAF8] text-xs font-bold font-[Space_Grotesk]">C</span>
              </div>
              <span className="text-lg font-bold text-[#18181B] tracking-tight font-[Space_Grotesk]">Common Man</span>
            </Link>

            {/* Pills de navegación */}
            <nav className="hidden md:flex items-center gap-1 bg-[#FAFAF8] rounded-full p-1 border border-[#E4E4E1]">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.key);
                return (
                  <button
                    key={item.key}
                    onClick={() => navigate(item.key)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                      active
                        ? "bg-[#18181B] text-white shadow-sm"
                        : "text-[#52525B] hover:text-[#18181B] hover:bg-white"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Acciones derecha */}
            <div className="flex items-center gap-3">
              {/* Notificaciones */}
              <button className="relative w-9 h-9 rounded-full bg-[#FAFAF8] border border-[#E4E4E1] flex items-center justify-center hover:bg-[#F4F4F5] transition-colors">
                <Bell className="w-4 h-4 text-[#52525B]" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#2563EB] rounded-full border-2 border-white" />
              </button>

              {/* Menú de usuario */}
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
                  <ChevronDown className={`w-4 h-4 text-[#52525B] transition-transform ${menuOpen ? "rotate-180" : ""}`} />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-[#E4E4E1] bg-white shadow-lg py-2 overflow-hidden">
                    <div className="px-4 py-3 border-b border-[#F4F4F5]">
                      <p className="text-sm font-semibold text-[#18181B]">{user?.nombre} {user?.apellido}</p>
                      <p className="text-xs text-[#A1A19A]">@{user?.username}</p>
                    </div>
                    
                    <button
                      onClick={() => { setMenuOpen(false); navigate("/perfil"); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#52525B] hover:bg-[#FAFAF8] transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Editar perfil
                    </button>
                    
                    <button
                      onClick={() => { setMenuOpen(false); navigate("/password"); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#52525B] hover:bg-[#FAFAF8] transition-colors"
                    >
                      <Shield className="w-4 h-4" />
                      Cambiar contraseña
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

                    <div className="border-t border-[#F4F4F5] mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pills móvil */}
          <div className="md:hidden flex items-center gap-1 overflow-x-auto pb-3 scrollbar-hide">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.key);
              return (
                <button
                  key={item.key}
                  onClick={() => navigate(item.key)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    active
                      ? "bg-[#18181B] text-white"
                      : "bg-white text-[#52525B] border border-[#E4E4E1]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* CONTENIDO */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}