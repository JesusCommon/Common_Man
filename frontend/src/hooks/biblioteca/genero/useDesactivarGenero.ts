import { useMutation, useQueryClient } from "@tanstack/react-query";
import { desactivarGeneroService } from "@/services";

export function useDesactivarGenero() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await desactivarGeneroService(id);
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["generos"] });
    },
  });
}