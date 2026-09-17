import { editorialesApi } from "@/api";
import {
  EditorialCreateSchema,
  EditorialUpdateSchema,
  ListarBibliotecaParamsSchema,
} from "@/schemas";
import type {
  EditorialCreate,
  EditorialUpdate,
  EditorialResponse,
  EditorialPublicResponse,
  Paginado,
  RespuestaConMensaje,
} from "@/api/types";
import type { ServiceResult } from "./types";
import { validationError, networkError } from "./types";
import type { AxiosError } from "axios";

export async function crearEditorialService(
  params: unknown
): Promise<ServiceResult<RespuestaConMensaje<EditorialResponse>>> {
  const parsed = EditorialCreateSchema.safeParse(params);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await editorialesApi.crearEditorial(parsed.data as EditorialCreate);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function listarEditorialesPublicasService(): Promise<
  ServiceResult<EditorialPublicResponse[]>
> {
  try {
    const data = await editorialesApi.listarEditorialesPublicas();
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function listarEditorialesService(
  params: unknown = {}
): Promise<ServiceResult<Paginado<EditorialResponse>>> {
  const parsed = ListarBibliotecaParamsSchema.safeParse(params);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await editorialesApi.listarEditoriales(parsed.data.skip, parsed.data.limit);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function listarEditorialesActivasService(
  params: unknown = {}
): Promise<ServiceResult<Paginado<EditorialResponse>>> {
  const parsed = ListarBibliotecaParamsSchema.safeParse(params);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await editorialesApi.listarEditorialesActivas(parsed.data.skip, parsed.data.limit);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function listarEditorialesInactivasService(
  params: unknown = {}
): Promise<ServiceResult<Paginado<EditorialResponse>>> {
  const parsed = ListarBibliotecaParamsSchema.safeParse(params);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await editorialesApi.listarEditorialesInactivas(parsed.data.skip, parsed.data.limit);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function obtenerEditorialService(
  id: string
): Promise<ServiceResult<EditorialResponse>> {
  try {
    const data = await editorialesApi.obtenerEditorialPorId(id);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function actualizarEditorialService(
  id: string,
  params: unknown
): Promise<ServiceResult<RespuestaConMensaje<EditorialResponse>>> {
  const parsed = EditorialUpdateSchema.safeParse(params);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await editorialesApi.actualizarEditorial(id, parsed.data as EditorialUpdate);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function activarEditorialService(
  id: string
): Promise<ServiceResult<RespuestaConMensaje<EditorialResponse>>> {
  try {
    const data = await editorialesApi.activarEditorial(id);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function desactivarEditorialService(
  id: string
): Promise<ServiceResult<RespuestaConMensaje<EditorialResponse>>> {
  try {
    const data = await editorialesApi.desactivarEditorial(id);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}