import { useMutation, useQueryClient } from "@tanstack/react-query";
import { crearProductoService } from "@/services";

export function useCrearProducto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: unknown) => {
      const result = await crearProductoService(payload);
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
  });
}