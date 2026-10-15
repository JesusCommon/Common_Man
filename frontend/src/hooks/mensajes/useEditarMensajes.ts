import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editarMensajeService } from "@/services";

export function useEditarMensaje() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      mensajeId,
      contenido,
    }: {
      mensajeId: string;
      contenido: string;
    }) => {
      const result = await editarMensajeService(mensajeId, contenido);
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mensajes"] });
    },
  });
}