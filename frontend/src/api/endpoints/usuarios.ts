import { API_PREFIXES, buildPath } from './base';

const PREFIX = API_PREFIXES.USUARIOS;

export const usuariosEndpoints = {
  crear: (): string => buildPath(PREFIX, '/'),
  listarTodos: (): string => buildPath(PREFIX, '/all'),
  listarActivos: (): string => buildPath(PREFIX, '/activos'),
  listarInactivos: (): string => buildPath(PREFIX, '/inactivos'),
  obtenerPerfil: (): string => buildPath(PREFIX, '/me'),
  actualizarPerfil: (): string => buildPath(PREFIX, '/me'),
  actualizarPassword: (): string => buildPath(PREFIX, '/me/password'),
  actualizarSaldo: (): string => buildPath(PREFIX, '/me/saldo'),
  buscar: (): string => buildPath(PREFIX, '/buscar'),
  buscarAdmin: (): string => buildPath(PREFIX, '/admin/buscar'),
  obtenerPorId: (id: string | number): string => buildPath(PREFIX, `/${id}`),
  obtenerPorUuid: (uuid: string): string => buildPath(PREFIX, `/identificador/${uuid}`),
  activar: (id: string | number): string => buildPath(PREFIX, `/${id}/activar`),
  desactivar: (id: string | number): string => buildPath(PREFIX, `/${id}/desactivar`),
} as const;