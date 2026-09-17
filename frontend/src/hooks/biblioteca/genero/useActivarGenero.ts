import { useMutation, useQueryClient } from "@tanstack/react-query";
import { activarGeneroService } from "@/services";

export function useActivarGenero() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await activarGeneroService(id);
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["generos"] });
    },
  });
}