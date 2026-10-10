import { useMutation, useQueryClient } from "@tanstack/react-query";
import { actualizarPortadaLibroService } from "@/services";

export function useActualizarPortadaLibro() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ libroId, imagen }: { libroId: string; imagen: File }) => {
      const result = await actualizarPortadaLibroService(libroId, imagen);
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["libros"] });
    },
  });
}