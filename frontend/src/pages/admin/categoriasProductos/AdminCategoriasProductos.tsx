import { useState } from "react";
import {
  useListarTodasLasCategorias,
  useListarCategoriasActivas,
  useListarCategoriasInactivas,
  useActivarCategoria,
  useDesactivarCategoria,
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
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Folder, FolderCheck, FolderX, CheckCircle2, XCircle } from "lucide-react";
import type { CategoriaResponse } from "@/api/types";

type Tab = "todas" | "activas" | "inactivas";
const PAGE_SIZE = 20;

export default function CategoriasProductos() {
  const [tab, setTab] = useState<Tab>("todas");
  const [page, setPage] = useState(1);

  const params = { skip: (page - 1) * PAGE_SIZE, limit: PAGE_SIZE };
  const todas = useListarTodasLasCategorias(params);
  const activas = useListarCategoriasActivas(params);
  const inactivas = useListarCategoriasInactivas(params);

  const activar = useActivarCategoria();
  const desactivar = useDesactivarCategoria();

  const current = tab === "todas" ? todas : tab === "activas" ? activas : inactivas;

  const tabs: TabItem<Tab>[] = [
    { key: "todas", label: "Todas", count: todas.data?.total ?? 0 },
    { key: "activas", label: "Activas", count: activas.data?.total ?? 0 },
    { key: "inactivas", label: "Inactivas", count: inactivas.data?.total ?? 0 },
  ];

  const handleTabChange = (key: Tab) => {
    setTab(key);
    setPage(1);
  };

  const columns: Column<CategoriaResponse>[] = [
    {
      header: "Nombre",
      render: (c) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
            <Folder className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="font-medium text-white">{c.nombre}</p>
            {c.descripcion && (
              <p className="text-xs text-slate-500 truncate max-w-xs">{c.descripcion}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      header: "Descripción",
      render: (c) => (
        <span className="text-slate-400 text-sm">{c.descripcion || "—"}</span>
      ),
    },
    {
      header: "Estado",
      render: (c) => <StatusBadge active={c.activo} />,
    },
    {
      header: "Fecha de creación",
      render: (c) => (
        <span className="text-slate-400 text-sm">
          {new Date(c.fecha_creacion).toLocaleDateString("es-ES")}
        </span>
      ),
    },
    {
      header: "Acciones",
      headerClassName: "text-right",
      cellClassName: "text-right",
      render: (c) => (
        <div className="flex items-center justify-end gap-2">
          {c.activo ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => desactivar.mutate(c.id)}
              disabled={desactivar.isPending}
            >
              <XCircle className="w-4 h-4 text-red-400" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => activar.mutate(c.id)}
              disabled={activar.isPending}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  if (current.isLoading) return <Spinner />;
  if (current.isError) return <ErrorAlert error={current.error} fallback="Error al cargar categorías" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Categorías</h1>
        <p className="text-slate-500 text-sm">Gestión de categorías de productos.</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard icon={Folder} label="Total" value={todas.data?.total ?? 0} iconClassName="text-blue-400" />
        <StatCard icon={FolderCheck} label="Activas" value={activas.data?.total ?? 0} iconClassName="text-emerald-400" />
        <StatCard icon={FolderX} label="Inactivas" value={inactivas.data?.total ?? 0} iconClassName="text-red-400" />
      </div>

      <Tabs tabs={tabs} active={tab} onChange={handleTabChange} />

      <DataTable
        columns={columns}
        data={current.data?.items ?? []}
        getRowKey={(c) => c.id}
        emptyMessage="No hay categorías en esta categoría."
      />

      <Pagination
        page={page}
        total={current.data?.total ?? 0}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />
    </div>
  );
}