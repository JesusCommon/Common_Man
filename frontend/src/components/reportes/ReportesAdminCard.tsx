import { Link } from "react-router-dom";
import { EstadoBadge, CategoriaBadge } from "./EstadoBadge";
import type { ReporteAdminResponse } from "@/api/types";

interface ReporteAdminCardProps {
  reporte: ReporteAdminResponse;
  onEliminar?: (id: string) => void;
  isDeleting?: boolean;
}

export function ReporteAdminCard({ reporte, onEliminar, isDeleting }: ReporteAdminCardProps) {
  const fechaCreacion = new Date(reporte.fecha_creacion).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const totalMensajes = reporte.mensajes.length;
  const ultimoMensaje = reporte.mensajes[reporte.mensajes.length - 1];

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <Link
            to={`/admin/soporte/${reporte.id}`}
            className="text-base font-semibold text-gray-900 hover:text-blue-600 transition"
          >
            {reporte.asunto}
          </Link>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <EstadoBadge estado={reporte.estado} />
            <CategoriaBadge categoria={reporte.categoria} />
            {reporte.codigo_referencia && (
              <span className="text-xs text-gray-500">
                Ref: {reporte.codigo_referencia}
              </span>
            )}
          </div>
        </div>
      </div>

      <p className="mt-2 text-sm text-gray-600 line-clamp-2">
        {reporte.descripcion}
      </p>

      {ultimoMensaje && (
        <div className="mt-3 rounded-md bg-gray-50 p-2.5">
          <p className="text-xs text-gray-500">
            <span className="font-medium">
              {ultimoMensaje.rol === "admin" ? "🛡️ Soporte" : "👤 Usuario"}:
            </span>{" "}
            <span className="line-clamp-1">{ultimoMensaje.contenido}</span>
          </p>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span>{fechaCreacion}</span>
          {totalMensajes > 0 && (
            <span>
              💬 {totalMensajes} {totalMensajes === 1 ? "mensaje" : "mensajes"}
            </span>
          )}
          <span className="text-gray-500 font-medium">
            Usuario: {reporte.usuario_id.slice(0, 8)}...
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/admin/soporte/${reporte.id}`}
            className="rounded-md bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 transition"
          >
            Gestionar
          </Link>
          {onEliminar && (
            <button
              onClick={() => onEliminar(reporte.id)}
              disabled={isDeleting}
              className="rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 transition disabled:opacity-50"
            >
              {isDeleting ? "..." : "Eliminar"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}