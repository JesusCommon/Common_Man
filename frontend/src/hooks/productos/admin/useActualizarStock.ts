import { useMutation, useQueryClient } from "@tanstack/react-query";
import { actualizarStockService } from "@/services";

export function useActualizarStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: unknown }) => {
      const result = await actualizarStockService(id, payload);
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      queryClient.invalidateQueries({ queryKey: ["productos", "admin", variables.id] });
    },
  });
}