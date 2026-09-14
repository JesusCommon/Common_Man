import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eliminarReporteAdminService } from "@/services";

export function useEliminarReporteAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reporteId: string) => {
      const result = await eliminarReporteAdminService(reporteId);
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reportes", "admin"] });
    },
  });
}