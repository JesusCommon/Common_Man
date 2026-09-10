import { z } from "zod";

export const ListarNotificacionesSchema = z.object({
  skip: z.number().int().nonnegative().default(0),
  limit: z.number().int().min(1).max(100).default(20),
  solo_no_leidas: z.boolean().default(false),
});

export type ListarNotificacionesInput = z.infer<typeof ListarNotificacionesSchema>;