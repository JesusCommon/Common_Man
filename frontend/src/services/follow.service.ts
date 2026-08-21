import { FollowCreateSchema } from "@/schemas";
import { followsApi } from "@/api";
import type { FollowPublicResponse } from "@/schemas"; // FollowCreateInput eliminado
import type { RespuestaConMensaje, Paginado } from "@/api/types";
import type { ServiceResult } from "./types";
import { validationError, networkError } from "./types";
import type { AxiosError } from "axios";

export async function seguirUsuario(payload: unknown): Promise<ServiceResult<RespuestaConMensaje<FollowPublicResponse>>> {
  const parsed = FollowCreateSchema.safeParse(payload);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    // parsed.data ya tiene el tipo FollowCreateInput inferido por Zod
    const data = await followsApi.seguir(parsed.data);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function dejarDeSeguirUsuario(username: string): Promise<ServiceResult<RespuestaConMensaje<FollowPublicResponse>>> {
  try {
    const data = await followsApi.dejarDeSeguir(username);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function obtenerMisSeguidores(skip = 0, limit = 20): Promise<ServiceResult<Paginado<FollowPublicResponse>>> {
  try {
    const data = await followsApi.listarMisSeguidores(skip, limit);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function obtenerMisSeguidos(skip = 0, limit = 20): Promise<ServiceResult<Paginado<FollowPublicResponse>>> {
  try {
    const data = await followsApi.listarMisSeguidos(skip, limit);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function verificarSiSigueA(username: string): Promise<ServiceResult<RespuestaConMensaje<boolean>>> {
  try {
    const data = await followsApi.sigueA(username);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function obtenerSeguidoresDe(username: string, skip = 0, limit = 20): Promise<ServiceResult<Paginado<FollowPublicResponse>>> {
  try {
    const data = await followsApi.listarSeguidoresDe(username, skip, limit);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function obtenerSeguidosDe(username: string, skip = 0, limit = 20): Promise<ServiceResult<Paginado<FollowPublicResponse>>> {
  try {
    const data = await followsApi.listarSeguidosDe(username, skip, limit);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}