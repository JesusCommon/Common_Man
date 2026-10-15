import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ocultarMensajeService } from "@/services";

export function useOcultarMensaje() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (mensajeId: string) => {
      const result = await ocultarMensajeService(mensajeId);
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mensajes"] });
    },
  });
}