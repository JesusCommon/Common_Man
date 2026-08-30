import { apiClient } from "../client";
import type {
  WalletResponse,
  HistorialItemResponse,
  Paginado,
  TipoMovimientoEnum,
} from "../types";

export async function obtenerWallet() {
  const { data } = await apiClient.get<WalletResponse>("/admin/finanzas/wallet");
  return data;
}

export async function listarHistorialFinanciero(
  params: { tipo?: TipoMovimientoEnum; skip?: number; limit?: number } = {}
) {
  const { data } = await apiClient.get<Paginado<HistorialItemResponse>>(
    "/admin/finanzas/historial",
    { params }
  );
  return data;
}