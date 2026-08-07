import { useQuery } from "@tanstack/react-query";
import { listarTodos } from "@/services";

export function useListarUsuarios() {
  return useQuery({
    queryKey: ["usuarios", "admin", "todos"],
    queryFn: async () => {
      const result = await listarTodos();
      if (!result.success) throw result.error;
      return result.data;
    },
  });
}