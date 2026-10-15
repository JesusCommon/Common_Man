import { useQuery } from "@tanstack/react-query";
import { obtenerSolicitudesService } from "@/services";

export function useSolicitudes(skip = 0, limit = 20) {
  return useQuery({
    queryKey: ["mensajes", "solicitudes", { skip, limit }],
    queryFn: async () => {
      const result = await obtenerSolicitudesService(skip, limit);
      if (!result.success) throw result.error;
      return result.data;
    },
  });
}