import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { UsuarioCambiarPasswordSchema } from "@/schemas";
import type { UsuarioCambiarPasswordInput } from "@/schemas";
import { useCambiarPassword } from "@/hooks";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Lock, AlertCircle, CheckCircle2 } from "lucide-react";
import { useEffect } from "react";

export default function Password() {
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UsuarioCambiarPasswordInput>({
    resolver: zodResolver(UsuarioCambiarPasswordSchema),
  });

  const { mutate, isPending, isError, error, isSuccess, data } = useCambiarPassword();

  useEffect(() => {
    if (isSuccess) {
      reset();
      const timer = setTimeout(() => navigate("/dashboard"), 2000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate, reset]);

  const onSubmit = (values: UsuarioCambiarPasswordInput) => {
    mutate(values);
  };

  return (
    <div className="max-w-lg mx-auto">
      <button
        onClick={() => navigate("/dashboard")}
        className="flex items-center text-sm text-slate-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver al dashboard
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center">
          <Lock className="w-6 h-6 text-orange-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Cambiar contraseña</h1>
          <p className="text-sm text-slate-500">Asegura tu cuenta</p>
        </div>
      </div>

      {isSuccess ? (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6 text-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
          <p className="text-white font-medium">{data?.mensaje}</p>
          <p className="text-slate-500 text-sm mt-1">Redirigiendo...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Contraseña actual</label>
            <input {...register("password_actual")} type="password" className="w-full h-11 px-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/50" />
            {errors.password_actual && <p className="mt-1 text-xs text-red-400">{errors.password_actual.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Nueva contraseña</label>
            <input {...register("password")} type="password" className="w-full h-11 px-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/50" />
            {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
            <p className="mt-1 text-xs text-slate-600">Mínimo 8 caracteres, mayúscula, minúscula, número y símbolo.</p>
          </div>

          {isError && (
            <div className="flex items-start gap-2 rounded-lg bg-red-500/10 border border-red-500/20 p-3">
              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
              <p className="text-sm text-red-300">{(error as Error)?.message || "Error al cambiar contraseña"}</p>
            </div>
          )}

          <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isPending}>
            {isPending ? "Actualizando..." : "Cambiar contraseña"}
          </Button>
        </form>
      )}
    </div>
  );
}