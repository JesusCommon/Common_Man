import { useMutation, useQueryClient } from "@tanstack/react-query";
import { marcarTodasNotificacionesLeidasService } from "@/services";

export function useMarcarTodasNotificacionesLeidas() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const result = await marcarTodasNotificacionesLeidasService();
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notificaciones"] });
    },
  });
}