import { Outlet, useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "@/store";
import { usePerfil } from "@/hooks";
import { useAuthInit } from "@/hooks";
import { useState, useRef, useEffect } from "react";
import { Search, LogOut, User, Wallet, Shield, ChevronDown } from "lucide-react";

export default function MainLayout() {
  useAuthInit();
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.rol === "admin";
  
  const [searchQuery, setSearchQuery] = useState("");
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/buscar?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-4">
          
          <Link to="/dashboard" className="flex items-center gap-2 shrink-0">
            <span className="text-lg font-bold text-white tracking-tight">Common Man</span>
          </Link>

          <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4 hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar personas..."
                className="w-full h-9 pl-9 pr-4 rounded-lg bg-slate-900 border border-slate-800 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all"
              />
            </div>
          </form>

          <div className="flex items-center gap-3 ml-auto">
            {/* Saldo: solo usuarios normales */}
            {!isAdmin && (
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-sm">
                <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">
                  ${user?.saldo?.toLocaleString() || "0"}
                </span>
              </div>
            )}

            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-800/50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold overflow-hidden">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    user?.nombre?.charAt(0).toUpperCase() || "U"
                  )}
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${menuOpen ? "rotate-180" : ""}`} />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-800 bg-slate-900 shadow-2xl py-2 overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-800">
                    <p className="text-sm font-semibold text-white">{user?.nombre} {user?.apellido}</p>
                    <p className="text-xs text-slate-500">@{user?.username}</p>
                  </div>
                  
                  <button
                    onClick={() => { setMenuOpen(false); navigate("/perfil"); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800/50 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Editar perfil
                  </button>
                  
                  <button
                    onClick={() => { setMenuOpen(false); navigate("/password"); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800/50 transition-colors"
                  >
                    <Shield className="w-4 h-4" />
                    Cambiar contraseña
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => { setMenuOpen(false); navigate("/admin"); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-blue-400 hover:bg-blue-500/10 transition-colors"
                    >
                      <Shield className="w-4 h-4" />
                      Panel Admin
                    </button>
                  )}

                  <div className="border-t border-slate-800 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
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
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}