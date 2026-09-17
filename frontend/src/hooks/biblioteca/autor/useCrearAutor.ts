import { useMutation, useQueryClient } from "@tanstack/react-query";
import { crearAutorService } from "@/services";

export function useCrearAutor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: unknown) => {
      const result = await crearAutorService(params);
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["autores"] });
    },
  });
}