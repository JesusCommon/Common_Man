import { useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { LoginSchema } from "@/schemas";
import type { LoginInput } from "@/schemas";
import { useLogin } from "@/hooks";
import { useAuthStore } from "@/store";
import { Button } from "@/components/ui/Button";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import { AuthInput } from "@/components/auth/AuthInput";
import { Mail, Lock, ArrowRight } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema) as Resolver<LoginInput>,
    mode: "onBlur",
  });

  const { mutate, isPending, isError, error } = useLogin();

  const onSubmit = (values: LoginInput) => {
    mutate(values, {
      onSuccess: () => {
        const rol = useAuthStore.getState().user?.rol;
        navigate(rol === "admin" ? "/admin" : "/dashboard", { replace: true });
      },
    });
  };

  return (
    <AuthSplitLayout isRegister={false}>
      <div className="space-y-4">
        <div className="space-y-0.5">
          <h1 className="text-xl font-bold tracking-tight text-white">Bienvenido de nuevo</h1>
          <p className="text-slate-400 text-xs">Ingresa tus credenciales para acceder</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <AuthInput
            label="Correo o Username"
            icon={Mail}
            type="text"
            autoComplete="username"
            placeholder="jesus@ejemplo.com"
            error={errors.identidad?.message}
            {...register("identidad")}
          />
          <AuthInput
            label="Contraseña"
            icon={Lock}
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password")}
          />

          {isError && <ErrorAlert error={error} fallback="Error al iniciar sesión" />}

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
                Entrando...
              </span>
            ) : (
              <>
                Iniciar Sesión
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-xs text-slate-500">
            ¿No tienes cuenta?{" "}
            <Link
              to="/register"
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors hover:underline"
            >
              Crear cuenta
            </Link>
          </p>
        </div>
      </div>
    </AuthSplitLayout>
  );
}