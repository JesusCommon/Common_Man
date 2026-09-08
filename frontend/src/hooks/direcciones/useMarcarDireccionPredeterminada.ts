import { useMutation, useQueryClient } from "@tanstack/react-query";
import { marcarDireccionPredeterminadaService } from "@/services";

export function useMarcarDireccionPredeterminada() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await marcarDireccionPredeterminadaService(id);
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["direcciones"] });
    },
  });
}