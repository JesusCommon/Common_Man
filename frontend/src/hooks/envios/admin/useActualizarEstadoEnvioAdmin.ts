import { useMutation, useQueryClient } from "@tanstack/react-query";
import { actualizarEstadoEnvioAdminService } from "@/services";

export function useActualizarEstadoEnvioAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: unknown }) => {
      const result = await actualizarEstadoEnvioAdminService(id, payload);
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["envios"] });
      queryClient.invalidateQueries({ queryKey: ["compras"] });
    },
  });
}