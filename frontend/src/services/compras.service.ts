import {
  CompraCreateSchema,
  CompraEstadoUpdateSchema,
  ListarComprasSchema,
  ListarComprasPorEstadoSchema,
} from "@/schemas";
import { comprasApi } from "@/api";
import type {
  CompraResponse,
  CompraAdminResponse,
  RespuestaConMensaje,
  Paginado,
} from "@/api/types";
import type { ServiceResult } from "./types";
import { validationError, networkError } from "./types";
import type { AxiosError } from "axios";

export async function crearCompraService(payload: unknown): Promise<ServiceResult<RespuestaConMensaje<CompraResponse>>> {
  const parsed = CompraCreateSchema.safeParse(payload);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await comprasApi.crearCompra(parsed.data);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function listarMisComprasService(params: unknown = {}): Promise<ServiceResult<Paginado<CompraResponse>>> {
  const parsed = ListarComprasSchema.safeParse(params);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await comprasApi.listarMisCompras(parsed.data.skip, parsed.data.limit);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function obtenerCompraPorIdService(id: string): Promise<ServiceResult<CompraResponse>> {
  try {
    const data = await comprasApi.obtenerCompraPorId(id);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function obtenerCompraPorNumeroOrdenService(numeroOrden: string): Promise<ServiceResult<CompraResponse>> {
  try {
    const data = await comprasApi.obtenerCompraPorNumeroOrden(numeroOrden);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

// ========== SERVICIOS DE ADMIN ==========

export async function listarTodasComprasAdminService(params: unknown = {}): Promise<ServiceResult<Paginado<CompraAdminResponse>>> {
  const parsed = ListarComprasSchema.safeParse(params);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await comprasApi.listarTodasComprasAdmin(parsed.data.skip, parsed.data.limit);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function listarComprasPorEstadoAdminService(params: unknown): Promise<ServiceResult<Paginado<CompraAdminResponse>>> {
  const parsed = ListarComprasPorEstadoSchema.safeParse(params);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await comprasApi.listarComprasPorEstadoAdmin(parsed.data.estado, parsed.data.skip, parsed.data.limit);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function obtenerCompraAdminService(id: string): Promise<ServiceResult<CompraAdminResponse>> {
  try {
    const data = await comprasApi.obtenerCompraAdmin(id);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function actualizarEstadoCompraAdminService(id: string, payload: unknown): Promise<ServiceResult<RespuestaConMensaje<CompraAdminResponse>>> {
  const parsed = CompraEstadoUpdateSchema.safeParse(payload);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await comprasApi.actualizarEstadoCompraAdmin(id, parsed.data);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}