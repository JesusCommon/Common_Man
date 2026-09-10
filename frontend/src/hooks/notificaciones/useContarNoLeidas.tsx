import { useQuery } from "@tanstack/react-query";
import { contarNoLeidasService } from "@/services";

export function useContarNoLeidas() {
  return useQuery({
    queryKey: ["notificaciones", "count"],
    queryFn: async () => {
      const result = await contarNoLeidasService();
      if (!result.success) throw result.error;
      return result.data;
    },
  });
}