import { useMutation, useQueryClient } from "@tanstack/react-query";
import { actualizarAutorService } from "@/services";

interface ActualizarAutorVars {
  id: string;
  data: unknown;
}

export function useActualizarAutor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: ActualizarAutorVars) => {
      const result = await actualizarAutorService(id, data);
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["autores"] });
    },
  });
}