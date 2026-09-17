import { useMutation, useQueryClient } from "@tanstack/react-query";
import { desactivarLibroService } from "@/services";

export function useDesactivarLibro() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await desactivarLibroService(id);
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["libros"] });
    },
  });
}