import { useMutation, useQueryClient } from "@tanstack/react-query";
import { crearReporteService } from "@/services";

export function useCrearReporte() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: unknown) => {
      const result = await crearReporteService(params);
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reportes"] });
    },
  });
}