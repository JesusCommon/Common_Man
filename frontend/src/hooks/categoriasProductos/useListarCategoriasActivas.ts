import { useQuery } from "@tanstack/react-query";
import { listarCategoriasActivasService } from "@/services";

export function useListarCategoriasActivas(params: { skip?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: ["categorias", "activas", params],
    queryFn: async () => {
      const result = await listarCategoriasActivasService(params);
      if (!result.success) throw result.error;
      return result.data;
    },
  });
}