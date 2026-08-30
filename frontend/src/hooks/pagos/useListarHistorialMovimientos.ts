import { useQuery } from "@tanstack/react-query";
import { listarHistorialMovimientosService } from "@/services";

export function useListarHistorialMovimientos(params: { skip?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: ["pagos", "historial", params],
    queryFn: async () => {
      const result = await listarHistorialMovimientosService(params);
      if (!result.success) throw result.error;
      return result.data;
    },
  });
}