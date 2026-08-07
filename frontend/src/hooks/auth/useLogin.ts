import { useMutation } from "@tanstack/react-query";
import { iniciarSesion } from "@/services";

export function useLogin() {
  return useMutation({
    mutationFn: async (credentials: unknown) => {
      const result = await iniciarSesion(credentials);
      if (!result.success) throw result.error;
      return result.data;
    },
  });
}