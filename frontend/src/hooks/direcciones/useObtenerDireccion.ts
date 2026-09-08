import { useQuery } from "@tanstack/react-query";
import { obtenerDireccionService } from "@/services";

export function useObtenerDireccion(id: string) {
  return useQuery({
    queryKey: ["direcciones", id],
    queryFn: async () => {
      const result = await obtenerDireccionService(id);
      if (!result.success) throw result.error;
      return result.data;
    },
    enabled: !!id,
  });
}