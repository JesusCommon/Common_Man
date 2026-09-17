import { apiClient } from "../client";
import type {
  RespuestaConMensaje,
  GeneroCreate,
  GeneroUpdate,
  GeneroResponse,
  GeneroPublicResponse,
  Paginado,
} from "../types";

export async function crearGenero(data: GeneroCreate) {
  const { data: response } = await apiClient.post<RespuestaConMensaje<GeneroResponse>>(
    "/generos/libros/",
    data
  );
  return response;
}

export async function listarGenerosPublicos() {
  const { data } = await apiClient.get<GeneroPublicResponse[]>(
    "/generos/libros/publicos"
  );
  return data;
}

export async function listarGeneros(skip = 0, limit = 20) {
  const { data } = await apiClient.get<Paginado<GeneroResponse>>(
    "/generos/libros/all",
    { params: { skip, limit } }
  );
  return data;
}

export async function listarGenerosActivos(skip = 0, limit = 20) {
  const { data } = await apiClient.get<Paginado<GeneroResponse>>(
    "/generos/libros/activos",
    { params: { skip, limit } }
  );
  return data;
}

export async function listarGenerosInactivos(skip = 0, limit = 20) {
  const { data } = await apiClient.get<Paginado<GeneroResponse>>(
    "/generos/libros/inactivos",
    { params: { skip, limit } }
  );
  return data;
}

export async function obtenerGeneroPorId(id: string) {
  const { data } = await apiClient.get<GeneroResponse>(`/generos/libros/${id}`);
  return data;
}

export async function actualizarGenero(id: string, data: GeneroUpdate) {
  const { data: response } = await apiClient.put<RespuestaConMensaje<GeneroResponse>>(
    `/generos/libros/${id}`,
    data
  );
  return response;
}

export async function activarGenero(id: string) {
  const { data: response } = await apiClient.patch<RespuestaConMensaje<GeneroResponse>>(
    `/generos/libros/${id}/activar`
  );
  return response;
}

export async function desactivarGenero(id: string) {
  const { data: response } = await apiClient.patch<RespuestaConMensaje<GeneroResponse>>(
    `/generos/libros/${id}/desactivar`
  );
  return response;
}