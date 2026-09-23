import { apiClient } from "../client";
import type {
  RespuestaConMensaje,
  Paginado,
  LibroCreate,
  LibroUpdate,
  LibroResponse,
  LibroAdminResponse,
  LibroContenidoResponse,
  Idiomas,
} from "../types";

export interface BuscarLibrosParams {
  nombre?: string;
  autor_id?: string;
  editorial_id?: string;
  genero_id?: string;
  idioma?: Idiomas;
  anio_desde?: number;
  anio_hasta?: number;
  precio_min?: string;
  precio_max?: string;
  skip?: number;
  limit?: number;
}

export interface ListarLibrosAdminParams {
  nombre?: string;
  autor_id?: string;
  editorial_id?: string;
  genero_id?: string;
  idioma?: Idiomas;
  activos?: boolean;
  skip?: number;
  limit?: number;
}

export async function buscarLibros(params: BuscarLibrosParams = {}) {
  const { data } = await apiClient.get<Paginado<LibroResponse>>("/libros/", {
    params,
  });
  return data;
}

export async function obtenerLibro(libroId: string) {
  const { data } = await apiClient.get<LibroResponse>(`/libros/${libroId}`);
  return data;
}

export async function obtenerContenidoLibro(libroId: string) {
  const { data } = await apiClient.get<LibroContenidoResponse>(
    `/libros/${libroId}/contenido`
  );
  return data;
}

export async function listarLibrosAdmin(params: ListarLibrosAdminParams = {}) {
  const { data } = await apiClient.get<Paginado<LibroAdminResponse>>(
    "libros/admin/all", {params}
  );
  return data
}

export async function listarLibros(skip = 0, limit = 20) {
  const { data } = await apiClient.get<Paginado<LibroAdminResponse>>("/libros/all", { params: { skip, limit } });
  return data;
}

export async function listarInactivos(skip = 0, limit = 20) {
  const { data } = await apiClient.get<Paginado<LibroAdminResponse>>("/libros/inactivos", { params: { skip, limit } });
  return data;
}

export async function listarActivos(skip = 0, limit = 20) {
  const { data } = await apiClient.get<Paginado<LibroAdminResponse>>("/libros/activos", { params: { skip, limit } });
  return data;
}

export async function obtenerLibroPorIsbn(isbn: string) {
  const { data } = await apiClient.get<LibroAdminResponse>(
    `/libros/admin/isbn/${isbn}`
  );
  return data;
}

export async function obtenerLibroPorSku(sku: string) {
  const { data } = await apiClient.get<LibroAdminResponse>(
    `/libros/admin/sku/${sku}`
  );
  return data;
}

export async function obtenerLibroAdmin(libroId: string) {
  const { data } = await apiClient.get<LibroAdminResponse>(
    `/libros/admin/${libroId}`
  );
  return data;
}

export async function crearLibro(data: LibroCreate) {
  const { data: response } = await apiClient.post<
    RespuestaConMensaje<LibroAdminResponse>
  >("/libros/", data);
  return response;
}

export async function actualizarLibro(libroId: string, data: LibroUpdate) {
  const { data: response } = await apiClient.patch<
    RespuestaConMensaje<LibroAdminResponse>
  >(`/libros/${libroId}`, data);
  return response;
}

export async function activarLibro(libroId: string) {
  const { data: response } = await apiClient.patch<
    RespuestaConMensaje<LibroAdminResponse>
  >(`/libros/${libroId}/activar`);
  return response;
}

export async function desactivarLibro(libroId: string) {
  const { data: response } = await apiClient.patch<
    RespuestaConMensaje<LibroAdminResponse>
  >(`/libros/${libroId}/desactivar`);
  return response;
}