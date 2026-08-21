import { z } from "zod";
import { UsernameSchema } from "./common";
import { ObtenerPerfilPublico } from "./usuarios";

export const FollowCreateSchema = z.object({
  username: UsernameSchema,
});

export type FollowCreateInput = z.infer<typeof FollowCreateSchema>;

export const FollowPublicResponseSchema = z.object({
  identificador: z.string().uuid("El identificador debe ser un UUID válido"),
  seguidor: ObtenerPerfilPublico,
  seguido: ObtenerPerfilPublico,
  activo: z.boolean(),
  fecha_creacion: z.string().datetime("La fecha debe tener formato datetime válido"),
});

export type FollowPublicResponse = z.infer<typeof FollowPublicResponseSchema>;