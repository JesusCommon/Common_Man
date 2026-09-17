import { useQuery } from "@tanstack/react-query";
import { obtenerAutorService } from "@/services";

export function useObtenerAutor(id: string) {
  return useQuery({
    queryKey: ["autores", id],
    queryFn: async () => {
      const result = await obtenerAutorService(id);
      if (!result.success) throw result.error;
      return result.data;
    },
    enabled: !!id,
  });
}