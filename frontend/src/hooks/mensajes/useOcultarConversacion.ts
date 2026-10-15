import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ocultarConversacionService } from "@/services";

export function useOcultarConversacion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (conversacionId: string) => {
      const result = await ocultarConversacionService(conversacionId);
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mensajes"] });
    },
  });
}