import { useMutation } from "@tanstack/react-query";
import { refrescarToken } from "@/services";

export function useRefresh() {
  return useMutation({
    mutationFn: async (payload: unknown) => {
      const result = await refrescarToken(payload);
      if (!result.success) throw result.error;
      return result.data;
    },
  });
}