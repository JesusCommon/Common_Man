import { useQuery } from "@tanstack/react-query";
import { listarGenerosPublicosService } from "@/services";

export function useGenerosPublicos() {
  return useQuery({
    queryKey: ["generos", "publicos"],
    queryFn: async () => {
      const result = await listarGenerosPublicosService();
      if (!result.success) throw result.error;
      return result.data;
    },
    staleTime: 1000 * 60 * 5,
  });
}