import { useQuery } from "@tanstack/react-query";
import { listarProductosService } from "@/services";

export function useListarProductos(params: { skip?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: ["productos", params],
    queryFn: async () => {
      const result = await listarProductosService(params);
      if (!result.success) throw result.error;
      return result.data;
    },
  });
}