import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eliminarImagenAutorService } from "@/services";

export function useEliminarImagenAutor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (autorId: string) => {
      const result = await eliminarImagenAutorService(autorId);
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["autores"] });
    },
  });
}