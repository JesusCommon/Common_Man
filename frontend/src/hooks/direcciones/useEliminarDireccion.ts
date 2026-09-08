import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eliminarDireccionService } from "@/services";

export function useEliminarDireccion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await eliminarDireccionService(id);
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["direcciones"] });
    },
  });
}