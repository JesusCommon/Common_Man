export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RequestConfig {
  timeout?: number;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  skipErrorHandler?: boolean;
}

export interface ApiErrorResponse {
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
  timestamp: string;
}

export interface RespuestaConMensaje<T = unknown> {
  mensaje: string;
  data: T;
}

export interface LoginRequest {
  identidad: string;
  password: string;
}

export interface RefreshRequest {
  refresh_token: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export type RolUsuario = "usuario" | "admin" | string;

export interface UsuarioCreate {
  nombre: string;
  apellido?: string;
  username: string;
  telefono?: string;
  correo: string;
  password: string;
}

export interface UsuarioUpdate {
  nombre?: string;
  apellido?: string;
  username?: string;
  telefono?: string;
  correo?: string;
  bio?: string;
  avatar?: string;
}

export interface UsuarioAdminUpdate extends UsuarioUpdate {
  rol?: RolUsuario;
  activo?: boolean;
  saldo?: number;
}

export interface UsuarioCambiarPassword {
  password_actual: string;
  password: string;
}

export interface UsuarioRecargarSaldo {
  monto: number;
}

export interface UsuarioPublicResponse {
  identificador: string;
  nombre: string;
  apellido?: string;
  username: string;
  bio?: string;
  avatar?: string;
  activo: boolean;
  fecha_creacion: string;
}

export interface UsuarioPropioResponse extends UsuarioPublicResponse {
  correo: string;
  telefono?: string;
  saldo: number;
  rol: RolUsuario;
  fecha_actualizacion: string;
}

export interface UsuarioAdminResponse extends UsuarioPropioResponse {
  id: string;
}

export interface PaginatedRequest {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}