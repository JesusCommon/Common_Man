import { useQuery } from "@tanstack/react-query";
import { listarTodosLosEnviosAdminService } from "@/services";

export function useListarTodosLosEnviosAdmin(
  params: { skip?: number; limit?: number } = {}
) {
  return useQuery({
    queryKey: ["envios", "admin", "todos", params],
    queryFn: async () => {
      const result = await listarTodosLosEnviosAdminService(params);
      if (!result.success) throw result.error;
      return result.data;
    },
  });
}