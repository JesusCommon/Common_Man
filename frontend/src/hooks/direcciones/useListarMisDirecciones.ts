import { useQuery } from "@tanstack/react-query";
import { listarMisDireccionesService } from "@/services";

export function useListarMisDirecciones(
  params: { skip?: number; limit?: number } = {}
) {
  return useQuery({
    queryKey: ["direcciones", "mias", params],
    queryFn: async () => {
      const result = await listarMisDireccionesService(params);
      if (!result.success) throw result.error;
      return result.data;
    },
  });
}