import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rechazarSolicitudService } from "@/services";

export function useRechazarSolicitud() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (conversacionId: string) => {
      const result = await rechazarSolicitudService(conversacionId);
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mensajes"] });
    },
  });
}