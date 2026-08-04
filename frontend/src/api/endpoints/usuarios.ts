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
} from "../types";

export async function crearUsuario(data: UsuarioCreate) {
  const { data: response } = await apiClient.post<
    RespuestaConMensaje<UsuarioPropioResponse>
  >("/usuarios/", data);
  return response;
}

export async function buscarPersonas(params: {
  nombre?: string;
  apellido?: string;
  username?: string;
  skip?: number;
  limit?: number;
}) {
  const { data } = await apiClient.get<UsuarioPublicResponse[]>(
    "/usuarios/buscar",
    { params }
  );
  return data;
}

export async function obtenerPerfilPropio() {
  const { data } = await apiClient.get<UsuarioPropioResponse>("/usuarios/me");
  return data;
}

export async function actualizarMiPerfil(data: UsuarioUpdate) {
  const { data: response } = await apiClient.put<
    RespuestaConMensaje<UsuarioPropioResponse>
  >("/usuarios/me", data);
  return response;
}

export async function cambiarMiPassword(data: UsuarioCambiarPassword) {
  const { data: response } = await apiClient.patch<
    RespuestaConMensaje<UsuarioPropioResponse>
  >("/usuarios/me/password", data);
  return response;
}

export async function recargarMiSaldo(data: UsuarioRecargarSaldo) {
  const { data: response } = await apiClient.patch<
    RespuestaConMensaje<UsuarioPropioResponse>
  >("/usuarios/me/saldo", data);
  return response;
}

export async function listarUsuarios() {
  const { data } = await apiClient.get<UsuarioAdminResponse[]>("/usuarios/all");
  return data;
}

export async function listarInactivos(params?: { skip?: number; limit?: number }) {
  const { data } = await apiClient.get<UsuarioAdminResponse[]>(
    "/usuarios/inactivos",
    { params }
  );
  return data;
}

export async function listarActivos() {
  const { data } = await apiClient.get<UsuarioAdminResponse[]>("/usuarios/activos");
  return data;
}

export async function buscarUsuariosAdmin(params: {
  nombre?: string;
  apellido?: string;
  username?: string;
  skip?: number;
  limit?: number;
}) {
  const { data } = await apiClient.get<UsuarioAdminResponse[]>(
    "/usuarios/admin/buscar",
    { params }
  );
  return data;
}

export async function obtenerPorIdentificador(identificador: string) {
  const { data } = await apiClient.get<UsuarioAdminResponse>(
    `/usuarios/identificador/${identificador}`
  );
  return data;
}

export async function obtenerPorId(id: string) {
  const { data } = await apiClient.get<UsuarioAdminResponse>(`/usuarios/${id}`);
  return data;
}

export async function actualizarAdmin(id: string, data: UsuarioAdminUpdate) {
  const { data: response } = await apiClient.put<
    RespuestaConMensaje<UsuarioAdminResponse>
  >(`/usuarios/${id}`, data);
  return response;
}

export async function recargarSaldoAdmin(id: string, data: UsuarioRecargarSaldo) {
  const { data: response } = await apiClient.patch<
    RespuestaConMensaje<UsuarioAdminResponse>
  >(`/usuarios/${id}/saldo`, data);
  return response;
}

export async function activarUsuario(id: string) {
  const { data: response } = await apiClient.patch<
    RespuestaConMensaje<UsuarioAdminResponse>
  >(`/usuarios/${id}/activar`);
  return response;
}

export async function desactivarUsuario(id: string) {
  const { data: response } = await apiClient.patch<
    RespuestaConMensaje<UsuarioAdminResponse>
  >(`/usuarios/${id}/desactivar`);
  return response;
}