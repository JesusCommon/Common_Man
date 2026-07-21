export const CATEGORIAS_TIENDA_ENDPOINTS = {
  BASE: "/categorias_tienda",
  ALL: "/categorias_tienda/all",
  ACTIVE: "/categorias_tienda/activos",
  BY_ID: (id) => `/categorias_tienda/${id}`,
  ACTIVATE: (id) => `/categorias_tienda/${id}/activar`,
  DEACTIVATE: (id) => `/categorias_tienda/${id}/desactivar`,
};