import { useQuery } from "@tanstack/react-query";
import { obtenerCategoriaPorIdService } from "@/services";

export function useObtenerCategoriaPorId(id: string) {
  return useQuery({
    queryKey: ["categorias", id],
    queryFn: async () => {
      const result = await obtenerCategoriaPorIdService(id);
      if (!result.success) throw result.error;
      return result.data;
    },
    enabled: !!id,
  });
}