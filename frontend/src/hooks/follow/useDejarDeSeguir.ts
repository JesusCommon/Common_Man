import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dejarDeSeguirUsuario } from "@/services";

export function useDejarDeSeguir() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (username: string) => {
      const result = await dejarDeSeguirUsuario(username);
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["follows"] });
      queryClient.invalidateQueries({ queryKey: ["perfil-publico"] });
    },
  });
}