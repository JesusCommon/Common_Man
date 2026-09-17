import { useMutation, useQueryClient } from "@tanstack/react-query";
import { activarLibroService } from "@/services";

export function useActivarLibro() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await activarLibroService(id);
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["libros"] });
    },
  });
}