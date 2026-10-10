import { useMutation, useQueryClient } from "@tanstack/react-query";
import { actualizarImagenAutorService } from "@/services";

export function useActualizarImagenAutor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ autorId, imagen }: { autorId: string; imagen: File }) => {
      const result = await actualizarImagenAutorService(autorId, imagen);
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["autores"] });
    },
  });
}