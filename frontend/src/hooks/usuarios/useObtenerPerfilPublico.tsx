import { useQuery } from "@tanstack/react-query";
import { obtenerPerfilPublico } from "@/services";

export function useObtenerPerfilPublico(username: string) {
  return useQuery({
    queryKey: ["usuario", "perfil", username],
    queryFn: async () => {
      const result = await obtenerPerfilPublico(username);
      if (!result.success) throw result.error;
      return result.data;
    },
    enabled: !!username,
  });
}