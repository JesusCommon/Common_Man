import { useQuery } from "@tanstack/react-query";
import { listarMisNotificacionesService } from "@/services";

export function useListarMisNotificaciones(params: {
  skip?: number;
  limit?: number;
  solo_no_leidas?: boolean;
} = {}) {
  return useQuery({
    queryKey: ["notificaciones", "lista", params],
    queryFn: async () => {
      const result = await listarMisNotificacionesService(params);
      if (!result.success) throw result.error;
      return result.data;
    },
  });
}