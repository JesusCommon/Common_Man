import axiosClient from "../api/axiosClient";
import { apiRequest } from "../api/apiRequest";

export function createBaseService(endpoints) {
  return {
    crear: (data) => apiRequest(axiosClient.post(endpoints.BASE, data)),
    listar: () => apiRequest(axiosClient.get(endpoints.ALL)),
    listarActivos: () => apiRequest(axiosClient.get(endpoints.ACTIVE)),
    obtenerPorId: (id) => apiRequest(axiosClient.get(endpoints.BY_ID(id))),
    actualizar: (id, data) => apiRequest(axiosClient.put(endpoints.BY_ID(id), data)),
    activar: (id) => apiRequest(axiosClient.patch(endpoints.ACTIVATE(id))),
    desactivar: (id) => apiRequest(axiosClient.patch(endpoints.DEACTIVATE(id))),
  };
}
