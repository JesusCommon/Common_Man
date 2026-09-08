import { useMutation, useQueryClient } from "@tanstack/react-query";
import { crearEnvioAdminService } from "@/services";

export function useCrearEnvioAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: unknown) => {
      const result = await crearEnvioAdminService(payload);
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["envios"] });
      queryClient.invalidateQueries({ queryKey: ["compras"] });
    },
  });
}