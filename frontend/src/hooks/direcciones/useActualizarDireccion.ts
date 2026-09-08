import { useMutation, useQueryClient } from "@tanstack/react-query";
import { actualizarDireccionService } from "@/services";

export function useActualizarDireccion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: unknown }) => {
      const result = await actualizarDireccionService(id, payload);
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["direcciones"] });
    },
  });
}