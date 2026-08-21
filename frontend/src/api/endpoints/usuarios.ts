import { apiClient } from "../client";
import type {
  RespuestaConMensaje,
  UsuarioAdminResponse,
  UsuarioAdminUpdate,
  UsuarioCambiarPassword,
  UsuarioCreate,
  UsuarioPublicResponse,
  UsuarioPropioResponse,
  UsuarioRecargarSaldo,
  UsuarioUpdate,
  Paginado,
} from "../types";

export async function crearUsuario(data: UsuarioCreate) {
  const { data: response } = await apiClient.post<RespuestaConMensaje<UsuarioPropioResponse>>("/usuarios/", data);
  return response;
}

export async function buscarPersonas(params: { nombre?: string; apellido?: string; username?: string; skip?: number; limit?: number }) {
  const { data } = await apiClient.get<UsuarioPublicResponse[]>("/usuarios/buscar", { params });
  return data;
}

export async function obtenerPerfilPropio() {
  const { data } = await apiClient.get<UsuarioPropioResponse>("/usuarios/me");
  return data;
}

export async function obtenerPerfilPublico(username: string) {
  const { data } = await apiClient.get<UsuarioPublicResponse>(`/usuarios/perfil/${username}`);
  return data;
}

export async function actualizarMiPerfil(data: UsuarioUpdate) {
  const { data: response } = await apiClient.put<RespuestaConMensaje<UsuarioPropioResponse>>("/usuarios/me", data);
  return response;
}

export async function cambiarMiPassword(data: UsuarioCambiarPassword) {
  const { data: response } = await apiClient.patch<RespuestaConMensaje<UsuarioPropioResponse>>("/usuarios/me/password", data);
  return response;
}

export async function recargarMiSaldo(data: UsuarioRecargarSaldo) {
  const { data: response } = await apiClient.patch<RespuestaConMensaje<UsuarioPropioResponse>>("/usuarios/me/saldo", data);
  return response;
}

export async function listarUsuarios(skip = 0, limit = 20) {
  const { data } = await apiClient.get<Paginado<UsuarioAdminResponse>>("/usuarios/all", { params: { skip, limit } });
  return data;
}

export async function listarInactivos(skip = 0, limit = 20) {
  const { data } = await apiClient.get<Paginado<UsuarioAdminResponse>>("/usuarios/inactivos", { params: { skip, limit } });
  return data;
}

export async function listarActivos(skip = 0, limit = 20) {
  const { data } = await apiClient.get<Paginado<UsuarioAdminResponse>>("/usuarios/activos", { params: { skip, limit } });
  return data;
}

export async function buscarUsuariosAdmin(params: { nombre?: string; apellido?: string; username?: string; skip?: number; limit?: number }) {
  const { data } = await apiClient.get<UsuarioAdminResponse[]>("/usuarios/admin/buscar", { params });
  return data;
}

export async function obtenerPorIdentificador(identificador: string) {
  const { data } = await apiClient.get<UsuarioAdminResponse>(`/usuarios/identificador/${identificador}`);
  return data;
}

export async function obtenerPorId(id: string) {
  const { data } = await apiClient.get<UsuarioAdminResponse>(`/usuarios/${id}`);
  return data;
}

export async function actualizarAdmin(id: string, data: UsuarioAdminUpdate) {
  const { data: response } = await apiClient.put<RespuestaConMensaje<UsuarioAdminResponse>>(`/usuarios/${id}`, data);
  return response;
}

export async function recargarSaldoAdmin(identificador: string, data: UsuarioRecargarSaldo) {
  const { data: response } = await apiClient.patch<RespuestaConMensaje<UsuarioAdminResponse>>(`/usuarios/${identificador}/saldo`, data);
  return response;
}

export async function restarSaldoAdmin(identificador: string, data: UsuarioRecargarSaldo) {
  const { data: response } = await apiClient.patch<RespuestaConMensaje<UsuarioAdminResponse>>(`/usuarios/${identificador}/saldo/restar`, data);
  return response;
}

export async function activarUsuario(id: string) {
  const { data: response } = await apiClient.patch<RespuestaConMensaje<UsuarioAdminResponse>>(`/usuarios/${id}/activar`);
  return response;
}

export async function desactivarUsuario(id: string) {
  const { data: response } = await apiClient.patch<RespuestaConMensaje<UsuarioAdminResponse>>(`/usuarios/${id}/desactivar`);
  return response;
}