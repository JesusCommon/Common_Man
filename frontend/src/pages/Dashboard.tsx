import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store";
import { usePerfil } from "@/hooks";
import { Search, Wallet, User, Lock, Shield } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.rol === "admin";
  // Mantiene el perfil fresco (refetch automático cada 30s por el layout)
  const { isLoading } = usePerfil();

  if (isLoading && !user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-slate-700 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Bienvenida */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Hola, {user?.nombre || "Usuario"}
        </h1>
        <p className="text-slate-500">
          Este es tu centro de control. ¿Qué quieres hacer hoy?
        </p>
      </div>

      {/* Accesos rápidos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <button
          onClick={() => navigate("/buscar")}
          className="group text-left rounded-xl border border-slate-800 bg-slate-900/50 p-6 hover:border-blue-500/30 hover:bg-slate-800/30 transition-all"
        >
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
            <Search className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="font-semibold text-white mb-1">Buscar personas</h3>
          <p className="text-sm text-slate-500">Encuentra otros usuarios por nombre o username.</p>
        </button>

        <button
          onClick={() => navigate("/recargar")}
          className="group text-left rounded-xl border border-slate-800 bg-slate-900/50 p-6 hover:border-emerald-500/30 hover:bg-slate-800/30 transition-all"
        >
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
            <Wallet className="w-5 h-5 text-emerald-400" />
          </div>
          <h3 className="font-semibold text-white mb-1">Recargar saldo</h3>
          <p className="text-sm text-slate-500">Añade fondos a tu cuenta.</p>
        </button>

        <button
          onClick={() => navigate("/perfil")}
          className="group text-left rounded-xl border border-slate-800 bg-slate-900/50 p-6 hover:border-purple-500/30 hover:bg-slate-800/30 transition-all"
        >
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
            <User className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="font-semibold text-white mb-1">Editar perfil</h3>
          <p className="text-sm text-slate-500">Actualiza tus datos personales.</p>
        </button>

        <button
          onClick={() => navigate("/password")}
          className="group text-left rounded-xl border border-slate-800 bg-slate-900/50 p-6 hover:border-orange-500/30 hover:bg-slate-800/30 transition-all"
        >
          <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition-colors">
            <Lock className="w-5 h-5 text-orange-400" />
          </div>
          <h3 className="font-semibold text-white mb-1">Seguridad</h3>
          <p className="text-sm text-slate-500">Cambia tu contraseña.</p>
        </button>
      </div>

      {/* Info rápida */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Tu cuenta</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-slate-600 mb-1">Usuario</p>
            <p className="text-white font-medium">@{user?.username}</p>
          </div>
          <div>
            <p className="text-slate-600 mb-1">Correo</p>
            <p className="text-white font-medium">{user?.correo}</p>
          </div>
          <div>
            <p className="text-slate-600 mb-1">Saldo</p>
            <p className="text-emerald-400 font-semibold">${user?.saldo?.toLocaleString() || "0"}</p>
          </div>
          <div>
            <p className="text-slate-600 mb-1">Rol</p>
            <p className="text-white font-medium capitalize flex items-center gap-1.5">
              {isAdmin && <Shield className="w-3 h-3 text-blue-400" />}
              {user?.rol || "—"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}