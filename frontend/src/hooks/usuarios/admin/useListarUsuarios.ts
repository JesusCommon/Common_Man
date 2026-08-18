import { useQuery } from "@tanstack/react-query";
import { listarTodos } from "@/services";

type ListarParams = {
  skip?: number;
  limit?: number;
};

export function useListarUsuarios({ skip = 0, limit = 20 }: ListarParams = {}) {
  return useQuery({
    queryKey: ["usuarios", "admin", "todos", skip, limit],
    queryFn: async () => {
      const result = await listarTodos(skip, limit);
      if (!result.success) throw result.error;
      return result.data;
    },
  });
}