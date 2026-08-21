import { useQuery } from "@tanstack/react-query";
import { obtenerPerfilPublicoService } from "@/services";

export function useObtenerPerfilPublico(username: string) {
  return useQuery({
    queryKey: ["usuario", "perfil", username],
    queryFn: async () => {
      const result = await obtenerPerfilPublicoService(username);
      if (!result.success) throw result.error;
      return result.data;
    },
    enabled: !!username,
  });
}