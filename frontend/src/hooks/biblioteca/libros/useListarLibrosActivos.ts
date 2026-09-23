import { useQuery } from "@tanstack/react-query";
import { listarLibrosActivos } from "@/services";

type ListarParams = {
  skip?: number;
  limit?: number;
};

export function useListarLibrosActivos({ skip = 0, limit = 20 }: ListarParams = {}) {
  return useQuery({
    queryKey: ["libros", "activos", skip, limit],
    queryFn: async () => {
      const result = await listarLibrosActivos(skip, limit);
      if (!result.success) throw result.error;
      return result.data;
    },
  });
}