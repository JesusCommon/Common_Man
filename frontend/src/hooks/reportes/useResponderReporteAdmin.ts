import { useMutation, useQueryClient } from "@tanstack/react-query";
import { responderReporteAdminService } from "@/services";

export function useResponderReporteAdmin(reporteId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: unknown) => {
      const result = await responderReporteAdminService(reporteId, params);
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