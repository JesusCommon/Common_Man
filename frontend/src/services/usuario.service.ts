import {
  UsuarioCreateSchema,
  UsuarioUpdateSchema,
  UsuarioAdminUpdateSchema,
  UsuarioCambiarPasswordSchema,
  UsuarioRecargarSaldoSchema,
  BuscarPersonasSchema,
} from "@/schemas";
import {
  crearUsuario,
  buscarPersonas,
  obtenerPerfilPropio,
  actualizarMiPerfil,
  cambiarMiPassword,
  recargarMiSaldo,
  listarUsuarios,
  listarInactivos,
  listarActivos,
  buscarUsuariosAdmin,
  obtenerPorIdentificador,
  obtenerPorId,
  actualizarAdmin,
  recargarSaldoAdmin,
  activarUsuario,
  desactivarUsuario,
  restarSaldoAdmin,
  ObtenerPerfilPublicoApi,
} from "@/api/endpoints/usuarios";
import type {
  UsuarioPropioResponse,
  UsuarioPublicResponse,
  UsuarioAdminResponse,
  RespuestaConMensaje,
} from "@/api/types";
import type { ServiceResult } from "./types";
import { validationError, networkError } from "./types";
import type { AxiosError } from "axios";

export async function registrarUsuario(payload: unknown): Promise<ServiceResult<RespuestaConMensaje<UsuarioPropioResponse>>> {
  const parsed = UsuarioCreateSchema.safeParse(payload);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await crearUsuario(parsed.data);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function buscarPersonasService(params: unknown): Promise<ServiceResult<UsuarioPublicResponse[]>> {
  const parsed = BuscarPersonasSchema.safeParse(params);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await buscarPersonas(parsed.data);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function obtenerPerfilPublico(username: string): Promise<ServiceResult<UsuarioPublicResponse>> {
  try {
    const data = await ObtenerPerfilPublicoApi(username);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function miPerfil(): Promise<ServiceResult<UsuarioPropioResponse>> {
  try {
    const data = await obtenerPerfilPropio();
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function actualizarPerfil(payload: unknown): Promise<ServiceResult<RespuestaConMensaje<UsuarioPropioResponse>>> {
  const parsed = UsuarioUpdateSchema.safeParse(payload);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await actualizarMiPerfil(parsed.data);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function cambiarPassword(payload: unknown): Promise<ServiceResult<RespuestaConMensaje<UsuarioPropioResponse>>> {
  const parsed = UsuarioCambiarPasswordSchema.safeParse(payload);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await cambiarMiPassword(parsed.data);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function recargarSaldo(payload: unknown): Promise<ServiceResult<RespuestaConMensaje<UsuarioPropioResponse>>> {
  const parsed = UsuarioRecargarSaldoSchema.safeParse(payload);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await recargarMiSaldo(parsed.data);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function listarTodos(skip = 0, limit = 20) {
  try {
    const data = await listarUsuarios(skip, limit);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function listarUsuariosInactivos(skip = 0, limit = 20) {
  try {
    const data = await listarInactivos(skip, limit);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function listarUsuariosActivos(skip = 0, limit = 20) {
  try {
    const data = await listarActivos(skip, limit);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function buscarAdmin(params: unknown): Promise<ServiceResult<UsuarioAdminResponse[]>> {
  const parsed = BuscarPersonasSchema.safeParse(params);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await buscarUsuariosAdmin(parsed.data);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function obtenerPorUUID(identificador: string): Promise<ServiceResult<UsuarioAdminResponse>> {
  try {
    const data = await obtenerPorIdentificador(identificador);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function obtenerPorObjectId(id: string): Promise<ServiceResult<UsuarioAdminResponse>> {
  try {
    const data = await obtenerPorId(id);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function actualizarUsuarioAdmin(id: string, payload: unknown): Promise<ServiceResult<RespuestaConMensaje<UsuarioAdminResponse>>> {
  const parsed = UsuarioAdminUpdateSchema.safeParse(payload);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await actualizarAdmin(id, parsed.data);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function recargarSaldoAdministrador(id: string, payload: unknown): Promise<ServiceResult<RespuestaConMensaje<UsuarioAdminResponse>>> {
  const parsed = UsuarioRecargarSaldoSchema.safeParse(payload);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await recargarSaldoAdmin(id, parsed.data);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function restarSaldoAdministrador(id: string, payload: unknown): Promise<ServiceResult<RespuestaConMensaje<UsuarioAdminResponse>>> {
  const parsed = UsuarioRecargarSaldoSchema.safeParse(payload);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await restarSaldoAdmin(id, parsed.data);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function activarCuenta(id: string): Promise<ServiceResult<RespuestaConMensaje<UsuarioAdminResponse>>> {
  try {
    const data = await activarUsuario(id);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function desactivarCuenta(id: string): Promise<ServiceResult<RespuestaConMensaje<UsuarioAdminResponse>>> {
  try {
    const data = await desactivarUsuario(id);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}