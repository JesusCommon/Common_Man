import { useMutation } from "@tanstack/react-query";
import { cambiarPassword } from "@/services";

export function useCambiarPassword() {
  return useMutation({
    mutationFn: async (payload: unknown) => {
      const result = await cambiarPassword(payload);
      if (!result.success) throw result.error;
      return result.data;
    },
  });
}