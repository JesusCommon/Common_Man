import { apiClient } from "../client";
import type {
  ReporteCreate,
  ReporteResponse,
  ReporteAdminResponse,
  MensajeCreate,
  ReporteEstadoUpdate,
  EstadoReporteEnum,
  Paginado,
  RespuestaConMensaje,
} from "../types";

export async function crearReporte(data: ReporteCreate) {
  const { data: response } = await apiClient.post<
    RespuestaConMensaje<ReporteResponse>
  >("/reportes/", data);
  return response;
}

export async function listarMisReportes(params: {
  skip?: number;
  limit?: number;
}) {
  const { data } = await apiClient.get<Paginado<ReporteResponse>>(
    "/reportes/",
    { params }
  );
  return data;
}

export async function obtenerMiReporte(reporteId: string) {
  const { data } = await apiClient.get<ReporteResponse>(
    `/reportes/${reporteId}`
  );
  return data;
}

export async function responderMiReporte(
  reporteId: string,
  data: MensajeCreate
) {
  const { data: response } = await apiClient.post<
    RespuestaConMensaje<ReporteResponse>
  >(`/reportes/${reporteId}/mensajes`, data);
  return response;
}

export async function eliminarMiReporte(reporteId: string) {
  const { data } = await apiClient.delete<RespuestaConMensaje<{ reporte_id: string }>>(
    `/reportes/${reporteId}`
  );
  return data;
}

export async function listarTodosReportesAdmin(params: {
  skip?: number;
  limit?: number;
}) {
  const { data } = await apiClient.get<Paginado<ReporteAdminResponse>>(
    "/reportes/admin/all",
    { params }
  );
  return data;
}

export async function listarReportesPorEstadoAdmin(
  estado: EstadoReporteEnum,
  params: { skip?: number; limit?: number }
) {
  const { data } = await apiClient.get<Paginado<ReporteAdminResponse>>(
    `/reportes/admin/estado/${estado}`,
    { params }
  );
  return data;
}

export async function obtenerReporteAdmin(reporteId: string) {
  const { data } = await apiClient.get<ReporteAdminResponse>(
    `/reportes/admin/${reporteId}`
  );
  return data;
}

export async function responderReporteAdmin(
  reporteId: string,
  data: MensajeCreate
) {
  const { data: response } = await apiClient.post<
    RespuestaConMensaje<ReporteAdminResponse>
  >(`/reportes/admin/${reporteId}/mensajes`, data);
  return response;
}

export async function actualizarEstadoReporteAdmin(
  reporteId: string,
  data: ReporteEstadoUpdate
) {
  const { data: response } = await apiClient.patch<
    RespuestaConMensaje<ReporteAdminResponse>
  >(`/reportes/admin/${reporteId}/estado`, data);
  return response;
}

export async function eliminarReporteAdmin(reporteId: string) {
  const { data } = await apiClient.delete<
    RespuestaConMensaje<{ reporte_id: string }>
  >(`/reportes/admin/${reporteId}`);
  return data;
}