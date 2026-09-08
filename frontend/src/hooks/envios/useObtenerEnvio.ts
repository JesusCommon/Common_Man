import { useQuery } from "@tanstack/react-query";
import { obtenerEnvioService } from "@/services";

export function useObtenerEnvio(id: string) {
  return useQuery({
    queryKey: ["envios", id],
    queryFn: async () => {
      const result = await obtenerEnvioService(id);
      if (!result.success) throw result.error;
      return result.data;
    },
    enabled: !!id,
  });
}