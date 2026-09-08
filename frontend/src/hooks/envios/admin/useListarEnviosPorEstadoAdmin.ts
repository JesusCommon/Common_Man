import { useQuery } from "@tanstack/react-query";
import { listarEnviosPorEstadoAdminService } from "@/services";
import type { EstadoEnvioEnum } from "@/api/types";

export function useListarEnviosPorEstadoAdmin(
  estado: EstadoEnvioEnum,
  params: { skip?: number; limit?: number } = {}
) {
  return useQuery({
    queryKey: ["envios", "admin", "estado", estado, params],
    queryFn: async () => {
      const result = await listarEnviosPorEstadoAdminService({
        estado,
        ...params,
      });
      if (!result.success) throw result.error;
      return result.data;
    },
    enabled: !!estado,
  });
}