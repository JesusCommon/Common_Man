import { useState } from "react";
import type { FormEvent } from "react";
import { useRecargarSaldoAdmin, useRestarSaldoAdmin } from "@/hooks";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { TextField } from "@/components/ui/TextField";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import type { SegmentedOption } from "@/components/ui/SegmentedControl";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Wallet, Fingerprint, User, ArrowRight, ArrowDown } from "lucide-react";

type Operacion = "recargar" | "restar";

const operacionOptions: SegmentedOption<Operacion>[] = [
  { key: "recargar", label: "Recargar" },
  { key: "restar", label: "Restar" },
];

const operacionTexto: Record<Operacion, { accion: string; exito: string }> = {
  recargar: { accion: "Recargar saldo", exito: "El saldo se ha acreditado correctamente." },
  restar: { accion: "Restar saldo", exito: "El saldo se ha descontado correctamente." },
};

export default function AdminRecargar() {
  const [operacion, setOperacion] = useState<Operacion>("recargar");
  const [userId, setUserId] = useState("");
  const [monto, setMonto] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const recargar = useRecargarSaldoAdmin();
  const restar = useRestarSaldoAdmin();
  const mutation = operacion === "recargar" ? recargar : restar;

  const montoNum = parseInt(monto, 10);
  const isValid = userId.trim().length > 0 && !Number.isNaN(montoNum) && montoNum > 0;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    if (!isValid) return;
    setConfirming(true);
  };

  const handleConfirm = () => {
    mutation.mutate(
      { id: userId.trim(), payload: { monto: montoNum } },
      {
        onSuccess: (data) => {
          setSuccessMsg(data.mensaje);
          setUserId("");
          setMonto("");
          setConfirming(false);
        },
        onError: () => setConfirming(false),
      }
    );
  };

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Gestionar saldo</h1>
        <p className="text-slate-500 text-sm">
          Ingresa el ID del usuario y el monto. Puedes obtener el ID desde{" "}
          <span className="text-blue-400">Usuarios</span> o <span className="text-blue-400">Buscar por ID</span>.
        </p>
      </div>

      {successMsg && (
        <Alert variant="success" message={successMsg} description={operacionTexto[operacion].exito} />
      )}

      {mutation.isError && (
        <Alert
          variant="error"
          message={
            mutation.error instanceof Error
              ? mutation.error.message
              : "Error al procesar la operación. Verifica el ID y el monto."
          }
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-5">
          <SegmentedControl options={operacionOptions} value={operacion} onChange={setOperacion} />

          <TextField
            label="ID del usuario"
            icon={Fingerprint}
            value={userId}
            onChange={setUserId}
            placeholder="Pega el MongoDB ID o UUID"
            mono
            hint="Usa el ID que aparece en la lista de usuarios o en la búsqueda por ID."
          />

          <TextField
            label={operacion === "recargar" ? "Monto a recargar" : "Monto a restar"}
            icon={Wallet}
            value={monto}
            onChange={setMonto}
            placeholder="100"
            type="number"
            min={1}
            focusColor="emerald"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={mutation.isPending || !isValid}
          >
            <Wallet className="w-4 h-4 mr-2" />
            {operacionTexto[operacion].accion}
            <ArrowRight className="w-4 h-4 ml-2" />
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

      {confirming && (
        <ConfirmModal
          title={operacion === "recargar" ? "Confirmar recarga" : "Confirmar descuento"}
          confirmLabel={operacionTexto[operacion].accion}
          isPending={mutation.isPending}
          onConfirm={handleConfirm}
          onCancel={() => setConfirming(false)}
        >
          <div className="rounded-lg bg-slate-950 border border-slate-800 p-4 space-y-3">
            <div>
              <p className="text-xs text-slate-500 mb-1">Operación</p>
              <p className={`text-sm font-medium flex items-center gap-1.5 ${operacion === "recargar" ? "text-emerald-400" : "text-red-400"}`}>
                {operacion === "restar" && <ArrowDown className="w-3.5 h-3.5" />}
                {operacionTexto[operacion].accion}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">ID del usuario</p>
              <code className="text-sm text-slate-300 font-mono break-all">{userId.trim()}</code>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Monto</p>
              <p className="text-lg font-bold text-white">${montoNum.toLocaleString()}</p>
            </div>
          </div>
          <p className="text-xs text-slate-500">
            Verifica que el ID y el monto sean correctos antes de confirmar. Esta operación se aplica de inmediato.
          </p>
        </ConfirmModal>
      )}
    </div>
  );
}