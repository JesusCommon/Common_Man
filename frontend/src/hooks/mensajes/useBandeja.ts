import { useQuery } from "@tanstack/react-query";
import { obtenerBandejaService } from "@/services";

export function useBandeja(skip = 0, limit = 20) {
  return useQuery({
    queryKey: ["mensajes", "bandeja", { skip, limit }],
    queryFn: async () => {
      const result = await obtenerBandejaService(skip, limit);
      if (!result.success) throw result.error;
      return result.data;
    },
  });
}