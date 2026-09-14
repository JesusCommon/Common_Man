import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eliminarMiReporteService } from "@/services";

export function useEliminarMiReporte() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reporteId: string) => {
      const result = await eliminarMiReporteService(reporteId);
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reportes", "mis"] });
    },
  });
}