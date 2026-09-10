import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eliminarNotificacionService } from "@/services";

export function useEliminarNotificacion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await eliminarNotificacionService(id);
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notificaciones"] });
    },
  });
}