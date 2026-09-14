import { reportesApi } from "@/api";
import {
  ReporteCreateSchema,
  MensajeCreateSchema,
  ReporteEstadoUpdateSchema,
  ListarReportesParamsSchema,
} from "@/schemas";
import type {
  ReporteCreate,
  MensajeCreate,
  ReporteEstadoUpdate,
  ReporteResponse,
  ReporteAdminResponse,
  EstadoReporteEnum,
  Paginado,
  RespuestaConMensaje,
} from "@/api/types";
import type { ServiceResult } from "./types";
import { validationError, networkError } from "./types";
import type { AxiosError } from "axios";

export async function crearReporteService(
  params: unknown
): Promise<ServiceResult<RespuestaConMensaje<ReporteResponse>>> {
  const parsed = ReporteCreateSchema.safeParse(params);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await reportesApi.crearReporte(parsed.data as ReporteCreate);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function listarMisReportesService(
  params: unknown = {}
): Promise<ServiceResult<Paginado<ReporteResponse>>> {
  const parsed = ListarReportesParamsSchema.safeParse(params);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await reportesApi.listarMisReportes(parsed.data);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function obtenerMiReporteService(
  reporteId: string
): Promise<ServiceResult<ReporteResponse>> {
  try {
    const data = await reportesApi.obtenerMiReporte(reporteId);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function responderMiReporteService(
  reporteId: string,
  params: unknown
): Promise<ServiceResult<RespuestaConMensaje<ReporteResponse>>> {
  const parsed = MensajeCreateSchema.safeParse(params);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await reportesApi.responderMiReporte(
      reporteId,
      parsed.data as MensajeCreate
    );
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function eliminarMiReporteService(
  reporteId: string
): Promise<ServiceResult<RespuestaConMensaje<{ reporte_id: string }>>> {
  try {
    const data = await reportesApi.eliminarMiReporte(reporteId);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function listarTodosReportesAdminService(
  params: unknown = {}
): Promise<ServiceResult<Paginado<ReporteAdminResponse>>> {
  const parsed = ListarReportesParamsSchema.safeParse(params);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await reportesApi.listarTodosReportesAdmin(parsed.data);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function listarReportesPorEstadoAdminService(
  estado: EstadoReporteEnum,
  params: unknown = {}
): Promise<ServiceResult<Paginado<ReporteAdminResponse>>> {
  const parsed = ListarReportesParamsSchema.safeParse(params);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await reportesApi.listarReportesPorEstadoAdmin(
      estado,
      parsed.data
    );
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function obtenerReporteAdminService(
  reporteId: string
): Promise<ServiceResult<ReporteAdminResponse>> {
  try {
    const data = await reportesApi.obtenerReporteAdmin(reporteId);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function responderReporteAdminService(
  reporteId: string,
  params: unknown
): Promise<ServiceResult<RespuestaConMensaje<ReporteAdminResponse>>> {
  const parsed = MensajeCreateSchema.safeParse(params);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await reportesApi.responderReporteAdmin(
      reporteId,
      parsed.data as MensajeCreate
    );
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function actualizarEstadoReporteAdminService(
  reporteId: string,
  params: unknown
): Promise<ServiceResult<RespuestaConMensaje<ReporteAdminResponse>>> {
  const parsed = ReporteEstadoUpdateSchema.safeParse(params);
  if (!parsed.success) return { success: false, error: validationError(parsed.error) };

  try {
    const data = await reportesApi.actualizarEstadoReporteAdmin(
      reporteId,
      parsed.data as ReporteEstadoUpdate
    );
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}

export async function eliminarReporteAdminService(
  reporteId: string
): Promise<ServiceResult<RespuestaConMensaje<{ reporte_id: string }>>> {
  try {
    const data = await reportesApi.eliminarReporteAdmin(reporteId);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: networkError(err as AxiosError) };
  }
}