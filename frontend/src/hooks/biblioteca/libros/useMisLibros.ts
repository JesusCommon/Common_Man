import { useQuery } from "@tanstack/react-query";
import { listarMisLibrosService } from "@/services";

export function useMisLibros() {
  return useQuery({
    queryKey: ["libros", "mis-libros"],
    queryFn: async () => {
      const result = await listarMisLibrosService();
      if (!result.success) throw result.error;
      return result.data;
    },
  });
}