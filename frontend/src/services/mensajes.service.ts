import { mensajesApi } from "@/api/endpoints/mensajes";
import type {
  ConversacionDetalleResponse,
  ConversacionResponse,
  ContadoresMensajesResponse,
  MensajeResponse,
} from "@/api/types";
import type { ServiceResult } from "./types";
import { validationError, networkError } from "./types";
import { EnviarMensajeSchema, MensajeUpdateSchema } from "@/schemas/mensajes";
import type { AxiosError } from "axios";

export async function obtenerContadoresMensajesService(): Promise<
  ServiceResult<ContadoresMensajesResponse>
> {
  try {
    const data = await mensajesApi.obtenerContadores();
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function obtenerBandejaService(
  skip = 0,
  limit = 20
): Promise<ServiceResult<ConversacionResponse[]>> {
  try {
    const data = await mensajesApi.obtenerBandeja(skip, limit);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function obtenerSolicitudesService(
  skip = 0,
  limit = 20
): Promise<ServiceResult<ConversacionResponse[]>> {
  try {
    const data = await mensajesApi.obtenerSolicitudes(skip, limit);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function obtenerDetalleConversacionService(
  conversacionId: string
): Promise<ServiceResult<ConversacionDetalleResponse>> {
  try {
    const data = await mensajesApi.obtenerDetalle(conversacionId);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function obtenerHistorialMensajesService(
  conversacionId: string,
  skip = 0,
  limit = 50
): Promise<ServiceResult<MensajeResponse[]>> {
  try {
    const data = await mensajesApi.obtenerHistorial(conversacionId, skip, limit);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function enviarMensajeService(payload: {
  destinatario_id: string;
  contenido: string;
}): Promise<ServiceResult<MensajeResponse>> {
  const parsed = EnviarMensajeSchema.safeParse(payload);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await mensajesApi.enviarMensaje(
      parsed.data.destinatario_id,
      { contenido: parsed.data.contenido }
    );
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function marcarLeidoService(
  conversacionId: string
): Promise<ServiceResult<ConversacionResponse>> {
  try {
    const data = await mensajesApi.marcarLeido(conversacionId);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function aceptarSolicitudService(
  conversacionId: string
): Promise<ServiceResult<ConversacionResponse>> {
  try {
    const data = await mensajesApi.aceptarSolicitud(conversacionId);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function rechazarSolicitudService(
  conversacionId: string
): Promise<ServiceResult<ConversacionResponse>> {
  try {
    const data = await mensajesApi.rechazarSolicitud(conversacionId);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function editarMensajeService(
  mensajeId: string,
  contenido: string
): Promise<ServiceResult<MensajeResponse>> {
  const parsed = MensajeUpdateSchema.safeParse({ contenido });
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await mensajesApi.editarMensaje(mensajeId, {
      contenido: parsed.data.contenido,
    });
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function eliminarMensajeService(
  mensajeId: string
): Promise<ServiceResult<MensajeResponse>> {
  try {
    const data = await mensajesApi.eliminarMensaje(mensajeId);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function ocultarMensajeService(
  mensajeId: string
): Promise<ServiceResult<MensajeResponse>> {
  try {
    const data = await mensajesApi.ocultarMensaje(mensajeId);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function ocultarConversacionService(
  conversacionId: string
): Promise<ServiceResult<void>> {
  try {
    await mensajesApi.ocultarConversacion(conversacionId);
    return { success: true, data: undefined };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}