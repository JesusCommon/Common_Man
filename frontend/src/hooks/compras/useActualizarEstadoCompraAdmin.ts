import { useMutation, useQueryClient } from "@tanstack/react-query";
import { actualizarEstadoCompraAdminService } from "@/services";

export function useActualizarEstadoCompraAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: unknown }) => {
      const result = await actualizarEstadoCompraAdminService(id, payload);
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["compras", "admin"] });
    },
  });
}