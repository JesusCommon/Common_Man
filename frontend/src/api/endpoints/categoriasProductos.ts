import { apiClient } from "../client";
import type {
  RespuestaConMensaje,
  CategoriaCreate,
  CategoriaUpdate,
  CategoriaResponse,
  CategoriaPublicaResponse,
  Paginado,
} from "../types";

export async function crearCategoria(data: CategoriaCreate) {
  const { data: response } = await apiClient.post<RespuestaConMensaje<CategoriaResponse>>("/categorias/productos/", data);
  return response;
}

export async function listarCategoriasPublicas() {
  const { data } = await apiClient.get<CategoriaPublicaResponse[]>("/categorias/productos/publicas");
  return data;
}

export async function listarCategorias(skip = 0, limit = 20) {
  const { data } = await apiClient.get<Paginado<CategoriaResponse>>("/categorias/productos/all", { params: { skip, limit } });
  return data;
}

export async function listarCategoriasActivas(skip = 0, limit = 20) {
  const { data } = await apiClient.get<Paginado<CategoriaResponse>>("/categorias/productos/activas", { params: { skip, limit } });
  return data;
}

export async function listarCategoriasInactivas(skip = 0, limit = 20) {
  const { data } = await apiClient.get<Paginado<CategoriaResponse>>("/categorias/productos/inactivas", { params: { skip, limit } });
  return data;
}

export async function obtenerCategoriaPorId(id: string) {
  const { data } = await apiClient.get<CategoriaResponse>(`/categorias/productos/${id}`);
  return data;
}

export async function actualizarCategoria(id: string, data: CategoriaUpdate) {
  const { data: response } = await apiClient.put<RespuestaConMensaje<CategoriaResponse>>(`/categorias/productos/${id}`, data);
  return response;
}

export async function activarCategoria(id: string) {
  const { data: response } = await apiClient.patch<RespuestaConMensaje<CategoriaResponse>>(`/categorias/productos/${id}/activar`);
  return response;
}

export async function desactivarCategoria(id: string) {
  const { data: response } = await apiClient.patch<RespuestaConMensaje<CategoriaResponse>>(`/categorias/productos/${id}/desactivar`);
  return response;
}