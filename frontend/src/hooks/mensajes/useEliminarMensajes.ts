import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eliminarMensajeService } from "@/services";

export function useEliminarMensaje() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (mensajeId: string) => {
      const result = await eliminarMensajeService(mensajeId);
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mensajes"] });
    },
  });
}