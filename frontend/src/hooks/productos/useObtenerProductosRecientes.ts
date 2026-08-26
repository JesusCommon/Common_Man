import { useQuery } from "@tanstack/react-query";
import { obtenerProductosRecientesService } from "@/services";

export function useObtenerProductosRecientes(params: { limit?: number } = {}) {
  return useQuery({
    queryKey: ["productos", "recientes", params.limit],
    queryFn: async () => {
      const result = await obtenerProductosRecientesService(params);
      if (!result.success) throw result.error;
      return result.data;
    },
  });
}