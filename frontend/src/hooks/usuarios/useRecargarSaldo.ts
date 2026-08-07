import { useMutation, useQueryClient } from "@tanstack/react-query";
import { recargarSaldo } from "@/services";

export function useRecargarSaldo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: unknown) => {
      const result = await recargarSaldo(payload);
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuario", "perfil"] });
    },
  });
}