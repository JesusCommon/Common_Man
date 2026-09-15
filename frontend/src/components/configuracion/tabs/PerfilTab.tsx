import { useState } from "react";
import { useAuthStore } from "@/store";
import { usePerfil, useActualizarPerfil } from "@/hooks";
import { ImagePreview } from "@/components/configuracion/ImagenPreview";
import { Spinner } from "@/components/ui/Spinner";

export function PerfilTab() {
  const user = useAuthStore((s) => s.user);
  const { data: perfil, isLoading } = usePerfil();
  const actualizarPerfil = useActualizarPerfil();

  const [nombre, setNombre] = useState(perfil?.nombre ?? user?.nombre ?? "");
  const [apellido, setApellido] = useState(perfil?.apellido ?? user?.apellido ?? "");
  const [bio, setBio] = useState(perfil?.bio ?? "");
  const [avatar, setAvatar] = useState(perfil?.avatar ?? user?.avatar ?? "");
  const [portada, setPortada] = useState(perfil?.portada ?? "");
  const [guardado, setGuardado] = useState(false);

  if (isLoading) {
    return <Spinner />;
  }

  function handleGuardar(e: React.FormEvent) {
    e.preventDefault();
    setGuardado(false);

    actualizarPerfil.mutate(
      {
        nombre,
        apellido,
        bio,
        avatar,
        portada,
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
        <h1 className="text-2xl font-bold text-gray-900">Perfil</h1>
        <p className="text-sm text-gray-500">
          Personaliza tu información pública y apariencia
        </p>
      </div>

      <form onSubmit={handleGuardar} className="space-y-6">
        <section className="rounded-lg border border-gray-200 bg-white p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            Información básica
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellido
              </label>
              <input
                type="text"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              maxLength={500}
              placeholder="Cuéntanos algo sobre ti..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm resize-none focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-gray-400 text-right">
              {bio.length}/500
            </p>
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-5 space-y-5">
          <h2 className="text-base font-semibold text-gray-900">
            Apariencia
          </h2>

          <ImagePreview
            label="Avatar"
            value={avatar}
            onChange={setAvatar}
            aspectRatio="square"
            placeholder="https://ejemplo.com/mi-avatar.jpg"
          />

          <ImagePreview
            label="Portada"
            value={portada}
            onChange={setPortada}
            aspectRatio="banner"
            placeholder="https://ejemplo.com/mi-portada.jpg"
          />
        </section>

        <div className="flex items-center justify-between">
          {guardado && (
            <p className="text-sm text-green-600">
              ✓ Perfil actualizado correctamente
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