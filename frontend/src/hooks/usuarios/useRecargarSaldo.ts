import { useMutation, useQueryClient } from "@tanstack/react-query";
import { recargarSaldo } from "@/services";
import { useAuthStore } from "@/store";

export function useRecargarSaldo() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: async (payload: unknown) => {
      const result = await recargarSaldo(payload);
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: (data) => {
      if (data.data) setUser(data.data);
      queryClient.invalidateQueries({ queryKey: ["usuario", "perfil"] });
    },
  });
}