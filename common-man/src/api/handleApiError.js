// api/handleApiError.js
export function handleApiError(error) {
  // El backend respondió con un status de error (400, 404, 500...)
  if (error.response) {
    return {
      status: error.response.status,
      message: error.response.data?.message || "Error en la respuesta del servidor",
      errors: error.response.data?.errors || null, // errores de validación, si existen
    };
  }

  // La petición se hizo pero no hubo respuesta (backend caído, sin internet)
  if (error.request) {
    return {
      status: null,
      message: "No se pudo conectar con el servidor",
      errors: null,
    };
  }

  // Error al configurar la petición
  return {
    status: null,
    message: error.message || "Error inesperado",
    errors: null,
  };
}