import { useQuery } from "@tanstack/react-query";
import { listarMisReportesService } from "@/services";

export function useListarMisReportes(params: { skip?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: ["reportes", "mis", params],
    queryFn: async () => {
      const result = await listarMisReportesService(params);
      if (!result.success) throw result.error;
      return result.data;
    },
  });
}