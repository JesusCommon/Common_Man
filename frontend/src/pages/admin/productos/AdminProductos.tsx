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
import { ProductoDetalleModal } from "@/components/productos/ProductoDetalleModal";
import {
  Package,
  CheckCircle2,
  XCircle,
  Plus,
  Pencil,
} from "lucide-react";
import type { ProductoAdminResponse } from "@/api/types";

type Tab = "todos" | "activos" | "inactivos";
const PAGE_SIZE = 20;

export default function AdminProductos() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("todos");
  const [page, setPage] = useState(1);
  const [selectedProducto, setSelectedProducto] =
    useState<ProductoAdminResponse | null>(null);

  const params = { skip: (page - 1) * PAGE_SIZE, limit: PAGE_SIZE };
  const todos = useListarTodosProductosAdmin(params);
  const activos = useListarProductosActivosAdmin(params);
  const inactivos = useListarProductosInactivosAdmin(params);

  const activar = useActivarProducto();
  const desactivar = useDesactivarProducto();

  const current =
    tab === "todos" ? todos : tab === "activos" ? activos : inactivos;

  const tabs: TabItem<Tab>[] = [
    { key: "todos", label: "Todos", count: todos.data?.total ?? 0 },
    { key: "activos", label: "Activos", count: activos.data?.total ?? 0 },
    { key: "inactivos", label: "Inactivos", count: inactivos.data?.total ?? 0 },
  ];

  const handleTabChange = (key: Tab) => {
    setTab(key);
    setPage(1);
  };

  const formatPrecio = (precio: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(precio);

  const columns: Column<ProductoAdminResponse>[] = [
    {
      header: "Producto",
      render: (p) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
            {p.imagen ? (
              <img
                src={p.imagen}
                alt={p.nombre}
                className="w-full h-full object-cover"
              />
            ) : (
              <Package className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-gray-900 truncate">{p.nombre}</p>
            <p className="text-xs text-gray-500 truncate">{p.slug}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Precio",
      render: (p) => (
        <span className="font-medium text-emerald-600">
          {formatPrecio(p.precio)}
        </span>
      ),
    },
    {
      header: "Stock",
      render: (p) => (
        <span
          className={`text-sm font-medium ${
            p.stock > 10
              ? "text-gray-700"
              : p.stock > 0
              ? "text-amber-600"
              : "text-red-600"
          }`}
        >
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
        <div
          className="flex items-center justify-end gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/admin/productos/editar/${p.id}`)}
            title="Editar"
          >
            <Pencil className="w-4 h-4 text-gray-600" />
          </Button>
          {p.activo ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => desactivar.mutate(p.id)}
              disabled={desactivar.isPending}
              title="Desactivar"
            >
              <XCircle className="w-4 h-4 text-red-500" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => activar.mutate(p.id)}
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
  if (current.isError)
    return (
      <ErrorAlert error={current.error} fallback="Error al cargar productos" />
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Productos</h1>
          <p className="text-gray-500 text-sm">
            Gestión del catálogo de productos de la tienda.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate("/admin/productos/nuevo")}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Producto
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={Package}
          label="Total"
          value={todos.data?.total ?? 0}
          iconClassName="text-blue-600"
        />
        <StatCard
          icon={CheckCircle2}
          label="Activos"
          value={activos.data?.total ?? 0}
          iconClassName="text-emerald-600"
        />
        <StatCard
          icon={XCircle}
          label="Inactivos"
          value={inactivos.data?.total ?? 0}
          iconClassName="text-red-600"
        />
      </div>

      <Tabs tabs={tabs} active={tab} onChange={handleTabChange} />

      <DataTable
        columns={columns}
        data={current.data?.items ?? []}
        getRowKey={(p) => p.id}
        onRowClick={setSelectedProducto}
        emptyMessage="No hay productos en esta vista."
      />

      <Pagination
        page={page}
        total={current.data?.total ?? 0}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />

      {selectedProducto && (
        <ProductoDetalleModal
          producto={selectedProducto}
          onClose={() => setSelectedProducto(null)}
        />
      )}
    </div>
  );
}