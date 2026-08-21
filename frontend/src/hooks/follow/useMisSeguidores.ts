import { useQuery } from "@tanstack/react-query";
import { obtenerMisSeguidores } from "@/services";

export function useMisSeguidores(skip = 0, limit = 20) {
  return useQuery({
    queryKey: ["follows", "mis-seguidores", skip, limit],
    queryFn: async () => {
      const result = await obtenerMisSeguidores(skip, limit);
      if (!result.success) throw result.error;
      return result.data;
    },
  });
}