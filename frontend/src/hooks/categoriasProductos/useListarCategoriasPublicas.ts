import { useQuery } from "@tanstack/react-query";
import { listarCategoriasPublicasService } from "@/services";

export function useListarCategoriasPublicas() {
  return useQuery({
    queryKey: ["categorias", "publicas"],
    queryFn: async () => {
      const result = await listarCategoriasPublicasService();
      if (!result.success) throw result.error;
      return result.data;
    },
  });
}