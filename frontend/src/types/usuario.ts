import type { EntityId, IsoDateString, Uuid } from './common';

export type RolUsuario = string;

export interface Usuario {
  id: EntityId;
  nombre: string;
  apellido: string | null;
  username: string;
  bio: string | null;
  avatar: string | null;
  identificador: Uuid;
  rol: RolUsuario;
  activo: boolean;
  fecha_creacion: IsoDateString;
  fecha_actualizacion: IsoDateString;
}

export type UsuarioResponse = Usuario;

export interface UsuarioCreate {
  nombre: string;
  apellido?: string | null;
  username: string;
  telefono?: string | null;
  correo: string;
  password: string;
  bio?: string | null;
  avatar?: string | null;
  saldo?: number | null;
}

export interface UsuarioUpdate {
  nombre?: string | null;
  apellido?: string | null;
  username?: string | null;
  telefono?: string | null;
  correo?: string | null;
  bio?: string | null;
  avatar?: string | null;
}

export interface UsuarioCambiarPassword {
  password_actual: string;
  password: string;
}

export interface UsuarioRecargarSaldo {
  monto: number;
}