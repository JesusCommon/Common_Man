import { z } from "zod";

export const ListarBibliotecaParamsSchema = z.object({
  skip: z.number().int().nonnegative().default(0),
  limit: z.number().int().min(1).max(100).default(20),
});

export type ListarBibliotecaParamsInput = z.infer<
  typeof ListarBibliotecaParamsSchema
>;