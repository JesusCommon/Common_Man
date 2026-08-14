import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { LoginSchema } from "@/schemas";
import type { LoginInput } from "@/schemas";
import { useLogin } from "@/hooks";
import { Button } from "@/components/ui/Button";
import { Shield, ArrowRight, AlertCircle } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
  });

  const { mutate, isPending, isError, error, isSuccess, data } = useLogin();

  useEffect(() => {
    if (isSuccess && data) {
      navigate("/dashboard", { replace: true });
    }
  }, [isSuccess, data, navigate]);

  const onSubmit = (values: LoginInput) => {
    mutate(values);
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
          Bienvenido de nuevo
        </h1>
        <p className="text-slate-500 text-sm">
          Ingresa tus credenciales para acceder a <span className="text-slate-300 font-medium">Common Man</span>
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-8 shadow-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">
              Correo o Username
            </label>
            <input
              {...register("identidad")}
              type="text"
              autoComplete="username"
              placeholder="jesus@ejemplo.com"
              className="w-full h-11 px-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all"
            />
            {errors.identidad && (
              <p className="mt-1.5 text-xs text-red-400">{errors.identidad.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">
              Contraseña
            </label>
            <input
              {...register("password")}
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full h-11 px-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all"
            />
            {errors.password && (
              <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>
            )}
          </div>

          {isError && (
            <div className="flex items-start gap-2 rounded-lg bg-red-500/10 border border-red-500/20 p-3">
              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
              <p className="text-sm text-red-300">
                {(error as Error)?.message || "Error al iniciar sesión"}
              </p>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full group"
            disabled={isPending}
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-slate-400/30 border-t-slate-900 rounded-full animate-spin" />
                Entrando...
              </span>
            ) : (
              <>
                <Shield className="w-4 h-4 mr-2" />
                Iniciar Sesión
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </Button>
        </form>
      </div>

      <p className="text-center mt-6 text-sm text-slate-500">
        ¿No tienes cuenta?{" "}
        <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
          Crear cuenta
        </Link>
      </p>
    </div>
  );
}