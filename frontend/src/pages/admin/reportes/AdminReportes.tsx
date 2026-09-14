import { useState } from "react";
import {
  useListarTodosReportesAdmin,
  useListarReportesPorEstadoAdmin,
  useEliminarReporteAdmin,
} from "@/hooks";
import { ReporteAdminCard } from "@/components/reportes/ReportesAdminCard";
import type { EstadoReporteEnum } from "@/api/types";

const ESTADOS_FILTRO: { value: EstadoReporteEnum | "todos"; label: string }[] = [
  { value: "todos", label: "📋 Todos" },
  { value: "abierto", label: "🔵 Abiertos" },
  { value: "en_progreso", label: "🟡 En progreso" },
  { value: "resuelto", label: "🟢 Resueltos" },
  { value: "cerrado", label: "⚫ Cerrados" },
];

export default function AdminReportes() {
  const [estadoFiltro, setEstadoFiltro] = useState<EstadoReporteEnum | "todos">("todos");
  const [skip, setSkip] = useState(0);
  const limit = 10;
  const queryTodos = useListarTodosReportesAdmin({ skip, limit });
  const queryPorEstado = useListarReportesPorEstadoAdmin(
    estadoFiltro === "todos" ? "" : estadoFiltro,
    { skip, limit }
  );

  const query = estadoFiltro === "todos" ? queryTodos : queryPorEstado;
  const reportes = query.data?.items ?? [];
  const total = query.data?.total ?? 0;
  const totalPaginas = Math.ceil(total / limit);
  const paginaActual = Math.floor(skip / limit) + 1;

  const eliminarReporte = useEliminarReporteAdmin();

  function handleCambiarFiltro(estado: EstadoReporteEnum | "todos") {
    setEstadoFiltro(estado);
    setSkip(0);
  }

  function handleEliminar(reporteId: string) {
    if (!confirm("¿Estás seguro de eliminar este reporte? Esta acción no se puede deshacer.")) return;
    eliminarReporte.mutate(reporteId);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Soporte</h1>
        <p className="text-sm text-gray-500">
          Administra los reportes de todos los usuarios
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {ESTADOS_FILTRO.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => handleCambiarFiltro(value)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              estadoFiltro === value
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {query.isLoading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : query.isError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-600">
            Error al cargar los reportes. Intenta recargando la página.
          </p>
        </div>
      ) : reportes.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
          <div className="text-4xl mb-3">📭</div>
          <h3 className="text-lg font-medium text-gray-900">
            No hay reportes {estadoFiltro !== "todos" && `con estado "${estadoFiltro}"`}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Los nuevos reportes de los usuarios aparecerán aquí.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {reportes.map((reporte) => (
              <ReporteAdminCard
                key={reporte.id}
                reporte={reporte}
                onEliminar={handleEliminar}
                isDeleting={eliminarReporte.isPending}
              />
            ))}
          </div>

           {totalPaginas > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                onClick={() => setSkip(Math.max(0, skip - limit))}
                disabled={skip === 0}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="text-sm text-gray-500">
                Página {paginaActual} de {totalPaginas} ({total} reportes)
              </span>
              <button
                onClick={() => setSkip(skip + limit)}
                disabled={paginaActual >= totalPaginas}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}