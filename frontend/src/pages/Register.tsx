import { motion } from "framer-motion";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { UsuarioCreateSchema } from "@/schemas";
import type { UsuarioCreateInput } from "@/schemas";
import { useRegistro } from "@/hooks";
import { Button } from "@/components/ui/Button";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import { AuthInput } from "@/components/auth/AuthInput";
import { User, Mail, Phone, Lock, ArrowRight, CheckCircle2 } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UsuarioCreateInput>({
    resolver: zodResolver(UsuarioCreateSchema) as Resolver<UsuarioCreateInput>,
    mode: "onBlur",
  });

  const { mutate, isPending, isError, error, isSuccess, data } = useRegistro();

  useEffect(() => {
    if (!isSuccess) return;
    const timer = setTimeout(() => navigate("/login", { replace: true }), 2000);
    return () => clearTimeout(timer);
  }, [isSuccess, navigate]);

  const onSubmit = (values: UsuarioCreateInput) => {
    mutate(values);
  };

  return (
    <AuthSplitLayout isRegister={true}>
      {isSuccess ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-sm p-6 text-center"
        >
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-white mb-1">¡Cuenta creada!</h2>
          <p className="text-slate-400 text-sm mb-0.5">{data?.mensaje}</p>
          <p className="text-slate-500 text-xs">Redirigiendo al login...</p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <div className="space-y-0.5">
            <h1 className="text-xl font-bold tracking-tight text-white">Crear cuenta</h1>
            <p className="text-slate-400 text-xs">Únete a Common Man hoy mismo</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            {/* Fila 1 */}
            <div className="grid grid-cols-2 gap-2">
              <AuthInput
                label="Nombre"
                icon={User}
                placeholder="Juan"
                error={errors.nombre?.message}
                {...register("nombre")}
              />
              <AuthInput
                label="Apellido"
                icon={User}
                placeholder="Pérez"
                optional
                error={errors.apellido?.message}
                {...register("apellido")}
              />
            </div>

            {/* Fila 2 */}
            <div className="grid grid-cols-2 gap-2">
              <AuthInput
                label="Username"
                icon={User}
                placeholder="juanperez"
                error={errors.username?.message}
                {...register("username")}
              />
              <AuthInput
                label="Teléfono"
                icon={Phone}
                placeholder="+58412..."
                optional
                error={errors.telefono?.message}
                {...register("telefono")}
              />
            </div>

            {/* Fila 3 */}
            <AuthInput
              label="Correo electrónico"
              icon={Mail}
              type="email"
              placeholder="juan@ejemplo.com"
              error={errors.correo?.message}
              {...register("correo")}
            />

            {/* Fila 4 */}
            <AuthInput
              label="Contraseña"
              icon={Lock}
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              hint="Mín. 8 caracteres, mayús., minús., número y símbolo."
              {...register("password")}
            />

            {isError && <ErrorAlert error={error} fallback="Error al crear la cuenta" />}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full group mt-1 h-10"
              disabled={isPending}
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-slate-400/30 border-t-slate-900 rounded-full animate-spin" />
                  Creando...
                </span>
              ) : (
                <>
                  Crear Cuenta
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-xs text-slate-500">
              ¿Ya tienes cuenta?{" "}
              <Link
                to="/login"
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors hover:underline"
              >
                Iniciar sesión
              </Link>
            </p>
          </div>
        </div>
      )}
    </AuthSplitLayout>
  );
}