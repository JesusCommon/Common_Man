import { useState } from "react";
import {
  useListarTodosLosEnviosAdmin,
  useListarEnviosPorEstadoAdmin,
} from "@/hooks";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { Select } from "@/components/ui/Select";
import { DataTable } from "@/components/ui/DataTable";
import type { Column } from "@/components/ui/DataTable";
import { Pagination } from "@/components/ui/Pagination";
import { EnvioDetalleModal } from "@/components/envios/EnvioDetalleModal";
import { CrearEnvioModal } from "@/components/envios/crearEnvioModal";
import { Truck, Plus, Eye } from "lucide-react";
import { ESTADOS_ENVIO, getEstadoEnvioConfig, formatFecha } from "@/lib/estadosEnvio";
import type { EnvioAdminResponse, EstadoEnvioEnum } from "@/api/types";

const PAGE_SIZE = 20;

export default function AdminEnvios() {
  const [filtro, setFiltro] = useState<"" | EstadoEnvioEnum>("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<EnvioAdminResponse | null>(null);
  const [crearOpen, setCrearOpen] = useState(false);

  const params = { skip: (page - 1) * PAGE_SIZE, limit: PAGE_SIZE };
  const todos = useListarTodosLosEnviosAdmin(params);
  const porEstado = useListarEnviosPorEstadoAdmin(filtro || "pendiente", params);

  const current = filtro ? porEstado : todos;

  const columns: Column<EnvioAdminResponse>[] = [
    {
      header: "Envío",
      render: (e) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
            <Truck className="w-4 h-4 text-gray-500" />
          </div>
          <div className="min-w-0">
            <p className="font-mono text-sm text-gray-900">{e.id.slice(0, 10)}...</p>
            <p className="text-xs text-gray-500 truncate">Compra: {e.compra_id.slice(0, 8)}...</p>
          </div>
        </div>
      ),
    },
    {
      header: "Estado",
      render: (e) => {
        const config = getEstadoEnvioConfig(e.estado);
        return (
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${config.badgeClass}`}>
            {config.label}
          </span>
        );
      },
    },
    {
      header: "Transportadora",
      render: (e) => <span className="text-sm text-gray-600">{e.transportadora || "—"}</span>,
    },
    {
      header: "Seguimiento",
      render: (e) => (
        <span className="font-mono text-xs text-gray-600">{e.numero_seguimiento || "—"}</span>
      ),
    },
    {
      header: "Creado",
      render: (e) => <span className="text-sm text-gray-500">{formatFecha(e.fecha_creacion)}</span>,
    },
    {
      header: "Acciones",
      headerClassName: "text-right",
      cellClassName: "text-right",
      render: (e) => (
        <div className="flex justify-end" onClick={(ev) => ev.stopPropagation()}>
          <Button variant="ghost" size="sm" onClick={() => setSelected(e)} title="Ver detalle">
            <Eye className="w-4 h-4 text-gray-600" />
          </Button>
        </div>
      ),
    },
  ];

  if (current.isLoading) return <Spinner />;
  if (current.isError) return <ErrorAlert error={current.error} fallback="Error al cargar envíos" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Gestión de Envíos</h1>
          <p className="text-gray-500 text-sm">Administra estados y tracking de los envíos.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-48">
            <Select
              value={filtro}
              onChange={(v) => {
                setFiltro(v as "" | EstadoEnvioEnum);
                setPage(1);
              }}
              options={ESTADOS_ENVIO.map((e) => ({ value: e.value, label: e.label }))}
              placeholder="Todos los estados"
            />
          </div>
          <Button variant="primary" onClick={() => setCrearOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Crear Envío
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={current.data?.items ?? []}
        getRowKey={(e) => e.id}
        onRowClick={setSelected}
        emptyMessage="No hay envíos en esta vista."
      />

      <Pagination
        page={page}
        total={current.data?.total ?? 0}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />

      {selected && (
        <EnvioDetalleModal
          key={selected.id}
          envio={selected}
          isAdmin
          onClose={() => setSelected(null)}
        />
      )}

      {crearOpen && <CrearEnvioModal onClose={() => setCrearOpen(false)} />}
    </div>
  );
}