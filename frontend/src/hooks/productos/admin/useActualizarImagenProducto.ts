import { useMutation, useQueryClient } from "@tanstack/react-query";
import { actualizarImagenProductoService } from "@/services";

export function useActualizarImagenProducto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productoId, imagen }: { productoId: string; imagen: File }) => {
      const result = await actualizarImagenProductoService(productoId, imagen);
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
  });
}