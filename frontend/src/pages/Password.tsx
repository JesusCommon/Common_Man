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
  const { register, handleSubmit, reset, formState: { errors } } = useForm<UsuarioCambiarPasswordInput>({
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

  const onSubmit = (values: UsuarioCambiarPasswordInput) => mutate(values);

  return (
    <div className="max-w-lg mx-auto p-4 sm:p-6">
      <button onClick={() => navigate("/dashboard")} className="flex items-center text-sm text-[#52525B] hover:text-[#18181B] transition-colors mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" /> Volver al dashboard
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center">
          <Lock className="w-6 h-6 text-amber-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#18181B]">Cambiar contraseña</h1>
          <p className="text-sm text-[#52525B]">Asegura tu cuenta</p>
        </div>
      </div>

      {isSuccess ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
          <p className="text-[#18181B] font-medium">{data?.mensaje}</p>
          <p className="text-[#52525B] text-sm mt-1">Redirigiendo...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#18181B] mb-1.5">Contraseña actual</label>
            <input {...register("password_actual")} type="password" className="w-full h-11 px-4 rounded-xl bg-white border border-[#E4E4E1] text-[#18181B] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all" />
            {errors.password_actual && <p className="mt-1 text-xs text-red-600">{errors.password_actual.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#18181B] mb-1.5">Nueva contraseña</label>
            <input {...register("password")} type="password" className="w-full h-11 px-4 rounded-xl bg-white border border-[#E4E4E1] text-[#18181B] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all" />
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
            <p className="mt-1 text-xs text-[#A1A19A]">Mínimo 8 caracteres, mayúscula, minúscula, número y símbolo.</p>
          </div>

          {isError && (
            <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 p-3">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
              <p className="text-sm text-red-700">{(error as Error)?.message || "Error al cambiar contraseña"}</p>
            </div>
          )}

          <Button type="submit" size="lg" className="w-full bg-[#18181B] text-white hover:bg-[#18181B]/90 border-0" disabled={isPending}>
            {isPending ? "Actualizando..." : "Cambiar contraseña"}
          </Button>
        </form>
      )}
    </div>
  );
}