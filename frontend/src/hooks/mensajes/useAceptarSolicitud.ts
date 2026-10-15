import { useMutation, useQueryClient } from "@tanstack/react-query";
import { aceptarSolicitudService } from "@/services";

export function useAceptarSolicitud() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (conversacionId: string) => {
      const result = await aceptarSolicitudService(conversacionId);
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mensajes"] });
    },
  });
}