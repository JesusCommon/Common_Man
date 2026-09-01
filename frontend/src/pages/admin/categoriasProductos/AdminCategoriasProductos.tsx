import { useState } from "react";
import { Folder, CheckCircle2, XCircle } from "lucide-react";
import {
  useListarTodasLasCategorias,
  useListarCategoriasActivas,
  useListarCategoriasInactivas,
} from "@/hooks";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { StatCard } from "@/components/ui/StatCard";
import { Tabs } from "@/components/ui/Tabs";
import type { TabItem } from "@/components/ui/Tabs";
import { DataTable } from "@/components/ui/DataTable";
import type { Column } from "@/components/ui/DataTable";
import { Pagination } from "@/components/ui/Pagination";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CategoriaDetalleModal } from "@/components/categorias/CategoriaDetalleModal";
import type { CategoriaResponse } from "@/api/types";

type Tab = "todas" | "activas" | "inactivas";
const PAGE_SIZE = 10;

export default function AdminCategorias() {
  const [tab, setTab] = useState<Tab>("todas");
  const [page, setPage] = useState(1);
  const [selectedCategoria, setSelectedCategoria] = useState<CategoriaResponse | null>(null);

  const params = { skip: (page - 1) * PAGE_SIZE, limit: PAGE_SIZE };
  const todas = useListarTodasLasCategorias(params);
  const activas = useListarCategoriasActivas(params);
  const inactivas = useListarCategoriasInactivas(params);

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
        <div className="flex items-center gap-2">
          <Folder className="w-4 h-4 text-gray-400" />
          <span className="font-medium text-gray-900">{c.nombre}</span>
        </div>
      ),
    },
    {
      header: "Descripción",
      render: (c) => <span className="text-gray-600">{c.descripcion || "Sin descripción"}</span>,
    },
    {
      header: "Estado",
      render: (c) => <StatusBadge active={c.activo} />,
    },
    {
      header: "Acciones",
      headerClassName: "text-right",
      cellClassName: "text-right",
      render: (c) => (
        <div className="flex items-center justify-end" onClick={(e) => e.stopPropagation()}>
          <Button variant="outline" size="sm" onClick={() => setSelectedCategoria(c)}>
            Editar
          </Button>
        </div>
      ),
    },
  ];

  if (current.isLoading) return <Spinner />;
  if (current.isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
        Error al cargar categorías
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Categorías</h1>
        <p className="text-gray-500 text-sm">Gestión de categorías de productos.</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
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