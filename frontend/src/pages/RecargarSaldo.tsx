import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { UsuarioRecargarSaldoSchema } from "@/schemas";
import type { UsuarioRecargarSaldoInput } from "@/schemas";
import { useRecargarSaldo } from "@/hooks";
import { useAuthStore } from "@/store";
import { Button } from "@/components/ui/Button";
import { Wallet, ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react";
import { useEffect } from "react";

type FormValues = {
  monto: string | number;
};

export default function RecargarSaldo() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(UsuarioRecargarSaldoSchema) as unknown as Resolver<FormValues, any, UsuarioRecargarSaldoInput>,
  });

  const { mutate, isPending, isError, error, isSuccess, data } = useRecargarSaldo();

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => navigate("/dashboard", { replace: true }), 2000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate]);

  const onSubmit = (values: FormValues) => {
    const payload: UsuarioRecargarSaldoInput = {
      monto: Number(values.monto)
    };
    mutate(payload);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#18181B]">
      <nav className="border-b border-[#E4E4E1] bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 h-16 flex items-center">
          <button onClick={() => navigate("/dashboard")} className="flex items-center text-sm text-[#52525B] hover:text-[#18181B] transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver al dashboard
          </button>
        </div>
      </nav>

      <main className="max-w-md mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-7 h-7 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-[#18181B] mb-1">Recargar saldo</h1>
          <p className="text-[#52525B] text-sm">
            Saldo actual: <span className="text-emerald-600 font-bold">${user?.saldo?.toLocaleString() || "0"}</span>
          </p>
        </div>

        {isSuccess ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-[#18181B] mb-2">¡Recarga exitosa!</h2>
            <p className="text-[#52525B] text-sm">{data?.mensaje}</p>
            <p className="text-[#A1A19A] text-xs mt-2">Redirigiendo...</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-[#E4E4E1] bg-white p-8 shadow-sm">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#18181B] mb-1.5">Monto a recargar</label>
                <input
                  {...register("monto")}
                  type="number"
                  min={1}
                  placeholder="100"
                  className="w-full h-11 px-4 rounded-xl bg-[#FAFAF8] border border-[#E4E4E1] text-[#18181B] placeholder:text-[#A1A19A] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
                {errors.monto && (
                  <p className="mt-1.5 text-xs text-red-600">{String(errors.monto.message)}</p>
                )}
              </div>

              {isError && (
                <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 p-3">
                  <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-red-700">{(error as Error)?.message || "Error al recargar"}</p>
                </div>
              )}

              <Button type="submit" size="lg" className="w-full bg-[#18181B] text-white hover:bg-[#18181B]/90 border-0" disabled={isPending}>
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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