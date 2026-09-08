import { useQuery } from "@tanstack/react-query";
import { listarMisEnviosService } from "@/services";

export function useListarMisEnvios(
  params: { skip?: number; limit?: number } = {}
) {
  return useQuery({
    queryKey: ["envios", "mios", params],
    queryFn: async () => {
      const result = await listarMisEnviosService(params);
      if (!result.success) throw result.error;
      return result.data;
    },
  });
}