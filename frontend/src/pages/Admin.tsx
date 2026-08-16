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
  Copy,
  X,
  Calendar,
  Mail,
  Phone,
  Wallet,
  Shield,
  Fingerprint,
} from "lucide-react";
import type { UsuarioAdminResponse } from "@/api/types";

type Tab = "todos" | "activos" | "inactivos";

export default function Admin() {
  const [tab, setTab] = useState<Tab>("todos");
  const [selectedUser, setSelectedUser] = useState<UsuarioAdminResponse | null>(null);
  const [copied, setCopied] = useState(false);

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

  const tabs = [
    { key: "todos" as Tab, label: "Todos", count: stats.total },
    { key: "activos" as Tab, label: "Activos", count: stats.activos },
    { key: "inactivos" as Tab, label: "Inactivos", count: stats.inactivos },
  ];

  const handleCopyId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = id;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyUUID = async (uuid: string) => {
    try {
      await navigator.clipboard.writeText(uuid);
    } catch {
      // Silencioso
    }
  };

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
                  <tr
                    key={usuario.id || usuario.identificador}
                    className="hover:bg-slate-800/20 transition-colors cursor-pointer"
                    onClick={() => setSelectedUser(usuario)}
                  >
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
                      <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
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
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de detalle */}
      {selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-0 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-800 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                  {selectedUser.nombre.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">
                    {selectedUser.nombre} {selectedUser.apellido || ""}
                  </h2>
                  <p className="text-sm text-slate-500">@{selectedUser.username}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-2 rounded-lg hover:bg-slate-800 text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-4">
              {/* ID copiable */}
              <div className="rounded-lg bg-slate-950 border border-slate-800 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-medium flex items-center gap-1.5">
                    <Fingerprint className="w-3.5 h-3.5" />
                    ID MongoDB
                  </span>
                  <button
                    onClick={() => handleCopyId(selectedUser.id)}
                    className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copied ? "¡Copiado!" : "Copiar"}
                  </button>
                </div>
                <code className="text-sm text-slate-300 font-mono break-all">{selectedUser.id}</code>
              </div>

              {/* UUID */}
              <div className="rounded-lg bg-slate-950 border border-slate-800 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-medium flex items-center gap-1.5">
                    <Fingerprint className="w-3.5 h-3.5" />
                    Identificador UUID
                  </span>
                  <button
                    onClick={() => handleCopyUUID(selectedUser.identificador)}
                    className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Copiar
                  </button>
                </div>
                <code className="text-sm text-slate-300 font-mono break-all">{selectedUser.identificador}</code>
              </div>

              {/* Grid de datos */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-slate-950 border border-slate-800 p-3">
                  <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                    <Mail className="w-3 h-3" /> Correo
                  </p>
                  <p className="text-sm text-white font-medium">{selectedUser.correo}</p>
                </div>
                <div className="rounded-lg bg-slate-950 border border-slate-800 p-3">
                  <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                    <Phone className="w-3 h-3" /> Teléfono
                  </p>
                  <p className="text-sm text-white font-medium">{selectedUser.telefono || "—"}</p>
                </div>
                <div className="rounded-lg bg-slate-950 border border-slate-800 p-3">
                  <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                    <Wallet className="w-3 h-3" /> Saldo
                  </p>
                  <p className="text-sm text-emerald-400 font-bold">${selectedUser.saldo?.toLocaleString() || "0"}</p>
                </div>
                <div className="rounded-lg bg-slate-950 border border-slate-800 p-3">
                  <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                    <Shield className="w-3 h-3" /> Rol
                  </p>
                  <p className="text-sm text-white font-medium capitalize">{selectedUser.rol}</p>
                </div>
              </div>

              {/* Bio */}
              {selectedUser.bio && (
                <div className="rounded-lg bg-slate-950 border border-slate-800 p-3">
                  <p className="text-xs text-slate-500 mb-1">Bio</p>
                  <p className="text-sm text-slate-300">{selectedUser.bio}</p>
                </div>
              )}

              {/* Fechas */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-slate-950 border border-slate-800 p-3">
                  <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Creado
                  </p>
                  <p className="text-sm text-slate-300">
                    {new Date(selectedUser.fecha_creacion).toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-950 border border-slate-800 p-3">
                  <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Actualizado
                  </p>
                  <p className="text-sm text-slate-300">
                    {new Date(selectedUser.fecha_actualizacion).toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              {/* Estado */}
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                    selectedUser.activo
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-red-500/10 text-red-400 border border-red-500/20"
                  }`}
                >
                  {selectedUser.activo ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  {selectedUser.activo ? "Cuenta activa" : "Cuenta inactiva"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}