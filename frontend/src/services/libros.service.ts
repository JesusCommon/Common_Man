import { librosApi } from "@/api";
import {
  LibroCreateSchema,
  LibroUpdateSchema,
  BuscarLibrosParamsSchema,
  ListarLibrosAdminParamsSchema,
} from "@/schemas";
import type {
  LibroCreate,
  LibroUpdate,
  LibroResponse,
  LibroAdminResponse,
  LibroContenidoResponse,
  AutorDestacado,
  Paginado,
  RespuestaConMensaje,
} from "@/api/types";
import type { ServiceResult } from "./types";
import { validationError, networkError } from "./types";
import type { AxiosError } from "axios";


export async function buscarLibrosService(
  params: unknown = {}
): Promise<ServiceResult<Paginado<LibroResponse>>> {
  const parsed = BuscarLibrosParamsSchema.safeParse(params);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await librosApi.buscarLibros(parsed.data);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function obtenerLibroService(
  id: string
): Promise<ServiceResult<LibroResponse>> {
  try {
    const data = await librosApi.obtenerLibro(id);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function obtenerContenidoLibroService(
  id: string
): Promise<ServiceResult<LibroContenidoResponse>> {
  try {
    const data = await librosApi.obtenerContenidoLibro(id);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function listarLibrosAdminService(
  params: unknown = {}
): Promise<ServiceResult<Paginado<LibroAdminResponse>>> {
  const parsed = ListarLibrosAdminParamsSchema.safeParse(params);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await librosApi.listarLibrosAdmin(parsed.data);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function listarAutoresDestacadosService(
  limit = 6
): Promise<ServiceResult<AutorDestacado[]>> {
  try {
    const data = await librosApi.listarAutoresDestacados(limit);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function listarTodosLosLibros(skip = 0, limit = 20): Promise<ServiceResult<Paginado<LibroAdminResponse>>> {
  try {
    const data = await librosApi.listarLibros(skip, limit);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function listarLibrosInactivos(skip = 0, limit = 20): Promise<ServiceResult<Paginado<LibroAdminResponse>>> {
  try {
    const data = await librosApi.listarInactivos(skip, limit);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function listarLibrosActivos(skip = 0, limit = 20): Promise<ServiceResult<Paginado<LibroAdminResponse>>> {
  try {
    const data = await librosApi.listarActivos(skip, limit);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function obtenerLibroPorIsbnService(
  isbn: string
): Promise<ServiceResult<LibroAdminResponse>> {
  try {
    const data = await librosApi.obtenerLibroPorIsbn(isbn);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function obtenerLibroPorSkuService(
  sku: string
): Promise<ServiceResult<LibroAdminResponse>> {
  try {
    const data = await librosApi.obtenerLibroPorSku(sku);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function obtenerLibroAdminService(
  id: string
): Promise<ServiceResult<LibroAdminResponse>> {
  try {
    const data = await librosApi.obtenerLibroAdmin(id);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function crearLibroService(
  params: unknown
): Promise<ServiceResult<RespuestaConMensaje<LibroAdminResponse>>> {
  const parsed = LibroCreateSchema.safeParse(params);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await librosApi.crearLibro(parsed.data as LibroCreate);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function actualizarLibroService(
  id: string,
  params: unknown
): Promise<ServiceResult<RespuestaConMensaje<LibroAdminResponse>>> {
  const parsed = LibroUpdateSchema.safeParse(params);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await librosApi.actualizarLibro(id, parsed.data as LibroUpdate);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function activarLibroService(
  id: string
): Promise<ServiceResult<RespuestaConMensaje<LibroAdminResponse>>> {
  try {
    const data = await librosApi.activarLibro(id);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function desactivarLibroService(
  id: string
): Promise<ServiceResult<RespuestaConMensaje<LibroAdminResponse>>> {
  try {
    const data = await librosApi.desactivarLibro(id);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}