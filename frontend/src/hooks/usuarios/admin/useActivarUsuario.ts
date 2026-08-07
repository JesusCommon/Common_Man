import { useMutation, useQueryClient } from "@tanstack/react-query";
import { activarCuenta } from "@/services";

export function useActivarUsuario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await activarCuenta(id);
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios", "admin"] });
    },
  });
}