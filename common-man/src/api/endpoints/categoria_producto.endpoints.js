export const CATEGORIA_PRODUCTOS_ENDPOINTS = {
  BASE: "/categoria_producto",
  ALL: "/categoria_producto/all",
  ACTIVE: "/categoria_producto/activos",
  BY_ID: (id) => `/categoria_producto/${id}`,
  ACTIVATE: (id) => `/categoria_producto/${id}/activar`,
  DEACTIVATE: (id) => `/categoria_producto/${id}/desactivar`,
};