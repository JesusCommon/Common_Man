import { useQuery } from "@tanstack/react-query";
import { listarCategoriasInactivasService } from "@/services";

export function useListarCategoriasInactivas(params: { skip?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: ["categorias", "inactivas", params],
    queryFn: async () => {
      const result = await listarCategoriasInactivasService(params);
      if (!result.success) throw result.error;
      return result.data;
    },
  });
}