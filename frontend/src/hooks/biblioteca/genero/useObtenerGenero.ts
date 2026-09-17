import { useQuery } from "@tanstack/react-query";
import { obtenerGeneroService } from "@/services";

export function useObtenerGenero(id: string) {
  return useQuery({
    queryKey: ["generos", id],
    queryFn: async () => {
      const result = await obtenerGeneroService(id);
      if (!result.success) throw result.error;
      return result.data;
    },
    enabled: !!id,
  });
}