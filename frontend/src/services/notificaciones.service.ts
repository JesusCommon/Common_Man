import { notificacionesApi } from "@/api";
import { ListarNotificacionesSchema } from "@/schemas";
import type {
  NotificacionResponse,
  Paginado,
  RespuestaConMensaje,
} from "@/api/types";
import type { ServiceResult } from "./types";
import { validationError, networkError } from "./types";
import type { AxiosError } from "axios";

export async function listarMisNotificacionesService(
  params: unknown = {}
): Promise<ServiceResult<Paginado<NotificacionResponse>>> {
  const parsed = ListarNotificacionesSchema.safeParse(params);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await notificacionesApi.listarMisNotificaciones(parsed.data);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function contarNoLeidasService(): Promise<ServiceResult<number>> {
  try {
    const data = await notificacionesApi.contarNoLeidas();
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function marcarNotificacionLeidaService(
  id: string
): Promise<ServiceResult<RespuestaConMensaje<NotificacionResponse>>> {
  try {
    const data = await notificacionesApi.marcarLeida(id);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function marcarTodasNotificacionesLeidasService(): Promise<
  ServiceResult<RespuestaConMensaje<{ actualizadas: number }>>
> {
  try {
    const data = await notificacionesApi.marcarTodasLeidas();
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function eliminarNotificacionService(
  id: string
): Promise<ServiceResult<RespuestaConMensaje<{ id: string }>>> {
  try {
    const data = await notificacionesApi.eliminarNotificacion(id);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}