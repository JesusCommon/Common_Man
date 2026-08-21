import { useMutation, useQueryClient } from "@tanstack/react-query";
import { seguirUsuario } from "@/services";

export function useSeguir() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: unknown) => {
      const result = await seguirUsuario(payload);
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["follows"] });
      queryClient.invalidateQueries({ queryKey: ["perfil-publico"] });
    },
  });
}