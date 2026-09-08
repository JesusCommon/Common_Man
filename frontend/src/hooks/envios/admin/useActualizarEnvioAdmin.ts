import { useMutation, useQueryClient } from "@tanstack/react-query";
import { actualizarEnvioAdminService } from "@/services";

export function useActualizarEnvioAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: unknown }) => {
      const result = await actualizarEnvioAdminService(id, payload);
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["envios"] });
    },
  });
}