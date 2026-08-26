import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useListarTodosProductosAdmin,
  useListarProductosActivosAdmin,
  useListarProductosInactivosAdmin,
  useActivarProducto,
  useDesactivarProducto,
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
import { Package, PackageCheck, PackageX, Pencil, Power } from "lucide-react";
import type { ProductoAdminResponse } from "@/api/types";

type Tab = "todos" | "activos" | "inactivos";
const PAGE_SIZE = 20;

export default function AdminProductos() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("todos");
  const [page, setPage] = useState(1);

  const params = { skip: (page - 1) * PAGE_SIZE, limit: PAGE_SIZE };
  const todos = useListarTodosProductosAdmin(params);
  const activos = useListarProductosActivosAdmin(params);
  const inactivos = useListarProductosInactivosAdmin(params);

  const activar = useActivarProducto();
  const desactivar = useDesactivarProducto();

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

  const columns: Column<ProductoAdminResponse>[] = [
    {
      header: "Producto",
      render: (p) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center overflow-hidden shrink-0">
            {p.imagen ? (
              <img src={p.imagen} alt={p.nombre} className="w-full h-full object-cover" />
            ) : (
              <Package className="w-5 h-5 text-slate-500" />
            )}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-white truncate">{p.nombre}</p>
            <p className="text-xs text-slate-500 truncate">{p.slug}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Precio",
      render: (p) => <span className="font-medium text-emerald-400">${p.precio.toLocaleString()}</span>,
    },
    {
      header: "Stock",
      render: (p) => (
        <span className={`text-sm ${p.stock > 10 ? "text-slate-300" : p.stock > 0 ? "text-amber-400" : "text-red-400"}`}>
          {p.stock} uds.
        </span>
      ),
    },
    { header: "Estado", render: (p) => <StatusBadge active={p.activo} /> },
    {
      header: "Acciones",
      headerClassName: "text-right",
      cellClassName: "text-right",
      render: (p) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/admin/productos/editar/${p.id}`)}
            title="Editar"
          >
            <Pencil className="w-4 h-4 text-blue-400" />
          </Button>
          {p.activo ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => desactivar.mutate(p.id)}
              disabled={desactivar.isPending}
              title="Desactivar"
            >
              <Power className="w-4 h-4 text-red-400" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => activar.mutate(p.id)}
              disabled={activar.isPending}
              title="Activar"
            >
              <Power className="w-4 h-4 text-emerald-400" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  if (current.isLoading) return <Spinner />;
  if (current.isError) return <ErrorAlert error={current.error} fallback="Error al cargar productos" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Productos</h1>
        <p className="text-slate-500 text-sm">Gestión del catálogo de productos de la tienda.</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard icon={Package} label="Total" value={todos.data?.total ?? 0} iconClassName="text-blue-400" />
        <StatCard icon={PackageCheck} label="Activos" value={activos.data?.total ?? 0} iconClassName="text-emerald-400" />
        <StatCard icon={PackageX} label="Inactivos" value={inactivos.data?.total ?? 0} iconClassName="text-red-400" />
      </div>

      <Tabs tabs={tabs} active={tab} onChange={handleTabChange} />

      <DataTable
        columns={columns}
        data={current.data?.items ?? []}
        getRowKey={(p) => p.id}
        emptyMessage="No hay productos en esta categoría."
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