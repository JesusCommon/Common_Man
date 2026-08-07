import { useMutation, useQueryClient } from "@tanstack/react-query";
import { actualizarUsuarioAdmin } from "@/services";

export function useActualizarAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: unknown }) => {
      const result = await actualizarUsuarioAdmin(id, payload);
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios", "admin"] });
    },
  });
}