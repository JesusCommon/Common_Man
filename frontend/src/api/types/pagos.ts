export type TipoMovimientoEnum = 
  | "pago_compra"
  | "reembolso"
  | "recarga";

export type EstadoMovimientoEnum = 
  | "pendiente"
  | "completado"
  | "cancelado";

export interface PagoRequest {
  compra_id: string;
}

export interface MovimientoSaldoUpdate {
  estado: EstadoMovimientoEnum;
}

export interface MovimientoSaldoResponse {
  id: string;
  usuario_id: string;
  compra_id: string | null;
  tipo: TipoMovimientoEnum;
  estado: EstadoMovimientoEnum;
  monto: number;
  saldo_anterior: number;
  saldo_posterior: number;
  descripcion: string | null;
  fecha_creacion: string;
  fecha_actualizacion: string;
}