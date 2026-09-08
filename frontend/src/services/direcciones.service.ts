import {
  DireccionCreateSchema,
  DireccionUpdateSchema,
  ListarDireccionesSchema,
} from "@/schemas";
import { direccionesApi } from "@/api";
import type {
  DireccionResponse,
  DireccionAdminResponse,
  RespuestaConMensaje,
  Paginado,
} from "@/api/types";
import type { ServiceResult } from "./types";
import { validationError, networkError } from "./types";
import type { AxiosError } from "axios";

export async function crearDireccionService(
  payload: unknown
): Promise<ServiceResult<RespuestaConMensaje<DireccionResponse>>> {
  const parsed = DireccionCreateSchema.safeParse(payload);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await direccionesApi.crearDireccion(parsed.data);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function listarMisDireccionesService(
  params: unknown = {}
): Promise<ServiceResult<Paginado<DireccionResponse>>> {
  const parsed = ListarDireccionesSchema.safeParse(params);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await direccionesApi.listarMisDirecciones(
      parsed.data.skip,
      parsed.data.limit
    );
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function obtenerDireccionService(
  id: string
): Promise<ServiceResult<DireccionResponse>> {
  try {
    const data = await direccionesApi.obtenerDireccion(id);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function actualizarDireccionService(
  id: string,
  payload: unknown
): Promise<ServiceResult<RespuestaConMensaje<DireccionResponse>>> {
  const parsed = DireccionUpdateSchema.safeParse(payload);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await direccionesApi.actualizarDireccion(id, parsed.data);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function marcarDireccionPredeterminadaService(
  id: string
): Promise<ServiceResult<RespuestaConMensaje<DireccionResponse>>> {
  try {
    const data = await direccionesApi.marcarDireccionPredeterminada(id);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function eliminarDireccionService(
  id: string
): Promise<ServiceResult<RespuestaConMensaje<DireccionResponse>>> {
  try {
    const data = await direccionesApi.eliminarDireccion(id);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function listarDireccionesDeUsuarioAdminService(
  usuarioId: string,
  params: unknown = {}
): Promise<ServiceResult<Paginado<DireccionAdminResponse>>> {
  const parsed = ListarDireccionesSchema.safeParse(params);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await direccionesApi.listarDireccionesDeUsuarioAdmin(
      usuarioId,
      parsed.data.skip,
      parsed.data.limit
    );
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}