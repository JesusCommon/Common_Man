export type TipoNotificacionEnum = 
  | "sistema"
  | "compra"
  | "envio"
  | "saldo"
  | "soporte"
  | "promocion"
  | "seguidores";

export interface NotificacionResponse {
  id: string;
  tipo: TipoNotificacionEnum;
  titulo: string;
  mensaje: string;
  leida: boolean;
  referencia_id: string | null;
  referencia_tipo: string | null;
  accion_url: string | null;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

export interface NotificacionAdminResponse extends NotificacionResponse {
  usuario_id: string;
}

export interface NotificacionCreate {
  usuario_id?: string;
  tipo: TipoNotificacionEnum;
  titulo: string;
  mensaje: string;
  referencia_id?: string;
  referencia_tipo?: string;
  accion_url?: string;
}