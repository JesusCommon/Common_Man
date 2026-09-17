import { useMutation, useQueryClient } from "@tanstack/react-query";
import { desactivarAutorService } from "@/services";

export function useDesactivarAutor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await desactivarAutorService(id);
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["autores"] });
    },
  });
}