import { useMutation, useQueryClient } from "@tanstack/react-query";
import { actualizarEstadoReporteAdminService } from "@/services";

export function useActualizarEstadoReporteAdmin(reporteId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: unknown) => {
      const result = await actualizarEstadoReporteAdminService(reporteId, params);
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reportes", "admin", reporteId] });
      queryClient.invalidateQueries({ queryKey: ["reportes", "admin", "all"] });
      queryClient.invalidateQueries({ queryKey: ["reportes", "admin", "estado"] });
    },
  });
}