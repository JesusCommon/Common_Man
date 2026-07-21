export const LIBROS_ENDPOINTS = {
    BASE: "/libros",
    ALL: "/libros/all",
    ACTIVE: "/libros/activos",
    SEARCH: "/libros/buscar",
    BY_ID: (id) => `/libros/${id}`,
    ACTIVATE: (id) => `/libros/${id}/activar`,
    DEACTIVATE: (id) => `/libros/${id}/desactivar`,
};