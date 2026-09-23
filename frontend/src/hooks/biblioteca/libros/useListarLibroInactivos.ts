import { useQuery } from "@tanstack/react-query";
import { listarLibrosInactivos } from "@/services";

type ListarParams = {
  skip?: number;
  limit?: number;
};

export function useListarLibrosInactivos({ skip = 0, limit = 20 }: ListarParams = {}) {
  return useQuery({
    queryKey: ["usuarios", "inactivos", skip, limit],
    queryFn: async () => {
      const result = await listarLibrosInactivos(skip, limit);
      if (!result.success) throw result.error;
      return result.data;
    },
  });
}