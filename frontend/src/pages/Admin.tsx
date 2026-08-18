import { useState } from "react";
import {
  useListarUsuarios,
  useListarActivos,
  useListarInactivos,
  useActivarUsuario,
  useDesactivarUsuario,
} from "@/hooks";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { StatCard } from "@/components/ui/StatCard";
import { Tabs } from "@/components/ui/Tabs";
import type { TabItem } from "@/components/ui/Tabs";
import { DataTable } from "@/components/ui/DataTable";
import type { Column } from "@/components/ui/DataTable";
import { Pagination } from "@/components/ui/Pagination";
import { Avatar } from "@/components/ui/Avatar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { UsuarioDetalleModal } from "@/components/usuarios/UsuarioDetalleModal";
import { Users, UserCheck, UserX, CheckCircle2, XCircle } from "lucide-react";
import type { UsuarioAdminResponse } from "@/api/types";

type Tab = "todos" | "activos" | "inactivos";
const PAGE_SIZE = 20;

export default function Admin() {
  const [tab, setTab] = useState<Tab>("todos");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<UsuarioAdminResponse | null>(null);

  const params = { skip: (page - 1) * PAGE_SIZE, limit: PAGE_SIZE };
  const todos = useListarUsuarios(params);
  const activos = useListarActivos(params);
  const inactivos = useListarInactivos(params);

  const activar = useActivarUsuario();
  const desactivar = useDesactivarUsuario();

  const current = tab === "todos" ? todos : tab === "activos" ? activos : inactivos;

  const tabs: TabItem<Tab>[] = [
    { key: "todos", label: "Todos", count: todos.data?.total ?? 0 },
    { key: "activos", label: "Activos", count: activos.data?.total ?? 0 },
    { key: "inactivos", label: "Inactivos", count: inactivos.data?.total ?? 0 },
  ];

  const handleTabChange = (key: Tab) => {
    setTab(key);
    setPage(1);
  };

  const columns: Column<UsuarioAdminResponse>[] = [
    {
      header: "Usuario",
      render: (u) => (
        <div className="flex items-center gap-3">
          <Avatar name={u.nombre} />
          <div>
            <p className="font-medium text-white">
              {u.nombre} {u.apellido || ""}
            </p>
            <p className="text-xs text-slate-500">@{u.username}</p>
          </div>
        </div>
      ),
    },
    { header: "Correo", render: (u) => <span className="text-slate-400">{u.correo}</span> },
    { header: "Teléfono", render: (u) => <span className="text-slate-400">{u.telefono || "—"}</span> },
    {
      header: "Rol",
      render: (u) => (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 capitalize">
          {u.rol}
        </span>
      ),
    },
    {
      header: "Saldo",
      render: (u) => (
        <span className="font-medium text-emerald-400">${u.saldo?.toLocaleString() || "0"}</span>
      ),
    },
    { header: "Estado", render: (u) => <StatusBadge active={u.activo} /> },
    {
      header: "Acciones",
      headerClassName: "text-right",
      cellClassName: "text-right",
      render: (u) => (
        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
          {u.activo ? (
            <Button variant="ghost" size="sm" onClick={() => desactivar.mutate(u.id)} disabled={desactivar.isPending}>
              <XCircle className="w-4 h-4 text-red-400" />
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => activar.mutate(u.id)} disabled={activar.isPending}>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  if (current.isLoading) return <Spinner />;
  if (current.isError) return <ErrorAlert error={current.error} fallback="Error al cargar usuarios" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Usuarios</h1>
        <p className="text-slate-500 text-sm">Gestión de cuentas registradas en la plataforma.</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard icon={Users} label="Total" value={todos.data?.total ?? 0} iconClassName="text-blue-400" />
        <StatCard icon={UserCheck} label="Activos" value={activos.data?.total ?? 0} iconClassName="text-emerald-400" />
        <StatCard icon={UserX} label="Inactivos" value={inactivos.data?.total ?? 0} iconClassName="text-red-400" />
      </div>

      <Tabs tabs={tabs} active={tab} onChange={handleTabChange} />

      <DataTable
        columns={columns}
        data={current.data?.items ?? []}
        getRowKey={(u) => u.id || u.identificador}
        onRowClick={setSelectedUser}
        emptyMessage="No hay usuarios en esta categoría."
      />

      <Pagination
        page={page}
        total={current.data?.total ?? 0}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />

      {selectedUser && (
        <UsuarioDetalleModal usuario={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  );
}