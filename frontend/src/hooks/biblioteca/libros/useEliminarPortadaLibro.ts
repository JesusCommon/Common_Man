import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eliminarPortadaLibroService } from "@/services";

export function useEliminarPortadaLibro() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (libroId: string) => {
      const result = await eliminarPortadaLibroService(libroId);
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["libros"] });
    },
  });
}