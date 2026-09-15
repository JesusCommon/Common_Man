import { useState } from "react";
import { useAuthStore } from "@/store";
import { usePerfil, useActualizarPerfil } from "@/hooks";
import { Spinner } from "@/components/ui/Spinner";

export function CuentaTab() {
  const user = useAuthStore((s) => s.user);
  const { data: perfil, isLoading } = usePerfil();
  const actualizarPerfil = useActualizarPerfil();

  const [correo, setCorreo] = useState(perfil?.correo ?? user?.correo ?? "");
  const [username, setUsername] = useState(perfil?.username ?? user?.username ?? "");
  const [telefono, setTelefono] = useState(perfil?.telefono ?? "");
  const [guardado, setGuardado] = useState(false);

  if (isLoading) {
    return <Spinner />;
  }

  function handleGuardar(e: React.FormEvent) {
    e.preventDefault();
    setGuardado(false);

    actualizarPerfil.mutate(
      {
        correo,
        username,
        telefono,
      },
      {
        onSuccess: () => {
          setGuardado(true);
          setTimeout(() => setGuardado(false), 3000);
        },
      }
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Cuenta</h1>
        <p className="text-sm text-gray-500">
          Gestiona tu información de acceso y contacto
        </p>
      </div>

      <form onSubmit={handleGuardar} className="space-y-6">
        <section className="rounded-lg border border-gray-200 bg-white p-5 space-y-4">
          <h2 className="text-base font-semibold text-gray-900">
            Información de contacto
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-gray-400">
              Se usa para iniciar sesión y recibir notificaciones
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">@</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.replace(/\s/g, ""))}
                className="w-full rounded-lg border border-gray-300 pl-8 pr-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <p className="mt-1 text-xs text-gray-400">
              Tu identificador público en la plataforma
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <input
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="+57 300 123 4567"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-gray-400">
              Opcional. Se usa para contacto de soporte
            </p>
          </div>
        </section>

        <div className="flex items-center justify-between">
          {guardado && (
            <p className="text-sm text-green-600">
              ✓ Cuenta actualizada correctamente
            </p>
          )}
          {actualizarPerfil.isError && (
            <p className="text-sm text-red-500">
              Error al guardar. Intenta nuevamente.
            </p>
          )}
          <button
            type="submit"
            disabled={actualizarPerfil.isPending}
            className="ml-auto rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 transition disabled:opacity-50"
          >
            {actualizarPerfil.isPending ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}