import { useMutation, useQueryClient } from "@tanstack/react-query";
import { actualizarLibroService } from "@/services";

interface ActualizarLibroVars {
  id: string;
  data: unknown;
}

export function useActualizarLibro() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: ActualizarLibroVars) => {
      const result = await actualizarLibroService(id, data);
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["libros"] });
    },
  });
}