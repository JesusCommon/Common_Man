import { useMutation } from "@tanstack/react-query";
import { librosApi } from "@/api";

export interface PrepararLecturaResponse {
  libro_id: string;
  titulo: string;
  url_lectura: string;
  expira_en_segundos: number;
}

export function usePrepararLectura() {
  return useMutation({
    mutationFn: async (libroId: string): Promise<PrepararLecturaResponse> => {
      const response = await librosApi.prepararLectura(libroId);
      return response;
    },
  });
}