import { apiClient } from "../client";
import type {
  RespuestaConMensaje,
  CompraCreate,
  CompraEstadoUpdate,
  CompraResponse,
  CompraAdminResponse,
  EstadoCompraEnum,
  Paginado,
} from "../types";

export async function crearCompra(data: CompraCreate) {
  const { data: response } = await apiClient.post<RespuestaConMensaje<CompraResponse>>("/compras/", data);
  return response;
}

export async function listarMisCompras(skip = 0, limit = 20) {
  const { data } = await apiClient.get<Paginado<CompraResponse>>("/compras/", { params: { skip, limit } });
  return data;
}

export async function obtenerCompraPorNumeroOrden(numeroOrden: string) {
  const { data } = await apiClient.get<CompraResponse>(`/compras/orden/${numeroOrden}`);
  return data;
}

export async function obtenerCompraPorId(id: string) {
  const { data } = await apiClient.get<CompraResponse>(`/compras/${id}`);
  return data;
}

export async function listarTodasComprasAdmin(skip = 0, limit = 20) {
  const { data } = await apiClient.get<Paginado<CompraAdminResponse>>("/compras/admin/all", { params: { skip, limit } });
  return data;
}

export async function listarComprasPorEstadoAdmin(estado: EstadoCompraEnum, skip = 0, limit = 20) {
  const { data } = await apiClient.get<Paginado<CompraAdminResponse>>(`/compras/admin/estado/${estado}`, { params: { skip, limit } });
  return data;
}

export async function obtenerCompraAdmin(id: string) {
  const { data } = await apiClient.get<CompraAdminResponse>(`/compras/admin/${id}`);
  return data;
}

export async function actualizarEstadoCompraAdmin(id: string, data: CompraEstadoUpdate) {
  const { data: response } = await apiClient.patch<RespuestaConMensaje<CompraAdminResponse>>(`/compras/admin/${id}/estado`, data);
  return response;
}