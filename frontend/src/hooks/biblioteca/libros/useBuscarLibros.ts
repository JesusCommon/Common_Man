import { useQuery } from "@tanstack/react-query";
import { buscarLibrosService } from "@/services";
import type { BuscarLibrosParamsInput } from "@/schemas";

export function useBuscarLibros(params: Partial<BuscarLibrosParamsInput> = {}) {
  return useQuery({
    queryKey: ["libros", "buscar", params],
    queryFn: async () => {
      const result = await buscarLibrosService(params);
      if (!result.success) throw result.error;
      return result.data;
    },
  });
}