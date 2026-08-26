import {
  ProductoCreateSchema,
  ProductoUpdateSchema,
  ProductoStockUpdateSchema,
  ListarProductosSchema,
  BuscarProductosSchema,
  ListarPorCategoriaSchema,
  ObtenerRecientesSchema,
} from "@/schemas";
import { productosApi } from "@/api";
import type {
  ProductoPublicResponse,
  ProductoAdminResponse,
  RespuestaConMensaje,
  Paginado,
} from "@/api/types";
import type { ServiceResult } from "./types";
import { validationError, networkError } from "./types";
import type { AxiosError } from "axios";

export async function listarProductosService(params: unknown = {}): Promise<ServiceResult<Paginado<ProductoPublicResponse>>> {
  const parsed = ListarProductosSchema.safeParse(params);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await productosApi.listarProductos(parsed.data.skip, parsed.data.limit);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function buscarProductosService(params: unknown = {}): Promise<ServiceResult<Paginado<ProductoPublicResponse>>> {
  const parsed = BuscarProductosSchema.safeParse(params);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await productosApi.buscarProductos(parsed.data);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function obtenerProductosRecientesService(params: unknown = {}): Promise<ServiceResult<ProductoPublicResponse[]>> {
  const parsed = ObtenerRecientesSchema.safeParse(params);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await productosApi.obtenerProductosRecientes(parsed.data.limit);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function listarPorCategoriaService(params: unknown): Promise<ServiceResult<Paginado<ProductoPublicResponse>>> {
  const parsed = ListarPorCategoriaSchema.safeParse(params);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await productosApi.listarPorCategoria(parsed.data.categoriaId, parsed.data.skip, parsed.data.limit);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function obtenerProductoPorSlugService(slug: string): Promise<ServiceResult<ProductoPublicResponse>> {
  try {
    const data = await productosApi.obtenerProductoPorSlug(slug);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function crearProductoService(payload: unknown): Promise<ServiceResult<RespuestaConMensaje<ProductoAdminResponse>>> {
  const parsed = ProductoCreateSchema.safeParse(payload);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await productosApi.crearProducto(parsed.data);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function listarTodosProductosAdminService(params: unknown = {}): Promise<ServiceResult<Paginado<ProductoAdminResponse>>> {
  const parsed = ListarProductosSchema.safeParse(params);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await productosApi.listarTodosProductosAdmin(parsed.data.skip, parsed.data.limit);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function listarProductosActivosAdminService(params: unknown = {}): Promise<ServiceResult<Paginado<ProductoAdminResponse>>> {
  const parsed = ListarProductosSchema.safeParse(params);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await productosApi.listarProductosActivosAdmin(parsed.data.skip, parsed.data.limit);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function listarProductosInactivosAdminService(params: unknown = {}): Promise<ServiceResult<Paginado<ProductoAdminResponse>>> {
  const parsed = ListarProductosSchema.safeParse(params);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await productosApi.listarProductosInactivosAdmin(parsed.data.skip, parsed.data.limit);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function obtenerProductoPorIdAdminService(id: string): Promise<ServiceResult<ProductoAdminResponse>> {
  try {
    const data = await productosApi.obtenerProductoPorIdAdmin(id);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function actualizarProductoService(id: string, payload: unknown): Promise<ServiceResult<RespuestaConMensaje<ProductoAdminResponse>>> {
  const parsed = ProductoUpdateSchema.safeParse(payload);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await productosApi.actualizarProducto(id, parsed.data);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function actualizarStockService(id: string, payload: unknown): Promise<ServiceResult<RespuestaConMensaje<ProductoAdminResponse>>> {
  const parsed = ProductoStockUpdateSchema.safeParse(payload);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await productosApi.actualizarStock(id, parsed.data);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function descontarStockService(id: string, payload: unknown): Promise<ServiceResult<RespuestaConMensaje<ProductoAdminResponse>>> {
  const parsed = ProductoStockUpdateSchema.safeParse(payload);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await productosApi.descontarStock(id, parsed.data);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function establecerStockService(id: string, payload: unknown): Promise<ServiceResult<RespuestaConMensaje<ProductoAdminResponse>>> {
  const parsed = ProductoStockUpdateSchema.safeParse(payload);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await productosApi.establecerStock(id, parsed.data);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function activarProductoService(id: string): Promise<ServiceResult<RespuestaConMensaje<ProductoAdminResponse>>> {
  try {
    const data = await productosApi.activarProducto(id);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function desactivarProductoService(id: string): Promise<ServiceResult<RespuestaConMensaje<ProductoAdminResponse>>> {
  try {
    const data = await productosApi.desactivarProducto(id);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}