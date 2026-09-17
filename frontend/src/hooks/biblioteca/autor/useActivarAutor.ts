import { useMutation, useQueryClient } from "@tanstack/react-query";
import { activarAutorService } from "@/services";

export function useActivarAutor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await activarAutorService(id);
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["autores"] });
    },
  });
}