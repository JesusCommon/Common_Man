import { apiClient } from "../client";
import type {
  DireccionCreate,
  DireccionUpdate,
  DireccionResponse,
  DireccionAdminResponse,
  Paginado,
  RespuestaConMensaje,
} from "../types";

export async function crearDireccion(data: DireccionCreate) {
  const { data: response } = await apiClient.post<RespuestaConMensaje<DireccionResponse>>("/direcciones/", data);
  return response;
}

export async function listarMisDirecciones(skip = 0, limit = 20) {
  const { data } = await apiClient.get<Paginado<DireccionResponse>>("/direcciones/", { params: { skip, limit } });
  return data;
}

export async function obtenerDireccion(id: string) {
  const { data } = await apiClient.get<DireccionResponse>(`/direcciones/${id}`);
  return data;
}

export async function actualizarDireccion(id: string, data: DireccionUpdate) {
  const { data: response } = await apiClient.put<RespuestaConMensaje<DireccionResponse>>(`/direcciones/${id}`, data);
  return response;
}

export async function marcarDireccionPredeterminada(id: string) {
  const { data: response } = await apiClient.patch<RespuestaConMensaje<DireccionResponse>>(`/direcciones/${id}/predeterminada`);
  return response;
}

export async function eliminarDireccion(id: string) {
  const { data: response } = await apiClient.delete<RespuestaConMensaje<DireccionResponse>>(`/direcciones/${id}`);
  return response;
}

export async function listarDireccionesDeUsuarioAdmin(usuarioId: string, skip = 0, limit = 20) {
  const { data } = await apiClient.get<Paginado<DireccionAdminResponse>>(`/direcciones/admin/usuario/${usuarioId}`, { params: { skip, limit } });
  return data;
}