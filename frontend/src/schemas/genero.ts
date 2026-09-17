import { z } from "zod";
import { texto, trimOpcional } from "./helpers";

export const GeneroCreateSchema = z.object({
  nombre: texto(1, 150, "El nombre"),
  descripcion: trimOpcional(
    z.string().max(1000, "La descripción no puede exceder 1000 caracteres")
  ),
});

export const GeneroUpdateSchema = GeneroCreateSchema.partial();

export type GeneroCreateInput = z.infer<typeof GeneroCreateSchema>;
export type GeneroUpdateInput = z.infer<typeof GeneroUpdateSchema>;