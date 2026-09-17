import { z } from "zod";

export const objectId = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "ID inválido");

export const trimOpcional = (schema: z.ZodTypeAny) =>
  z.preprocess(
    (v) => (typeof v === "string" ? v.trim() || undefined : v),
    schema.optional()
  );

export const texto = (min: number, max: number, etiqueta: string) =>
  z
    .string()
    .trim()
    .min(min, `${etiqueta} debe tener al menos ${min} caracteres`)
    .max(max, `${etiqueta} no puede exceder ${max} caracteres`);

export const soloLetras = /^[A-Za-zÀ-ÿñÑ\s]+$/;