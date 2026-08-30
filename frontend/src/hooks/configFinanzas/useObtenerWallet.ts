import { useQuery } from "@tanstack/react-query";
import { obtenerWalletService } from "@/services";

export function useObtenerWallet() {
  return useQuery({
    queryKey: ["finanzas", "wallet"],
    queryFn: async () => {
      const result = await obtenerWalletService();
      if (!result.success) throw result.error;
      return result.data;
    },
    staleTime: 1000 * 60 * 2,
  });
}