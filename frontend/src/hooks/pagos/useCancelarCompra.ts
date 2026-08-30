import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelarCompraService } from "@/services";

export function useCancelarCompra() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: unknown) => {
      const result = await cancelarCompraService(payload);
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pagos", "historial"] });
      queryClient.invalidateQueries({ queryKey: ["compras"] });
    },
  });
}