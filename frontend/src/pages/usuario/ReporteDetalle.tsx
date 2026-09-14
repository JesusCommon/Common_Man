import { useParams, useNavigate, Link } from "react-router-dom";
import { useObtenerMiReporte, useResponderMiReporte } from "@/hooks";
import { EstadoBadge, CategoriaBadge } from "@/components/reportes/EstadoBadge";
import { ReporteChat } from "@/components/reportes/ReporteChat";

export default function ReporteDetallePage() {
  const { reporteId } = useParams<{ reporteId: string }>();
  const navigate = useNavigate();
  const { data: reporte, isLoading, isError } = useObtenerMiReporte(reporteId ?? "", {
    refetchInterval: 5000,
  });
  const responder = useResponderMiReporte(reporteId ?? "");

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
            onClick={() => navigate("/soporte")}
            className="mt-3 text-sm text-blue-600 hover:underline"
          >
            Volver a mis reportes
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

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="mb-4">
        <Link
          to="/soporte"
          className="text-sm text-blue-600 hover:underline"
        >
          ← Volver a mis reportes
        </Link>
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
          <span className="text-xs text-gray-400 whitespace-nowrap">
            {fechaCreacion}
          </span>
        </div>

        <div className="mt-4 rounded-md bg-gray-50 p-3">
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
        <ReporteChat
          mensajes={reporte.mensajes}
          onEnviarMensaje={handleEnviarMensaje}
          isEnviando={responder.isPending}
          deshabilitado={estaCerrado}
          mensajeDeshabilitado={
            reporte.estado === "resuelto"
              ? "Este reporte fue resuelto. Si necesitas más ayuda, crea uno nuevo."
              : "Este reporte está cerrado."
          }
        />
      </div>

      {responder.isError && (
        <p className="mt-2 text-sm text-red-500">
          Error al enviar el mensaje. Intenta nuevamente.
        </p>
      )}
    </div>
  );
}