import { useMutation, useQueryClient } from "@tanstack/react-query";
import { marcarNotificacionLeidaService } from "@/services";

export function useMarcarNotificacionLeida() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await marcarNotificacionLeidaService(id);
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notificaciones"] });
    },
  });
}