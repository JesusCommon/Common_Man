import { useMutation, useQueryClient } from "@tanstack/react-query";
import { recargarSaldoAdministrador } from "@/services";

export function useRecargarSaldoAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: unknown }) => {
      const result = await recargarSaldoAdministrador(id, payload);
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["usuarios", "admin"] });
      queryClient.invalidateQueries({ queryKey: ["usuarios", "admin", "uuid"] });
      queryClient.invalidateQueries({ queryKey: ["usuarios", "admin", "id", variables.id] });
    },
  });
}