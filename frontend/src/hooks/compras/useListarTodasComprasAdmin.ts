import { useQuery } from "@tanstack/react-query";
import { listarTodasComprasAdminService } from "@/services";

export function useListarTodasComprasAdmin(params: { skip?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: ["compras", "admin", "todas", params],
    queryFn: async () => {
      const result = await listarTodasComprasAdminService(params);
      if (!result.success) throw result.error;
      return result.data;
    },
  });
}