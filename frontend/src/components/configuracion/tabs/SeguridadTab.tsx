import { useState } from "react";
import { useCambiarPassword } from "@/hooks";
import { Lock, Eye, EyeOff } from "lucide-react";

export function SeguridadTab() {
  const cambiarPassword = useCambiarPassword();
  const [passwordActual, setPasswordActual] = useState("");
  const [passwordNuevo, setPasswordNuevo] = useState("");
  const [passwordConfirmar, setPasswordConfirmar] = useState("");
  const [mostrarActual, setMostrarActual] = useState(false);
  const [mostrarNuevo, setMostrarNuevo] = useState(false);
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [guardado, setGuardado] = useState(false);

  function validar(): boolean {
    const nuevosErrores: Record<string, string> = {};

    if (!passwordActual) {
      nuevosErrores.passwordActual = "La contraseña actual es requerida";
    }
    if (passwordNuevo.length < 8) {
      nuevosErrores.passwordNuevo = "Mínimo 8 caracteres";
    }
    if (passwordNuevo !== passwordConfirmar) {
      nuevosErrores.passwordConfirmar = "Las contraseñas no coinciden";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }

  function handleGuardar(e: React.FormEvent) {
    e.preventDefault();
    setGuardado(false);
    if (!validar()) return;

    cambiarPassword.mutate(
      {
        password_actual: passwordActual,
        password: passwordNuevo,
      },
      {
        onSuccess: () => {
          setGuardado(true);
          setPasswordActual("");
          setPasswordNuevo("");
          setPasswordConfirmar("");
          setErrores({});
          setTimeout(() => setGuardado(false), 3000);
        },
      }
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Seguridad</h1>
        <p className="text-sm text-gray-500">
          Protege tu cuenta con una contraseña segura
        </p>
      </div>

      <form onSubmit={handleGuardar} className="space-y-6">
        <section className="rounded-lg border border-gray-200 bg-white p-5 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-5 h-5 text-gray-500" />
            <h2 className="text-base font-semibold text-gray-900">
              Cambiar contraseña
            </h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña actual <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={mostrarActual ? "text" : "password"}
                value={passwordActual}
                onChange={(e) => {
                  setPasswordActual(e.target.value);
                  setErrores((prev) => ({ ...prev, passwordActual: "" }));
                }}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setMostrarActual(!mostrarActual)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {mostrarActual ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errores.passwordActual && (
              <p className="mt-1 text-xs text-red-500">{errores.passwordActual}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nueva contraseña <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={mostrarNuevo ? "text" : "password"}
                value={passwordNuevo}
                onChange={(e) => {
                  setPasswordNuevo(e.target.value);
                  setErrores((prev) => ({ ...prev, passwordNuevo: "" }));
                }}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setMostrarNuevo(!mostrarNuevo)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {mostrarNuevo ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errores.passwordNuevo && (
              <p className="mt-1 text-xs text-red-500">{errores.passwordNuevo}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar nueva contraseña <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="password"
                value={passwordConfirmar}
                onChange={(e) => {
                  setPasswordConfirmar(e.target.value);
                  setErrores((prev) => ({ ...prev, passwordConfirmar: "" }));
                }}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            {errores.passwordConfirmar && (
              <p className="mt-1 text-xs text-red-500">{errores.passwordConfirmar}</p>
            )}
          </div>
        </section>

        <div className="flex items-center justify-between">
          {guardado && (
            <p className="text-sm text-green-600">
              ✓ Contraseña actualizada correctamente
            </p>
          )}
          {cambiarPassword.isError && (
            <p className="text-sm text-red-500">
              Error al cambiar la contraseña. Verifica que la contraseña actual sea correcta.
            </p>
          )}
          <button
            type="submit"
            disabled={cambiarPassword.isPending}
            className="ml-auto rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 transition disabled:opacity-50"
          >
            {cambiarPassword.isPending ? "Guardando..." : "Cambiar contraseña"}
          </button>
        </div>
      </form>
    </div>
  );
}