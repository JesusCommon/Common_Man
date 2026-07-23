export const CATEGORIA_LIBROS_ENDPOINTS = {
  BASE: "/categoria_libro",
  ALL: "/categoria_libro/all",
  ACTIVE: "/categoria_libro/activos",
  BY_ID: (id) => `/categoria_libro/${id}`,
  ACTIVATE: (id) => `/categoria_libro/${id}/activar`,
  DEACTIVATE: (id) => `/categoria_libro/${id}/desactivar`,
};