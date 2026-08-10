import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { UsuarioCreateSchema } from "@/schemas";
import type { UsuarioCreateInput } from "@/schemas";
import { useRegistro } from "@/hooks";
import { Button } from "@/components/ui/Button";
import { UserPlus, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { useEffect } from "react";

export default function Register() {
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UsuarioCreateInput>({
    resolver: zodResolver(UsuarioCreateSchema),
  });

  const { mutate, isPending, isError, error, isSuccess, data } = useRegistro();

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => navigate("/login", { replace: true }), 2000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate]);

  const onSubmit = (values: UsuarioCreateInput) => {
    mutate(values);
  };

  if (isSuccess) {
    return (
      <div className="w-full">
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-sm p-8 text-center">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">¡Cuenta creada!</h2>
          <p className="text-slate-400 text-sm mb-1">{data?.mensaje}</p>
          <p className="text-slate-500 text-xs">Redirigiendo al login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
          Crear cuenta
        </h1>
        <p className="text-slate-500 text-sm">
          Únete a <span className="text-slate-300 font-medium">Common Man</span> hoy mismo
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-8 shadow-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
          {/* Nombre + Apellido */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Nombre</label>
              <input
                {...register("nombre")}
                placeholder="Juan"
                className="w-full h-11 px-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all"
              />
              {errors.nombre && <p className="mt-1.5 text-xs text-red-400">{errors.nombre.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Apellido</label>
              <input
                {...register("apellido")}
                placeholder="Pérez"
                className="w-full h-11 px-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all"
              />
              {errors.apellido && <p className="mt-1.5 text-xs text-red-400">{errors.apellido.message}</p>}
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Username</label>
            <input
              {...register("username")}
              placeholder="juanperez"
              className="w-full h-11 px-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all"
            />
            {errors.username && <p className="mt-1.5 text-xs text-red-400">{errors.username.message}</p>}
          </div>

          {/* Correo */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Correo electrónico</label>
            <input
              {...register("correo")}
              type="email"
              placeholder="juan@ejemplo.com"
              className="w-full h-11 px-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all"
            />
            {errors.correo && <p className="mt-1.5 text-xs text-red-400">{errors.correo.message}</p>}
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Teléfono <span className="text-slate-600">(opcional)</span></label>
            <input
              {...register("telefono")}
              placeholder="+584121234567"
              className="w-full h-11 px-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all"
            />
            {errors.telefono && <p className="mt-1.5 text-xs text-red-400">{errors.telefono.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Contraseña</label>
            <input
              {...register("password")}
              type="password"
              placeholder="••••••••"
              className="w-full h-11 px-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all"
            />
            {errors.password && <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>}
            <p className="mt-1 text-xs text-slate-600">
              Mínimo 8 caracteres, mayúscula, minúscula, número y símbolo.
            </p>
          </div>

          {/* Error global */}
          {isError && (
            <div className="flex items-start gap-2 rounded-lg bg-red-500/10 border border-red-500/20 p-3">
              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
              <p className="text-sm text-red-300">{(error as Error)?.message || "Error al crear la cuenta"}</p>
            </div>
          )}

          {/* Submit */}
          <Button type="submit" variant="primary" size="lg" className="w-full group" disabled={isPending}>
            {isPending ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-slate-400/30 border-t-slate-900 rounded-full animate-spin" />
                Creando cuenta...
              </span>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Crear Cuenta
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </Button>
        </form>
      </div>

      <p className="text-center mt-6 text-sm text-slate-500">
        ¿Ya tienes cuenta?{" "}
        <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
          Iniciar sesión
        </Link>
      </p>
    </div>
  );
}