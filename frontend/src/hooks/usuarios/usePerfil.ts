import { useQuery } from "@tanstack/react-query";
import { miPerfil } from "@/services";

export function usePerfil() {
  return useQuery({
    queryKey: ["usuario", "perfil"],
    queryFn: async () => {
      const result = await miPerfil();
      if (!result.success) throw result.error;
      return result.data;
    },
  });
}