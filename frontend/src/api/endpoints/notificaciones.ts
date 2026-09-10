import { apiClient } from "../client";
import type {
  NotificacionResponse,
  NotificacionAdminResponse,
  NotificacionCreate,
  Paginado,
  RespuestaConMensaje,
} from "../types";

export async function listarMisNotificaciones(params: {
  skip?: number;
  limit?: number;
  solo_no_leidas?: boolean;
}) {
  const { data } = await apiClient.get<Paginado<NotificacionResponse>>("/notificaciones/", {
    params,
  });
  return data;
}

export async function contarNoLeidas(): Promise<number> {
  const { data } = await apiClient.get<RespuestaConMensaje<number>>(
    "/notificaciones/no-leidas/count"
  );
  return data.data;
}

export async function marcarLeida(id: string) {
  const { data } = await apiClient.patch<RespuestaConMensaje<NotificacionResponse>>(
    `/notificaciones/${id}/leida`
  );
  return data;
}

export async function marcarTodasLeidas() {
  const { data } = await apiClient.patch<RespuestaConMensaje<{ actualizadas: number }>>(
    "/notificaciones/marcar-todas-leidas"
  );
  return data;
}

export async function eliminarNotificacion(id: string) {
  const { data } = await apiClient.delete<RespuestaConMensaje<{ id: string }>>(
    `/notificaciones/${id}`
  );
  return data;
}

export async function crearNotificacionAdmin(data: NotificacionCreate) {
  const { data: response } = await apiClient.post<
    RespuestaConMensaje<NotificacionAdminResponse>
  >("/notificaciones/admin/crear", data);
  return response;
}