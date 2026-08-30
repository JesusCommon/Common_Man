import type { TipoMovimientoEnum, EstadoMovimientoEnum } from "./pagos";

export interface WalletResponse {
  saldo_plataforma: number;
  total_transacciones: number;
  fecha_actualizacion: string;
}

export interface HistorialItemResponse {
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
}