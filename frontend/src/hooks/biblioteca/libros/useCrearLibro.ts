import { useMutation, useQueryClient } from "@tanstack/react-query";
import { crearLibroService } from "@/services";

export function useCrearLibro() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: unknown) => {
      const result = await crearLibroService(params);
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["libros"] });
    },
  });
}