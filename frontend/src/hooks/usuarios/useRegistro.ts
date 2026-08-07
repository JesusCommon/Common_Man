import { useMutation } from "@tanstack/react-query";
import { registrarUsuario } from "@/services";

export function useRegistro() {
  return useMutation({
    mutationFn: async (payload: unknown) => {
      const result = await registrarUsuario(payload);
      if (!result.success) throw result.error;
      return result.data;
    },
  });
}