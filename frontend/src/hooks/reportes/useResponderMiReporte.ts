import { useMutation, useQueryClient } from "@tanstack/react-query";
import { responderMiReporteService } from "@/services";

export function useResponderMiReporte(reporteId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: unknown) => {
      const result = await responderMiReporteService(reporteId, params);
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reportes", reporteId] });
      queryClient.invalidateQueries({ queryKey: ["reportes", "mis"] });
    },
  });
}