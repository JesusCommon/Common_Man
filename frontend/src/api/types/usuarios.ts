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