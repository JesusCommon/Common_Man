import { useQuery } from "@tanstack/react-query";
import { buscarProductosService } from "@/services";

export function useBuscarProductos(params: Record<string, unknown> = {}) {
  return useQuery({
    queryKey: ["productos", "buscar", params],
    queryFn: async () => {
      const result = await buscarProductosService(params);
      if (!result.success) throw result.error;
      return result.data;
    },
  });
}