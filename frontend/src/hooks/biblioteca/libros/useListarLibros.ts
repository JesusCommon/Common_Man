import { useQuery } from "@tanstack/react-query";
import { listarTodosLosLibros } from "@/services";

type ListarParams = {
  skip?: number;
  limit?: number;
};

export function useListarLibros({ skip = 0, limit = 20 }: ListarParams = {}) {
  return useQuery({
    queryKey: ["libros", "todos", skip, limit],
    queryFn: async () => {
      const result = await listarTodosLosLibros(skip, limit);
      if (!result.success) throw result.error;
      return result.data;
    },
  });
}