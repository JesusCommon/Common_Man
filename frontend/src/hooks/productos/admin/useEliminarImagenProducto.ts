import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eliminarImagenProductoService } from "@/services";

export function useEliminarImagenProducto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productoId: string) => {
      const result = await eliminarImagenProductoService(productoId);
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
  });
}