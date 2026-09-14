import { useQuery } from "@tanstack/react-query";
import { listarTodosReportesAdminService } from "@/services";

export function useListarTodosReportesAdmin(params: { skip?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: ["reportes", "admin", "all", params],
    queryFn: async () => {
      const result = await listarTodosReportesAdminService(params);
      if (!result.success) throw result.error;
      return result.data;
    },
  });
}