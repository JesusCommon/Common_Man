import { useMutation, useQueryClient } from "@tanstack/react-query";
import { activarCategoriaService } from "@/services";

export function useActivarCategoria() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await activarCategoriaService(id);
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
    },
  });
}