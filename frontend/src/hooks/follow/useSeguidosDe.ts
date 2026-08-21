import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { obtenerSeguidosDe } from "@/services";
import type { Paginado } from "@/api/types";
import type { FollowPublicResponse } from "@/schemas"; // ✅ Desde schemas, no desde api/types

export function useSeguidosDe(
  username: string,
  skip = 0,
  limit = 20,
  options?: Omit<UseQueryOptions<Paginado<FollowPublicResponse>, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: ["follows", "seguidos-de", username, skip, limit],
    queryFn: async () => {
      const result = await obtenerSeguidosDe(username, skip, limit);
      if (!result.success) throw result.error;
      return result.data;
    },
    enabled: !!username,
    ...options,
  });
}