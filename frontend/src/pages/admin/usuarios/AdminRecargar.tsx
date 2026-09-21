import { useState } from "react";
import type { FormEvent } from "react";
import { useRecargarSaldoAdmin, useRestarSaldoAdmin } from "@/hooks";
import { Wallet, Fingerprint, User, ArrowDown, AlertCircle, CheckCircle2 } from "lucide-react";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { extraerMensajeError } from "@/lib/errors";

type Operacion = "recargar" | "restar";

export default function AdminRecargar() {
  const [operacion, setOperacion] = useState<Operacion>("recargar");
  const [userId, setUserId] = useState("");
  const [monto, setMonto] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const recargar = useRecargarSaldoAdmin();
  const restar = useRestarSaldoAdmin();
  const mutation = operacion === "recargar" ? recargar : restar;
  const montoNum = parseInt(monto, 10);
  const isValid = userId.trim().length > 0 && !Number.isNaN(montoNum) && montoNum > 0;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);
    if (!isValid) return;
    setConfirming(true);
  };

  const handleConfirm = () => {
    mutation.mutate(
      { id: userId.trim(), payload: { monto: montoNum } },
      {
        onSuccess: (data) => {
          setSuccessMsg(data.mensaje);
          setErrorMsg(null);
          setUserId("");
          setMonto("");
          setConfirming(false);
        },
        onError: (err) => {
          setErrorMsg(extraerMensajeError(err));
          setConfirming(false);
        },
      }
    );
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#18181B]">Gestionar saldo</h1>
        <p className="text-sm text-[#52525B]">
          Ingresa el ID del usuario y el monto para recargar o descontar saldo.
        </p>
      </div>

      {/* Alertas */}
      {successMsg && (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
          <p className="text-sm text-emerald-700">{successMsg}</p>
        </div>
      )}
      {errorMsg && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
          <p className="text-sm text-red-700">{errorMsg}</p>
        </div>
      )}

      {/* Grid: formulario + consejo al lado */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Formulario (3 cols) */}
        <form onSubmit={handleSubmit} className="lg:col-span-3">
          <div className="rounded-xl border border-[#E4E4E1] bg-white shadow-sm p-6 space-y-5">
            {/* Segmented control inline */}
            <div>
              <label className="block text-sm font-medium text-[#52525B] mb-2">
                Operación
              </label>
              <div className="grid grid-cols-2 bg-[#F4F4F5] rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setOperacion("recargar")}
                  className={`py-2 rounded-md text-sm font-medium transition ${
                    operacion === "recargar"
                      ? "bg-white text-emerald-600 shadow-sm"
                      : "text-[#52525B] hover:text-[#18181B]"
                  }`}
                >
                  ↑ Recargar
                </button>
                <button
                  type="button"
                  onClick={() => setOperacion("restar")}
                  className={`py-2 rounded-md text-sm font-medium transition ${
                    operacion === "restar"
                      ? "bg-white text-red-600 shadow-sm"
                      : "text-[#52525B] hover:text-[#18181B]"
                  }`}
                >
                  ↓ Restar
                </button>
              </div>
            </div>

            {/* ID */}
            <div>
              <label className="mb-1 block text-sm font-medium text-[#52525B]">
                <Fingerprint className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                ID del usuario
              </label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Pega el MongoDB ID o UUID"
                className="w-full rounded-lg border border-[#E4E4E1] px-3 py-2 text-sm font-mono focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
              />
            </div>

            {/* Monto */}
            <div>
              <label className="mb-1 block text-sm font-medium text-[#52525B]">
                <Wallet className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
                {operacion === "recargar" ? "Monto a recargar" : "Monto a restar"}
              </label>
              <input
                type="number"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                placeholder="100"
                min={1}
                className="w-full rounded-lg border border-[#E4E4E1] px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
              />
            </div>

            <button
              type="submit"
              disabled={mutation.isPending || !isValid}
              className={`w-full rounded-lg px-4 py-2.5 text-sm font-medium text-white transition disabled:opacity-50 ${
                operacion === "recargar"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {mutation.isPending
                ? "Procesando..."
                : operacion === "recargar"
                ? "Recargar saldo"
                : "Restar saldo"}
            </button>
          </div>
        </form>

        {/* Consejo (2 cols) */}
        <aside className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-[#E4E4E1] bg-white shadow-sm p-5 sticky top-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#EFF4FE] flex items-center justify-center">
                <User className="w-4 h-4 text-[#2563EB]" />
              </div>
              <h3 className="text-sm font-semibold text-[#18181B]">
                ¿Cómo obtener el ID?
              </h3>
            </div>
            <ol className="text-xs text-[#52525B] space-y-2 list-decimal list-inside">
              <li>
                Ve a{" "}
                <span className="text-[#2563EB] font-medium">Usuarios</span>{" "}
                y haz clic en cualquier usuario.
              </li>
              <li>
                En el modal que aparece, copia el{" "}
                <span className="font-mono text-[#18181B]">ID MongoDB</span>.
              </li>
              <li>
                O usa{" "}
                <span className="text-[#2563EB] font-medium">Buscar por ID</span>{" "}
                para localizar uno específico.
              </li>
              <li>Pega el ID aquí, ingresa el monto y confirma.</li>
            </ol>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-xs font-semibold text-amber-800 mb-1">
                  Importante
                </h4>
                <p className="text-xs text-amber-700">
                  Esta operación se aplica de inmediato y no se puede deshacer.
                  Verifica el ID y el monto antes de confirmar.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {confirming && (
        <ConfirmModal
          title={operacion === "recargar" ? "Confirmar recarga" : "Confirmar descuento"}
          confirmLabel={operacion === "recargar" ? "Recargar saldo" : "Restar saldo"}
          isPending={mutation.isPending}
          onConfirm={handleConfirm}
          onCancel={() => setConfirming(false)}
        >
          <div className="rounded-lg bg-[#FAFAF8] border border-[#E4E4E1] p-4 space-y-3">
            <div>
              <p className="text-xs text-[#A1A19A] mb-1">Operación</p>
              <p
                className={`text-sm font-medium flex items-center gap-1.5 ${
                  operacion === "recargar" ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {operacion === "restar" && <ArrowDown className="w-3.5 h-3.5" />}
                {operacion === "recargar" ? "Recargar saldo" : "Restar saldo"}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#A1A19A] mb-1">ID del usuario</p>
              <code className="text-sm text-[#18181B] font-mono break-all">
                {userId.trim()}
              </code>
            </div>
            <div>
              <p className="text-xs text-[#A1A19A] mb-1">Monto</p>
              <p className="text-lg font-bold text-[#18181B]">
                ${montoNum.toLocaleString()}
              </p>
            </div>
          </div>
          <p className="text-xs text-[#52525B]">
            Verifica que el ID y el monto sean correctos antes de confirmar.
          </p>
        </ConfirmModal>
      )}
    </div>
  );
}