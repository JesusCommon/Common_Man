import { useMutation, useQueryClient } from "@tanstack/react-query";
import { actualizarPerfil } from "@/services";

export function useActualizarPerfil() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: unknown) => {
      const result = await actualizarPerfil(payload);
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      // Invalida el caché del perfil para que se recargue
      queryClient.invalidateQueries({ queryKey: ["usuario", "perfil"] });
    },
  });
}