import { useState } from "react";
import { usuarioService } from "../../services/usuarios.service";

export function useBuscarUsuarios() {
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorApi, setErrorApi] = useState(null);

  const buscar = async (filtros = {}) => {
    setErrorApi(null);
    setLoading(true);
    try {
      const data = await usuarioService.buscar(filtros);
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