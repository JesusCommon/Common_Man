import { z } from 'zod';

const nombreSchema = z
  .string()
  .trim()
  .min(2, 'El nombre tiene que tener al menos 2 caracteres')
  .regex(/^[A-Za-zÀ-ÿñÑ\s]+$/, 'El nombre solo puede llevar letras');

const apellidoSchema = z
  .string()
  .trim()
  .min(2, 'El apellido tiene que tener al menos 2 caracteres')
  .regex(/^[A-Za-zÀ-ÿñÑ\s]+$/, 'El apellido solo puede llevar letras');

const telefonoSchema = z
  .string()
  .trim()
  .regex(/^\+?[0-9]{7,15}$/, 'Número telefónico inválido');

const usernameSchema = z
  .string()
  .trim()
  .min(3, 'El username tiene que tener mínimo 3 caracteres')
  .regex(
    /^[A-Za-z0-9_]+$/,
    'El username solo puede llevar letras, números o guión bajo',
  )
  .transform((v) => v.toLowerCase());

const correoSchema = z
  .string()
  .trim()
  .email('Correo electrónico inválido')
  .transform((v) => v.toLowerCase());

const bioSchema = z
  .string()
  .trim()
  .max(40, 'La bio no puede tener más de 40 caracteres');

const avatarSchema = z
  .string()
  .url('El avatar debe ser una URL válida')
  .refine(
    (url) => /\.(jpg|jpeg|png|webp)$/i.test(url),
    'El avatar debe ser una URL con extensión .jpg, .jpeg, .png o .webp',
  );

export const passwordSchema = z
  .string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .regex(/[A-Z]/, 'La contraseña debe tener al menos una mayúscula')
  .regex(/[a-z]/, 'La contraseña debe tener al menos una minúscula')
  .regex(/\d/, 'La contraseña debe tener al menos un número')
  .refine((v) => !/\s/.test(v), 'La contraseña no puede contener espacios')
  .regex(
    /[!@#$%&(),.?":{}|<>_-]/,
    'La contraseña debe tener al menos un símbolo',
  );

const saldoSchema = z
  .number({error: "El saldo debe ser un número",})
  .positive("El saldo debe ser mayor a 0");

const montoSchema = z
  .number({error: "El monto debe ser un número",})
  .positive("El monto debe ser mayor a 0");

export const usuarioCreateSchema = z.object({
  nombre: nombreSchema,
  apellido: apellidoSchema.optional().nullable(),
  username: usernameSchema,
  telefono: telefonoSchema.optional().nullable(),
  correo: correoSchema,
  password: passwordSchema,
  bio: bioSchema.optional().nullable(),
  avatar: avatarSchema.optional().nullable(),
  saldo: saldoSchema.optional().nullable(),
});

export type UsuarioCreateFormValues = z.infer<typeof usuarioCreateSchema>;

export const usuarioUpdateSchema = z.object({
  nombre: nombreSchema.optional().nullable(),
  apellido: apellidoSchema.optional().nullable(),
  username: usernameSchema.optional().nullable(),
  telefono: telefonoSchema.optional().nullable(),
  correo: correoSchema.optional().nullable(),
  bio: bioSchema.optional().nullable(),
  avatar: avatarSchema.optional().nullable(),
});

export type UsuarioUpdateFormValues = z.infer<typeof usuarioUpdateSchema>;

export const usuarioCambiarPasswordSchema = z.object({
  password_actual: z.string().min(1, 'Debes ingresar tu contraseña actual'),
  password: passwordSchema,
});

export type UsuarioCambiarPasswordFormValues = z.infer<
  typeof usuarioCambiarPasswordSchema
>;

export const usuarioRecargarSaldoSchema = z.object({
  monto: montoSchema,
});

export type UsuarioRecargarSaldoFormValues = z.infer<
  typeof usuarioRecargarSaldoSchema
>;