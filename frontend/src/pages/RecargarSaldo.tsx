import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { UsuarioRecargarSaldoSchema } from "@/schemas";
import type { UsuarioRecargarSaldoInput } from "@/schemas";
import { useRecargarSaldo } from "@/hooks";
import { useAuthStore } from "@/store";
import { Button } from "@/components/ui/Button";
import { Wallet, ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react";
import { useEffect } from "react";

export default function RecargarSaldo() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UsuarioRecargarSaldoInput>({
    resolver: zodResolver(UsuarioRecargarSaldoSchema),
  });

  const { mutate, isPending, isError, error, isSuccess, data } = useRecargarSaldo();

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => navigate("/dashboard", { replace: true }), 2000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate]);

  const onSubmit = (values: UsuarioRecargarSaldoInput) => {
    mutate(values);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-6 h-16 flex items-center">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al dashboard
          </button>
        </div>
      </nav>

      <main className="max-w-md mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-6 h-6 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Recargar saldo</h1>
          <p className="text-slate-500 text-sm">
            Saldo actual: <span className="text-emerald-400 font-semibold">${user?.saldo?.toLocaleString() || "0"}</span>
          </p>
        </div>

        {isSuccess ? (
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">¡Recarga exitosa!</h2>
            <p className="text-slate-400 text-sm">{data?.mensaje}</p>
            <p className="text-slate-600 text-xs mt-2">Redirigiendo...</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm p-8 shadow-xl">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">
                  Monto a recargar
                </label>
                <input
                  {...register("monto", { valueAsNumber: true })}
                  type="number"
                  min={1}
                  placeholder="100"
                  className="w-full h-11 px-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all"
                />
                {errors.monto && (
                  <p className="mt-1.5 text-xs text-red-400">{errors.monto.message}</p>
                )}
              </div>

              {isError && (
                <div className="flex items-start gap-2 rounded-lg bg-red-500/10 border border-red-500/20 p-3">
                  <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-red-300">{(error as Error)?.message || "Error al recargar"}</p>
                </div>
              )}

              <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isPending}>
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-slate-400/30 border-t-slate-900 rounded-full animate-spin" />
                    Procesando...
                  </span>
                ) : (
                  <>
                    <Wallet className="w-4 h-4 mr-2" />
                    Recargar saldo
                  </>
                )}
              </Button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}