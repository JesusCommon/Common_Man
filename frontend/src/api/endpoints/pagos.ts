import { apiClient } from "../client";
import type {
  RespuestaConMensaje,
  MovimientoSaldoResponse,
  CompraResponse,
  Paginado,
} from "../types";

export async function procesarPago(compraId: string) {
  const { data: response } = await apiClient.post<RespuestaConMensaje<MovimientoSaldoResponse>>(
    `/pagos/compra/${compraId}`
  );
  return response;
}

export async function cancelarCompra(compraId: string) {
  const { data: response } = await apiClient.post<RespuestaConMensaje<CompraResponse>>(
    `/pagos/compra/${compraId}/cancelar`
  );
  return response;
}

export async function obtenerMovimientoDeCompra(compraId: string) {
  const { data } = await apiClient.get<MovimientoSaldoResponse>(
    `/pagos/compra/${compraId}/movimiento`
  );
  return data;
}

export async function listarHistorialMovimientos(skip = 0, limit = 20) {
  const { data } = await apiClient.get<Paginado<MovimientoSaldoResponse>>(
    "/pagos/historial",
    { params: { skip, limit } }
  );
  return data;
}