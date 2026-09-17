import { useQuery } from "@tanstack/react-query";
import { listarAutoresPublicosService } from "@/services";

export function useAutoresPublicos() {
  return useQuery({
    queryKey: ["autores", "publicos"],
    queryFn: async () => {
      const result = await listarAutoresPublicosService();
      if (!result.success) throw result.error;
      return result.data;
    },
    staleTime: 1000 * 60 * 5,
  });
}