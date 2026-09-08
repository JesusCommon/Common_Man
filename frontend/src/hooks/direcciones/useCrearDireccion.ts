import { useMutation, useQueryClient } from "@tanstack/react-query";
import { crearDireccionService } from "@/services";

export function useCrearDireccion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: unknown) => {
      const result = await crearDireccionService(payload);
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["direcciones"] });
    },
  });
}