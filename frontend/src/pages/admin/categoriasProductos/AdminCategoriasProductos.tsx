import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { CategoriaDetalleModal } from "@/components/categorias/CategoriaDetalleModal";
import { Folder, CheckCircle2, XCircle, Plus, Pencil } from "lucide-react";
import type { CategoriaResponse } from "@/api/types";

type Tab = "todas" | "activas" | "inactivas";
const PAGE_SIZE = 20;

export default function AdminCategoriasProductos() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("todas");
  const [page, setPage] = useState(1);
  const [selectedCategoria, setSelectedCategoria] = useState<CategoriaResponse | null>(null);

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
      header: "Categoría",
      render: (c) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
            <Folder className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{c.nombre}</p>
            <p className="text-xs text-gray-500">ID: {c.id.slice(0, 8)}...</p>
          </div>
        </div>
      ),
    },
    {
      header: "Descripción",
      render: (c) => (
        <span className="text-gray-600 text-sm line-clamp-1">
          {c.descripcion || "Sin descripción"}
        </span>
      ),
    },
    { header: "Estado", render: (c) => <StatusBadge active={c.activo} /> },
    {
      header: "Acciones",
      headerClassName: "text-right",
      cellClassName: "text-right",
      render: (c) => (
        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/admin/categoriasProductos/editar/${c.id}`)}
            title="Editar"
          >
            <Pencil className="w-4 h-4 text-gray-600" />
          </Button>
          {c.activo ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => desactivar.mutate(c.id)}
              disabled={desactivar.isPending}
              title="Desactivar"
            >
              <XCircle className="w-4 h-4 text-red-500" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => activar.mutate(c.id)}
              disabled={activar.isPending}
              title="Activar"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Categorías</h1>
          <p className="text-gray-500 text-sm">Gestión de categorías de productos.</p>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate("/admin/categoriasProductos/nueva")}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Categoría
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={Folder} label="Total" value={todas.data?.total ?? 0} iconClassName="text-blue-600" />
        <StatCard icon={CheckCircle2} label="Activas" value={activas.data?.total ?? 0} iconClassName="text-emerald-600" />
        <StatCard icon={XCircle} label="Inactivas" value={inactivas.data?.total ?? 0} iconClassName="text-red-600" />
      </div>

      <Tabs tabs={tabs} active={tab} onChange={handleTabChange} />

      <DataTable
        columns={columns}
        data={current.data?.items ?? []}
        getRowKey={(c) => c.id}
        onRowClick={setSelectedCategoria}
        emptyMessage="No hay categorías en esta vista."
      />

      <Pagination
        page={page}
        total={current.data?.total ?? 0}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />

      {selectedCategoria && (
        <CategoriaDetalleModal
          categoria={selectedCategoria}
          onClose={() => setSelectedCategoria(null)}
        />
      )}
    </div>
  );
}