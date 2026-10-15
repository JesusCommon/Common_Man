import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enviarMensajeService } from "@/services";

export function useEnviarMensaje() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { destinatario_id: string; contenido: string }) => {
      const result = await enviarMensajeService(payload);
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mensajes"] });
    },
  });
}