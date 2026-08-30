import { ListarHistorialFinancieroSchema } from "@/schemas";
import { configFinanzasApi } from "@/api";
import type {
  WalletResponse,
  HistorialItemResponse,
  Paginado,
} from "@/api/types";
import type { ServiceResult } from "./types";
import { validationError, networkError } from "./types";
import type { AxiosError } from "axios";

export async function obtenerWalletService(): Promise<ServiceResult<WalletResponse>> {
  try {
    const data = await configFinanzasApi.obtenerWallet();
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function listarHistorialFinancieroService(
  params: unknown = {}
): Promise<ServiceResult<Paginado<HistorialItemResponse>>> {
  const parsed = ListarHistorialFinancieroSchema.safeParse(params);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await configFinanzasApi.listarHistorialFinanciero(parsed.data);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}