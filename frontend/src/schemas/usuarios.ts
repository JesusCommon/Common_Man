import { z } from "zod";
import {
  NombreSchema,
  ApellidoSchema,
  UsernameSchema,
  TelefonoSchema,
  CorreoSchema,
  BioSchema,
  AvatarSchema,
  PasswordSchema,
  MontoSchema,
  RolUsuarioSchema,
} from "./common";

export const UsuarioCreateSchema = z.object({
  nombre: NombreSchema,
  apellido: ApellidoSchema.optional(),
  username: UsernameSchema,
  telefono: TelefonoSchema,
  correo: CorreoSchema,
  password: PasswordSchema,
});

export type UsuarioCreateInput = z.infer<typeof UsuarioCreateSchema>;

export const UsuarioUpdateSchema = z.object({
  nombre: NombreSchema.optional(),
  apellido: ApellidoSchema.optional(),
  username: UsernameSchema.optional(),
  correo: CorreoSchema.optional(),
  telefono: TelefonoSchema.optional(),
  bio: BioSchema.optional(),
  avatar: AvatarSchema.optional(),
});

export type UsuarioUpdateInput = z.infer<typeof UsuarioUpdateSchema>;

export const ObtenerPerfilPublico = z.object({
  identificador: z.string().uuid(),
  nombre: z.string(),
  apellido: z.string().nullable().optional(),
  username: z.string(),
  bio: z.string().nullable().optional(),
  avatar: z.string().url().nullable().optional(),
  activo: z.boolean(),
  fecha_creacion: z.string().datetime(),
});

export type UsuarioPublicResponse = z.infer<typeof ObtenerPerfilPublico>;

export const UsuarioAdminUpdateSchema = UsuarioUpdateSchema.extend({
  rol: RolUsuarioSchema.optional(),
  activo: z.boolean().optional(),
  saldo: z.number().int().nonnegative().optional(),
});

export type UsuarioAdminUpdateInput = z.infer<typeof UsuarioAdminUpdateSchema>;

export const UsuarioCambiarPasswordSchema = z.object({
  password_actual: z
    .string({ message: "La contraseña actual es obligatoria" })
    .min(1, "Ingresa tu contraseña actual"),
    
  password: PasswordSchema,
});

export type UsuarioCambiarPasswordInput = z.infer<typeof UsuarioCambiarPasswordSchema>;

export const UsuarioRecargarSaldoSchema = z.object({
  monto: MontoSchema,
});

export type UsuarioRecargarSaldoInput = z.infer<typeof UsuarioRecargarSaldoSchema>;

export const BuscarPersonasSchema = z.object({
  nombre: z.string().optional(),
  apellido: z.string().optional(),
  username: z.string().optional(),
  skip: z.number().int().nonnegative().default(0),
  limit: z.number().int().min(1).max(100).default(20),
});

export type BuscarPersonasInput = z.infer<typeof BuscarPersonasSchema>;

export const BuscarUsuariosAdminSchema = BuscarPersonasSchema;

export type BuscarUsuariosAdminInput = z.infer<typeof BuscarUsuariosAdminSchema>;