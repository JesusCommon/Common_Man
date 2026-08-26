import { useQuery } from "@tanstack/react-query";
import { listarProductosActivosAdminService } from "@/services";

export function useListarProductosActivosAdmin(params: { skip?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: ["productos", "admin", "activos", params],
    queryFn: async () => {
      const result = await listarProductosActivosAdminService(params);
      if (!result.success) throw result.error;
      return result.data;
    },
  });
}