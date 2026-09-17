import { useQuery } from "@tanstack/react-query";
import { listarLibrosAdminService } from "@/services";
import type { ListarLibrosAdminParamsInput } from "@/schemas";

export function useListarLibrosAdmin(
  params: Partial<ListarLibrosAdminParamsInput> = {}
) {
  return useQuery({
    queryKey: ["libros", "admin", params],
    queryFn: async () => {
      const result = await listarLibrosAdminService(params);
      if (!result.success) throw result.error;
      return result.data;
    },
  });
}