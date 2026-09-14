export type EstadoReporteEnum =
  | "abierto"
  | "en_progreso"
  | "resuelto"
  | "cerrado";

export type CategoriaReporteEnum =
  | "compra"
  | "producto"
  | "pago"
  | "envio"
  | "cuenta"
  | "otro";

export type RolMensajeEnum = "usuario" | "admin";

export interface MensajeReporte {
  usuario_id: string;
  nombre_usuario: string;
  rol: RolMensajeEnum;
  contenido: string;
  fecha: string;
}

export interface ReporteResponse {
  id: string;
  categoria: CategoriaReporteEnum;
  estado: EstadoReporteEnum;
  asunto: string;
  descripcion: string;
  codigo_referencia: string | null;
  mensajes: MensajeReporte[];
  fecha_creacion: string;
  fecha_actualizacion: string;
  fecha_cierre: string | null;
}

export interface ReporteAdminResponse extends ReporteResponse {
  usuario_id: string;
}

export interface ReporteCreate {
  categoria: CategoriaReporteEnum;
  asunto: string;
  descripcion: string;
  codigo_referencia?: string;
}

export interface MensajeCreate {
  contenido: string;
}

export interface ReporteEstadoUpdate {
  estado: EstadoReporteEnum;
  mensaje_resolucion?: string;
}