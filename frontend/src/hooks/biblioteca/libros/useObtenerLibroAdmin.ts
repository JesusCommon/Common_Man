import { useQuery } from "@tanstack/react-query";
import { obtenerLibroAdminService } from "@/services";

export function useObtenerLibroAdmin(id: string) {
  return useQuery({
    queryKey: ["libros", "admin", id],
    queryFn: async () => {
      const result = await obtenerLibroAdminService(id);
      if (!result.success) throw result.error;
      return result.data;
    },
    enabled: !!id,
  });
}