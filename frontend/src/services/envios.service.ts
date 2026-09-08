import { z } from "zod";
import {
  EnvioCreateSchema,
  EnvioUpdateSchema,
  EnvioEstadoUpdateSchema,
  ListarEnviosSchema,
  EstadoEnvioSchema,
} from "@/schemas";
import { enviosApi } from "@/api";
import type {
  EnvioResponse,
  EnvioAdminResponse,
  RespuestaConMensaje,
  Paginado,
} from "@/api/types";
import type { ServiceResult } from "./types";
import { validationError, networkError } from "./types";
import type { AxiosError } from "axios";

const ListarEnviosPorEstadoSchema = z.object({
  estado: EstadoEnvioSchema,
  skip: z.number().int().nonnegative().default(0),
  limit: z.number().int().min(1).max(100).default(20),
});

export async function listarMisEnviosService(
  params: unknown = {}
): Promise<ServiceResult<Paginado<EnvioResponse>>> {
  const parsed = ListarEnviosSchema.safeParse(params);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await enviosApi.listarMisEnvios(parsed.data.skip, parsed.data.limit);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function obtenerEnvioService(
  id: string
): Promise<ServiceResult<EnvioResponse>> {
  try {
    const data = await enviosApi.obtenerEnvio(id);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function crearEnvioAdminService(
  payload: unknown
): Promise<ServiceResult<RespuestaConMensaje<EnvioAdminResponse>>> {
  const parsed = EnvioCreateSchema.safeParse(payload);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await enviosApi.crearEnvio(parsed.data);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function listarTodosLosEnviosAdminService(
  params: unknown = {}
): Promise<ServiceResult<Paginado<EnvioAdminResponse>>> {
  const parsed = ListarEnviosSchema.safeParse(params);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await enviosApi.listarTodosLosEnviosAdmin(
      parsed.data.skip,
      parsed.data.limit
    );
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function listarEnviosPorEstadoAdminService(
  params: unknown
): Promise<ServiceResult<Paginado<EnvioAdminResponse>>> {
  const parsed = ListarEnviosPorEstadoSchema.safeParse(params);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await enviosApi.listarEnviosPorEstadoAdmin(
      parsed.data.estado,
      parsed.data.skip,
      parsed.data.limit
    );
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function obtenerEnvioPorCompraAdminService(
  compraId: string
): Promise<ServiceResult<EnvioAdminResponse>> {
  try {
    const data = await enviosApi.obtenerEnvioPorCompraAdmin(compraId);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function actualizarEnvioAdminService(
  id: string,
  payload: unknown
): Promise<ServiceResult<RespuestaConMensaje<EnvioAdminResponse>>> {
  const parsed = EnvioUpdateSchema.safeParse(payload);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await enviosApi.actualizarEnvioAdmin(id, parsed.data);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function actualizarEstadoEnvioAdminService(
  id: string,
  payload: unknown
): Promise<ServiceResult<RespuestaConMensaje<EnvioAdminResponse>>> {
  const parsed = EnvioEstadoUpdateSchema.safeParse(payload);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await enviosApi.actualizarEstadoEnvioAdmin(id, parsed.data);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}