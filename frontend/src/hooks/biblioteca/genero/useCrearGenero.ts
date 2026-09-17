import { useMutation, useQueryClient } from "@tanstack/react-query";
import { crearGeneroService } from "@/services";

export function useCrearGenero() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: unknown) => {
      const result = await crearGeneroService(params);
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["generos"] });
    },
  });
}