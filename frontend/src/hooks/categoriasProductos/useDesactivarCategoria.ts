import { useMutation, useQueryClient } from "@tanstack/react-query";
import { desactivarCategoriaService } from "@/services";

export function useDesactivarCategoria() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await desactivarCategoriaService(id);
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias"] });
    },
  });
}