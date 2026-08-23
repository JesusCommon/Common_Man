// src/pages/admin/AdminDashboard.tsx
import { useNavigate } from "react-router-dom";
import { useListarUsuarios, useListarActivos, useListarInactivos } from "@/hooks";
import { useListarTodasLasCategorias, useListarCategoriasActivas, useListarCategoriasInactivas } from "@/hooks";
import { Users, UserCheck, UserX, Folder, FolderCheck, FolderX } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const { data: usuarios } = useListarUsuarios({ skip: 0, limit: 1 });
  const { data: activos } = useListarActivos({ skip: 0, limit: 1 });
  const { data: inactivos } = useListarInactivos({ skip: 0, limit: 1 });
  const { data: categorias } = useListarTodasLasCategorias({ skip: 0, limit: 1 });
  const { data: categoriasActivas } = useListarCategoriasActivas({ skip: 0, limit: 1 });
  const { data: categoriasInactivas } = useListarCategoriasInactivas({ skip: 0, limit: 1 });

  const stats = [
    {
      title: "Total Usuarios",
      value: usuarios?.total ?? 0,
      icon: Users,
      color: "blue",
      onClick: () => navigate("/admin/usuarios"),
    },
    {
      title: "Usuarios Activos",
      value: activos?.total ?? 0,
      icon: UserCheck,
      color: "emerald",
      onClick: () => navigate("/admin/usuarios"),
    },
    {
      title: "Usuarios Inactivos",
      value: inactivos?.total ?? 0,
      icon: UserX,
      color: "red",
      onClick: () => navigate("/admin/usuarios"),
    },
    {
      title: "Total Categorías",
      value: categorias?.total ?? 0,
      icon: Folder,
      color: "purple",
      onClick: () => navigate("/admin/categoriasProductos"),
    },
    {
      title: "Categorías Activas",
      value: categoriasActivas?.total ?? 0,
      icon: FolderCheck,
      color: "indigo",
      onClick: () => navigate("/admin/categoriasProductos"),
    },
    {
      title: "Categorías Inactivas",
      value: categoriasInactivas?.total ?? 0,
      icon: FolderX,
      color: "amber",
      onClick: () => navigate("/admin/categoriasProductos"),
    },
  ];

  const colorMap = {
    blue: "text-blue-400",
    emerald: "text-emerald-400",
    red: "text-red-400",
    purple: "text-purple-400",
    indigo: "text-indigo-400",
    amber: "text-amber-400",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-slate-500">Bienvenido al panel de administración de Common Man</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={stat.onClick}
            className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 cursor-pointer hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg bg-slate-800/50 flex items-center justify-center ${colorMap[stat.color as keyof typeof colorMap]}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <p className="text-sm text-slate-500 mb-1">{stat.title}</p>
            <p className="text-2xl font-bold text-white">
              {stat.value.toLocaleString()}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => navigate("/admin/usuarios")}
            className="flex items-center gap-3 p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors text-left"
          >
            <Users className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-sm font-medium text-white">Gestionar Usuarios</p>
              <p className="text-xs text-slate-500">Ver y administrar cuentas</p>
            </div>
          </button>

          <button
            onClick={() => navigate("/admin/categoriasProductos")}
            className="flex items-center gap-3 p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors text-left"
          >
            <Folder className="w-5 h-5 text-purple-400" />
            <div>
              <p className="text-sm font-medium text-white">Gestionar Categorías</p>
              <p className="text-xs text-slate-500">Organizar productos</p>
            </div>
          </button>

          <button
            onClick={() => navigate("/admin/buscar")}
            className="flex items-center gap-3 p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors text-left"
          >
            <Users className="w-5 h-5 text-amber-400" />
            <div>
              <p className="text-sm font-medium text-white">Buscar por ID</p>
              <p className="text-xs text-slate-500">Búsqueda avanzada</p>
            </div>
          </button>

          <button
            onClick={() => navigate("/admin/recargas")}
            className="flex items-center gap-3 p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors text-left"
          >
            <Users className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="text-sm font-medium text-white">Recargas</p>
              <p className="text-xs text-slate-500">Gestionar saldos</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}