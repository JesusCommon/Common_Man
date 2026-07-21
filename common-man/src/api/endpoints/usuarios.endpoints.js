export const USUARIOS_ENDPOINTS = {
  BASE: "/usuarios",
  ALL: "/usuarios/all",
  INACTIVE: "/usuarios/inactivos",
  ACTIVE: "/usuarios/activos",
  SEARCH: "/usuarios/buscar",
  BY_IDENTIFIER: (identificador) => `/usuarios/identificador/${identificador}`,
  BY_ID: (id) => `/usuarios/${id}`,
  ACTIVATE: (id) => `/usuarios/${id}/activar`,
  DEACTIVATE: (id) => `/usuarios/${id}/desactivar`,
  CHANGE_PASSWORD: (id) => `/usuarios/${id}/password`,
  RECHARGE_BALANCE: (id) => `/usuarios/${id}/saldo`,
};