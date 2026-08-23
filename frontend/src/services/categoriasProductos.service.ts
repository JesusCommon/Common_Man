import {
  CategoriaCreateSchema,
  CategoriaUpdateSchema,
  ListarCategoriasSchema,
} from "@/schemas";
import { categoriasApi } from "@/api";
import type {
  CategoriaResponse,
  CategoriaPublicaResponse,
  RespuestaConMensaje,
  Paginado,
} from "@/api/types";
import type { ServiceResult } from "./types";
import { validationError, networkError } from "./types";
import type { AxiosError } from "axios";

export async function crearCategoriaService(payload: unknown): Promise<ServiceResult<RespuestaConMensaje<CategoriaResponse>>> {
  const parsed = CategoriaCreateSchema.safeParse(payload);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await categoriasApi.crearCategoria(parsed.data);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function listarCategoriasPublicasService(): Promise<ServiceResult<CategoriaPublicaResponse[]>> {
  try {
    const data = await categoriasApi.listarCategoriasPublicas();
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function listarTodasLasCategoriasService(params: unknown = {}): Promise<ServiceResult<Paginado<CategoriaResponse>>> {
  const parsed = ListarCategoriasSchema.safeParse(params);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await categoriasApi.listarCategorias(parsed.data.skip, parsed.data.limit);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function listarCategoriasActivasService(params: unknown = {}): Promise<ServiceResult<Paginado<CategoriaResponse>>> {
  const parsed = ListarCategoriasSchema.safeParse(params);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await categoriasApi.listarCategoriasActivas(parsed.data.skip, parsed.data.limit);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function listarCategoriasInactivasService(params: unknown = {}): Promise<ServiceResult<Paginado<CategoriaResponse>>> {
  const parsed = ListarCategoriasSchema.safeParse(params);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await categoriasApi.listarCategoriasInactivas(parsed.data.skip, parsed.data.limit);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function obtenerCategoriaPorIdService(id: string): Promise<ServiceResult<CategoriaResponse>> {
  try {
    const data = await categoriasApi.obtenerCategoriaPorId(id);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function actualizarCategoriaService(id: string, payload: unknown): Promise<ServiceResult<RespuestaConMensaje<CategoriaResponse>>> {
  const parsed = CategoriaUpdateSchema.safeParse(payload);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await categoriasApi.actualizarCategoria(id, parsed.data);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function activarCategoriaService(id: string): Promise<ServiceResult<RespuestaConMensaje<CategoriaResponse>>> {
  try {
    const data = await categoriasApi.activarCategoria(id);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function desactivarCategoriaService(id: string): Promise<ServiceResult<RespuestaConMensaje<CategoriaResponse>>> {
  try {
    const data = await categoriasApi.desactivarCategoria(id);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}