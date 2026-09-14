import { useQuery } from "@tanstack/react-query";
import { listarReportesPorEstadoAdminService } from "@/services";
import type { EstadoReporteEnum } from "@/api/types";

export function useListarReportesPorEstadoAdmin(
  estado: EstadoReporteEnum | "",
  params: { skip?: number; limit?: number } = {}
) {
  return useQuery({
    queryKey: ["reportes", "admin", "estado", estado, params],
    queryFn: async () => {
      if (!estado) throw new Error("Estado requerido");
      const result = await listarReportesPorEstadoAdminService(estado, params);
      if (!result.success) throw result.error;
      return result.data;
    },
    enabled: estado !== "",
  });
}