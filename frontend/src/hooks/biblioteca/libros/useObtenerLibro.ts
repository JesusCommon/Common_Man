import { useQuery } from "@tanstack/react-query";
import { obtenerLibroService } from "@/services";

export function useObtenerLibro(id: string) {
  return useQuery({
    queryKey: ["libros", id],
    queryFn: async () => {
      const result = await obtenerLibroService(id);
      if (!result.success) throw result.error;
      return result.data;
    },
    enabled: !!id,
  });
}