import { apiClient } from "../client";
import type {
  EnvioCreate,
  EnvioUpdate,
  EnvioEstadoUpdate,
  EnvioResponse,
  EnvioAdminResponse,
  EstadoEnvioEnum,
  Paginado,
  RespuestaConMensaje,
} from "../types";

export async function listarMisEnvios(skip = 0, limit = 20) {
  const { data } = await apiClient.get<Paginado<EnvioResponse>>("/envios/", { params: { skip, limit } });
  return data;
}

export async function obtenerEnvio(id: string) {
  const { data } = await apiClient.get<EnvioResponse>(`/envios/${id}`);
  return data;
}

export async function crearEnvio(data: EnvioCreate) {
  const { data: response } = await apiClient.post<RespuestaConMensaje<EnvioAdminResponse>>("/envios/", data);
  return response;
}

export async function listarTodosLosEnviosAdmin(skip = 0, limit = 20) {
  const { data } = await apiClient.get<Paginado<EnvioAdminResponse>>("/envios/admin/all", { params: { skip, limit } });
  return data;
}

export async function listarEnviosPorEstadoAdmin(estado: EstadoEnvioEnum, skip = 0, limit = 20) {
  const { data } = await apiClient.get<Paginado<EnvioAdminResponse>>(`/envios/admin/estado/${estado}`, { params: { skip, limit } });
  return data;
}

export async function obtenerEnvioPorCompraAdmin(compraId: string) {
  const { data } = await apiClient.get<EnvioAdminResponse>(`/envios/admin/compra/${compraId}`);
  return data;
}

export async function actualizarEnvioAdmin(id: string, data: EnvioUpdate) {
  const { data: response } = await apiClient.put<RespuestaConMensaje<EnvioAdminResponse>>(`/envios/${id}`, data);
  return response;
}

export async function actualizarEstadoEnvioAdmin(id: string, data: EnvioEstadoUpdate) {
  const { data: response } = await apiClient.patch<RespuestaConMensaje<EnvioAdminResponse>>(`/envios/${id}/estado`, data);
  return response;
}