import { useQuery } from "@tanstack/react-query";
import { obtenerPorObjectId } from "@/services";

export function useObtenerPorObjectId(id: string | undefined) {
  return useQuery({
    queryKey: ["usuarios", "admin", "id", id],
    queryFn: async () => {
      const result = await obtenerPorObjectId(id!);
      if (!result.success) throw result.error;
      return result.data;
    },
    enabled: !!id,
  });
}