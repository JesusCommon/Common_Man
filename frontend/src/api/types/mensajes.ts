export type EstadoConversacion = "pendiente" | "aceptada" | "rechazada";
export type TipoMensaje = "texto";

export interface UsuarioMiniResponse {
  id: string;
  nombre: string;
  apellido: string | null;
  username: string;
  avatar: string | null;
}

export interface MensajeResponse {
  id: string;
  conversacion_id: string;
  remitente_id: string;
  contenido: string | null;
  tipo: TipoMensaje;
  leido: boolean;
  editado: boolean;
  fecha_edicion: string | null;
  eliminado: boolean;
  fecha_creacion: string;
}

export interface ConversacionResponse {
  id: string;
  estado: EstadoConversacion;
  otro_usuario: UsuarioMiniResponse;
  ultimo_mensaje_id: string | null;
  ultimo_contenido: string | null;
  ultimo_remitente_id: string | null;
  ultimo_fecha: string | null;
  no_leidos_mios: number;
  fecha_creacion: string;
}

export interface ConversacionDetalleResponse {
  id: string;
  estado: EstadoConversacion;
  otro_usuario: UsuarioMiniResponse;
  no_leidos_mios: number;
}

export interface ContadoresMensajesResponse {
  mensajes_no_leidos: number;
  solicitudes_pendientes: number;
}

// Eventos que llegan por WebSocket (desde el suscriptor del backend)
export interface MensajeWSBase {
  conversacion_id: string;
}

export interface MensajeNuevoWS extends MensajeWSBase {
  tipo: "mensaje_nuevo";
  remitente_id: string;
  remitente_nombre: string;
  mensaje_id: string;
  contenido: string;
  fecha: string;
}

export interface SolicitudNuevaWS extends MensajeWSBase {
  tipo: "solicitud_nueva";
  solicitante_id: string;
  solicitante_nombre: string;
  preview: string;
}

export interface SolicitudProcesadaWS extends MensajeWSBase {
  tipo: "solicitud_procesada";
  estado: EstadoConversacion;
}

export interface MensajeLeidoWS extends MensajeWSBase {
  tipo: "mensaje_leido";
  leido_por: string;
}

export interface MensajeEditadoWS extends MensajeWSBase {
  tipo: "mensaje_editado";
  mensaje_id: string;
  nuevo_contenido: string;
}

export interface MensajeEliminadoWS extends MensajeWSBase {
  tipo: "mensaje_eliminado";
  mensaje_id: string;
  para_todos: boolean;
}

export type MensajeWSEvent =
  | MensajeNuevoWS
  | SolicitudNuevaWS
  | SolicitudProcesadaWS
  | MensajeLeidoWS
  | MensajeEditadoWS
  | MensajeEliminadoWS;