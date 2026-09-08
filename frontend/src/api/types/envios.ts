export type EstadoEnvioEnum =
  | "pendiente"
  | "preparando"
  | "enviado"
  | "en_transito"
  | "entregado"
  | "cancelado"

export interface EventoEnvioResponse {
  estado: EstadoEnvioEnum;
  descripcion: string | null;
  fecha: string;
}

export interface EnvioCreate {
  compra_id: string;
  direccion_id: string;
  notas?: string;
}

export interface EnvioUpdate {
  transportadora?: string;
  numero_seguimiento?: string;
  fecha_estimada_entrega?: string;
  notas?: string;
}

export interface EnvioEstadoUpdate {
  estado: EstadoEnvioEnum;
  descripcion?: string;
}

export interface EnvioResponse {
  id: string;
  compra_id: string;
  direccion_id: string;
  estado: EstadoEnvioEnum;
  transportadora: string | null;
  numero_seguimiento: string | null;
  fecha_estimada_entrega: string | null;
  fecha_entrega_real: string | null;
  notas: string | null;
  eventos: EventoEnvioResponse[];
  fecha_creacion: string;
  fecha_actualizacion: string;
}

export interface EnvioAdminResponse extends EnvioResponse {
  usuario_id: string;
  activo: boolean;
}

export interface EnvioDetalleResponse {
  envio: EnvioResponse;
  compra_numero_orden?: string;
  direccion_alias?: string;
  direccion_completa?: string;
}