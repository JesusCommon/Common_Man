import { useMutation, useQueryClient } from "@tanstack/react-query";
import { crearCompraService } from "@/services";

export function useCrearCompra() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: unknown) => {
      const result = await crearCompraService(payload);
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["compras", "mis-compras"] });
      queryClient.invalidateQueries({ queryKey: ["libros"] });
      queryClient.invalidateQueries({ queryKey: ["usuario", "me"] });
      queryClient.invalidateQueries({ queryKey: ["usuario", "perfil"] });
      queryClient.invalidateQueries({ queryKey: ["finanzas"] });
    },
  });
}