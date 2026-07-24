import { useState } from "react";
import { libroService } from "../../services/libros.service";

export function useBuscarLibros() {
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorApi, setErrorApi] = useState(null);

  const buscar = async (filtros = {}) => {
    setErrorApi(null);
    setLoading(true);
    try {
      const data = await libroService.buscar(filtros);
      setResultados(data);
      return { success: true, data };
    } catch (err) {
      setErrorApi(err);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return { resultados, buscar, loading, errorApi };
}