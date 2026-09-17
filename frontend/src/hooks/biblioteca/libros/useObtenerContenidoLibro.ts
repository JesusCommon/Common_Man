import { useQuery } from "@tanstack/react-query";
import { obtenerContenidoLibroService } from "@/services";

export function useObtenerContenidoLibro(id: string) {
  return useQuery({
    queryKey: ["libros", id, "contenido"],
    queryFn: async () => {
      const result = await obtenerContenidoLibroService(id);
      if (!result.success) throw result.error;
      return result.data;
    },
    enabled: !!id,
    retry: false,
  });
}