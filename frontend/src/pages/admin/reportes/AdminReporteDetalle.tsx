import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useObtenerReporteAdmin, useResponderReporteAdmin, useEliminarReporteAdmin } from "@/hooks";
import { EstadoBadge, CategoriaBadge } from "@/components/reportes/EstadoBadge";
import { ActualizarEstadoModal } from "@/components/reportes/ActualizarEstadoModal";
import { ReporteAdminChat } from "@/components/reportes/ReporteAdminChat";

export default function AdminReporteDetalle() {
  const { reporteId } = useParams<{ reporteId: string }>();
  const navigate = useNavigate();
  const [mostrarModalEstado, setMostrarModalEstado] = useState(false);
  const { data: reporte, isLoading, isError } = useObtenerReporteAdmin(reporteId ?? "", {
    refetchInterval: 5000,
  });
  const responder = useResponderReporteAdmin(reporteId ?? "");
  const eliminarReporte = useEliminarReporteAdmin();

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (isError || !reporte) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-600">
            No se pudo cargar el reporte.
          </p>
          <button
            onClick={() => navigate("/admin/soporte")}
            className="mt-3 text-sm text-blue-600 hover:underline"
          >
            Volver a reportes
          </button>
        </div>
      </div>
    );
  }

  const fechaCreacion = new Date(reporte.fecha_creacion).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const estaCerrado = reporte.estado === "resuelto" || reporte.estado === "cerrado";

  function handleEnviarMensaje(contenido: string) {
    responder.mutate({ contenido });
  }

  function handleEliminar() {
    if (!confirm("¿Estás seguro de eliminar este reporte?")) return;
    eliminarReporte.mutate(reporteId ?? "", {
      onSuccess: () => navigate("/admin/soporte"),
    });
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <Link
          to="/admin/soporte"
          className="text-sm text-blue-600 hover:underline"
        >
          ← Volver a reportes
        </Link>
        <button
          onClick={handleEliminar}
          disabled={eliminarReporte.isPending}
          className="rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 transition disabled:opacity-50"
        >
          {eliminarReporte.isPending ? "Eliminando..." : "🗑️ Eliminar reporte"}
        </button>
      </div>

      <div className="rounded-t-lg border border-gray-200 bg-white p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold text-gray-900">
              {reporte.asunto}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <EstadoBadge estado={reporte.estado} />
              <CategoriaBadge categoria={reporte.categoria} />
              {reporte.codigo_referencia && (
                <span className="text-xs text-gray-500">
                  Ref: {reporte.codigo_referencia}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <span className="text-xs text-gray-400 whitespace-nowrap">
              {fechaCreacion}
            </span>
            <button
              onClick={() => setMostrarModalEstado(true)}
              disabled={estaCerrado}
              className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              title={estaCerrado ? "Este reporte ya está cerrado" : "Cambiar estado"}
            >
              📝 Cambiar estado
            </button>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 rounded-md bg-gray-50 p-2.5">
          <span className="text-xs text-gray-500 font-medium">👤 Usuario:</span>
          <span className="text-xs text-gray-700 font-mono">{reporte.usuario_id}</span>
        </div>

        <div className="mt-3 rounded-md bg-gray-50 p-3">
          <p className="text-xs font-medium text-gray-500 mb-1">
            Descripción del reporte:
          </p>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">
            {reporte.descripcion}
          </p>
        </div>

        {reporte.fecha_cierre && (
          <p className="mt-3 text-xs text-gray-400">
            Cerrado el{" "}
            {new Date(reporte.fecha_cierre).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
      </div>

      <div className="rounded-b-lg border border-t-0 border-gray-200 bg-white" style={{ height: "450px" }}>
        <ReporteAdminChat
          mensajes={reporte.mensajes}
          onEnviarMensaje={handleEnviarMensaje}
          isEnviando={responder.isPending}
          deshabilitado={estaCerrado}
        />
      </div>

      {responder.isError && (
        <p className="mt-2 text-sm text-red-500">
          Error al enviar el mensaje. Intenta nuevamente.
        </p>
      )}

      {mostrarModalEstado && (
        <ActualizarEstadoModal
          reporteId={reporte.id}
          estadoActual={reporte.estado}
          onClose={() => setMostrarModalEstado(false)}
        />
      )}
    </div>
  );
}