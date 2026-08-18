import { useMutation, useQueryClient } from "@tanstack/react-query";
import { restarSaldoAdministrador } from "@/services";

export function useRestarSaldoAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: unknown }) => {
      const result = await restarSaldoAdministrador(id, payload);
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