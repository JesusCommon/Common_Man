import axiosClient from "../api/axiosClient";
import { ENDPOINTS } from "../api/endpoints";
import { apiRequest } from "../api/apiRequest";
import { createBaseService } from "./createBaseService";

const { USUARIOS } = ENDPOINTS;

export const usuarioService = {
  ...createBaseService(USUARIOS),

  buscar: ({ nombre, apellido, username, skip = 0, limit = 20 } = {}) =>
    apiRequest(
      axiosClient.get(USUARIOS.SEARCH, {
        params: { nombre, apellido, username, skip, limit },
      })
    ),

  obtenerPorIdentificador: (identificador) =>
    apiRequest(axiosClient.get(USUARIOS.BY_IDENTIFIER(identificador))),

  cambiarPassword: (id, data) =>
    apiRequest(axiosClient.patch(USUARIOS.CHANGE_PASSWORD(id), data)),

  recargarSaldo: (id, data) =>
    apiRequest(axiosClient.patch(USUARIOS.RECHARGE_BALANCE(id), data)),
};