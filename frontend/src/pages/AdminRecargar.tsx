import { useState } from "react";
import { useRecargarSaldoAdmin } from "@/hooks";
import { Button } from "@/components/ui/Button";
import {
  Wallet,
  AlertCircle,
  CheckCircle2,
  Fingerprint,
  User,
  ArrowRight,
} from "lucide-react";

export default function AdminRecargar() {
  const [userId, setUserId] = useState("");
  const [monto, setMonto] = useState("");
  const [success, setSuccess] = useState(false);

  const { mutate, isPending, isError, error, data } = useRecargarSaldoAdmin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);

    const montoNum = parseInt(monto);
    if (!userId.trim() || !montoNum || montoNum <= 0) return;

    mutate(
      { id: userId.trim(), payload: { monto: montoNum } },
      {
        onSuccess: () => {
          setSuccess(true);
          setUserId("");
          setMonto("");
        },
      }
    );
  };

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Recargar saldo</h1>
        <p className="text-slate-500 text-sm">
          Ingresa el ID del usuario y el monto a recargar. Puedes obtener el ID desde{" "}
          <span className="text-blue-400">Usuarios</span> o <span className="text-blue-400">Buscar por ID</span>.
        </p>
      </div>

      {success && data && (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-emerald-400">{data.mensaje}</p>
            <p className="text-xs text-slate-500 mt-1">El saldo se ha acreditado correctamente.</p>
          </div>
        </div>
      )}

      {isError && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <p className="text-sm text-red-300">
            {(error as Error)?.message || "Error al procesar la recarga. Verifica el ID y el monto."}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5 flex items-center gap-2">
              <Fingerprint className="w-4 h-4" />
              ID del usuario
            </label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Pega el MongoDB ID o UUID"
              className="w-full h-11 px-4 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 font-mono text-sm"
            />
            <p className="mt-1.5 text-xs text-slate-600">
              Usa el ID que aparece en la lista de usuarios o en la búsqueda por ID.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5 flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              Monto a recargar
            </label>
            <input
              type="number"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              placeholder="100"
              min={1}
              className="w-full h-11 px-4 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={isPending || !userId.trim() || !monto}
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-slate-400/30 border-t-slate-900 rounded-full animate-spin" />
                Procesando...
              </span>
            ) : (
              <>
                <Wallet className="w-4 h-4 mr-2" />
                Recargar saldo
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </form>

      <div className="rounded-lg border border-slate-800 bg-slate-900/30 p-4">
        <h3 className="text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
          <User className="w-4 h-4" />
          ¿Cómo obtener el ID?
        </h3>
        <ul className="text-xs text-slate-500 space-y-1.5 list-disc list-inside">
          <li>Ve a <span className="text-slate-400">Usuarios</span> y haz clic en cualquier usuario de la lista.</li>
          <li>En el modal que aparece, copia el <span className="text-slate-400">ID MongoDB</span>.</li>
          <li>También puedes usar <span className="text-slate-400">Buscar por ID</span> para encontrar un usuario específico.</li>
          <li>Pega el ID aquí, ingresa el monto y confirma.</li>
        </ul>
      </div>
    </div>
  );
}