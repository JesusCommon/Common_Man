import { useMutation, useQueryClient } from "@tanstack/react-query";
import { marcarLeidoService } from "@/services";

export function useMarcarComoLeido() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (conversacionId: string) => {
      const result = await marcarLeidoService(conversacionId);
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mensajes"] });
    },
  });
}