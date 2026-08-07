import { useMutation, useQueryClient } from "@tanstack/react-query";
import { desactivarCuenta } from "@/services";

export function useDesactivarUsuario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await desactivarCuenta(id);
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios", "admin"] });
    },
  });
}