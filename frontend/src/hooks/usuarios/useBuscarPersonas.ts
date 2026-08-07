import { useQuery } from "@tanstack/react-query";
import { buscarPersonasService } from "@/services";

export function useBuscarPersonas(params?: {
  nombre?: string;
  apellido?: string;
  username?: string;
  skip?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["usuarios", "buscar", params],
    queryFn: async () => {
      const result = await buscarPersonasService(params);
      if (!result.success) throw result.error;
      return result.data;
    },
    enabled: !!params, // Solo ejecuta si hay params (ajusta a tu gusto)
  });
}