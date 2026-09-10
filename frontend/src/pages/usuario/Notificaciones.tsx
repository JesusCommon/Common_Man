import { useState } from "react";
import {
  useListarMisNotificaciones,
  useMarcarNotificacionLeida,
  useMarcarTodasNotificacionesLeidas,
  useEliminarNotificacion,
} from "@/hooks";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { Bell, Check, Trash2 } from "lucide-react";
import type { NotificacionResponse } from "@/api/types";

const PAGE_SIZE = 20;

export default function Notificaciones() {
  const [page, setPage] = useState(1);

  const listQuery = useListarMisNotificaciones({
    skip: (page - 1) * PAGE_SIZE,
    limit: PAGE_SIZE,
  });
  const marcarLeida = useMarcarNotificacionLeida();
  const marcarTodas = useMarcarTodasNotificacionesLeidas();
  const eliminar = useEliminarNotificacion();

  if (listQuery.isLoading) return <Spinner />;
  if (listQuery.isError)
    return <ErrorAlert error={listQuery.error} fallback="Error al cargar notificaciones" />;

  const notificaciones: NotificacionResponse[] = listQuery.data?.items ?? [];
  const total: number = listQuery.data?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#18181B] mb-1">Notificaciones</h1>
          <p className="text-sm text-[#52525B]">Todas tus notificaciones</p>
        </div>
        <Button
          variant="outline"
          onClick={() => marcarTodas.mutate()}
          disabled={marcarTodas.isPending}
        >
          <Check className="w-4 h-4 mr-2" />
          Marcar todas como leídas
        </Button>
      </div>

      {notificaciones.length === 0 ? (
        <div className="bg-white border border-[#E4E4E1] rounded-2xl p-12 text-center space-y-3">
          <Bell className="w-12 h-12 text-[#A1A19A] mx-auto" />
          <p className="text-sm text-[#52525B]">No tienes notificaciones</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notificaciones.map((notif) => (
            <div
              key={notif.id}
              className={`bg-white border border-[#E4E4E1] rounded-xl p-4 flex items-start gap-4 ${
                !notif.leida ? "border-l-4 border-l-[#2563EB]" : ""
              }`}
            >
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold text-[#18181B]">{notif.titulo}</h3>
                    <p className="text-sm text-[#52525B] mt-1">{notif.mensaje}</p>
                    <p className="text-xs text-[#A1A19A] mt-2">
                      {new Date(notif.fecha_creacion).toLocaleString("es-CO")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!notif.leida && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => marcarLeida.mutate(notif.id)}
                        disabled={marcarLeida.isPending}
                        title="Marcar como leída"
                      >
                        <Check className="w-4 h-4 text-[#2563EB]" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => eliminar.mutate(notif.id)}
                      disabled={eliminar.isPending}
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Anterior
          </Button>
          <span className="px-4 py-2 text-sm text-[#52525B]">
            Página {page} de {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
}