import { useQuery } from "@tanstack/react-query";
import { listarTodosProductosAdminService } from "@/services";

export function useListarTodosProductosAdmin(params: { skip?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: ["productos", "admin", "todos", params],
    queryFn: async () => {
      const result = await listarTodosProductosAdminService(params);
      if (!result.success) throw result.error;
      return result.data;
    },
  });
}