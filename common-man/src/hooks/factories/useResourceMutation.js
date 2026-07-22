import { useState } from "react";

/**
 * @param {Function} mutationFn - función que ejecuta la acción, ej: (data) => usuarioService.crear(data)
 * @param {Object} [schema] - schema de Zod opcional. Si no se pasa, no se valida (ideal para activar/desactivar)
 */
export function useResourceMutation(mutationFn, schema = null) {
  const [loading, setLoading] = useState(false);
  const [errores, setErrores] = useState(null);
  const [errorApi, setErrorApi] = useState(null);

  const ejecutar = async (input) => {
    setErrores(null);
    setErrorApi(null);

    let datosValidados = input;

    if (schema) {
      const result = schema.safeParse(input);
      if (!result.success) {
        const erroresPorCampo = {};
        result.error.issues.forEach((issue) => {
          erroresPorCampo[issue.path[0]] = issue.message;
        });
        setErrores(erroresPorCampo);
        return { success: false };
      }
      datosValidados = result.data;
    }

    setLoading(true);
    try {
      const data = await mutationFn(datosValidados);
      return { success: true, data };
    } catch (err) {
      setErrorApi(err);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return { ejecutar, loading, errores, errorApi };
}