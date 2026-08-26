import {
  UsuarioCreateSchema,
  UsuarioUpdateSchema,
  UsuarioAdminUpdateSchema,
  UsuarioCambiarPasswordSchema,
  UsuarioRecargarSaldoSchema,
  BuscarPersonasSchema,
} from "@/schemas";
import { usersApi } from "@/api";
import type {
  UsuarioPropioResponse,
  UsuarioPublicResponse,
  UsuarioAdminResponse,
  RespuestaConMensaje,
  Paginado,
} from "@/api/types";
import type { ServiceResult } from "./types";
import { validationError, networkError } from "./types";
import type { AxiosError } from "axios";

export async function registrarUsuario(payload: unknown): Promise<ServiceResult<RespuestaConMensaje<UsuarioPropioResponse>>> {
  const parsed = UsuarioCreateSchema.safeParse(payload);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await usersApi.crearUsuario(parsed.data);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function buscarPersonasService(params: unknown): Promise<ServiceResult<UsuarioPublicResponse[]>> {
  const parsed = BuscarPersonasSchema.safeParse(params);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await usersApi.buscarPersonas(parsed.data);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function obtenerPerfilPublicoService(username: string): Promise<ServiceResult<UsuarioPublicResponse>> {
  try {
    const data = await usersApi.obtenerPerfilPublico(username);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function miPerfil(): Promise<ServiceResult<UsuarioPropioResponse>> {
  try {
    const data = await usersApi.obtenerPerfilPropio();
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function actualizarPerfil(payload: unknown): Promise<ServiceResult<RespuestaConMensaje<UsuarioPropioResponse>>> {
  const parsed = UsuarioUpdateSchema.safeParse(payload);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await usersApi.actualizarMiPerfil(parsed.data);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function cambiarPassword(payload: unknown): Promise<ServiceResult<RespuestaConMensaje<UsuarioPropioResponse>>> {
  const parsed = UsuarioCambiarPasswordSchema.safeParse(payload);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await usersApi.cambiarMiPassword(parsed.data);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function recargarSaldo(payload: unknown): Promise<ServiceResult<RespuestaConMensaje<UsuarioPropioResponse>>> {
  const parsed = UsuarioRecargarSaldoSchema.safeParse(payload);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await usersApi.recargarMiSaldo(parsed.data);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

// --- Funciones de Admin (Tipos de retorno agregados para consistencia) ---

export async function listarTodos(skip = 0, limit = 20): Promise<ServiceResult<Paginado<UsuarioAdminResponse>>> {
  try {
    const data = await usersApi.listarUsuarios(skip, limit);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function listarUsuariosInactivos(skip = 0, limit = 20): Promise<ServiceResult<Paginado<UsuarioAdminResponse>>> {
  try {
    const data = await usersApi.listarInactivos(skip, limit);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function listarUsuariosActivos(skip = 0, limit = 20): Promise<ServiceResult<Paginado<UsuarioAdminResponse>>> {
  try {
    const data = await usersApi.listarActivos(skip, limit);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function buscarAdmin(params: unknown): Promise<ServiceResult<UsuarioAdminResponse[]>> {
  const parsed = BuscarPersonasSchema.safeParse(params);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await usersApi.buscarUsuariosAdmin(parsed.data);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function obtenerPorUUID(identificador: string): Promise<ServiceResult<UsuarioAdminResponse>> {
  try {
    const data = await usersApi.obtenerPorIdentificador(identificador);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function obtenerPorObjectId(id: string): Promise<ServiceResult<UsuarioAdminResponse>> {
  try {
    const data = await usersApi.obtenerPorId(id);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function actualizarUsuarioAdmin(id: string, payload: unknown): Promise<ServiceResult<RespuestaConMensaje<UsuarioAdminResponse>>> {
  const parsed = UsuarioAdminUpdateSchema.safeParse(payload);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await usersApi.actualizarAdmin(id, parsed.data);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function recargarSaldoAdministrador(id: string, payload: unknown): Promise<ServiceResult<RespuestaConMensaje<UsuarioAdminResponse>>> {
  const parsed = UsuarioRecargarSaldoSchema.safeParse(payload);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await usersApi.recargarSaldoAdmin(id, parsed.data);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function restarSaldoAdministrador(id: string, payload: unknown): Promise<ServiceResult<RespuestaConMensaje<UsuarioAdminResponse>>> {
  const parsed = UsuarioRecargarSaldoSchema.safeParse(payload);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await usersApi.restarSaldoAdmin(id, parsed.data);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function activarCuenta(id: string): Promise<ServiceResult<RespuestaConMensaje<UsuarioAdminResponse>>> {
  try {
    const data = await usersApi.activarUsuario(id);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function desactivarCuenta(id: string): Promise<ServiceResult<RespuestaConMensaje<UsuarioAdminResponse>>> {
  try {
    const data = await usersApi.desactivarUsuario(id);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}