import { useMutation, useQueryClient } from "@tanstack/react-query";
import { procesarPagoService } from "@/services";

export function useProcesarPago() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: unknown) => {
      const result = await procesarPagoService(payload);
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pagos", "historial"] });
      queryClient.invalidateQueries({ queryKey: ["compras"] });
    },
  });
}