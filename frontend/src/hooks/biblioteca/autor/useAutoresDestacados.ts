import { useQuery } from "@tanstack/react-query";
import { listarAutoresDestacadosService } from "@/services";

export function useAutoresDestacados(limit = 6) {
  return useQuery({
    queryKey: ["autores", "destacados", limit],
    queryFn: async () => {
      const result = await listarAutoresDestacadosService(limit);
      if (!result.success) throw result.error;
      return result.data;
    },
    staleTime: 1000 * 60 * 5,
  });
}