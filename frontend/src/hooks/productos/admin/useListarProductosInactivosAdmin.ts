import { useQuery } from "@tanstack/react-query";
import { listarProductosInactivosAdminService } from "@/services";

export function useListarProductosInactivosAdmin(params: { skip?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: ["productos", "admin", "inactivos", params],
    queryFn: async () => {
      const result = await listarProductosInactivosAdminService(params);
      if (!result.success) throw result.error;
      return result.data;
    },
  });
}