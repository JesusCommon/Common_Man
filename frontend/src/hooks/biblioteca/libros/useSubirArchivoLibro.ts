import { useMutation, useQueryClient } from "@tanstack/react-query";
import { subirArchivoLibroService } from "@/services";

export function useSubirArchivoLibro() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ libroId, archivo }: { libroId: string; archivo: File }) => {
      const result = await subirArchivoLibroService(libroId, archivo);
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["libros"] });
      queryClient.invalidateQueries({ queryKey: ["libros", "admin"] });
    },
  });
}