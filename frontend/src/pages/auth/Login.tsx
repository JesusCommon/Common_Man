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
      <div className="space-y-5">
        <div className="space-y-1">
          {/* CAMBIO: Textos adaptados a la paleta clara */}
          <h1 className="text-2xl font-bold tracking-tight text-[#18181B]">Bienvenido de nuevo</h1>
          <p className="text-[#52525B] text-sm">Ingresa tus credenciales para acceder</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

          {/* CAMBIO: Botón negro con letras blancas, spinner blanco */}
          <Button
            type="submit"
            size="lg"
            className="w-full group mt-2 h-11 bg-[#18181B] text-[#FAFAF8] hover:bg-[#18181B]/90 border-0 shadow-sm"
            disabled={isPending}
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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

        <div className="text-center pt-2">
          <p className="text-sm text-[#52525B]">
            ¿No tienes cuenta?{" "}
            <Link
              to="/register"
              className="text-[#2563EB] hover:text-[#1D4ED8] font-semibold transition-colors underline underline-offset-4 decoration-[#2563EB]/30 hover:decoration-[#1D4ED8]"
            >
              Crear cuenta
            </Link>
          </p>
        </div>
      </div>
    </AuthSplitLayout>
  );
}