import { apiClient } from "../client";
import type {
  RespuestaConMensaje,
  ProductoAdminResponse,
  ProductoCreate,
  ProductoPublicResponse,
  ProductoStockUpdate,
  ProductoUpdate,
  Paginado,
} from "../types";

export async function listarProductos(skip = 0, limit = 20) {
  const { data } = await apiClient.get<Paginado<ProductoPublicResponse>>("/productos/", { params: { skip, limit } });
  return data;
}

export async function buscarProductos(params: {
  nombre?: string;
  categoria_id?: string;
  precio_min?: number;
  precio_max?: number;
  stock_min?: number;
  skip?: number;
  limit?: number;
}) {
  const { data } = await apiClient.get<Paginado<ProductoPublicResponse>>("/productos/buscar", { params });
  return data;
}

export async function obtenerProductosRecientes(limit = 10) {
  const { data } = await apiClient.get<ProductoPublicResponse[]>("/productos/recientes", { params: { limit } });
  return data;
}

export async function listarPorCategoria(categoriaId: string, skip = 0, limit = 20) {
  const { data } = await apiClient.get<Paginado<ProductoPublicResponse>>(`/productos/categoria/${categoriaId}`, {
    params: { skip, limit },
  });
  return data;
}

export async function obtenerProductoPorSlug(slug: string) {
  const { data } = await apiClient.get<ProductoPublicResponse>(`/productos/${slug}`);
  return data;
}

export async function crearProducto(data: ProductoCreate) {
  const { data: response } = await apiClient.post<RespuestaConMensaje<ProductoAdminResponse>>("/productos/", data);
  return response;
}

export async function listarTodosProductosAdmin(skip = 0, limit = 20) {
  const { data } = await apiClient.get<Paginado<ProductoAdminResponse>>("/productos/admin/all", {
    params: { skip, limit },
  });
  return data;
}

export async function listarProductosActivosAdmin(skip = 0, limit = 20) {
  const { data } = await apiClient.get<Paginado<ProductoAdminResponse>>("/productos/admin/activos", {
    params: { skip, limit },
  });
  return data;
}

export async function listarProductosInactivosAdmin(skip = 0, limit = 20) {
  const { data } = await apiClient.get<Paginado<ProductoAdminResponse>>("/productos/admin/inactivos", {
    params: { skip, limit },
  });
  return data;
}

export async function obtenerProductoPorIdAdmin(id: string) {
  const { data } = await apiClient.get<ProductoAdminResponse>(`/productos/admin/${id}`);
  return data;
}

export async function actualizarProducto(id: string, data: ProductoUpdate) {
  const { data: response } = await apiClient.put<RespuestaConMensaje<ProductoAdminResponse>>(`/productos/${id}`, data);
  return response;
}

export async function actualizarStock(id: string, data: ProductoStockUpdate) {
  const { data: response } = await apiClient.patch<RespuestaConMensaje<ProductoAdminResponse>>(
    `/productos/${id}/stock`,
    data
  );
  return response;
}

export async function descontarStock(id: string, data: ProductoStockUpdate) {
  const { data: response } = await apiClient.patch<RespuestaConMensaje<ProductoAdminResponse>>(
    `/productos/${id}/stock/descontar`,
    data
  );
  return response;
}

export async function establecerStock(id: string, data: ProductoStockUpdate) {
  const { data: response } = await apiClient.patch<RespuestaConMensaje<ProductoAdminResponse>>(
    `/productos/${id}/stock/establecer`,
    data
  );
  return response;
}

export async function activarProducto(id: string) {
  const { data: response } = await apiClient.patch<RespuestaConMensaje<ProductoAdminResponse>>(`/productos/${id}/activar`);
  return response;
}

export async function desactivarProducto(id: string) {
  const { data: response } = await apiClient.patch<RespuestaConMensaje<ProductoAdminResponse>>(
    `/productos/${id}/desactivar`
  );
  return response;
}