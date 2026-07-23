export const PRODUCTOS_ENDPOINTS = {
    BASE: "/productos",
    ALL: "/productos/all",
    ACTIVE: "/productos/activos",
    SEARCH: "/productos/buscar",
    BY_IDENTIFIER: (identificador) => `/productos/identificador/${identificador}`,
    BY_ID: (id) => `/productos/${id}`,
    ACTIVATE: (id) => `/productos/${id}/activar`,
    DEACTIVATE: (id) => `/productos/${id}/desactivar`,
};