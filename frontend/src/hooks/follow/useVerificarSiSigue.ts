import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { verificarSiSigueA } from "@/services";

export function useVerificarSiSigue(
  username: string, 
  options?: Omit<UseQueryOptions<{ mensaje: string; data: boolean }, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: ["follows", "sigue-a", username],
    queryFn: async () => {
      const result = await verificarSiSigueA(username);
      if (!result.success) throw result.error;
      return result.data;
    },
    enabled: !!username,
    ...options, // Permite sobrescribir 'enabled' desde el componente
  });
}