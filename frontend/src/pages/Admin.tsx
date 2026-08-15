import { useState } from "react";
import {
  useListarUsuarios,
  useListarActivos,
  useListarInactivos,
  useActivarUsuario,
  useDesactivarUsuario,
} from "@/hooks";
import { Button } from "@/components/ui/Button";
import {
  Users,
  UserCheck,
  UserX,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

type Tab = "todos" | "activos" | "inactivos";

export default function Admin() {
  const [tab, setTab] = useState<Tab>("todos");

  const todos = useListarUsuarios();
  const activos = useListarActivos();
  const inactivos = useListarInactivos();

  const activar = useActivarUsuario();
  const desactivar = useDesactivarUsuario();

  const current = tab === "todos" ? todos : tab === "activos" ? activos : inactivos;
  const data = current.data || [];
  const isLoading = current.isLoading;
  const isError = current.isError;
  const error = current.error;

  const stats = {
    total: todos.data?.length || 0,
    activos: activos.data?.length || 0,
    inactivos: inactivos.data?.length || 0,
  };

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "todos", label: "Todos", count: stats.total },
    { key: "activos", label: "Activos", count: stats.activos },
    { key: "inactivos", label: "Inactivos", count: stats.inactivos },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-slate-700 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-start gap-2 rounded-lg bg-red-500/10 border border-red-500/20 p-4">
        <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
        <p className="text-sm text-red-300">{(error as Error)?.message || "Error al cargar usuarios"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Usuarios</h1>
        <p className="text-slate-500 text-sm">Gestión de cuentas registradas en la plataforma.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-blue-400" />
            <p className="text-xs text-slate-500 font-medium uppercase">Total</p>
          </div>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
          <div className="flex items-center gap-2 mb-2">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <p className="text-xs text-slate-500 font-medium uppercase">Activos</p>
          </div>
          <p className="text-2xl font-bold text-white">{stats.activos}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
          <div className="flex items-center gap-2 mb-2">
            <UserX className="w-4 h-4 text-red-400" />
            <p className="text-xs text-slate-500 font-medium uppercase">Inactivos</p>
          </div>
          <p className="text-2xl font-bold text-white">{stats.inactivos}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-800">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === t.key
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
          >
            {t.label}
            <span
              className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                tab === t.key ? "bg-blue-500/10 text-blue-400" : "bg-slate-800 text-slate-500"
              }`}
            >
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Tabla */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-900/50">
              <tr>
                <th className="px-6 py-3 font-medium">Usuario</th>
                <th className="px-6 py-3 font-medium">Correo</th>
                <th className="px-6 py-3 font-medium">Teléfono</th>
                <th className="px-6 py-3 font-medium">Rol</th>
                <th className="px-6 py-3 font-medium">Saldo</th>
                <th className="px-6 py-3 font-medium">Estado</th>
                <th className="px-6 py-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500 text-sm">
                    No hay usuarios en esta categoría.
                  </td>
                </tr>
              ) : (
                data.map((usuario) => (
                  <tr key={usuario.id || usuario.identificador} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-white text-xs font-bold">
                          {usuario.nombre.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-white">
                            {usuario.nombre} {usuario.apellido || ""}
                          </p>
                          <p className="text-xs text-slate-500">@{usuario.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400">{usuario.correo}</td>
                    <td className="px-6 py-4 text-slate-400">{usuario.telefono || "—"}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 capitalize">
                        {usuario.rol}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-emerald-400">
                      ${usuario.saldo?.toLocaleString() || "0"}
                    </td>
                    <td className="px-6 py-4">
                      {usuario.activo ? (
                        <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs text-red-400">
                          <XCircle className="w-3.5 h-3.5" />
                          Inactivo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {usuario.activo ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => desactivar.mutate(usuario.id)}
                          disabled={desactivar.isPending}
                        >
                          <XCircle className="w-4 h-4 text-red-400" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => activar.mutate(usuario.id)}
                          disabled={activar.isPending}
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}