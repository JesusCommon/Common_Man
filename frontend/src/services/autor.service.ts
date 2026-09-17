import { autoresApi } from "@/api";
import {
  AutorCreateSchema,
  AutorUpdateSchema,
  ListarBibliotecaParamsSchema,
} from "@/schemas";
import type {
  AutorCreate,
  AutorUpdate,
  AutorResponse,
  AutorPublicResponse,
  Paginado,
  RespuestaConMensaje,
} from "@/api/types";
import type { ServiceResult } from "./types";
import { validationError, networkError } from "./types";
import type { AxiosError } from "axios";

export async function crearAutorService(
  params: unknown
): Promise<ServiceResult<RespuestaConMensaje<AutorResponse>>> {
  const parsed = AutorCreateSchema.safeParse(params);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await autoresApi.crearAutor(parsed.data as AutorCreate);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function listarAutoresPublicosService(): Promise<
  ServiceResult<AutorPublicResponse[]>
> {
  try {
    const data = await autoresApi.listarAutoresPublicos();
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function listarAutoresService(
  params: unknown = {}
): Promise<ServiceResult<Paginado<AutorResponse>>> {
  const parsed = ListarBibliotecaParamsSchema.safeParse(params);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await autoresApi.listarAutores(parsed.data.skip, parsed.data.limit);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function listarAutoresActivosService(
  params: unknown = {}
): Promise<ServiceResult<Paginado<AutorResponse>>> {
  const parsed = ListarBibliotecaParamsSchema.safeParse(params);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await autoresApi.listarAutoresActivos(parsed.data.skip, parsed.data.limit);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function listarAutoresInactivosService(
  params: unknown = {}
): Promise<ServiceResult<Paginado<AutorResponse>>> {
  const parsed = ListarBibliotecaParamsSchema.safeParse(params);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await autoresApi.listarAutoresInactivos(parsed.data.skip, parsed.data.limit);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function obtenerAutorService(
  id: string
): Promise<ServiceResult<AutorResponse>> {
  try {
    const data = await autoresApi.obtenerAutorPorId(id);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function actualizarAutorService(
  id: string,
  params: unknown
): Promise<ServiceResult<RespuestaConMensaje<AutorResponse>>> {
  const parsed = AutorUpdateSchema.safeParse(params);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await autoresApi.actualizarAutor(id, parsed.data as AutorUpdate);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function activarAutorService(
  id: string
): Promise<ServiceResult<RespuestaConMensaje<AutorResponse>>> {
  try {
    const data = await autoresApi.activarAutor(id);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function desactivarAutorService(
  id: string
): Promise<ServiceResult<RespuestaConMensaje<AutorResponse>>> {
  try {
    const data = await autoresApi.desactivarAutor(id);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}