import { useQuery } from "@tanstack/react-query";
import { obtenerMisSeguidos } from "@/services";

export function useMisSeguidos(skip = 0, limit = 20) {
  return useQuery({
    queryKey: ["follows", "mis-seguidos", skip, limit],
    queryFn: async () => {
      const result = await obtenerMisSeguidos(skip, limit);
      if (!result.success) throw result.error;
      return result.data;
    },
  });
}