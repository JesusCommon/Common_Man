import { useMutation, useQueryClient } from "@tanstack/react-query";
import { actualizarEditorialService } from "@/services";

interface ActualizarEditorialVars {
  id: string;
  data: unknown;
}

export function useActualizarEditorial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: ActualizarEditorialVars) => {
      const result = await actualizarEditorialService(id, data);
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["editoriales"] });
    },
  });
}