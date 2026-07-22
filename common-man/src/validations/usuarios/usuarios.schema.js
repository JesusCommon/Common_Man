// validations/usuarios/usuarios.schema.js
import { z } from "zod";
import {
  nombreSchema,
  apellidoSchema,
  telefonoSchema,
  usernameSchema,
  correoSchema,
  bioSchema,
  avatarSchema,
  passwordSchema,
  saldoSchema,
  montoSchema,
} from "./campos";

// Equivalente a UsuarioCreate(UsuarioValidaciones, PasswordValidacion, BaseModel)
export const usuarioCreateSchema = z.object({
  nombre: nombreSchema,
  apellido: apellidoSchema.optional(),
  username: usernameSchema,
  telefono: telefonoSchema.optional(),
  correo: correoSchema,
  password: passwordSchema,
  bio: bioSchema.optional(),
  avatar: avatarSchema.optional(),
  saldo: saldoSchema.optional(),
});

// Equivalente a UsuarioUpdate(UsuarioValidaciones, BaseModel) -> todo opcional
export const usuarioUpdateSchema = z.object({
  nombre: nombreSchema.optional(),
  apellido: apellidoSchema.optional(),
  username: usernameSchema.optional(),
  telefono: telefonoSchema.optional(),
  correo: correoSchema.optional(),
  bio: bioSchema.optional(),
  avatar: avatarSchema.optional(),
});

// Equivalente a UsuarioCambiarPassword(PasswordValidacion, BaseModel)
export const usuarioCambiarPasswordSchema = z.object({
  password_actual: z.string().min(1, "La contraseña actual es obligatoria"),
  password: passwordSchema,
});

// Equivalente a UsuarioRecargarSaldo(BaseModel)
export const usuarioRecargarSaldoSchema = z.object({
  monto: montoSchema,
});