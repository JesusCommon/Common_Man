import { useAuthStore } from "@/store";
import { usePerfil } from "@/hooks";
import { Button } from "@/components/ui/Button";
import { LogOut, User, Wallet, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const isAdmin = useAuthStore((s) => s.isAdmin);
  
  // Si el user no está en store (recarga de página), lo cargamos
  const { isLoading } = usePerfil();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  if (isLoading && !user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-slate-700 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* Navbar simple */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <h1 className="text-lg font-bold text-white tracking-tight">Common Man</h1>
          <div className="flex items-center gap-4">
            {isAdmin && (
              <span className="px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-400 flex items-center gap-1.5">
                <Shield className="w-3 h-3" />
                Admin
              </span>
            )}
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </nav>

      {/* Contenido */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-1">
            Hola, {user?.nombre || "Usuario"}
          </h2>
          <p className="text-slate-500">Este es tu panel de control.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card Perfil */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
              <User className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="font-semibold text-white mb-1">Perfil</h3>
            <p className="text-sm text-slate-500">{user?.correo}</p>
            <p className="text-sm text-slate-500">@{user?.username}</p>
          </div>

          {/* Card Saldo */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4">
              <Wallet className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="font-semibold text-white mb-1">Saldo</h3>
            <p className="text-2xl font-bold text-emerald-400">
              ${user?.saldo?.toLocaleString() || "0"}
            </p>
          </div>

          {/* Card Rol */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
              <Shield className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="font-semibold text-white mb-1">Rol</h3>
            <p className="text-sm text-slate-500 capitalize">{user?.rol}</p>
          </div>
        </div>
      </main>
    </div>
  );
}