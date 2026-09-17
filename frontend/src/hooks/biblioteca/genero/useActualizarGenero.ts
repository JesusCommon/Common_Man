import { useMutation, useQueryClient } from "@tanstack/react-query";
import { actualizarGeneroService } from "@/services";

interface ActualizarGeneroVars {
  id: string;
  data: unknown;
}

export function useActualizarGenero() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: ActualizarGeneroVars) => {
      const result = await actualizarGeneroService(id, data);
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["generos"] });
    },
  });
}