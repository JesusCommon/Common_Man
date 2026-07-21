export const CATEGORIAS_LIBROS_ENDPOINTS = {
  BASE: "/categorias_libro",
  ALL: "/categorias_libro/all",
  ACTIVE: "/categorias_libro/activos",
  BY_ID: (id) => `/categorias_libro/${id}`,
  ACTIVATE: (id) => `/categorias_libro/${id}/activar`,
  DEACTIVATE: (id) => `/categorias_libro/${id}/desactivar`,
};