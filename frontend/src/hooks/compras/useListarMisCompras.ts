import { useQuery } from "@tanstack/react-query";
import { listarMisComprasService } from "@/services";

export function useListarMisCompras(params: { skip?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: ["compras", "mis-compras", params],
    queryFn: async () => {
      const result = await listarMisComprasService(params);
      if (!result.success) throw result.error;
      return result.data;
    },
  });
}