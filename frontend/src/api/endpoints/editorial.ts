import { apiClient } from "../client";
import type {
  RespuestaConMensaje,
  EditorialCreate,
  EditorialUpdate,
  EditorialResponse,
  EditorialPublicResponse,
  Paginado,
} from "../types";

export async function crearEditorial(data: EditorialCreate) {
  const { data: response } = await apiClient.post<RespuestaConMensaje<EditorialResponse>>(
    "/editorial/libros/",
    data
  );
  return response;
}

export async function listarEditorialesPublicas() {
  const { data } = await apiClient.get<EditorialPublicResponse[]>(
    "/editorial/libros/publicos"
  );
  return data;
}

export async function listarEditoriales(skip = 0, limit = 20) {
  const { data } = await apiClient.get<Paginado<EditorialResponse>>(
    "/editorial/libros/all",
    { params: { skip, limit } }
  );
  return data;
}

export async function listarEditorialesActivas(skip = 0, limit = 20) {
  const { data } = await apiClient.get<Paginado<EditorialResponse>>(
    "/editorial/libros/activos",
    { params: { skip, limit } }
  );
  return data;
}

export async function listarEditorialesInactivas(skip = 0, limit = 20) {
  const { data } = await apiClient.get<Paginado<EditorialResponse>>(
    "/editorial/libros/inactivos",
    { params: { skip, limit } }
  );
  return data;
}

export async function obtenerEditorialPorId(id: string) {
  const { data } = await apiClient.get<EditorialResponse>(`/editorial/libros/${id}`);
  return data;
}

export async function actualizarEditorial(id: string, data: EditorialUpdate) {
  const { data: response } = await apiClient.put<RespuestaConMensaje<EditorialResponse>>(
    `/editorial/libros/${id}`,
    data
  );
  return response;
}

export async function activarEditorial(id: string) {
  const { data: response } = await apiClient.patch<RespuestaConMensaje<EditorialResponse>>(
    `/editorial/libros/${id}/activar`
  );
  return response;
}

export async function desactivarEditorial(id: string) {
  const { data: response } = await apiClient.patch<RespuestaConMensaje<EditorialResponse>>(
    `/editorial/libros/${id}/desactivar`
  );
  return response;
}