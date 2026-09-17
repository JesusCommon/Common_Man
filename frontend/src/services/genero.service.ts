import { generosApi } from "@/api";
import {
  GeneroCreateSchema,
  GeneroUpdateSchema,
  ListarBibliotecaParamsSchema,
} from "@/schemas";
import type {
  GeneroCreate,
  GeneroUpdate,
  GeneroResponse,
  GeneroPublicResponse,
  Paginado,
  RespuestaConMensaje,
} from "@/api/types";
import type { ServiceResult } from "./types";
import { validationError, networkError } from "./types";
import type { AxiosError } from "axios";

export async function crearGeneroService(
  params: unknown
): Promise<ServiceResult<RespuestaConMensaje<GeneroResponse>>> {
  const parsed = GeneroCreateSchema.safeParse(params);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await generosApi.crearGenero(parsed.data as GeneroCreate);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function listarGenerosPublicosService(): Promise<
  ServiceResult<GeneroPublicResponse[]>
> {
  try {
    const data = await generosApi.listarGenerosPublicos();
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function listarGenerosService(
  params: unknown = {}
): Promise<ServiceResult<Paginado<GeneroResponse>>> {
  const parsed = ListarBibliotecaParamsSchema.safeParse(params);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await generosApi.listarGeneros(parsed.data.skip, parsed.data.limit);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function listarGenerosActivosService(
  params: unknown = {}
): Promise<ServiceResult<Paginado<GeneroResponse>>> {
  const parsed = ListarBibliotecaParamsSchema.safeParse(params);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await generosApi.listarGenerosActivos(parsed.data.skip, parsed.data.limit);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function listarGenerosInactivosService(
  params: unknown = {}
): Promise<ServiceResult<Paginado<GeneroResponse>>> {
  const parsed = ListarBibliotecaParamsSchema.safeParse(params);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await generosApi.listarGenerosInactivos(parsed.data.skip, parsed.data.limit);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function obtenerGeneroService(
  id: string
): Promise<ServiceResult<GeneroResponse>> {
  try {
    const data = await generosApi.obtenerGeneroPorId(id);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function actualizarGeneroService(
  id: string,
  params: unknown
): Promise<ServiceResult<RespuestaConMensaje<GeneroResponse>>> {
  const parsed = GeneroUpdateSchema.safeParse(params);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await generosApi.actualizarGenero(id, parsed.data as GeneroUpdate);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function activarGeneroService(
  id: string
): Promise<ServiceResult<RespuestaConMensaje<GeneroResponse>>> {
  try {
    const data = await generosApi.activarGenero(id);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function desactivarGeneroService(
  id: string
): Promise<ServiceResult<RespuestaConMensaje<GeneroResponse>>> {
  try {
    const data = await generosApi.desactivarGenero(id);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}