import { useState } from "react";
import { useListarMisReportes, useCrearReporte, useEliminarMiReporte } from "@/hooks";
import { ReporteCard } from "@/components/reportes/ReporteCard";
import { CrearReporteForm } from "@/components/reportes/CrearReporteModal";
import type { ReporteCreateInput } from "@/schemas";

export default function MisReportes() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [skip, setSkip] = useState(0);
  const limit = 10;

  const { data, isLoading, isError } = useListarMisReportes({ skip, limit });
  const crearReporte = useCrearReporte();
  const eliminarReporte = useEliminarMiReporte();

  const reportes = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPaginas = Math.ceil(total / limit);
  const paginaActual = Math.floor(skip / limit) + 1;

  function handleCrear(formData: ReporteCreateInput) {
    crearReporte.mutate(formData, {
      onSuccess: () => {
        setMostrarFormulario(false);
        setSkip(0);
      },
    });
  }

  function handleEliminar(reporteId: string) {
    if (!confirm("¿Estás seguro de eliminar este reporte?")) return;
    eliminarReporte.mutate(reporteId);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Soporte</h1>
          <p className="text-sm text-gray-500">
            Gestiona tus reportes y comunícate con nuestro equipo
          </p>
        </div>
        <button
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
        >
          {mostrarFormulario ? "Cancelar" : "+ Nuevo reporte"}
        </button>
      </div>

      {mostrarFormulario && (
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Crear nuevo reporte
          </h2>
          <CrearReporteForm
            onSubmit={handleCrear}
            isLoading={crearReporte.isPending}
            onCancel={() => setMostrarFormulario(false)}
          />
          {crearReporte.isError && (
            <p className="mt-3 text-sm text-red-500">
              Error al crear el reporte. Intenta nuevamente.
            </p>
          )}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      ) : isError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-600">
            Error al cargar los reportes. Intenta recargando la página.
          </p>
        </div>
      ) : reportes.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
          <div className="text-4xl mb-3">📩</div>
          <h3 className="text-lg font-medium text-gray-900">
            No tienes reportes
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            ¿Tienes algún problema? Crea un nuevo reporte y nuestro equipo te
            ayudará.
          </p>
          {!mostrarFormulario && (
            <button
              onClick={() => setMostrarFormulario(true)}
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
            >
              Crear mi primer reporte
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {reportes.map((reporte) => (
              <ReporteCard
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
                Página {paginaActual} de {totalPaginas}
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