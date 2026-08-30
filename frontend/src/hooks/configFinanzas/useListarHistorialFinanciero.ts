import { useQuery } from "@tanstack/react-query";
import { listarHistorialFinancieroService } from "@/services";
import type { TipoMovimientoEnum } from "@/schemas";

export function useListarHistorialFinanciero(
  params: { tipo?: TipoMovimientoEnum; skip?: number; limit?: number } = {}
) {
  return useQuery({
    queryKey: ["finanzas", "historial", params],
    queryFn: async () => {
      const result = await listarHistorialFinancieroService(params);
      if (!result.success) throw result.error;
      return result.data;
    },
  });
}