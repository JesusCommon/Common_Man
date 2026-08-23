import { useQuery } from "@tanstack/react-query";
import { listarTodasLasCategoriasService } from "@/services";

export function useListarTodasLasCategorias(params: { skip?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: ["categorias", "todas", params],
    queryFn: async () => {
      const result = await listarTodasLasCategoriasService(params);
      if (!result.success) throw result.error;
      return result.data;
    },
  });
}