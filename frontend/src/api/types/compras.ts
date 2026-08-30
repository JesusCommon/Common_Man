export type EstadoCompraEnum = 
  | "pendiente"
  | "pagado"
  | "enviado"
  | "entregado"
  | "cancelado";

export interface CompraItemCreate {
  producto_id: string;
  cantidad: number;
}

export interface CompraCreate {
  items: CompraItemCreate[];
  notas?: string;
  descuento?: number;
  impuestos?: number;
}

export interface CompraUpdate {
  notas?: string;
}

export interface CompraEstadoUpdate {
  estado: EstadoCompraEnum;
}

export interface CompraItemResponse {
  producto_id: string;
  nombre_producto_snapshot: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export interface CompraResponse {
  id: string;
  numero_orden: string;
  items: CompraItemResponse[];
  subtotal: number;
  descuento: number;
  impuestos: number;
  total: number;
  estado: EstadoCompraEnum;
  notas?: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

export interface CompraAdminResponse extends CompraResponse {
  usuario_id: string;
}