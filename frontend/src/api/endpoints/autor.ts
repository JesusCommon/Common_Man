import { apiClient } from "../client";
import type {
  RespuestaConMensaje,
  AutorCreate,
  AutorUpdate,
  AutorResponse,
  AutorPublicResponse,
  Paginado,
} from "../types";

export async function crearAutor(data: AutorCreate) {
  const { data: response } = await apiClient.post<RespuestaConMensaje<AutorResponse>>(
    "/autor/libros/",
    data
  );
  return response;
}

export async function listarAutoresPublicos() {
  const { data } = await apiClient.get<AutorPublicResponse[]>(
    "/autor/libros/publicos"
  );
  return data;
}

export async function listarAutores(skip = 0, limit = 20) {
  const { data } = await apiClient.get<Paginado<AutorResponse>>(
    "/autor/libros/all",
    { params: { skip, limit } }
  );
  return data;
}

export async function listarAutoresActivos(skip = 0, limit = 20) {
  const { data } = await apiClient.get<Paginado<AutorResponse>>(
    "/autor/libros/activos",
    { params: { skip, limit } }
  );
  return data;
}

export async function listarAutoresInactivos(skip = 0, limit = 20) {
  const { data } = await apiClient.get<Paginado<AutorResponse>>(
    "/autor/libros/inactivos",
    { params: { skip, limit } }
  );
  return data;
}

export async function obtenerAutorPorId(id: string) {
  const { data } = await apiClient.get<AutorResponse>(`/autor/libros/${id}`);
  return data;
}

export async function actualizarAutor(id: string, data: AutorUpdate) {
  const { data: response } = await apiClient.put<RespuestaConMensaje<AutorResponse>>(
    `/autor/libros/${id}`,
    data
  );
  return response;
}

export async function activarAutor(id: string) {
  const { data: response } = await apiClient.patch<RespuestaConMensaje<AutorResponse>>(
    `/autor/libros/${id}/activar`
  );
  return response;
}

export async function desactivarAutor(id: string) {
  const { data: response } = await apiClient.patch<RespuestaConMensaje<AutorResponse>>(
    `/autor/libros/${id}/desactivar`
  );
  return response;
}