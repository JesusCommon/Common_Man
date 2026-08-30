import {
  ProcesarPagoSchema,
  CancelarCompraSchema,
  ObtenerMovimientoSchema,
  ListarHistorialSchema,
} from "@/schemas";
import { pagosApi } from "@/api";
import type {
  MovimientoSaldoResponse,
  CompraResponse,
  RespuestaConMensaje,
  Paginado,
} from "@/api/types";
import type { ServiceResult } from "./types";
import { validationError, networkError } from "./types";
import type { AxiosError } from "axios";

export async function procesarPagoService(payload: unknown): Promise<ServiceResult<RespuestaConMensaje<MovimientoSaldoResponse>>> {
  const parsed = ProcesarPagoSchema.safeParse(payload);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await pagosApi.procesarPago(parsed.data.compraId);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function cancelarCompraService(payload: unknown): Promise<ServiceResult<RespuestaConMensaje<CompraResponse>>> {
  const parsed = CancelarCompraSchema.safeParse(payload);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await pagosApi.cancelarCompra(parsed.data.compraId);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function obtenerMovimientoDeCompraService(payload: unknown): Promise<ServiceResult<MovimientoSaldoResponse>> {
  const parsed = ObtenerMovimientoSchema.safeParse(payload);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await pagosApi.obtenerMovimientoDeCompra(parsed.data.compraId);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function listarHistorialMovimientosService(params: unknown = {}): Promise<ServiceResult<Paginado<MovimientoSaldoResponse>>> {
  const parsed = ListarHistorialSchema.safeParse(params);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await pagosApi.listarHistorialMovimientos(parsed.data.skip, parsed.data.limit);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}