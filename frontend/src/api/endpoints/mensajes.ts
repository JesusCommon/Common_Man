import { apiClient } from "../client";
import type {
  ConversacionDetalleResponse,
  ConversacionResponse,
  ContadoresMensajesResponse,
  MensajeResponse,
} from "@/api/types";

export const mensajesApi = {
  async obtenerContadores(): Promise<ContadoresMensajesResponse> {
    const { data } = await apiClient.get<ContadoresMensajesResponse>(
      "/mensajes/contadores"
    );
    return data;
  },

  async obtenerBandeja(
    skip = 0,
    limit = 20
  ): Promise<ConversacionResponse[]> {
    const { data } = await apiClient.get<ConversacionResponse[]>(
      `/mensajes/conversaciones?skip=${skip}&limit=${limit}`
    );
    return data;
  },

  async obtenerSolicitudes(
    skip = 0,
    limit = 20
  ): Promise<ConversacionResponse[]> {
    const { data } = await apiClient.get<ConversacionResponse[]>(
      `/mensajes/solicitudes?skip=${skip}&limit=${limit}`
    );
    return data;
  },

  async obtenerDetalle(conversacionId: string): Promise<ConversacionDetalleResponse> {
    const { data } = await apiClient.get<ConversacionDetalleResponse>(
      `/mensajes/conversaciones/${conversacionId}`
    );
    return data;
  },

  async obtenerHistorial(
    conversacionId: string,
    skip = 0,
    limit = 50
  ): Promise<MensajeResponse[]> {
    const { data } = await apiClient.get<MensajeResponse[]>(
      `/mensajes/conversaciones/${conversacionId}/mensajes?skip=${skip}&limit=${limit}`
    );
    return data;
  },

  async enviarMensaje(
    destinatarioId: string,
    payload: { contenido: string }
  ): Promise<MensajeResponse> {
    const { data } = await apiClient.post<MensajeResponse>(
      `/mensajes/usuario/${destinatarioId}`,
      payload
    );
    return data;
  },

  async marcarLeido(conversacionId: string): Promise<ConversacionResponse> {
    const { data } = await apiClient.patch<ConversacionResponse>(
      `/mensajes/conversaciones/${conversacionId}/leer`
    );
    return data;
  },

  async aceptarSolicitud(conversacionId: string): Promise<ConversacionResponse> {
    const { data } = await apiClient.patch<ConversacionResponse>(
      `/mensajes/conversaciones/${conversacionId}/aceptar`
    );
    return data;
  },

  async rechazarSolicitud(conversacionId: string): Promise<ConversacionResponse> {
    const { data } = await apiClient.patch<ConversacionResponse>(
      `/mensajes/conversaciones/${conversacionId}/rechazar`
    );
    return data;
  },

  async editarMensaje(
    mensajeId: string,
    payload: { contenido: string }
  ): Promise<MensajeResponse> {
    const { data } = await apiClient.patch<MensajeResponse>(
      `/mensajes/${mensajeId}`,
      payload
    );
    return data;
  },

  async eliminarMensaje(mensajeId: string): Promise<MensajeResponse> {
    const { data } = await apiClient.delete<MensajeResponse>(
      `/mensajes/${mensajeId}`
    );
    return data;
  },

  async ocultarMensaje(mensajeId: string): Promise<MensajeResponse> {
    const { data } = await apiClient.patch<MensajeResponse>(
      `/mensajes/${mensajeId}/ocultar`
    );
    return data;
  },

  async ocultarConversacion(conversacionId: string): Promise<void> {
    await apiClient.delete(`/mensajes/conversaciones/${conversacionId}`);
  },
};