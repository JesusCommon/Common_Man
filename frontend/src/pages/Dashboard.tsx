import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store";
import { usePerfil } from "@/hooks";
import { useEffect } from "react";
import { ExternalLink, Shield, Users, Store } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.rol === "admin";
  const { data: perfil, isLoading } = usePerfil();
  const saldo = perfil?.saldo ?? user?.saldo ?? 0;

  useEffect(() => {
    if (isAdmin) {
      navigate("/admin", { replace: true });
    }
  }, [isAdmin, navigate]);

  if (isLoading && !user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#E4E4E1] border-t-[#18181B] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-[300px_1fr] gap-6">
      <aside className="space-y-4">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white rounded-2xl border border-[#E4E4E1] p-5 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-xl bg-linear-to-br from-[#2563EB] to-[#1D4ED8] flex items-center justify-center text-xl font-bold text-white shrink-0">
              {user?.nombre?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-[#18181B] truncate">
                {user?.nombre || "Usuario"}
              </h3>
              <p className="text-xs text-[#A1A19A] truncate">@{user?.username}</p>
            </div>
          </div>

          <div className="space-y-2.5 text-sm">
            <div className="flex items-center justify-between py-1.5 border-b border-[#F4F4F5]">
              <span className="text-[#A1A19A]">Correo</span>
              <span className="text-[#18181B] font-medium truncate ml-2 text-xs">{user?.correo}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-[#F4F4F5]">
              <span className="text-[#A1A19A]">Rol</span>
              <span className="text-[#18181B] font-medium capitalize flex items-center gap-1 text-xs">
                {isAdmin && <Shield className="w-3 h-3 text-[#2563EB]" />}
                {user?.rol || "—"}
              </span>
            </div>
            {!isAdmin && (
              <div className="flex items-center justify-between py-1.5">
                <span className="text-[#A1A19A]">Saldo</span>
                <span className="text-emerald-600 font-bold text-xs">
                  ${saldo.toLocaleString()}
                </span>
              </div>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full mt-4 bg-[#FAFAF8] text-[#18181B] border-[#E4E4E1] hover:bg-[#F4F4F5] text-xs"
            onClick={() => navigate(`/perfil/${user?.username}`)}
          >
            <ExternalLink className="w-3.5 h-3.5 mr-2" />
            Ver perfil público
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white rounded-2xl border border-[#E4E4E1] p-5 shadow-sm"
        >
          <h4 className="text-xs font-semibold text-[#A1A19A] uppercase tracking-wider mb-3">
            Resumen
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-[#EFF4FE] border border-[#BFDBFE]">
              <Users className="w-4 h-4 text-[#2563EB] mb-1" />
              <p className="text-lg font-bold text-[#18181B]">—</p>
              <p className="text-[10px] text-[#52525B]">Seguidores</p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/tienda")}
              className="p-3 rounded-xl bg-[#2563EB] border border-[#1D4ED8] hover:bg-[#1D4ED8] transition-colors text-left"
            >
              <Store className="w-4 h-4 text-white mb-1" />
              <p className="text-sm font-bold text-white">Ir a la Tienda</p>
              <p className="text-[10px] text-blue-100">Explorar productos</p>
            </button>
          </div>
        </motion.div>
      </aside>

      <main className="min-w-0">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white rounded-2xl border border-[#E4E4E1] p-8 shadow-sm"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-[#18181B] tracking-tight mb-2">
            Hola, {user?.nombre || "Usuario"}
          </h1>
          <p className="text-sm text-[#52525B] max-w-md">
            Este es tu centro de control. Usa la barra de navegación superior para explorar las diferentes secciones.
          </p>
        </motion.div>
      </main>
    </div>
  );
}