import { useQuery } from "@tanstack/react-query";
import { listarPorCategoriaService } from "@/services";

export function useListarPorCategoria(
  categoriaId: string,
  params: { skip?: number; limit?: number } = {}
) {
  return useQuery({
    queryKey: ["productos", "categoria", categoriaId, params],
    queryFn: async () => {
      const result = await listarPorCategoriaService({ categoriaId, ...params });
      if (!result.success) throw result.error;
      return result.data;
    },
    enabled: !!categoriaId,
  });
}